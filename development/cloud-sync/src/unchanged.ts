import { parseManifest } from "./content";
import type { Options } from "./engine";
import { HEAD, type Entry, type Result } from "./model";

/** Nothing changed here since the last sync, and the remote is still the
 *  revision it was then: done, with one request and no lock. Null when
 *  anything may have to move, and the sync runs in full. */
export async function unchanged(
  options: Options,
  files: Record<string, Entry>,
): Promise<Result | null> {
  const { local, store, base } = options;
  if (!base.revision || options.cleanupDue || options.keep.chosen) return null;
  // A copy here of a file left out (parked) counts only once it changes.
  const parked = base.parked ?? {};
  const ours = Object.entries(files).filter(
    ([path, e]) => local.wants(path) && parked[path] !== e.hash,
  );
  if (
    ours.length !== Object.keys(base.files).length ||
    ours.some(([path, entry]) => base.files[path] !== entry.hash)
  )
    return null;
  try {
    const raw = await store.get(HEAD);
    const remote = raw && parseManifest(raw);
    if (!remote || remote.revision !== base.revision) return null;
    local.limitRemote?.(remote.files);
    // The same revision, but what this device takes of it changed (a folder
    // no longer left out): its files there are fetched in full.
    const theirs = Object.entries(remote.files).filter(([p]) => local.wants(p));
    if (
      theirs.length !== ours.length ||
      theirs.some(([path, entry]) => base.files[path] !== entry.hash)
    )
      return null;
  } catch {
    // Half written (a WebDAV PUT isn't atomic): read again under the lock.
    return null;
  }
  return {
    uploaded: 0,
    downloaded: 0,
    removed: 0,
    moved: 0,
    conflicts: [],
    deferred: [],
    notTrashed: [],
    unchanged: ours.length,
  };
}
