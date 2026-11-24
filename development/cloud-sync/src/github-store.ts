import { hash } from "./content";
import { relativePath } from "./config";
import {
  LOCK,
  SyncError,
  type Config,
  type Credentials,
  type ObjectStore,
} from "./model";
import {
  ATTEMPTS,
  LONGEST_WAIT_S,
  backoff,
  encodePath,
  retryAfter,
  type Fetch,
} from "./transport";

type Response = Awaited<ReturnType<Fetch>>;
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const base64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let at = 0; at < bytes.length; at += 8192)
    binary += String.fromCharCode(...bytes.subarray(at, at + 8192));
  return btoa(binary);
};
const unbase64 = (value: string) => {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let at = 0; at < binary.length; at++) bytes[at] = binary.charCodeAt(at);
  return bytes;
};

/** A GitHub repository as the same store the S3 and WebDAV services
 *  offer: every key lives at `prefix/key` on the repository's default
 *  branch. Writes stage in memory and land as one commit, so a whole sync
 *  costs a handful of requests, and the repository's history stays
 *  readable - a sync is one commit, not a file's every change. */
export class GitHubStore implements ObjectStore {
  private quietUntil = 0;
  /** Told when GitHub asks to wait, in seconds: the status says so. */
  onWait?: (seconds: number) => void;
  /** The repository's default branch, asked for once. */
  private branchName = "";
  /** Writes waiting for the next commit: full path to bytes, or null to
   *  delete. `get` and `has` see staged writes; `create` and `remove`
   *  commit straight away, because another device must see a lock. */
  private staged = new Map<string, Uint8Array | null>();
  /** Full path to blob sha, as the branch's last commit has it. */
  private tree: Map<string, string> | null = null;
  constructor(
    private config: Config,
    private credentials: Credentials,
    private fetch: Fetch,
    private sleep: (ms: number) => Promise<unknown> = pause,
  ) {
    if (!credentials.secret) throw new SyncError("credentialsRequired");
  }
  now(): number {
    return Date.now();
  }
  private header(response: Response, name: string): string | undefined {
    const value = response.headers[name];
    if (value) return value;
    for (const [key, got] of Object.entries(response.headers ?? {}))
      if (key.toLowerCase() === name) return got;
    return undefined;
  }
  private url(path: string) {
    return `${this.config.endpoint}/repos/${this.config.bucket}${path}`;
  }
  /** One API call, sent again while GitHub is busy or out of reach;
   *  waiting as long as it asks, and no longer than a sync can. */
  private async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    for (let attempt = 0; ; attempt++) {
      const quiet = this.quietUntil - Date.now();
      if (quiet > 0) await this.sleep(quiet);
      let response: Response;
      try {
        response = await this.fetch(this.url(path), {
          method,
          body: body === undefined ? undefined : JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${this.credentials.secret}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
      } catch {
        if (attempt + 1 >= ATTEMPTS) throw new SyncError("networkError");
        await this.sleep(backoff(attempt));
        continue;
      }
      const remaining = this.header(response, "x-ratelimit-remaining");
      const busy =
        [429, 503].includes(response.status) ||
        (response.status === 403 && remaining === "0");
      if (!busy || attempt + 1 >= ATTEMPTS) return response;
      const reset = Number(this.header(response, "x-ratelimit-reset"));
      const asked =
        Math.max(
          retryAfter(this.header(response, "retry-after")),
          Number.isFinite(reset) && reset > 0 ? reset * 1000 - Date.now() : 0,
        ) / 1000;
      if (asked > LONGEST_WAIT_S) throw new SyncError("rateLimited");
      const wait = Math.max(backoff(attempt), asked * 1000);
      this.quietUntil = Math.max(this.quietUntil, Date.now() + wait);
      if (asked) this.onWait?.(asked);
      await this.sleep(wait);
    }
  }
  private require(response: Response) {
    if (response.status >= 200 && response.status < 300) return;
    if ([401, 403].includes(response.status))
      throw new SyncError("permissionError", [response.status]);
    // A 404 here means a repository or branch we just read is gone, not a
    // file: `get` and `has` answer through the tree instead of this.
    throw new SyncError("httpError", [response.status]);
    throw new SyncError("httpError", [response.status]);
  }
  private full(key: string): string {
    if (!relativePath(key)) throw new SyncError("invalidPath");
    return `${this.config.prefix}/${key}`;
  }
  /** The branch to sync, from the repository's own default. */
  private async branch(): Promise<string> {
    if (this.branchName) return this.branchName;
    const res = await this.request("GET", "");
    this.require(res);
    const data = (await res.json()) as { default_branch?: string };
    if (typeof data?.default_branch !== "string" || !data.default_branch)
      throw new SyncError("httpError", [res.status]);
    this.branchName = data.default_branch;
    return this.branchName;
  }
  /** The branch's commit and tree, or null when there is none yet. */
  private async commitHead(): Promise<{ sha: string; tree: string } | null> {
    const branch = await this.branch();
    const res = await this.request(
      "GET",
      `/branches/${encodeURIComponent(branch)}`,
    );
    if (res.status === 404) return null;
    this.require(res);
    const data = (await res.json()) as {
      commit?: { sha?: string; commit?: { tree?: { sha?: string } } };
    };
    const sha = data?.commit?.sha;
    const tree = data?.commit?.commit?.tree?.sha;
    if (!sha || !tree) throw new SyncError("httpError", [res.status]);
    return { sha, tree };
  }
  /** Path to blob sha under the prefix, from the branch's tree. */
  private async loadTree(): Promise<Map<string, string>> {
    if (this.tree) return this.tree;
    const map = new Map<string, string>();
    const head = await this.commitHead();
    if (head) {
      const res = await this.request(
        "GET",
        `/git/trees/${head.tree}?recursive=1`,
      );
      this.require(res);
      // A repository beyond GitHub's one tree answer would hide our files,
      // but a Textus workspace never gets near the 100,000-entry cut.
      const data = (await res.json()) as {
        tree?: { path?: string; sha?: string; type?: string }[];
      };
      const base = `${this.config.prefix}/`;
      for (const item of data?.tree ?? [])
        if (item.type === "blob" && item.path?.startsWith(base))
          map.set(item.path, item.sha!);
    }
    this.tree = map;
    return map;
  }
  private async blobBytes(sha: string): Promise<Uint8Array> {
    const res = await this.request("GET", `/git/blobs/${sha}`);
    this.require(res);
    const data = (await res.json()) as { content?: string };
    return unbase64(data?.content ?? "");
  }
  async get(key: string): Promise<Uint8Array | null> {
    const path = this.full(key);
    if (this.staged.has(path)) {
      const bytes = this.staged.get(path);
      return bytes ? bytes.slice() : null;
    }
    const sha = (await this.loadTree()).get(path);
    return sha ? this.blobBytes(sha) : null;
  }
  async has(key: string): Promise<boolean> {
    const path = this.full(key);
    if (this.staged.has(path)) return this.staged.get(path) !== null;
    return (await this.loadTree()).has(path);
  }
  async put(key: string, bytes: Uint8Array): Promise<void> {
    this.staged.set(this.full(key), bytes);
  }
  async create(key: string, bytes: Uint8Array): Promise<boolean> {
    const path = this.full(key);
    const tree = await this.loadTree();
    const waiting = this.staged.get(path);
    if (tree.has(path) || (waiting !== undefined && waiting !== null)) {
      const there =
        waiting !== undefined
          ? waiting
          : await this.blobBytes(tree.get(path)!);
      return !!there && (await hash(there)) === (await hash(bytes));
    }
    if (waiting === null) this.staged.delete(path);
    this.staged.set(path, bytes);
    await this.commit(`Textus: connect ${key}`);
    return true;
  }
  async remove(key: string): Promise<void> {
    const path = this.full(key);
    this.staged.set(path, null);
    // The lock and the connection probes must leave at once; everything
    // else leaves with the sync's own commit. Releasing the lock is the
    // last write of a sync, so it carries the sync's staged blocks,
    // history and manifest as one commit.
    if (key === LOCK) await this.commit("Textus sync");
    else if (/^v1\/probes\//.test(key))
      await this.commit(`Textus: release ${key}`);
  }
  /** The first file of an empty repository, through the contents API:
   *  GitHub's git database answers 409 to a blob until one commit exists,
   *  and the contents API makes that commit (and the branch) itself. */
  private async firstFile(path: string, bytes: Uint8Array, message: string) {
    const res = await this.request("PUT", `/contents/${encodePath(path)}`, {
      message,
      content: base64(bytes),
      branch: await this.branch(),
    });
    this.require(res);
    this.tree = null;
  }
  /** One commit carrying every staged write. A ref that moved meanwhile
   *  (another device, the person) is rebuilt on top of, not forced over. */
  async commit(message: string): Promise<void> {
    if (!this.staged.size) return;
    const entries = [...this.staged];
    this.staged.clear();
    let changed = entries;
    if (!(await this.commitHead())) {
      const first = changed.find(([, bytes]) => bytes !== null);
      // Nothing to start an empty repository with: a deletion commits nothing.
      if (!first) return;
      await this.firstFile(first[0], first[1]!, message);
      changed = changed.filter(([path]) => path !== first[0]);
    }
    // GitHub refuses a deletion of a path its base tree doesn't have
    // ("GitRPC::BadObjectState"), and a marker written then removed inside
    // one sync was never committed at all: neither is a change.
    const known = await this.loadTree();
    changed = changed.filter(
      ([path, bytes]) => bytes !== null || known.has(path),
    );
    if (!changed.length) return;
    // A deletion of the prefix's last file would leave the branch's tree
    // empty, and GitHub's git database answers 404 to a commit with no
    // tree; nothing would be left to sync with, so the store empties
    // itself in memory instead. The next sync starts over as a new
    // connection.
    if (
      changed.every(([path, bytes]) => bytes === null && known.has(path)) &&
      changed.length === known.size
    ) {
      this.tree = new Map();
      return;
    }
    const blobs = new Map<string, string>();
    for (const [path, bytes] of changed) {
      if (bytes === null) continue;
      const res = await this.request("POST", "/git/blobs", {
        content: base64(bytes),
        encoding: "base64",
      });
      this.require(res);
      blobs.set(path, ((await res.json()) as { sha: string }).sha);
    }
    for (let attempt = 0; ; attempt++) {
      const head = await this.commitHead();
      const res = await this.request("POST", "/git/trees", {
        base_tree: head?.tree,
        tree: changed.map(([path, bytes]) => ({
          path,
          mode: "100644",
          type: "blob",
          sha: bytes === null ? null : blobs.get(path),
        })),
      });
      this.require(res);
      const treeSha = ((await res.json()) as { sha: string }).sha;
      const made = await this.request("POST", "/git/commits", {
        message,
        tree: treeSha,
        parents: head ? [head.sha] : [],
      });
      this.require(made);
      const commitSha = ((await made.json()) as { sha: string }).sha;
      const branch = await this.branch();
      const ref = await this.request(
        head ? "PATCH" : "POST",
        head ? `/git/refs/heads/${encodeURIComponent(branch)}` : "/git/refs",
        head ? { sha: commitSha } : { ref: `refs/heads/${branch}`, sha: commitSha },
      );
      if ([409, 422].includes(ref.status) && attempt + 1 < ATTEMPTS) continue;
      this.require(ref);
      this.tree ??= new Map();
      for (const [path, bytes] of changed) {
        if (bytes === null) this.tree.delete(path);
        else this.tree.set(path, blobs.get(path)!);
      }
      return;
    }
  }
}