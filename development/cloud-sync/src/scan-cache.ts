import { checkEntry, hash } from "./content";
import type { Entry } from "./model";

/** What a file was found to hold, with the size and time it had then and
 *  when it was read. */
export interface Seen {
  size: number;
  modifiedMs: number;
  at: number;
  entry: Entry;
}
type Storage = Pick<Textus.StoragePlace, "get" | "set">;
/** Saved: [size, modifiedMs, at, hash, blocks] a path; blocks left out
 *  when they are the file's own hash (one block) or none (empty). */
type Row = [number, number, number, string, Entry["blocks"]?];

export const scanKey = async (root: string) =>
  `scan:${await hash(new TextEncoder().encode(root))}`;

/** The folder's scan kept between launches, so a sync after a restart
 *  reads again only what changed meanwhile. Anything malformed is taken
 *  as nothing kept: the file is read again. */
export class ScanCache {
  constructor(
    private storage: Storage,
    private root: string,
  ) {}
  async load(): Promise<Map<string, Seen>> {
    const seen = new Map<string, Seen>();
    try {
      const raw = (await this.storage.get(await scanKey(this.root))) as {
        format?: number;
        files?: Record<string, Row>;
      } | null;
      if (raw?.format !== 1 || !raw.files || typeof raw.files !== "object")
        return seen;
      for (const [path, row] of Object.entries(raw.files)) {
        if (!Array.isArray(row)) continue;
        const [size, modifiedMs, at, sum, listed] = row;
        const blocks = listed ?? (size ? [{ hash: sum, size }] : []);
        const entry: Entry = {
          hash: sum,
          size: Array.isArray(blocks)
            ? blocks.reduce((total, b) => total + b?.size, 0)
            : NaN,
          blocks,
        };
        try {
          checkEntry(entry);
        } catch {
          continue;
        }
        if ([size, modifiedMs, at].every(Number.isFinite))
          seen.set(path, { size, modifiedMs, at, entry });
      }
    } catch {
      /* Unreadable: nothing kept. */
    }
    return seen;
  }
  async save(seen: Map<string, Seen>) {
    const files: Record<string, Row> = Object.create(null);
    for (const [path, { size, modifiedMs, at, entry }] of seen) {
      const own =
        entry.size === size &&
        entry.blocks.length === (size ? 1 : 0) &&
        (!size || entry.blocks[0].hash === entry.hash);
      files[path] = own
        ? [size, modifiedMs, at, entry.hash]
        : [size, modifiedMs, at, entry.hash, entry.blocks];
    }
    await this.storage.set(await scanKey(this.root), { format: 1, files });
  }
}
