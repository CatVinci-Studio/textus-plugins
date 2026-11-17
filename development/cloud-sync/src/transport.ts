import { AwsV4Signer } from "aws4fetch";
import { hash } from "./content";
import { providers, relativePath } from "./config";
import {
  SyncError,
  type Config,
  type Credentials,
  type ObjectStore,
} from "./model";

export type Fetch = Textus.Net["fetch"];
type Response = Awaited<ReturnType<Fetch>>;
const encodePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** What may be sent again after no answer or a busy one: asking twice
 *  changes nothing. A MOVE may have happened. */
const REPEATABLE = new Set([
  "GET",
  "HEAD",
  "PUT",
  "DELETE",
  "PROPFIND",
  "MKCOL",
]);
const ATTEMPTS = 4;
/** The longest a server may ask to be left before a sync stops for now. */
const LONGEST_WAIT_S = 60;

export class RemoteStore implements ObjectStore {
  private dirs = new Map<string, Promise<void>>();
  /** The server's clock minus ours, from its last answer's Date. */
  private skew = 0;
  private cache = new Map<string, ArrayBuffer>();
  /** Until when every request waits: the server asked to be left. */
  private quietUntil = 0;
  /** Told when the server asks to wait, in seconds: the status says so. */
  onWait?: (seconds: number) => void;
  constructor(
    private config: Config,
    private credentials: Credentials,
    private fetch: Fetch,
    private sleep: (ms: number) => Promise<unknown> = pause,
  ) {
    if (
      !credentials.account ||
      !credentials.secret ||
      (providers[config.provider].transport === "dav" &&
        credentials.account.includes(":"))
    )
      throw new SyncError("credentialsRequired");
  }
  now(): number {
    return Date.now() + this.skew;
  }
  private target(key: string): string {
    if (!relativePath(key)) throw new SyncError("invalidPath");
    const c = this.config;
    const url = new URL(c.endpoint);
    const prefix = `${c.prefix}/${key}`;
    const s3 = providers[c.provider].transport === "s3";
    if (s3 && !c.pathStyle) url.hostname = `${c.bucket}.${url.hostname}`;
    url.pathname =
      url.pathname.replace(/\/$/, "") +
      "/" +
      encodePath(s3 && c.pathStyle ? `${c.bucket}/${prefix}` : prefix);
    return url.toString();
  }
  /** One request, sent again while the server is busy or doesn't answer,
   *  if it may be (`repeat`: not a MOVE, nor a create whose lost answer a
   *  retry would read as someone else's). */
  private async request(
    method: string,
    url: string,
    body?: Uint8Array,
    extra: Record<string, string> = {},
    repeat = REPEATABLE.has(method),
  ): Promise<Response> {
    for (let attempt = 0; ; attempt++) {
      const quiet = this.quietUntil - Date.now();
      if (quiet > 0) await this.sleep(quiet);
      let headers: Record<string, string> = { ...extra };
      if (providers[this.config.provider].transport === "s3") {
        const signed = await new AwsV4Signer({
          url,
          method,
          body: body?.slice().buffer,
          headers: {
            ...headers,
            "x-amz-content-sha256": await hash(body ?? new Uint8Array()),
          },
          accessKeyId: this.credentials.account,
          secretAccessKey: this.credentials.secret,
          sessionToken: this.credentials.sessionToken || undefined,
          service: "s3",
          region: this.config.region,
          cache: this.cache,
        }).sign();
        headers = Object.fromEntries(signed.headers.entries());
      } else {
        const bytes = new TextEncoder().encode(
          `${this.credentials.account}:${this.credentials.secret}`,
        );
        headers.Authorization = `Basic ${btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""))}`;
      }
      let response: Response;
      try {
        response = await this.fetch(url, { method, body, headers });
      } catch {
        if (!repeat || attempt + 1 >= ATTEMPTS)
          throw new SyncError("networkError");
        await this.sleep(backoff(attempt));
        continue;
      }
      const date = Date.parse(response.headers["date"] ?? "");
      if (Number.isFinite(date)) this.skew = date - Date.now();
      const busy = [429, 503].includes(response.status);
      if (
        !(busy || [502, 504].includes(response.status)) ||
        !repeat ||
        attempt + 1 >= ATTEMPTS
      )
        return response;
      const asked = retryAfter(response.headers["retry-after"]);
      if (asked > LONGEST_WAIT_S) throw new SyncError("rateLimited");
      const wait = Math.max(backoff(attempt), asked * 1000);
      // Busy is for every request: the others hold back too.
      if (busy) {
        this.quietUntil = Math.max(this.quietUntil, Date.now() + wait);
        if (asked) this.onWait?.(asked);
      }
      await this.sleep(wait);
    }
  }
  private require(response: Response) {
    if (response.status >= 200 && response.status < 300) return;
    if ([401, 403].includes(response.status))
      throw new SyncError("permissionError", [response.status]);
    if (response.status === 429) throw new SyncError("rateLimited");
    if (response.status === 507) throw new SyncError("quotaError");
    throw new SyncError("httpError", [response.status]);
  }
  /** The folders `key` goes in, made from the deepest up: those there
   *  already cost one refused MKCOL at most. */
  private async parents(key: string) {
    if (providers[this.config.provider].transport !== "dav") return;
    const parts = `${this.config.prefix}/${key}`.split("/").slice(0, -1);
    const paths = parts.map(
      (_, i) =>
        parts
          .slice(0, i + 1)
          .map(encodeURIComponent)
          .join("/") + "/",
    );
    await this.ensure(paths, paths.length - 1);
  }
  private ensure(paths: string[], i: number): Promise<void> {
    const path = paths[i];
    // Shared, so uploads at once make each folder once.
    let made = this.dirs.get(path);
    if (!made) {
      const refused = () =>
        new SyncError("folderNotCreated", [
          decodeURIComponent(path.slice(0, -1)),
        ]);
      made = (async () => {
        if (await this.folder(path)) return;
        if (i === 0) throw refused();
        await this.ensure(paths, i - 1);
        if (!(await this.folder(path))) throw refused();
      })();
      this.dirs.set(path, made);
      made.catch(() => this.dirs.delete(path));
    }
    return made;
  }
  /** MKCOL: whether the folder is there now. "Already there" is 405;
   *  Nutstore says 409, as for a missing parent, so a 409 is looked at. */
  private async folder(path: string): Promise<boolean> {
    const url = `${this.config.endpoint}/${path}`;
    const res = await this.request("MKCOL", url);
    if ((res.status >= 200 && res.status < 300) || res.status === 405)
      return true;
    if ([401, 403, 429, 507].includes(res.status)) this.require(res);
    return this.isFolder(url);
  }
  private async isFolder(url: string): Promise<boolean> {
    const res = await this.request("PROPFIND", url, undefined, { Depth: "0" });
    return res.status === 207 || res.status === 200;
  }
  async get(key: string): Promise<Uint8Array | null> {
    const res = await this.request("GET", this.target(key), undefined, {});
    if (res.status === 404) return null;
    this.require(res);
    return res.bytes();
  }
  async has(key: string): Promise<boolean> {
    const res = await this.request("HEAD", this.target(key));
    if (res.status === 404) return false;
    this.require(res);
    return true;
  }
  async put(key: string, bytes: Uint8Array): Promise<void> {
    const url = this.target(key);
    const dav = providers[this.config.provider].transport === "dav";
    // Its folders are mostly there: made only when the PUT says one isn't.
    let res = await this.request("PUT", url, bytes);
    if (dav && [404, 409].includes(res.status)) {
      await this.parents(key);
      res = await this.request("PUT", url, bytes);
    }
    this.require(res);
  }
  async create(key: string, bytes: Uint8Array): Promise<boolean> {
    if (providers[this.config.provider].transport === "s3") {
      const put = (repeat: boolean) =>
        this.request(
          "PUT",
          this.target(key),
          bytes,
          { "If-None-Match": "*" },
          repeat,
        );
      let res: Response;
      let resent = false;
      try {
        res = await put(false);
      } catch (error) {
        if (!(error instanceof SyncError) || error.code !== "networkError")
          throw error;
        // No answer: it may have landed. Sent again, a refusal may be ours.
        resent = true;
        res = await put(true);
      }
      if (res.status === 412) {
        if (!resent) return false;
        const there = await this.get(key);
        return !!there && (await hash(there)) === (await hash(bytes));
      }
      this.require(res);
      return true;
    }
    // Nutstore supports atomic MOVE with Overwrite:F, including its 409
    // DuplicateName response; a conditional PUT is not portable across DAV servers.
    const temporary = `${key}.tmp-${crypto.randomUUID()}`;
    await this.put(temporary, bytes);
    try {
      const res = await this.request(
        "MOVE",
        this.target(temporary),
        undefined,
        { Destination: this.target(key), Overwrite: "F" },
      );
      if (res.status === 412 || (res.status === 409 && (await this.has(key))))
        return false;
      this.require(res);
      return true;
    } finally {
      await this.remove(temporary).catch(() => {});
    }
  }
  async remove(key: string): Promise<void> {
    const res = await this.request("DELETE", this.target(key), undefined, {});
    if (res.status !== 404) this.require(res);
  }
}

/** A pause before sending again: doubling from half a second, give or
 *  take a fifth, so requests that met the same busy server spread out. */
function backoff(attempt: number): number {
  return 500 * 2 ** attempt * (0.8 + Math.random() * 0.4);
}

/** Retry-After in seconds: a number, or a date (HTTP's two forms). */
function retryAfter(value: string | undefined): number {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds);
  const at = Date.parse(value);
  return Number.isFinite(at) ? Math.max(0, (at - Date.now()) / 1000) : 0;
}

/** Tests permissions and the exclusion primitive using disposable objects only. */
export async function testConnection(store: ObjectStore) {
  const key = `v1/probes/${crypto.randomUUID()}`;
  const original = crypto.getRandomValues(new Uint8Array(32));
  let created = false;
  try {
    created = await refused("permissionWrite", () =>
      store.create(key, original),
    );
    if (!created) throw new SyncError("unsafeServer");
    if (await store.create(key, new Uint8Array([9])))
      throw new SyncError("unsafeServer");
    const read = await refused("permissionRead", () => store.get(key));
    if (!read || (await hash(read)) !== (await hash(original)))
      throw new SyncError("unsafeServer");
  } finally {
    if (created) await refused("permissionDelete", () => store.remove(key));
  }
}

/** `run`, a refusal of it (403; a 401 is the sign-in) named for what it
 *  was: writing, reading or deleting - a key often has some of the three. */
async function refused<T>(code: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (
      error instanceof SyncError &&
      error.code === "permissionError" &&
      error.args[0] === 403
    )
      throw new SyncError(code);
    throw error;
  }
}
