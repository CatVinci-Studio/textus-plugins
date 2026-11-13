import { afterEach, describe as suite, expect, it, vi } from "vitest";
import { describe, parseManifest } from "./content";
import { emptyHistory, fit, parseHistory, thin } from "./history";
import { restoreInto } from "./history-host";
import { openPlainStore } from "./plain-store";
import { openEncryptedStore } from "./encrypted-store";
import {
  FORMAT,
  HEAD,
  HISTORY,
  blockKey,
  encode,
  snapshotKey,
  type Manifest,
  type ObjectStore,
  type Version,
} from "./model";
import { MemoryLocal, MemoryStore, bytes, keep } from "./test-fixtures";

const DAY = 86_400_000;
const head = async (s: ObjectStore) => parseManifest((await s.get(HEAD))!);
const history = async (s: ObjectStore) => parseHistory((await s.get(HISTORY))!);
const at = (iso: string) => vi.setSystemTime(new Date(iso));

/** Every block anything kept refers to is still in the store. */
async function intact(store: MemoryStore) {
  const h = await head(store);
  const kept = [
    ...Object.values(h.files),
    ...(h.trash ?? []).map((t) => t.entry),
  ];
  const hist = await history(store);
  kept.push(...Object.values(hist.versions).flat());
  if (hist.previous) {
    const snap = await store.get(snapshotKey(hist.previous));
    if (snap) kept.push(...Object.values(parseManifest(snap).files));
  }
  for (const e of kept)
    for (const b of e.blocks)
      expect(store.values.has(blockKey(b.hash)), b.hash).toBe(true);
}

suite("cloud history", () => {
  afterEach(() => vi.useRealTimers());

  it("keeps each replaced content with when and where it was written", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-03-01T10:00:00Z");
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "n.md": "one" });
    await a.sync(remote, undefined, { device: "Mac" });
    at("2026-03-02T10:00:00Z");
    a.files.set("n.md", bytes("two"));
    await a.sync(remote, undefined, { device: "Mac" });
    const h = await history(remote);
    expect(h.versions["n.md"]).toMatchObject([
      { at: "2026-03-01T10:00:00.000Z", device: "Mac", size: 3 },
    ]);
    expect(h.current["n.md"]).toEqual({
      at: "2026-03-02T10:00:00.000Z",
      device: "Mac",
    });
  });

  it("keeps one version an hour for a day, then one a day for the days chosen", () => {
    const now = Date.parse("2026-06-30T12:00:00Z");
    const v = (ms: number): Version => ({
      hash: "a".repeat(64),
      size: 0,
      blocks: [],
      at: new Date(now - ms).toISOString(),
    });
    const list = [
      v(10 * 60_000),
      v(20 * 60_000), // same hour as the one above
      v(2 * DAY),
      v(2 * DAY + 3_600_000), // same day
      v(29 * DAY),
      v(31 * DAY),
      v(400 * DAY),
    ];
    const kept = (days: 30 | 90 | 365 | 0) => {
      const versions = { "x.md": [...list] };
      thin(versions, now, days);
      return versions["x.md"]?.length ?? 0;
    };
    expect([kept(30), kept(90), kept(365), kept(0)]).toEqual([3, 4, 4, 5]);
    const capped = { "x.md": [...list] };
    thin(capped, now, 0, 2);
    expect(capped["x.md"]).toHaveLength(2);
  });

  it("lets expired versions go and frees only blocks nothing else uses", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-01-01T00:00:00Z");
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "old", "same.md": "shared" });
    await a.sync(remote, undefined, { keep: keep(30) });
    const old = await describe(bytes("old"));
    at("2026-01-02T00:00:00Z");
    a.files.set("a.md", bytes("shared")); // its new content shares a block
    await a.sync(remote, undefined, { keep: keep(30) });
    at("2026-01-03T00:00:00Z");
    a.files.set("a.md", bytes("new"));
    await a.sync(remote, undefined, { keep: keep(30) });
    expect(remote.values.has(blockKey(old.blocks[0].hash))).toBe(true);
    at("2026-03-01T00:00:00Z");
    await a.sync(remote, undefined, { keep: keep(30), cleanupDue: true });
    expect((await history(remote)).versions).toEqual({});
    expect(remote.values.has(blockKey(old.blocks[0].hash))).toBe(false);
    await intact(remote);
    const b = new MemoryLocal();
    await b.sync(remote);
    expect(b.files).toEqual(a.files);
  });

  it("keeps only the head's and the previous snapshot", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "1" });
    for (const n of ["2", "3", "4"]) {
      await a.sync(remote);
      a.files.set("a.md", bytes(n));
    }
    await a.sync(remote);
    const snapshots = [...remote.values.keys()].filter((k) =>
      k.startsWith("v1/snapshots/"),
    );
    const h = await head(remote);
    expect(snapshots.sort()).toEqual(
      [
        snapshotKey(h.revision),
        snapshotKey((await history(remote)).previous!),
      ].sort(),
    );
  });

  it("does not republish when nothing changed and no cleanup is due", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "1" });
    await a.sync(remote);
    const revision = (await head(remote)).revision;
    await a.sync(remote);
    await a.sync(remote, undefined, { cleanupDue: true });
    expect((await head(remote)).revision).toBe(revision);
  });

  it("loses nothing a client before 0.5 still refers to", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-01-01T00:00:00Z");
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "1", "b.md": "b" });
    await a.sync(remote, undefined, { keep: keep(30) });
    a.files.set("a.md", bytes("2"));
    await a.sync(remote, undefined, { keep: keep(30) });
    // An older client: it changes the head and leaves the history as it was.
    const legacy: Manifest = await head(remote);
    const entry = await describe(bytes("legacy"));
    await remote.put(blockKey(entry.blocks[0].hash), bytes("legacy"));
    legacy.files["b.md"] = entry;
    legacy.revision = crypto.randomUUID();
    legacy.updatedAt = "2026-03-25T00:00:00.000Z";
    await remote.put(HEAD, encode(legacy));
    at("2026-04-01T00:00:00Z");
    a.files.set("a.md", bytes("3"));
    await a.sync(remote, undefined, { keep: keep(30) });
    await intact(remote);
    expect(new TextDecoder().decode(a.files.get("b.md"))).toBe("legacy");
    // What the older client replaced is in the history all the same.
    expect((await history(remote)).versions["b.md"]?.[0].hash).toBe(
      (await describe(bytes("b"))).hash,
    );
  });

  it("shows no phantom versions after a run died between the history and the head", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "1", "b.md": "b" });
    await a.sync(remote);
    // The run wrote its history (a new head, the old one as previous) and
    // its snapshot, then died before writing the head itself.
    const current = await head(remote);
    const ghost: Manifest = structuredClone(current);
    const entry = await describe(bytes("never"));
    await remote.put(blockKey(entry.blocks[0].hash), bytes("never"));
    ghost.files["b.md"] = entry;
    ghost.revision = crypto.randomUUID();
    await remote.put(snapshotKey(ghost.revision), encode(ghost));
    const written = await history(remote);
    await remote.put(
      HISTORY,
      encode({ ...written, head: ghost.revision, previous: current.revision }),
    );
    a.files.set("a.md", bytes("2"));
    await a.sync(remote);
    const versions = (await history(remote)).versions["b.md"] ?? [];
    expect(versions.map((v) => v.hash)).not.toContain(entry.hash);
  });

  it("restores in place only over the synced file, else beside it", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "n.md": "one" });
    await a.sync(remote);
    a.files.set("n.md", bytes("two"));
    await a.sync(remote);
    const version = (await history(remote)).versions["n.md"][0];
    await restoreInto(a, remote, { path: "n.md", version });
    expect(new TextDecoder().decode(a.files.get("n.md"))).toBe("one");
    a.files.set("n.md", bytes("unsynced"));
    await restoreInto(a, remote, { path: "n.md", version });
    expect(new TextDecoder().decode(a.files.get("n.md"))).toBe("unsynced");
    const copy = `n (${version.hash.slice(0, 8)}).md`;
    expect(new TextDecoder().decode(a.files.get(copy))).toBe("one");
  });

  it("starts again when the head is gone but the history is left", async () => {
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "1" });
    await a.sync(remote);
    a.files.set("a.md", bytes("2"));
    await a.sync(remote);
    remote.values.delete(HEAD);
    await new MemoryLocal({ "b.md": "b" }).sync(remote);
    await new MemoryLocal().sync(remote);
    expect(await history(remote)).toBeTruthy();
  });

  it("counts a version's age from when it was replaced, not written", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-01-01T00:00:00Z");
    const remote = new MemoryStore();
    const a = new MemoryLocal({ "a.md": "old" });
    await a.sync(remote, undefined, { keep: keep(90) });
    at("2026-05-01T00:00:00Z");
    a.files.set("a.md", bytes("new"));
    await a.sync(remote, undefined, { keep: keep(90) });
    expect((await history(remote)).versions["a.md"]).toMatchObject([
      { at: "2026-01-01T00:00:00.000Z", until: "2026-05-01T00:00:00.000Z" },
    ]);
  });

  it("thins by the folder's keep setting, changed only by a choice made on a device", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-01-01T00:00:00Z");
    const remote = new MemoryStore();
    const mac = new MemoryLocal({ "a.md": "1" });
    await mac.sync(remote, undefined, { keep: keep(0, true) });
    mac.files.set("a.md", bytes("2"));
    await mac.sync(remote, undefined, { keep: keep(0) });
    // Another device's own setting, not chosen there, doesn't count.
    const laptop = new MemoryLocal();
    let told: unknown = null;
    at("2026-09-01T00:00:00Z");
    await laptop.sync(remote, undefined, {
      keep: keep(30),
      cleanupDue: true,
      onKeep: (k) => void (told = k),
    });
    expect(told).toMatchObject({ days: 0 });
    expect((await history(remote)).versions["a.md"]).toHaveLength(1);
    await laptop.sync(remote, undefined, { keep: keep(30, true) });
    expect((await history(remote)).versions).toEqual({});
    // A written head shares the pick even when reading it back fails.
    const written = remote.puts.length;
    const get = remote.get.bind(remote);
    remote.get = async (key) => {
      if (key === HEAD && remote.puts.slice(written).includes(HEAD))
        throw new Error("offline");
      return get(key);
    };
    told = null;
    await expect(
      laptop.sync(remote, undefined, {
        keep: keep(365, true),
        onKeep: (k) => void (told = k),
      }),
    ).rejects.toThrow();
    expect(told).toMatchObject({ days: 365 });
  });

  it("drops the oldest versions of any file when the history outgrows its size", () => {
    const h = emptyHistory();
    for (let i = 0; i < 40; i++)
      h.versions[`f${i % 4}.md`] = [
        ...(h.versions[`f${i % 4}.md`] ?? []),
        {
          hash: "b".repeat(64),
          size: 0,
          blocks: [],
          at: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
        },
      ];
    const limit = encode(h).length / 2;
    const dropped = fit(h, limit);
    expect(encode(h).length).toBeLessThanOrEqual(limit);
    const kept = Object.values(h.versions)
      .flat()
      .map((v) => v.at);
    expect(Math.min(...kept.map(Date.parse))).toBeGreaterThan(
      Math.max(...dropped.map((v) => Date.parse(v.at))),
    );
  });

  it("rejects a malformed history and keeps plain and encrypted folders apart", async () => {
    const bad = (v: unknown) => () => parseHistory(encode(v));
    expect(bad({ format: FORMAT, current: [], versions: {} })).toThrow(
      "invalidHistory",
    );
    expect(
      bad({ format: FORMAT, current: {}, versions: { "../x": [] } }),
    ).toThrow("invalidHistory");
    const plain = new MemoryStore();
    await new MemoryLocal({ "a.md": "a" }).sync(await openPlainStore(plain));
    await expect(
      openEncryptedStore(plain, "test-only long sync passphrase"),
    ).rejects.toThrow("legacyRemote");
    const sealed = new MemoryStore();
    await openEncryptedStore(sealed, "test-only long sync passphrase");
    await expect(openPlainStore(sealed)).rejects.toThrow("remoteEncrypted");
  });
});
