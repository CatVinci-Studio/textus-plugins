import { LOCK, SyncError, checkAbort, encode, type ObjectStore } from "./model";

/** The remote lock's contents: which run holds it, since when. */
export interface Owner {
  id: string;
  startedAt: string;
}
/** This device's note of the lock it holds, `seen` renewed while the run
 *  lives: one a killed run left is taken back by the next, unasked. */
export interface Note extends Owner {
  seen: number;
}
export interface LockNote {
  load(): Promise<unknown>;
  save(note: Note | null): Promise<void>;
}
export const lockNoteIn = (
  storage: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
  },
  key: string,
): LockNote => ({
  load: () => storage.get(`lock:${key}`),
  save: (note) => storage.set(`lock:${key}`, note),
});

/** How often a running sync renews its note. */
export const RENEW_MS = 10_000;
/** A note not renewed for this long is a run that ended without letting go;
 *  a newer one may be another window's sync, still running. */
export const STALE_MS = 3 * RENEW_MS;

function parseNote(value: unknown): Note | null {
  const n = value as Partial<Note> | null;
  return n &&
    typeof n.id === "string" &&
    typeof n.startedAt === "string" &&
    typeof n.seen === "number"
    ? { id: n.id, startedAt: n.startedAt, seen: n.seen }
    : null;
}
const same = (a: Uint8Array | null, b: Uint8Array) =>
  !!a && new TextDecoder().decode(a) === new TextDecoder().decode(b);
const pause = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** One run's hold on the remote folder: `v1/lock.json`, created only where
 *  none is. Another device's lock is never removed here. */
export class RemoteLock {
  readonly owner: Owner = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
  };
  private renew?: ReturnType<typeof setInterval>;
  constructor(
    private store: ObjectStore,
    private note?: LockNote,
    private signal?: AbortSignal,
  ) {}
  private bytes = () => encode(this.owner);
  private noted() {
    return this.note?.save({ ...this.owner, seen: Date.now() });
  }
  async take() {
    if (!(await this.store.create(LOCK, this.bytes()))) {
      if (!(await this.reclaim())) throw new SyncError("locked");
      if (!(await this.store.create(LOCK, this.bytes())))
        throw new SyncError("locked");
    }
    // Best effort: without it, a lock left by this run needs recovering.
    await this.noted()?.catch(() => {});
    this.renew = setInterval(
      () => void this.noted()?.catch(() => {}),
      RENEW_MS,
    );
  }
  /** The lock this device noted removed, once the note shows its run
   *  stopped: waited for while it was renewed lately, given up on as soon
   *  as it is renewed again (that run lives, in another window). */
  private async reclaim() {
    const noted = parseNote(await this.note?.load());
    if (
      !noted ||
      !same(
        await this.store.get(LOCK),
        encode({ id: noted.id, startedAt: noted.startedAt }),
      )
    )
      return false;
    while (Date.now() - noted.seen <= STALE_MS) {
      await pause(Math.min(RENEW_MS, noted.seen + STALE_MS + 1 - Date.now()));
      checkAbort(this.signal);
      const now = parseNote(await this.note?.load());
      if (now?.id !== noted.id || now.seen !== noted.seen) return false;
    }
    await this.store.remove(LOCK);
    return true;
  }
  /** Throws unless the remote lock is still this run's. */
  async check() {
    if (!same(await this.store.get(LOCK), this.bytes()))
      throw new SyncError("lockLost");
  }
  /** Removed only while it is still this run's; the note stays when that
   *  fails, so the next run takes it back. */
  async release() {
    clearInterval(this.renew);
    await this.check();
    await this.store.remove(LOCK);
    await this.note?.save(null);
  }
}
