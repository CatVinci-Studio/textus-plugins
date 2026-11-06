import { afterEach, describe as suite, expect, it, vi } from "vitest";
import { parseManifest } from "./content";
import { openEncryptedStore } from "./encrypted-store";
import { HEAD, encode } from "./model";
import { MemoryLocal, MemoryStore, bytes, text } from "./test-fixtures";

const manifest = async (store: MemoryStore) =>
  parseManifest((await store.get(HEAD))!);
async function pair(files: Record<string, string>) {
  const remote = new MemoryStore(),
    a = new MemoryLocal(files),
    b = new MemoryLocal();
  await a.sync(remote);
  await b.sync(remote);
  return { remote, a, b };
}

suite("deletions and renames", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it("moves a local deletion to the remote trash and the other device's system trash", async () => {
    const { remote, a, b } = await pair({ "gone.md": "old", "keep.md": "k" });
    a.files.delete("gone.md");
    expect((await a.sync(remote)).removed).toBe(1);
    const head = await manifest(remote);
    expect(head.files["gone.md"]).toBeUndefined();
    expect(head.trash?.map((t) => t.path)).toEqual(["gone.md"]);
    expect((await b.sync(remote)).removed).toBe(1);
    expect(b.files.has("gone.md")).toBe(false);
    expect(b.trashed.map(([p, v]) => [p, text(v)])).toEqual([
      ["gone.md", "old"],
    ]);
    expect((await a.sync(remote)).removed).toBe(0);
    expect(text(a.files.get("keep.md"))).toBe("k");
  });
  it("keeps an edit made on one side over a deletion on the other", async () => {
    const { remote, a, b } = await pair({ "note.md": "base" });
    a.files.delete("note.md");
    b.files.set("note.md", bytes("edited"));
    await b.sync(remote);
    await a.sync(remote);
    expect(text(a.files.get("note.md"))).toBe("edited");

    a.files.set("note.md", bytes("edited again"));
    await a.sync(remote);
    b.files.delete("note.md");
    await a.sync(remote);
    await b.sync(remote);
    expect(text(b.files.get("note.md"))).toBe("edited again");
    expect(b.trashed).toEqual([]);
  });
  it("never treats a file not yet synced as deleted on first sync", async () => {
    const remote = new MemoryStore();
    await new MemoryLocal({ "remote.md": "r" }).sync(remote);
    const existing = new MemoryLocal({ "local.md": "l" });
    expect(await existing.sync(remote)).toMatchObject({
      uploaded: 1,
      downloaded: 1,
      removed: 0,
    });
    expect([...existing.files.keys()].sort()).toEqual([
      "local.md",
      "remote.md",
    ]);
    expect(Object.keys((await manifest(remote)).files).sort()).toEqual([
      "local.md",
      "remote.md",
    ]);
  });
  it("renames on the other device instead of trashing and downloading again", async () => {
    const { remote, a, b } = await pair({ "old.md": "body" });
    a.files.set("new/name.md", a.files.get("old.md")!);
    a.files.delete("old.md");
    expect(await a.sync(remote)).toMatchObject({ uploaded: 1, removed: 1 });
    const reads = vi.spyOn(remote, "get");
    expect((await b.sync(remote)).moved).toBe(1);
    expect(reads.mock.calls.some(([k]) => k.includes("/blocks/"))).toBe(false);
    expect([...b.files.keys()]).toEqual(["new/name.md"]);
    expect(b.trashed).toEqual([]);
    expect((await b.sync(remote)).unchanged).toBe(1);
  });
  it("purges remote trash entries after 30 days", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { remote, a } = await pair({ "a.md": "a", "b.md": "b" });
    a.files.delete("a.md");
    await a.sync(remote);
    vi.setSystemTime(new Date("2026-01-30T00:00:00Z"));
    a.files.delete("b.md");
    a.files.set("c.md", bytes("c"));
    await a.sync(remote);
    expect((await manifest(remote)).trash?.map((t) => t.path)).toEqual([
      "a.md",
      "b.md",
    ]);
    vi.setSystemTime(new Date("2026-02-01T00:00:00Z"));
    await a.sync(remote);
    expect((await manifest(remote)).trash?.map((t) => t.path)).toEqual([
      "b.md",
    ]);
  });
  it("waits to trash a file that is open, without losing track of the deletion", async () => {
    const { remote, a, b } = await pair({ "open.md": "x" });
    a.files.delete("open.md");
    await a.sync(remote);
    b.deferred.add("open.md");
    expect((await b.sync(remote)).deferred).toEqual(["open.md"]);
    expect(b.files.has("open.md")).toBe(true);
    b.deferred.clear();
    expect((await b.sync(remote)).removed).toBe(1);
    expect(b.files.has("open.md")).toBe(false);
  });
  it("forgets a file deleted on both sides, so recreating it uploads it", async () => {
    const { remote, a, b } = await pair({ "x.md": "same" });
    a.files.delete("x.md");
    b.files.delete("x.md");
    b.files.set("other.md", bytes("o"));
    await a.sync(remote);
    await b.sync(remote);
    expect(b.base.files["x.md"]).toBeUndefined();
    b.files.set("x.md", bytes("same"));
    expect((await b.sync(remote)).uploaded).toBe(1);
    await a.sync(remote);
    expect(text(a.files.get("x.md"))).toBe("same");
  });
  it("keeps the names of deleted files encrypted", async () => {
    const raw = new MemoryStore();
    const store = await openEncryptedStore(
      raw,
      "test-only long sync passphrase",
    );
    const a = new MemoryLocal({ "secret-name.md": "s", "other.md": "o" });
    await a.sync(store);
    a.files.delete("secret-name.md");
    await a.sync(store);
    const everything = [...raw.values].map(([k, v]) => k + text(v)).join("\n");
    expect(everything).not.toContain("secret-name");
  });
  it("reads manifests without a trash and rejects a malformed one", () => {
    const base = {
      format: "textus-cloud-sync/1",
      revision: "r",
      updatedAt: "",
    };
    expect(parseManifest(encode({ ...base, files: {} })).trash).toBeUndefined();
    expect(() =>
      parseManifest(
        encode({
          ...base,
          files: {},
          trash: [{ path: "../x", deletedAt: "" }],
        }),
      ),
    ).toThrow("invalidManifest");
  });
});
