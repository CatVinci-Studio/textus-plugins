import { describe as suite, expect, it } from "vitest";
import { hash, parseManifest } from "./content";
import { synchronize } from "./engine";
import { CHUNK_SIZE, HEAD, LOCK, blockKey, encode, emptyBase } from "./model";
import { MemoryLocal, MemoryStore, bytes, keep, text } from "./test-fixtures";

suite("workspace synchronization", () => {
  it("copies saved documents and attachments to a second device and skips unchanged content", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({
      "notes/你好.md": "first",
      "images/a.png": "binary",
    });
    const b = new MemoryLocal();
    expect((await a.sync(remote)).uploaded).toBe(2);
    expect((await b.sync(remote)).downloaded).toBe(2);
    expect(b.files).toEqual(a.files);
    const writes = remote.puts.length;
    expect((await a.sync(remote)).unchanged).toBe(2);
    expect(remote.puts.length).toBe(writes);
  });
  it("uses the baseline to send independent edits in both directions", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "a", "b.md": "b" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("a.md", bytes("new A"));
    b.files.set("b.md", bytes("new B"));
    await a.sync(remote);
    const result = await b.sync(remote);
    expect(result).toMatchObject({ uploaded: 1, downloaded: 1, conflicts: [] });
    await a.sync(remote);
    expect(a.files).toEqual(b.files);
  });
  it("preserves both concurrent versions and converges without creating more conflict copies", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "note.md": "base" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("note.md", bytes("A edit"));
    b.files.set("note.md", bytes("B edit"));
    await a.sync(remote);
    const result = await b.sync(remote);
    expect(result.conflicts).toHaveLength(1);
    expect(text(b.files.get(result.conflicts[0]))).toBe("A edit");
    expect(text(b.files.get("note.md"))).toBe("B edit");
    await a.sync(remote);
    await b.sync(remote);
    expect(a.files).toEqual(b.files);
    expect(a.files.size).toBe(2);
  });
  it("keeps both versions on first sync when existing files disagree", async () => {
    const remote = new MemoryStore();
    await new MemoryLocal({ "note.md": "remote" }).sync(remote);
    const local = new MemoryLocal({ "note.md": "local" });
    expect((await local.sync(remote)).conflicts).toHaveLength(1);
    expect([...local.files.values()].map(text).sort()).toEqual([
      "local",
      "remote",
    ]);
  });
  it("never overwrites a pre-existing conflict copy with unrelated contents", async () => {
    const remote = new MemoryStore();
    await new MemoryLocal({ "note.md": "remote" }).sync(remote);
    const suffix = (await hash(bytes("remote"))).slice(0, 8);
    const name = `Sync conflicts/note (${suffix}).md`;
    const local = new MemoryLocal({ "note.md": "local", [name]: "keep" });
    const result = await local.sync(remote);
    expect(text(local.files.get(name))).toBe("keep");
    expect(result.conflicts[0]).not.toBe(name);
    expect(text(local.files.get(result.conflicts[0]))).toBe("remote");
  });
  it("defers open destinations without advancing their baseline or changing the remote file", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "note.md": "base" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("note.md", bytes("new"));
    await a.sync(remote);
    const base = { ...b.base.files };
    b.deferred.add("note.md");
    const result = await b.sync(remote);
    expect(result.deferred).toEqual(["note.md"]);
    expect(b.base.files).toEqual(base);
    expect(text(b.files.get("note.md"))).toBe("base");
    b.deferred.clear();
    await b.sync(remote);
    expect(text(b.files.get("note.md"))).toBe("new");
  });
  it("replaces an attachment changed elsewhere, the old one to the trash, and both devices agree", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.png": "base" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("a.png", bytes("new"));
    a.binary.add("a.png");
    b.binary.add("a.png");
    await a.sync(remote);
    const result = await b.sync(remote);
    expect(result.conflicts).toHaveLength(0);
    expect(text(b.files.get("a.png"))).toBe("new");
    expect(b.trashed.map(([path]) => path)).toContain("a.png");
    // Nothing goes back: another round changes nothing on either side.
    expect((await a.sync(remote)).downloaded).toBe(0);
    expect((await b.sync(remote)).uploaded).toBe(0);
    expect(text(a.files.get("a.png"))).toBe("new");
  });
  it("carries Obsidian's settings without conflict copies: the synced one wins", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ ".obsidian/app.json": '{"a":1}' }),
      b = new MemoryLocal({ ".obsidian/app.json": '{"b":1}' });
    await a.sync(remote);
    expect((await b.sync(remote)).conflicts).toEqual([]);
    expect(text(b.files.get(".obsidian/app.json"))).toBe('{"a":1}');
    b.files.set(".obsidian/app.json", bytes('{"b":2}'));
    await b.sync(remote);
    await a.sync(remote);
    expect(text(a.files.get(".obsidian/app.json"))).toBe('{"b":2}');
  });
  it("keeps both versions of an attachment changed on both devices", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.png": "base" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("a.png", bytes("A"));
    b.files.set("a.png", bytes("B"));
    a.binary.add("a.png");
    b.binary.add("a.png");
    await a.sync(remote);
    const result = await b.sync(remote);
    expect(result.conflicts).toHaveLength(1);
    expect(text(b.files.get("a.png"))).toBe("B");
    expect(text(b.files.get(result.conflicts[0]))).toBe("A");
  });
  it("publishes no partial manifest or baseline when a block upload fails, then resumes", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal({ "a.md": "old" });
    await a.sync(remote);
    const head = await remote.get(HEAD),
      base = a.base;
    a.files.set("a.md", bytes("new"));
    const put = remote.put.bind(remote);
    remote.put = async (key, value) => {
      if (key.includes("/blocks/")) throw Error("offline");
      await put(key, value);
    };
    await expect(a.sync(remote)).rejects.toThrow("offline");
    expect(await remote.get(HEAD)).toEqual(head);
    expect(a.base).toBe(base);
    expect(await remote.has(LOCK)).toBe(false);
    remote.put = put;
    expect((await a.sync(remote)).uploaded).toBe(1);
  });
  it("rejects a corrupt remote block before changing local content", async () => {
    const remote = new MemoryStore();
    await new MemoryLocal({ "a.md": "valid" }).sync(remote);
    remote.values.set(blockKey(await hash(bytes("valid"))), bytes("corrupt"));
    const b = new MemoryLocal();
    await expect(b.sync(remote)).rejects.toThrow("integrityError");
    expect(b.files.size).toBe(0);
    expect(b.base).toEqual(emptyBase());
  });
  it("refuses concurrent writers and preserves a lock belonging to another run", async () => {
    const remote = new MemoryStore();
    const lock = encode({ id: "other" });
    remote.values.set(LOCK, lock);
    await expect(new MemoryLocal({ "a.md": "a" }).sync(remote)).rejects.toThrow(
      "locked",
    );
    expect(await remote.get(LOCK)).toEqual(lock);
    expect(await remote.has(HEAD)).toBe(false);
  });
  it("detects manual lock replacement before publishing and leaves the new lock alone", async () => {
    const remote = new MemoryStore(),
      local = new MemoryLocal({ "a.md": "a" });
    await expect(
      synchronize({
        local,
        store: remote,
        base: emptyBase(),
        keep: keep(90),
        saveBase: async () => {},
        progress: (phase) => {
          if (phase === "transferring")
            remote.values.set(LOCK, encode({ id: "replacement" }));
        },
      }),
    ).rejects.toThrow("lockLost");
    expect(await remote.has(HEAD)).toBe(false);
    expect(text(await remote.get(LOCK))).toContain("replacement");
  });
  it("cancellation releases the lock and leaves the baseline unadvanced", async () => {
    const remote = new MemoryStore(),
      local = new MemoryLocal({ "a.md": "a" }),
      abort = new AbortController();
    await expect(
      synchronize({
        local,
        store: remote,
        base: local.base,
        keep: keep(90),
        signal: abort.signal,
        saveBase: async () => {
          throw new Error("must not save");
        },
        progress: (phase) => {
          if (phase === "scanning") abort.abort();
        },
      }),
    ).rejects.toThrow("cancelled");
    expect(await remote.has(LOCK)).toBe(false);
    expect(await remote.has(HEAD)).toBe(false);
  });
  it("deduplicates blocks shared between files and verifies the assembled binary", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal();
    const data = new Uint8Array(CHUNK_SIZE * 2 + 17).fill(37);
    a.files.set("a.pdf", data);
    a.files.set("b.pdf", data);
    await a.sync(remote);
    expect(remote.puts.filter((p) => p.includes("/blocks/"))).toHaveLength(2);
    const b = new MemoryLocal();
    await b.sync(remote);
    expect(Buffer.compare(b.files.get("a.pdf")!, data)).toBe(0);
  });
  it("keeps every published manifest as a recoverable snapshot", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal({ "a.md": "first" });
    await a.sync(remote);
    const previous = parseManifest((await remote.get(HEAD))!);
    a.files.set("a.md", bytes("second"));
    await a.sync(remote);
    expect(
      parseManifest(
        (await remote.get(`v1/snapshots/${previous.revision}.json`))!,
      ),
    ).toEqual(previous);
  });
  it("stops when a previously joined remote repository disappears", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal({ "a.md": "first" });
    await a.sync(remote);
    remote.values.delete(HEAD);
    await expect(a.sync(remote)).rejects.toThrow("remoteMissing");
    expect(await remote.has(HEAD)).toBe(false);
    // Also with everything synced since left out here.
    const store = new MemoryStore(),
      b = new MemoryLocal({ "a.md": "first" });
    await b.sync(store);
    b.leaves = () => true;
    await b.sync(store);
    store.values.delete(HEAD);
    await expect(b.sync(store)).rejects.toThrow("remoteMissing");
  });
  it("refuses case-colliding paths before any download", async () => {
    const remote = new MemoryStore();
    await new MemoryLocal({ "Note.md": "remote" }).sync(remote);
    const local = new MemoryLocal({ "note.md": "local" });
    await expect(local.sync(remote)).rejects.toThrow("caseCollision");
    expect(local.files.size).toBe(1);
  });
  it("retains a local edit made between scanning and applying a download", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal({ "a.md": "base" }),
      b = new MemoryLocal();
    await a.sync(remote);
    await b.sync(remote);
    a.files.set("a.md", bytes("remote"));
    await a.sync(remote);
    b.beforeApply = () => {
      b.files.set("a.md", bytes("edited while syncing"));
      b.beforeApply = undefined;
    };
    const result = await b.sync(remote);
    expect(text(b.files.get("a.md"))).toBe("edited while syncing");
    expect(result.deferred).toEqual(["a.md"]);
    expect(text(b.files.get(result.conflicts[0]))).toBe("remote");
  });
  it("leaves excluded files alone on both sides", async () => {
    const remote = new MemoryStore(),
      a = new MemoryLocal({ "a.md": "a", "drafts/x.md": "theirs" }),
      b = new MemoryLocal({ "drafts/y.md": "mine" });
    b.leaves = (path) => path.startsWith("drafts/");
    await a.sync(remote);
    expect((await b.sync(remote)).downloaded).toBe(1);
    expect(b.files.has("drafts/x.md")).toBe(false);
    a.files.set("drafts/x.md", bytes("theirs, edited"));
    await a.sync(remote);
    await b.sync(remote);
    const c = new MemoryLocal();
    await c.sync(remote);
    expect(text(c.files.get("drafts/x.md"))).toBe("theirs, edited");
    expect(c.files.has("drafts/y.md")).toBe(false);
    expect(text(b.files.get("drafts/y.md"))).toBe("mine");
    // Synced, then left out and removed here, then included again: the
    // file is fetched back, not deleted everywhere.
    b.leaves = () => false;
    await b.sync(remote);
    b.leaves = (path) => path.startsWith("drafts/");
    b.files.delete("drafts/x.md");
    await b.sync(remote);
    b.leaves = () => false;
    expect((await b.sync(remote)).removed).toBe(0);
    expect(text(b.files.get("drafts/x.md"))).toBe("theirs, edited");
    // Left out while another device edits it, then included again with
    // the old copy still here: the newer one comes down, no conflict.
    b.leaves = (path) => path.startsWith("drafts/");
    await b.sync(remote);
    a.files.set("drafts/x.md", bytes("theirs, v3"));
    await a.sync(remote);
    b.leaves = () => false;
    const back = await b.sync(remote);
    expect(back.conflicts).toEqual([]);
    expect(text(b.files.get("drafts/x.md"))).toBe("theirs, v3");
    // A twin left out here still clashes with an upload of the other.
    b.leaves = (path) => path === "drafts/x.md";
    b.files.delete("drafts/x.md");
    b.files.set("drafts/X.md", bytes("twin"));
    await expect(b.sync(remote)).rejects.toThrow("caseCollision");
  });
});
