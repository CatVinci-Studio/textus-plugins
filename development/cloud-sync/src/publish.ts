import { hash, parseManifest } from "./content";
import {
  emptyHistory,
  fit,
  parseHistory,
  retire,
  thin,
  unusedBlocks,
} from "./history";
import {
  HEAD,
  HISTORY,
  MAX_MANIFEST_SIZE,
  SyncError,
  blockKey,
  encode,
  snapshotKey,
  type Entry,
  type KeepChoice,
  type Keep,
  type Manifest,
  type ObjectStore,
  type Origin,
} from "./model";

export interface Publish {
  store: ObjectStore;
  /** The head as this run found it (null: a new folder). */
  raw: Uint8Array | null;
  remote: Manifest;
  next: Manifest;
  origin: Origin;
  /** This device's keep setting: a new choice is shared, else the
   *  folder's holds (this one's only for a folder with none yet). */
  keep: KeepChoice;
  /** Told the folder's keep setting once a history with it is written. */
  onKeep?: (keep: Keep) => void | Promise<void>;
  /** Thin and clean even when no file changed (once a day or so). */
  cleanupDue: boolean;
  ownLock: () => Promise<void>;
}

/** Writes the new head with its history and snapshot, then lets go of
 *  what the history no longer keeps. Returns whether a head was written. */
export async function publish(p: Publish): Promise<boolean> {
  const { store, remote, next } = p;
  const changed =
    !p.raw ||
    JSON.stringify([next.files, next.trash]) !==
      JSON.stringify([remote.files, remote.trash ?? []]);
  if (!changed && !p.cleanupDue && !p.keep.chosen) return false;
  const stored = await store.get(HISTORY);
  const before = stored ? parseHistory(stored) : emptyHistory();
  // A client before 0.5 wrote the head since: what it replaced joins too.
  const skipped =
    before.head && remote.revision && before.head !== remote.revision
      ? await store.get(snapshotKey(before.head))
      : null;
  let history = skipped
    ? retire(before, parseManifest(skipped), remote, { at: remote.updatedAt })
    : structuredClone(before);
  if (changed) history = retire(history, remote, next, p.origin);
  history.keep =
    p.keep.chosen || !before.keep
      ? { days: p.keep.days, at: p.origin.at }
      : before.keep;
  const dropped = thin(
    history.versions,
    Date.parse(p.origin.at),
    history.keep.days,
  );
  dropped.push(...fit(history));
  const keepMoved = JSON.stringify(history.keep) !== JSON.stringify(before.keep);
  if (!changed && !skipped && !keepMoved && !dropped.length) {
    await p.onKeep?.(history.keep);
    return false;
  }
  next.revision = crypto.randomUUID();
  next.updatedAt = p.origin.at;
  history.previous = remote.revision || undefined;
  history.head = next.revision;
  const document = encode(next);
  if (document.length > MAX_MANIFEST_SIZE) throw new SyncError("tooManyFiles");
  parseManifest(document);
  // The snapshot and the history land before the shared head.
  await store.put(snapshotKey(next.revision), document);
  await p.ownLock();
  await store.put(HISTORY, encode(history));
  await p.ownLock();
  await store.put(HEAD, document);
  const committed = await store.get(HEAD);
  if (!committed || (await hash(committed)) !== (await hash(document)))
    throw new SyncError("integrityError");
  await p.onKeep?.(history.keep);
  await clean(p, before.previous, dropped, history);
  return true;
}

/** Best effort, under the lock: the snapshot before the previous one, and
 *  the blocks only dropped versions or that snapshot used. What a failure
 *  leaves behind only takes space. */
async function clean(
  p: Publish,
  stale: string | undefined,
  dropped: Entry[],
  history: ReturnType<typeof emptyHistory>,
) {
  try {
    const candidates = [...dropped];
    const old =
      stale && stale !== p.remote.revision
        ? await p.store.get(snapshotKey(stale))
        : null;
    if (old) candidates.push(...Object.values(parseManifest(old).files));
    const unused = unusedBlocks(candidates, p.next, p.remote, history);
    if (!old && !unused.length) return;
    // No other device may run while blocks go: one could reuse them.
    await p.ownLock();
    if (old) await p.store.remove(snapshotKey(stale!));
    for (let i = 0; i < unused.length; i++) {
      if (i && i % 50 === 0) await p.ownLock();
      await p.store.remove(blockKey(unused[i]));
    }
  } catch {
    /* Left for the next cleanup. */
  }
}
