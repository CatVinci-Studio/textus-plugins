import { isObsidianSetting } from "./config";
import { hash, parseManifest } from "./content";
import { conflictPath, moves, plan } from "./planner";
import { PendingBlocks, resume, type PendingStore } from "./pending";
import { RemoteLock, type LockNote } from "./lock";
import { checkDeletions, checkScanned } from "./guard";
import { Pool } from "./pool";
import { publish } from "./publish";
import { unchanged } from "./unchanged";
import {
  FORMAT,
  HEAD,
  MAX_TRASH,
  SyncError,
  TRANSFER_BYTES,
  TRASH_DAYS,
  blockKey,
  checkAbort,
  type Base,
  type Entry,
  type Keep,
  type KeepChoice,
  type LocalFiles,
  type Manifest,
  type ObjectStore,
  type Result,
} from "./model";

/** The actions that move a file's contents. */
const TRANSFERS = new Set(["download", "conflict", "upload"]);

type Progress = (phase: string, current: number, total: number) => void;
export interface Options {
  local: LocalFiles;
  store: ObjectStore;
  base: Base;
  saveBase: (base: Base) => Promise<void>;
  keep: KeepChoice;
  onKeep?: (keep: Keep) => void | Promise<void>;
  /** This device's name in the history. */
  device?: string;
  /** Thin and clean the history even when no file changed. */
  cleanupDue?: boolean;
  signal?: AbortSignal;
  progress?: Progress;
  /** Transfers at once (Config.parallel). */
  parallel?: number;
  /** Where blocks stored by a run that stopped before publishing are kept. */
  pending?: PendingStore;
  /** Where this device notes the lock it holds (RemoteLock). */
  lockNote?: LockNote;
  /** Deletions from the cloud the person agreed to (checkDeletions). */
  allowDeletions?: number;
}

export async function download(
  store: ObjectStore,
  entry: Entry,
  signal?: AbortSignal,
) {
  const bytes = new Uint8Array(entry.size);
  let offset = 0;
  for (const block of entry.blocks) {
    checkAbort(signal);
    const chunk = await store.get(blockKey(block.hash));
    if (
      !chunk ||
      chunk.length !== block.size ||
      (await hash(chunk)) !== block.hash
    )
      throw new SyncError("integrityError");
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  if ((await hash(bytes)) !== entry.hash) throw new SyncError("integrityError");
  return bytes;
}

/** Each block sent once: by hash, the ones stored or being stored. */
type Known = Map<string, Promise<void>>;

async function upload(
  store: ObjectStore,
  entry: Entry,
  bytes: Uint8Array,
  known: Known,
  signal?: AbortSignal,
  onStored: (hash: string) => void = () => {},
) {
  let offset = 0;
  for (const block of entry.blocks) {
    checkAbort(signal);
    let stored = known.get(block.hash);
    if (!stored) {
      const hashed = block.hash;
      stored = putBlock(
        store,
        hashed,
        bytes.subarray(offset, offset + block.size),
      ).then(() => onStored(hashed));
      known.set(block.hash, stored);
    }
    await stored;
    offset += block.size;
  }
}
/** One request: blocks are named by their contents, so sending one that is
 *  there already changes nothing, and asking first would cost as much. The
 *  answer is the check: S3 refuses a body that isn't the one signed, WebDAV
 *  one cut short; every download checks each block's hash again. */
async function putBlock(store: ObjectStore, hashed: string, bytes: Uint8Array) {
  await store.put(blockKey(hashed), bytes);
}

export async function synchronize(options: Options): Promise<Result> {
  const { local, store, signal } = options;
  const progress = options.progress ?? (() => {});
  checkAbort(signal);
  await local.check();
  progress("scanning", 0, 0);
  const files = await local.scan();
  checkScanned(files, options.base, local);
  checkAbort(signal);
  const idle = await unchanged(options, files);
  if (idle) return idle;
  checkAbort(signal);
  progress("locking", 0, 0);
  const lock = new RemoteLock(store, options.lockNote, signal);
  await lock.take();
  const ownLock = () => lock.check();
  let completed = false;
  let blocks: PendingBlocks | undefined;
  const pool = new Pool(options.parallel ?? 4, TRANSFER_BYTES);
  // Downloads fetched a few files ahead of the loop that applies them.
  const fetching = new Map<string, Promise<Uint8Array>>();
  try {
    await ownLock();
    const raw = await store.get(HEAD);
    const remote: Manifest = raw
      ? parseManifest(raw)
      : {
          format: FORMAT,
          revision: "",
          updatedAt: "",
          files: Object.create(null),
        };
    // Left out for its size there, a file here is neither sent nor deleted.
    local.limitRemote?.(remote.files);
    for (const path in files) if (!local.wants(path)) delete files[path];
    // A previously joined folder must never silently recreate a missing repository.
    if (
      !raw &&
      (Object.keys(options.base.files).length ||
        Object.keys(options.base.parked ?? {}).length)
    )
      throw new SyncError("remoteMissing");
    const now = new Date(store.now?.() ?? Date.now());
    const cutoff = now.getTime() - TRASH_DAYS * 86_400_000;
    const next: Manifest = {
      ...remote,
      files: { ...remote.files },
      trash: (remote.trash ?? []).filter(
        (t) => Date.parse(t.deletedAt) > cutoff,
      ),
    };
    // What this device leaves out stays as it is, here and there; its
    // last-synced state is parked. Included again, it counts only while the
    // file is still here: a missing one is fetched, never taken for a
    // deletion, and one changed elsewhere meanwhile is downloaded.
    const ours = <T>(from: Record<string, T>) =>
      Object.fromEntries(
        Object.entries(from).filter(([path]) => local.wants(path)),
      );
    const lastSynced = { ...options.base.parked, ...options.base.files };
    const base: Base = {
      format: FORMAT,
      files: Object.fromEntries(
        Object.entries(lastSynced).filter(
          ([path]) =>
            local.wants(path) && (path in options.base.files || path in files),
        ),
      ),
    };
    const parked = Object.fromEntries(
      Object.entries(lastSynced).filter(([path]) => !local.wants(path)),
    );
    if (Object.keys(parked).length) base.parked = parked;
    // Blocks the folder's files use are stored already.
    const known: Known = new Map();
    for (const entry of Object.values(remote.files))
      for (const block of entry.blocks)
        known.set(block.hash, Promise.resolve());
    // And the ones a stopped run of this device stored.
    blocks = new PendingBlocks(
      store,
      await resume(store, remote.revision, options.pending),
      options.pending,
    );
    for (const hashed of blocks.hashes) known.set(hashed, Promise.resolve());
    let begun: Promise<void> | undefined;
    const result: Result = {
      uploaded: 0,
      downloaded: 0,
      removed: 0,
      moved: 0,
      conflicts: [],
      deferred: [],
      notTrashed: [],
      unchanged: 0,
    };
    const ourBase = { ...base.files };
    const actions = plan(files, ours(remote.files), ourBase);
    checkDeletions(
      actions,
      files,
      remote.files,
      ourBase,
      options.allowDeletions,
    );
    // Twins left out here still clash with an upload of the other.
    const names = new Map(
      Object.keys(remote.files).map((p) => [
        p.normalize("NFC").toLowerCase(),
        p,
      ]),
    );
    for (const a of actions) {
      const folded = a.path.normalize("NFC").toLowerCase();
      if (names.has(folded) && names.get(folded) !== a.path)
        throw new SyncError("caseCollision");
      names.set(folded, a.path);
    }
    const keepRemote = async (
      path: string,
      entry: Entry,
      bytes: Uint8Array,
    ) => {
      const candidate = conflictPath(path, entry.hash);
      let target = candidate;
      for (let attempt = 0; attempt < 4; attempt++) {
        const existing = await local.read(target);
        const remoteExisting = next.files[target];
        const collision = names.get(target.normalize("NFC").toLowerCase());
        if (
          (!collision || collision === target) &&
          (!remoteExisting || remoteExisting.hash === entry.hash) &&
          (existing
            ? (await hash(existing)) === entry.hash
            : (await local.apply(target, bytes, null)) === true)
        ) {
          next.files[target] = entry;
          base.files[target] = entry.hash;
          names.set(target.normalize("NFC").toLowerCase(), target);
          result.conflicts.push(target);
          return;
        }
        const dot = candidate.lastIndexOf(".");
        target = `${candidate.slice(0, dot)}-${crypto.randomUUID()}${candidate.slice(dot)}`;
      }
      throw new SyncError("localChanged");
    };
    const done = new Set<string>();
    for (const [to, from] of moves(actions, files, remote.files, ourBase)) {
      checkAbort(signal);
      await local.check();
      if (!(await local.move(from, to, files[from].hash))) continue;
      delete base.files[from];
      base.files[to] = files[from].hash;
      done.add(from).add(to);
      result.moved++;
    }
    // In order, while slots are free: the next one to apply is always
    // fetched first, so a slot held for a later one never blocks it.
    let ahead = 0;
    const fetchAhead = (from: number) => {
      for (ahead = Math.max(ahead, from); ahead < actions.length; ahead++) {
        const { path, kind } = actions[ahead];
        if (done.has(path) || !TRANSFERS.has(kind)) continue;
        // One that may send too takes its own slot in its turn: nothing
        // fetched after it may hold one meanwhile.
        if (kind !== "download" || files[path]) return;
        if (!pool.tryTake(remote.files[path].size)) return;
        const bytes = download(store, remote.files[path], signal);
        bytes.catch(() => {});
        fetching.set(path, bytes);
      }
    };
    const fetched = async (path: string, entry: Entry) => {
      let bytes = fetching.get(path);
      if (!bytes) {
        await pool.take(entry.size);
        bytes = download(store, entry, signal);
        fetching.set(path, bytes);
      }
      try {
        return await bytes;
      } finally {
        fetching.delete(path);
        pool.give(entry.size);
      }
    };
    // Done is what has finished: uploads still sending don't count yet.
    let reached = 0,
      sending = 0;
    const report = () =>
      progress("transferring", reached - sending, actions.length);
    for (let i = 0; i < actions.length; i++) {
      fetchAhead(i);
      checkAbort(signal);
      await local.check();
      const { path, kind } = actions[i];
      reached = i;
      report();
      const l = files[path],
        r = remote.files[path];
      if (done.has(path)) continue;
      if (kind === "equal") {
        base.files[path] = l.hash;
        result.unchanged++;
        continue;
      }
      if (kind === "forget") {
        delete base.files[path];
        continue;
      }
      if (kind === "deleteRemote") {
        // Its content stays in the history.
        delete next.files[path];
        delete base.files[path];
        result.removed++;
        continue;
      }
      if (kind === "deleteLocal") {
        const removed = await local.remove(path, l.hash);
        if (removed === true) {
          delete base.files[path];
          result.removed++;
        } else if (removed === "refused") result.notTrashed.push(path);
        else result.deferred.push(path);
        continue;
      }
      if (kind === "download" || kind === "conflict") {
        const bytes = await fetched(path, r);
        checkAbort(signal);
        const applied =
          kind === "download" &&
          (await local.apply(path, bytes, l?.hash ?? null));
        if (applied === "deferred") {
          result.deferred.push(path);
          continue;
        }
        if (applied === true) {
          base.files[path] = r.hash;
          result.downloaded++;
          continue;
        }
        // An attachment changed elsewhere and not here: the old one goes to
        // the trash and the new one takes its place (it can't be rewritten
        // in place). Kept as two files, it was sent back over the new one.
        if (applied === false && kind === "download" && l) {
          const gone = await local.remove(path, l.hash);
          if (gone === "deferred" || gone === "refused") {
            result[gone === "refused" ? "notTrashed" : "deferred"].push(path);
            continue;
          }
          const placed = gone && (await local.apply(path, bytes, null));
          if (placed === true) {
            base.files[path] = r.hash;
            result.downloaded++;
            continue;
          }
          // Trashed but not placed (a tab opened on it), or a setting
          // Obsidian rewrote meanwhile: fetched next time, no copy made.
          if (gone || isObsidianSetting(path)) {
            result.deferred.push(path);
            continue;
          }
        }
        // Concurrent edits are kept as two files.
        await keepRemote(path, r, bytes);
        if (kind === "download" && !l) {
          result.deferred.push(path);
          continue;
        }
      }
      if (!l) {
        result.deferred.push(path);
        continue;
      }
      // The slot before the read: a file is in memory only inside one.
      await pool.take(l.size);
      const current = await local.read(path);
      if (!current || (await hash(current)) !== l.hash) {
        pool.give(l.size);
        result.deferred.push(path);
        continue;
      }
      sending++;
      pool.run(l.size, async () => {
        try {
          await (begun ??= blocks!.begin());
          await upload(store, l, current, known, signal, (hashed) =>
            blocks!.stored(hashed),
          );
          next.files[path] = l;
          base.files[path] = l.hash;
          result.uploaded++;
        } finally {
          sending--;
          report();
        }
      });
    }
    reached = actions.length;
    await pool.drain();
    checkAbort(signal);
    await local.check();
    await ownLock();
    progress("publishing", actions.length, actions.length);
    next.trash = next.trash!.slice(-MAX_TRASH);
    await publish({
      store,
      raw,
      remote,
      next,
      origin: {
        at: new Date(store.now?.() ?? Date.now()).toISOString(),
        device: options.device,
      },
      keep: options.keep,
      onKeep: options.onKeep,
      cleanupDue: options.cleanupDue ?? false,
      ownLock,
    });
    await blocks.done();
    // Left to do (a file open, changed meanwhile): next time runs in full.
    if (!result.deferred.length && !result.notTrashed.length && next.revision)
      base.revision = next.revision;
    await options.saveBase(base);
    completed = true;
    return result;
  } finally {
    // Nothing of this run still sending when the lock goes.
    await Promise.allSettled([pool.settle(), ...fetching.values()]);
    if (!completed) await blocks?.save();
    // Cancellation cannot prevent releasing our lock. A lock belonging to a
    // replacement run is never removed, even after manual recovery elsewhere.
    try {
      await lock.release();
    } catch {
      if (completed) throw new SyncError("unlockFailed");
    }
  }
}
