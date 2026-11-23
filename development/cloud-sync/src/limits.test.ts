import { expect, it } from "vitest";
import { parseManifest } from "./content";
import { synchronize } from "./engine";
import { Workspace } from "./local";
import { HEAD, emptyBase, type Base } from "./model";
import {
  MemoryStore,
  bytes,
  keep,
  memoryFolder,
  memoryStorage,
  text,
} from "./test-fixtures";

/** A store that counts locks taken: a sync that takes none was idle. */
class Counting extends MemoryStore {
  locks = 0;
  async create(key: string, value: Uint8Array) {
    if (key.endsWith("lock.json")) this.locks++;
    return super.create(key, value);
  }
}
const remoteFiles = async (store: MemoryStore) =>
  parseManifest((await store.get(HEAD))!).files;

/** A device syncing folder /n; `limit` its largest file in bytes. */
function device(platform: string, files: Record<string, string> = {}) {
  const map = new Map(
    Object.entries(files).map(([p, t]) => [`/n/${p}`, bytes(t)]),
  );
  const api = memoryFolder("/n", map, platform);
  const storage = memoryStorage();
  let base: Base = emptyBase();
  return {
    map,
    file: (p: string) => text(map.get(`/n/${p}`)) ?? null,
    async sync(store: MemoryStore, limit?: number) {
      const local = new Workspace(
        api,
        "/n",
        storage,
        undefined,
        undefined,
        limit,
      );
      const result = await synchronize({
        local,
        store,
        base,
        keep: keep(90),
        saveBase: async (next) => {
          base = next;
        },
      });
      return { ...result, large: [...local.large] };
    },
  };
}

it("leaves a file too large for this device where it is, on both sides, and then syncs idle", async () => {
  const store = new Counting();
  const desk = device("macos", { "a.md": "a", "big.md": "far too large" });
  await desk.sync(store);
  const phone = device("ios");
  expect((await phone.sync(store, 8)).large).toEqual(["big.md"]);
  expect(phone.file("a.md")).toBe("a");
  expect(phone.file("big.md")).toBeNull();
  // Grown past it here after it synced: neither sent nor deleted there.
  phone.map.set("/n/a.md", bytes("a, now too large"));
  const grown = await phone.sync(store, 8);
  expect(grown.large.sort()).toEqual(["a.md", "big.md"]);
  expect(grown.removed).toBe(0);
  expect(Object.keys(await remoteFiles(store)).sort()).toEqual([
    "a.md",
    "big.md",
  ]);
  await desk.sync(store);
  expect(desk.file("a.md")).toBe("a");
  const locks = store.locks;
  await phone.sync(store, 8);
  expect(store.locks).toBe(locks);
});

it("brings files back as transfers, never deletions, once they fit", async () => {
  const store = new MemoryStore();
  const desk = device("macos", { "big.md": "far too large" });
  await desk.sync(store);
  const phone = device("ios", { "mine.md": "mine, grown large" });
  await phone.sync(store, 8);
  const later = await phone.sync(store, 1024);
  expect(later).toMatchObject({ downloaded: 1, uploaded: 1, removed: 0 });
  expect(phone.file("big.md")).toBe("far too large");
  expect(Object.keys(await remoteFiles(store)).sort()).toEqual([
    "big.md",
    "mine.md",
  ]);
});

it("keeps a file deleted elsewhere in Sync trash where there is no Trash, and never syncs it", async () => {
  const store = new Counting();
  const desk = device("macos", {
    "a.md": "one",
    "pic.png": "old",
    "Sync trash/theirs.md": "a folder of that name elsewhere",
  });
  await desk.sync(store);
  const phone = device("android");
  await phone.sync(store);
  expect(phone.file("Sync trash/theirs.md")).toBeNull();
  desk.map.delete("/n/a.md");
  desk.map.set("/n/pic.png", bytes("new"));
  await desk.sync(store);
  const result = await phone.sync(store);
  expect(result).toMatchObject({ removed: 1, downloaded: 1, notTrashed: [] });
  expect(phone.file("a.md")).toBeNull();
  expect(phone.file("Sync trash/a.md")).toBe("one");
  // An attachment changed elsewhere: the old one aside, the new in place.
  expect(phone.file("Sync trash/pic.png")).toBe("old");
  expect(phone.file("pic.png")).toBe("new");
  expect(Object.keys(await remoteFiles(store)).sort()).toEqual([
    "Sync trash/theirs.md",
    "pic.png",
  ]);
  const locks = store.locks;
  await phone.sync(store);
  expect(store.locks).toBe(locks);
  // The same name deleted again: beside the first one.
  desk.map.set("/n/a.md", bytes("two"));
  await desk.sync(store);
  await phone.sync(store);
  desk.map.delete("/n/a.md");
  await desk.sync(store);
  await phone.sync(store);
  const kept = [...phone.map.keys()].filter((p) => p.includes("Sync trash/a"));
  expect(kept.map((p) => text(phone.map.get(p))).sort()).toEqual([
    "one",
    "two",
  ]);
});
