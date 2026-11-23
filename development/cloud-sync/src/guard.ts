import type { Action } from "./planner";
import { SyncError, type Base, type Entry } from "./model";

/** More deletions from the cloud than this, and more than this share of
 *  the files synced, wait for the person to agree. */
const FEW = 10;
const SHARE = 0.3;

/** Nothing found where many files were synced: the folder unreadable
 *  (access lost, files not downloaded), not everything deleted. */
export function checkScanned(
  files: Record<string, Entry>,
  base: Base,
  local: { wants(path: string): boolean },
) {
  if (Object.keys(files).length) return;
  const synced = Object.keys(base.files).filter((p) => local.wants(p)).length;
  if (synced > FEW) throw new SyncError("folderEmpty", [synced]);
}

/** Stops a run about to delete many files from the cloud, unless the
 *  person agreed to as many (`allowed`). A file whose content is still
 *  here under another name moved: it doesn't count. */
export function checkDeletions(
  actions: Action[],
  local: Record<string, Entry>,
  remote: Record<string, Entry>,
  base: Record<string, string>,
  allowed = 0,
) {
  const kept = new Set(Object.values(local).map((e) => e.hash));
  const gone = actions.filter(
    (a) => a.kind === "deleteRemote" && !kept.has(remote[a.path].hash),
  ).length;
  if (gone > FEW && gone > Object.keys(base).length * SHARE && gone > allowed)
    throw new SyncError("manyDeletions", [gone]);
}

/** Whether to ask about a run `checkDeletions` stopped: always for a sync
 *  the person started, once per count for an automatic one, so a refusal
 *  isn't asked again at each interval; never twice at once. Null: not
 *  asked. */
export class DeletionQuestion {
  private declined?: number;
  private asking = false;
  async ask(
    count: number,
    byHand: boolean,
    confirm: (count: number) => Promise<boolean>,
  ): Promise<boolean | null> {
    if (this.asking || (!byHand && this.declined === count)) return null;
    this.asking = true;
    try {
      const yes = await confirm(count);
      this.declined = yes ? undefined : count;
      return yes;
    } finally {
      this.asking = false;
    }
  }
}
