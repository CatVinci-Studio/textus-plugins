import { isObsidianSetting } from "./config";
import type { Entry } from "./model";

export type Action = {
  path: string;
  kind:
    | "upload"
    | "download"
    | "conflict"
    | "equal"
    | "forget"
    | "deleteRemote"
    | "deleteLocal";
};
/** A side missing a file it had at the last sync deleted it; without that
 *  baseline (a first sync) a missing file is only not there yet. An edit on
 *  the other side wins over a deletion. */
export function plan(
  local: Record<string, Entry>,
  remote: Record<string, Entry>,
  base: Record<string, string>,
): Action[] {
  return [
    ...new Set([
      ...Object.keys(local),
      ...Object.keys(remote),
      ...Object.keys(base),
    ]),
  ]
    .sort()
    .map((path) => {
      const l = local[path]?.hash,
        r = remote[path]?.hash,
        b = base[path];
      const kind =
        l === r
          ? l
            ? "equal"
            : "forget"
          : !l
            ? r === b
              ? "deleteRemote"
              : "download"
            : !r
              ? l === b
                ? "deleteLocal"
                : "upload"
              : l === b
                ? "download"
                : r === b
                  ? "upload"
                  : // Obsidian's settings have no copy to keep: the synced
                    // one wins.
                    isObsidianSetting(path)
                    ? "download"
                    : "conflict";
      return { path, kind };
    });
}
/** Pairs a remote rename: a file to delete locally whose content arrives
 *  under a new name. */
export function moves(
  actions: Action[],
  local: Record<string, Entry>,
  remote: Record<string, Entry>,
  base: Record<string, string>,
): Map<string, string> {
  const gone = new Map<string, string>();
  for (const a of actions)
    if (a.kind === "deleteLocal" && !gone.has(local[a.path].hash))
      gone.set(local[a.path].hash, a.path);
  const pairs = new Map<string, string>();
  for (const a of actions) {
    const from = gone.get(remote[a.path]?.hash);
    if (a.kind === "download" && from && !local[a.path] && !base[a.path]) {
      pairs.set(a.path, from);
      gone.delete(remote[a.path].hash);
    }
  }
  return pairs;
}
export function conflictPath(path: string, hash: string): string {
  const safe = path.replace(/^\.textus\//, "Textus project/");
  const dot = safe.lastIndexOf(".");
  const end = dot > safe.lastIndexOf("/") + 1 ? dot : safe.length;
  return `Sync conflicts/${safe.slice(0, end)} (${hash.slice(0, 8)})${safe.slice(end)}`;
}
