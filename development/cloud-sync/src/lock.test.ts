import { expect, it } from "vitest";
import { STALE_MS, type LockNote, type Note } from "./lock";
import { HEAD, LOCK, encode } from "./model";
import { MemoryLocal, MemoryStore, bytes, text } from "./test-fixtures";

function noted(value: Note | null = null) {
  const note: LockNote & { value: Note | null } = {
    value,
    load: async () => note.value && { ...note.value },
    save: async (next) => {
      note.value = next;
    },
  };
  return note;
}
const mine = { id: "mine", startedAt: "2026-11-23T00:00:00.000Z" };
/** A note last renewed so that it goes stale in `ms`. */
const staleIn = (ms: number) =>
  noted({ ...mine, seen: Date.now() - STALE_MS + ms });

it("takes back, unasked, the lock a run of this device left when it was killed", async () => {
  const remote = new MemoryStore(),
    local = new MemoryLocal({ "a.md": "a" }),
    note = noted();
  // Killed before letting go: the lock stays, as does the note of it.
  const remove = remote.remove.bind(remote);
  remote.remove = async (key) => {
    if (key === LOCK) throw new Error("killed");
    await remove(key);
  };
  await expect(
    local.sync(remote, undefined, { lockNote: note }),
  ).rejects.toThrow("unlockFailed");
  remote.remove = remove;
  expect(await remote.has(LOCK)).toBe(true);
  note.value!.seen -= STALE_MS + 1;
  local.files.set("b.md", bytes("b"));
  expect(
    (await local.sync(remote, undefined, { lockNote: note })).uploaded,
  ).toBe(1);
  expect(await remote.has(LOCK)).toBe(false);
  expect(note.value).toBeNull();
});

it("started just after the kill, waits until the note goes stale and syncs", async () => {
  const remote = new MemoryStore(),
    note = staleIn(80);
  remote.values.set(LOCK, encode(mine));
  const result = await new MemoryLocal({ "a.md": "a" }).sync(
    remote,
    undefined,
    { lockNote: note },
  );
  expect(result.uploaded).toBe(1);
  expect(await remote.has(LOCK)).toBe(false);
});

it("leaves the lock to a run that renews its note meanwhile: another window's", async () => {
  const remote = new MemoryStore(),
    note = staleIn(300);
  remote.values.set(LOCK, encode(mine));
  setTimeout(() => (note.value!.seen = Date.now()), 50);
  await expect(
    new MemoryLocal({ "a.md": "a" }).sync(remote, undefined, {
      lockNote: note,
    }),
  ).rejects.toThrow("locked");
  expect(text(await remote.get(LOCK))).toContain("mine");
  expect(await remote.has(HEAD)).toBe(false);
});

it("never takes another device's lock, and keeps its own note", async () => {
  const remote = new MemoryStore(),
    note = staleIn(-1000);
  const kept = { ...note.value! };
  remote.values.set(LOCK, encode({ ...mine, id: "other" }));
  await expect(
    new MemoryLocal({ "a.md": "a" }).sync(remote, undefined, {
      lockNote: note,
    }),
  ).rejects.toThrow("locked");
  expect(text(await remote.get(LOCK))).toContain("other");
  expect(note.value).toEqual(kept);
  expect(await remote.has(HEAD)).toBe(false);
});

it("leaves the lock to a device that took it first once this one let its own go", async () => {
  const remote = new MemoryStore(),
    note = staleIn(-1000);
  remote.values.set(LOCK, encode(mine));
  const remove = remote.remove.bind(remote);
  remote.remove = async (key) => {
    await remove(key);
    if (key === LOCK) remote.values.set(LOCK, encode({ id: "quicker" }));
  };
  await expect(
    new MemoryLocal({ "a.md": "a" }).sync(remote, undefined, {
      lockNote: note,
    }),
  ).rejects.toThrow("locked");
  expect(text(await remote.get(LOCK))).toContain("quicker");
  expect(await remote.has(HEAD)).toBe(false);
});
