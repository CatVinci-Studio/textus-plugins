import { isObsidianSetting } from "./config";
import { hash, parseManifest } from "./content";
import { conflictPath, moves, plan } from "./planner";
import { publish } from "./publish";
import {
  FORMAT,
  HEAD,
  LOCK,
  MAX_TRASH,
  SyncError,
  TRASH_DAYS,
  blockKey,
  encode,
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

async function upload(
  store: ObjectStore,
  entry: Entry,
  bytes: Uint8Array,
  known: Set<string>,
  signal?: AbortSignal,
) {
  let offset = 0;
  for (const block of entry.blocks) {
    checkAbort(signal);
    if (!known.has(block.hash)) {
      const key = blockKey(block.hash);
      if (!(await store.has(key)))
        await store.put(key, bytes.subarray(offset, offset + block.size));
      // A stored block's name alone is not proof of its contents.
      const actual = await store.get(key);
      if (!actual || (await hash(actual)) !== block.hash)
        throw new SyncError("integrityError");
      known.add(block.hash);
    }
    offset += block.size;
  }
}

export async function synchronize(options: Options): Promise<Result> {
  const { local, store, signal } = options;
  const progress = options.progress ?? (() => {});
  const owner = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
  };
  checkAbort(signal);
  await local.check();
  progress("locking", 0, 0);
  if (!(await store.create(LOCK, encode(owner)))) throw new SyncError("locked");
  const ownLock = async () => {
    const raw = await store.get(LOCK);
    if (
      !raw ||
      new TextDecoder().decode(raw) !== new TextDecoder().decode(encode(owner))
    )
      throw new SyncError("lockLost");
  };
  let completed = false;
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
    // A previously joined folder must never silently recreate a missing repository.
    if (
      !raw &&
      (Object.keys(options.base.files).length ||
        Object.keys(options.base.parked ?? {}).length)
    )
      throw new SyncError("remoteMissing");
    progress("scanning", 0, 0);
    const files = await local.scan();
    checkAbort(signal);
    const now = new Date();
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
    const known = new Set<string>();
    const result: Result = {
      uploaded: 0,
      downloaded: 0,
      removed: 0,
      moved: 0,
      conflicts: [],
      deferred: [],
      unchanged: 0,
    };
    const ourBase = { ...base.files };
    const actions = plan(files, ours(remote.files), ourBase);
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
    for (let i = 0; i < actions.length; i++) {
      checkAbort(signal);
      await local.check();
      const { path, kind } = actions[i];
      progress("transferring", i, actions.length);
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
        } else result.deferred.push(path);
        continue;
      }
      if (kind === "download" || kind === "conflict") {
        const bytes = await download(store, r, signal);
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
          if (gone === "deferred") {
            result.deferred.push(path);
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
      const current = await local.read(path);
      if (!l || !current || (await hash(current)) !== l.hash) {
        result.deferred.push(path);
        continue;
      }
      await upload(store, l, current, known, signal);
      next.files[path] = l;
      base.files[path] = l.hash;
      result.uploaded++;
    }
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
      origin: { at: new Date().toISOString(), device: options.device },
      keep: options.keep,
      onKeep: options.onKeep,
      cleanupDue: options.cleanupDue ?? false,
      ownLock,
    });
    await options.saveBase(base);
    completed = true;
    return result;
  } finally {
    // Cancellation cannot prevent releasing our lock. A lock belonging to a
    // replacement run is never removed, even after manual recovery elsewhere.
    try {
      await ownLock();
      await store.remove(LOCK);
    } catch {
      if (completed) throw new SyncError("unlockFailed");
    }
  }
}

