import { checkEntry } from "./content";
import { inScope } from "./config";
import {
  FORMAT,
  KEEP_DAYS,
  MAX_HISTORY_SIZE,
  SyncError,
  encode,
  type Entry,
  type History,
  type KeepDays,
  type Manifest,
  type Origin,
  type Version,
} from "./model";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Versions a path keeps at most, whatever their age. */
const MAX_VERSIONS = 200;
const time = (iso: string | undefined) => (iso ? Date.parse(iso) : NaN);
/** When a version stopped being current (written by 0.5.0: when written). */
export const retiredAt = (v: { at: string; until?: string }) => time(v.until ?? v.at);

export const emptyHistory = (): History => ({
  format: FORMAT,
  current: Object.create(null),
  versions: Object.create(null),
});

const checkOrigin = (o: Origin) => {
  if (
    !o ||
    !Number.isFinite(Date.parse(o.at)) ||
    (o.device !== undefined &&
      (typeof o.device !== "string" || o.device.length > 64))
  )
    throw new Error();
};

export function parseHistory(raw: Uint8Array): History {
  try {
    if (raw.length > MAX_HISTORY_SIZE) throw new Error();
    const h = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw));
    if (
      h.format !== FORMAT ||
      !h.current ||
      Array.isArray(h.current) ||
      !h.versions ||
      Array.isArray(h.versions) ||
      (h.previous !== undefined && typeof h.previous !== "string") ||
      (h.head !== undefined && typeof h.head !== "string") ||
      (h.keep !== undefined &&
        (!KEEP_DAYS.includes(h.keep.days) || !Number.isFinite(time(h.keep.at))))
    )
      throw new Error();
    for (const [path, o] of Object.entries(h.current)) {
      if (!inScope(path)) throw new Error();
      checkOrigin(o as Origin);
    }
    for (const [path, list] of Object.entries(h.versions)) {
      if (!inScope(path) || !Array.isArray(list)) throw new Error();
      for (const v of list as Version[]) {
        checkEntry(v);
        checkOrigin(v);
        if (v.until !== undefined && !Number.isFinite(time(v.until)))
          throw new Error();
      }
    }
    return h;
  } catch {
    throw new SyncError("invalidHistory");
  }
}

/** The history after `remote` became `next`: each replaced or deleted
 *  file's content joins its path's versions, and each new content's
 *  origin is this device, now. */
export function retire(
  history: History,
  remote: Manifest,
  next: Manifest,
  origin: Origin,
): History {
  const current: Record<string, Origin> = Object.create(null);
  const versions: Record<string, Version[]> = Object.create(null);
  for (const [path, list] of Object.entries(history.versions))
    versions[path] = [...list];
  const was = (path: string): Origin =>
    history.current[path] ?? { at: remote.updatedAt || origin.at };
  for (const [path, entry] of Object.entries(next.files))
    current[path] =
      remote.files[path]?.hash === entry.hash ? was(path) : origin;
  for (const [path, entry] of Object.entries(remote.files)) {
    if (next.files[path]?.hash === entry.hash) continue;
    versions[path] = [
      { ...entry, ...was(path), until: origin.at },
      ...(versions[path] ?? []),
    ];
  }
  return { ...history, current, versions };
}

/** Keeps, for each path, the newest version per hour for a day, then the
 *  newest per day for `keepDays` (0: always), at most `cap`; returns the
 *  versions let go. */
export function thin(
  versions: Record<string, Version[]>,
  now: number,
  keepDays: KeepDays,
  cap = MAX_VERSIONS,
): Version[] {
  const dropped: Version[] = [];
  for (const [path, list] of Object.entries(versions)) {
    const seen = new Set<string>();
    const kept: Version[] = [];
    for (const v of [...list].sort((a, b) => retiredAt(b) - retiredAt(a))) {
      const at = retiredAt(v);
      const age = now - at;
      const bucket =
        age < DAY ? `h${Math.floor(at / HOUR)}` : `d${Math.floor(at / DAY)}`;
      const expired = keepDays !== 0 && age > keepDays * DAY;
      if (expired || seen.has(bucket) || kept.length >= cap) dropped.push(v);
      else {
        seen.add(bucket);
        kept.push(v);
      }
    }
    if (kept.length) versions[path] = kept;
    else delete versions[path];
  }
  return dropped;
}

/** Lets the oldest versions go, whichever path they belong to, until the
 *  history fits its size; returns them. */
export function fit(history: History, limit = MAX_HISTORY_SIZE): Version[] {
  let size = encode(history).length;
  if (size <= limit) return [];
  const all = Object.entries(history.versions)
    .flatMap(([path, list]) => list.map((v) => ({ path, v })))
    .sort((a, b) => retiredAt(a.v) - retiredAt(b.v));
  const dropped: Version[] = [];
  for (const { path, v } of all) {
    if (size <= limit) break;
    size -= encode(v).length + 1;
    const list = history.versions[path].filter((x) => x !== v);
    if (list.length) history.versions[path] = list;
    else {
      delete history.versions[path];
      size -= encode(path).length + 3;
    }
    dropped.push(v);
  }
  if (encode(history).length > limit) throw new SyncError("tooManyFiles");
  return dropped;
}

const blocksOf = (entries: Iterable<Entry>, into: Set<string>) => {
  for (const e of entries) for (const b of e.blocks) into.add(b.hash);
  return into;
};

/** The blocks of `candidates` that nothing kept still uses: the head's
 *  files and old trash, the previous head's files (its snapshot is kept),
 *  and every version. */
export function unusedBlocks(
  candidates: Entry[],
  next: Manifest,
  previous: Manifest,
  history: History,
): string[] {
  const used = blocksOf(Object.values(next.files), new Set());
  blocksOf(Object.values(previous.files), used);
  for (const list of Object.values(history.versions)) blocksOf(list, used);
  blocksOf((next.trash ?? []).map((t) => t.entry), used);
  return [...blocksOf(candidates, new Set())].filter((h) => !used.has(h));
}
