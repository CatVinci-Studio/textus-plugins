export const ID = "catvinci.cloud-sync";
export const FORMAT = "textus-cloud-sync/1";
export const CHUNK_SIZE = 2 * 1024 * 1024;
export const MAX_FILE_SIZE = 128 * 1024 * 1024;
export const MAX_MANIFEST_SIZE = 8 * 1024 * 1024;
export const MAX_FILES = 20000;
export const HEAD = "v1/head.json";
export const LOCK = "v1/lock.json";
export const TRASH_DAYS = 30;
/** Newest trash entries kept, so a renamed big folder can't fill the manifest. */
export const MAX_TRASH = 2000;

export interface Config {
  provider: "s3" | "webdav" | "nutstore";
  endpoint: string;
  region: string;
  bucket: string;
  prefix: string;
  pathStyle: boolean;
  automatic: boolean;
  interval: number;
  /** Paths left out, a rule a line, as a .gitignore writes them. */
  exclude: string;
  /** The folder's .gitignore is followed too. */
  gitignore: boolean;
  /** Obsidian's own settings (OBSIDIAN_SETTINGS) are carried too. */
  obsidian: boolean;
}
export interface Credentials {
  account: string;
  secret: string;
  sessionToken?: string;
}
export interface ConnectionInput extends Credentials {
  syncPassword?: string;
  confirmPassword?: string;
}
export interface Block {
  hash: string;
  size: number;
}
export interface Entry {
  hash: string;
  size: number;
  blocks: Block[];
}
export interface Trashed {
  path: string;
  deletedAt: string;
  entry: Entry;
}
export interface Manifest {
  format: typeof FORMAT;
  revision: string;
  updatedAt: string;
  files: Record<string, Entry>;
  /** Deleted files, kept TRASH_DAYS; older clients carry it along unread. */
  trash?: Trashed[];
}
export interface Base {
  format: typeof FORMAT;
  files: Record<string, string>;
  /** Last-synced hashes of files this device leaves out, kept for when
   *  they're included again. */
  parked?: Record<string, string>;
}
export interface ObjectStore {
  get(key: string): Promise<Uint8Array | null>;
  has(key: string): Promise<boolean>;
  put(key: string, bytes: Uint8Array): Promise<void>;
  create(key: string, bytes: Uint8Array): Promise<boolean>;
  remove(key: string): Promise<void>;
}
export interface LocalFiles {
  scan(): Promise<Record<string, Entry>>;
  /** Whether this device syncs `path`: a path it leaves out is neither
   *  sent, fetched nor deleted, wherever it is. */
  wants(path: string): boolean;
  read(path: string): Promise<Uint8Array | null>;
  /** False leaves the destination untouched (open, changed, or binary). */
  apply(
    path: string,
    bytes: Uint8Array,
    expected: string | null,
  ): Promise<boolean | "deferred">;
  /** To the system Trash, only while it still has the `expected` hash. */
  remove(path: string, expected: string): Promise<boolean | "deferred">;
  /** False when `from` changed or `to` exists. */
  move(from: string, to: string, expected: string): Promise<boolean>;
  check(): Promise<void>;
}
export interface Result {
  uploaded: number;
  downloaded: number;
  removed: number;
  moved: number;
  conflicts: string[];
  deferred: string[];
  unchanged: number;
}
export class SyncError extends Error {
  constructor(
    public code: string,
    public args: (string | number)[] = [],
  ) {
    super(code);
    this.name = "SyncError";
  }
}
export const encode = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value));
export const emptyBase = (): Base => ({
  format: FORMAT,
  files: Object.create(null),
});
export const blockKey = (hash: string) =>
  `v1/blocks/${hash.slice(0, 2)}/${hash}`;
export function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new SyncError("cancelled");
}
