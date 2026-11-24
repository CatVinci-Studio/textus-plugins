import { describe, expect, it } from "vitest";
import { normalizeConfig } from "./config";
import { SyncError } from "./model";
import { GitHubStore } from "./github-store";
import { bytes } from "./test-fixtures";
import type { Fetch } from "./transport";

/** A fake of the GitHub API that keeps one branch, its tree and a ref,
 *  and refuses the calls GitHub itself refuses: a blob on an empty
 *  repository, a tree entry that deletes what its base tree doesn't have,
 *  and a commit that would leave the tree empty. */
const github = (empty = false) => {
  let branch = empty ? null : "main";
  let tree = new Map<string, string>();
  let blobId = 0;
  const calls: { method: string; path: string; body: any }[] = [];
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status }) as never;
  const commit = () => ({
    sha: `commit-${blobId}`,
    commit: { tree: { sha: `tree-${blobId}` } },
  });
  const fetch: Fetch = (async (url, init) => {
    const method = init?.method ?? "GET";
    const path = String(url).replace(
      "https://api.github.com/repos/owner/repo",
      "",
    );
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    calls.push({ method, path, body });
    if (path === "") return json(200, { default_branch: "main" });
    if (path === "/branches/main")
      return branch ? json(200, { commit: commit() }) : json(404, {});
    if (path.startsWith("/git/trees/"))
      return json(200, {
        tree: [...tree].map(([p, sha]) => ({ path: p, sha, type: "blob" })),
      });
    if (path === "/git/blobs") {
      if (!branch) return json(409, { message: "Git Repository is empty." });
      return json(201, { sha: `blob-${++blobId}` });
    }
    if (path === "/git/trees") {
      if (!body.base_tree) return json(422, {});
      const deletions = body.tree.filter(
        (item: { sha: string | null }) => item.sha === null,
      );
      if (deletions.length === body.tree.length) {
        if (
          deletions.every((item: { path: string }) => tree.has(item.path)) &&
          deletions.length === tree.size
        )
          return json(404, {});
        return json(422, {});
      }
      // The tree this fake hands out must reflect the writes, like the
      // real one does once the commit lands.
      tree = new Map(tree);
      for (const item of body.tree as { path: string; sha: string | null }[]) {
        if (item.sha === null) tree.delete(item.path);
        else tree.set(item.path, item.sha);
      }
      return json(201, { sha: `tree-${++blobId}` });
    }
    if (path === "/git/commits") return json(201, { sha: `commit-${++blobId}` });
    if (path === "/git/refs/heads/main") {
      branch = body.sha;
      return json(200, {});
    }
    if (path.startsWith("/contents/")) {
      if (!branch) branch = "main";
      tree.set(decodeURIComponent(path.slice("/contents/".length)), "seeded");
      return json(201, {});
    }
    return json(404, {});
  }) as Fetch;
  return { fetch, calls, branch: () => branch };
};

const store = (fetch: Fetch) =>
  new GitHubStore(
    normalizeConfig({
      provider: "github",
      bucket: "owner/repo",
      prefix: "textus/notes",
    }),
    { account: "owner", secret: "test-only-secret" },
    fetch,
    () => new Promise(() => {}),
  );

describe("a GitHub repository", () => {
  it("starts an empty repository with the first file, not a blob", async () => {
    const fake = github(true);
    const s = store(fake.fetch);
    expect(await s.has("v1/lock.json")).toBe(false);
    expect(await s.create("v1/lock.json", bytes("{}"))).toBe(true);
    const contents = fake.calls.filter((call) =>
      call.path.startsWith("/contents/"),
    );
    expect(contents.length).toBe(1);
    expect(contents[0].path).toBe("/contents/textus/notes/v1/lock.json");
    // The next writes go through the git database.
    await s.put("v1/head.json", bytes("{}"));
    await s.commit("Textus sync");
    expect(
      fake.calls.some((call) => call.path === "/git/blobs"),
    ).toBe(true);
  });

  it("does not ask GitHub to delete what it never committed", async () => {
    const fake = github();
    const s = store(fake.fetch);
    // A connection probe put then removed inside one sync: only staged,
    // never committed, so the branch's tree doesn't have it.
    await s.put("v1/probes/test.json", bytes("{}"));
    await s.remove("v1/probes/test.json");
    await s.commit("Textus sync");
    const tree = fake.calls.find((call) => call.path === "/git/trees");
    expect(tree?.body.tree.length ?? 0).toBe(0);
    expect(fake.calls.filter((call) => call.path === "/git/commits").length).toBe(
      0,
    );
  });

  it("removes a probe at once and carries the sync's writes in its commit", async () => {
    const fake = github();
    const s = store(fake.fetch);
    await s.put("v1/probes/old.json", bytes("{}"));
    await s.commit("Textus: connect");
    await s.remove("v1/probes/old.json"); // probes leave in their own commit
    const trees = fake.calls.filter((call) => call.path === "/git/trees");
    expect(
      trees.at(-1)?.body.tree.map((item: { path: string }) =>
        item.path.replace("textus/notes/", ""),
      ),
    ).toEqual(["v1/probes/old.json"]);
    await s.put("v1/head.json", bytes("{}"));
    await s.commit("Textus sync");
    const sync = fake.calls.filter((call) => call.path === "/git/trees").at(-1);
    expect(
      sync?.body.tree.map((item: { path: string; sha: string | null }) => [
        item.path.replace("textus/notes/", ""),
        item.sha !== null,
      ]),
    ).toEqual([["v1/head.json", true]]);
  });

  it("empties itself rather than commit a branch with no files", async () => {
    const fake = github();
    const s = store(fake.fetch);
    await s.put("v1/only.txt", bytes("{}"));
    await s.commit("Textus sync");
    const refs = () =>
      fake.calls.filter((call) => call.path === "/git/refs/heads/main").length;
    const before = refs();
    await s.remove("v1/only.txt");
    await s.commit("Textus sync"); // would leave the tree empty: not sent
    expect(refs()).toBe(before);
    expect(await s.has("v1/only.txt")).toBe(false);
  });

  it("refuses a bucket that is not owner/repository", () => {
    expect(() =>
      normalizeConfig({
        provider: "github",
        bucket: "just-a-name",
        prefix: "textus/notes",
        }),
    ).toThrow(SyncError);
  });
});