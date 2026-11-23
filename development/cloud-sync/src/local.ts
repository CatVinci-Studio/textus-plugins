import { OBSIDIAN_SETTINGS, inScope, isText } from "./config";
import { scopeOf, type Scope } from "./scope";
import { describe, hash } from "./content";
import { deviceOf, folderKey } from "./device";
import { beside } from "./planner";
import { Reservations } from "./reservations";
import { ScanCache, type Seen } from "./scan-cache";
import {
  MAX_FILES,
  MAX_FILE_SIZE,
  SyncError,
  checkAbort,
  type Entry,
  type LocalFiles,
} from "./model";

/** What a file was found to hold, by folder and path, with the size and
 *  time it had: a later sync reads again only what changed since. Kept on
 *  disk too (ScanCache) for the first sync after a launch. */
const described = new Map<string, Map<string, Seen>>();
/** A file changed this close to when it was read may change again within
 *  the same tick of its clock: read again (as Git's racy check does). */
const SETTLED_MS = 2000;
/** How Textus says a device has no Trash (Android). */
const NO_TRASH = /\[noTrash\]$/;

export class Workspace implements LocalFiles {
  private reservations: Reservations;
  private cache: ScanCache;
  /** Paths this run trashed or renamed, so their file events start no new sync. */
  readonly touched = new Set<string>();
  /** Files over `limit` here or in the cloud: left as they are on both. */
  readonly large = new Set<string>();
  private ownTrash?: string;
  constructor(
    private api: Textus.Api,
    readonly root: string,
    storage: Pick<Textus.StoragePlace, "get" | "set">,
    private signal?: AbortSignal,
    private scope: Scope = scopeOf({
      exclude: "",
      gitignore: false,
      obsidian: false,
    }),
    private limit = MAX_FILE_SIZE,
  ) {
    const platform = api.env?.platform;
    const folder = folderKey(root, platform);
    this.reservations = new Reservations(storage, folder);
    this.cache = new ScanCache(storage, folder);
    this.ownTrash = deviceOf(platform).ownTrash;
  }
  private inOwnTrash(path: string) {
    const trash = this.ownTrash;
    return !!trash && (path === trash || path.startsWith(`${trash}/`));
  }
  wants(path: string) {
    return (
      this.scope.wants(path) && !this.large.has(path) && !this.inOwnTrash(path)
    );
  }
  limitRemote(remote: Record<string, Entry>) {
    for (const [path, entry] of Object.entries(remote))
      if (entry.size > this.limit && this.scope.wants(path))
        this.large.add(path);
  }
  async check() {
    checkAbort(this.signal);
    if ((await this.api.files.root()) !== this.root)
      throw new SyncError("rootChanged");
  }
  private path(relative: string) {
    if (!inScope(relative)) throw new SyncError("invalidPath");
    return `${this.root.replace(/[/\\]$/, "")}/${relative}`;
  }
  private async open(path: string) {
    const canonical = (p: string) => p.replace(/\\/g, "/").normalize("NFC");
    return (await this.api.layout.tabs()).some(
      (tab) => tab.path && canonical(tab.path) === canonical(path),
    );
  }
  private async readRaw(relative: string): Promise<Uint8Array | null> {
    await this.check();
    const path = this.path(relative);
    const stat = await this.api.files.stat(path);
    if (!stat) return null;
    if (stat.isDir) throw new SyncError("pathIsDirectory", [relative]);
    if (stat.size > MAX_FILE_SIZE) throw new SyncError("tooLarge", [relative]);
    const bytes = await this.api.files.read(path);
    if (bytes.length > MAX_FILE_SIZE)
      throw new SyncError("tooLarge", [relative]);
    return bytes;
  }
  async read(relative: string): Promise<Uint8Array | null> {
    const bytes = await this.readRaw(relative);
    const marker = await this.reservations.get(relative);
    if (bytes && marker) {
      if (this.reservations.matches(bytes, marker)) return null;
      // A replaced marker is real content, including a user's empty file.
      await this.reservations.clear(relative);
    }
    return bytes;
  }
  private async createBinary(relative: string, bytes: Uint8Array) {
    const path = this.path(relative);
    const marker = await this.reservations.reserve(relative);
    const existing = await this.readRaw(relative);
    if (!existing) {
      try {
        await this.api.files.create(path, marker);
      } catch {
        const current = await this.readRaw(relative);
        if (!current) throw new SyncError("localWriteError", [relative]);
        if (!this.reservations.matches(current, marker)) {
          await this.reservations.clear(relative);
          return false;
        }
      }
    }
    const reserved = await this.readRaw(relative);
    if (!reserved || !this.reservations.matches(reserved, marker)) {
      await this.reservations.clear(relative);
      return false;
    }
    await this.check();
    if (await this.open(path)) return "deferred" as const;
    try {
      await this.api.files.write(path, bytes);
    } catch {
      // Keep the marker journal and stop before publishing a partial download.
      throw new SyncError("localWriteError", [relative]);
    }
    return true;
  }
  async scan(): Promise<Record<string, Entry>> {
    const files: Record<string, Entry> = Object.create(null);
    let visits = 0;
    const known = described.get(this.root) ?? (await this.cache.load());
    const seen = new Map<string, Seen>();
    let read = false;
    const add = async (
      rel: string,
      stat: { size: number; modifiedMs: number | null } | null,
    ) => {
      if (stat && stat.size > this.limit) {
        this.large.add(rel);
        return;
      }
      const was = known.get(rel);
      const at = stat?.modifiedMs;
      if (
        was &&
        stat &&
        at != null &&
        was.size === stat.size &&
        was.modifiedMs === at &&
        at < was.at - SETTLED_MS &&
        !(await this.reservations.get(rel))
      ) {
        files[rel] = was.entry;
        seen.set(rel, was);
        return;
      }
      const bytes = await this.read(rel);
      read = true;
      if (!bytes) return;
      files[rel] = await describe(bytes);
      if (stat && at != null)
        seen.set(rel, {
          size: stat.size,
          modifiedMs: at,
          at: Date.now(),
          entry: files[rel],
        });
    };
    const walk = async (relative = "") => {
      await this.check();
      if (++visits > MAX_FILES || relative.split("/").length > 48)
        throw new SyncError("tooManyFiles");
      const dir = relative ? `${this.root}/${relative}` : this.root;
      for (const entry of await this.api.files.list(dir)) {
        const rel = relative ? `${relative}/${entry.name}` : entry.name;
        if (entry.isDir) {
          if (
            this.scope.enters(rel) ||
            /^\.textus\/(library|memory|skills)(\/|$)/.test(rel)
          )
            await walk(rel);
        } else if (this.wants(rel)) {
          if (++visits > MAX_FILES) throw new SyncError("tooManyFiles");
          await add(rel, entry);
        }
      }
    };
    await walk();
    // files.list deliberately hides dot directories. Reach only Textus's
    // documented project data, never plugin state, credentials or arbitrary dotfiles.
    for (const name of ["agent.md", "style.md", "style.previous.md"]) {
      const rel = `.textus/${name}`;
      const stat = await this.api.files.stat(this.path(rel));
      if (stat) await add(rel, stat);
    }
    if (this.scope.obsidian)
      for (const name of OBSIDIAN_SETTINGS) {
        const rel = `.obsidian/${name}`;
        if (!this.scope.wants(rel)) continue;
        const stat = await this.api.files.stat(this.path(rel));
        if (stat && !stat.isDir) await add(rel, stat);
      }
    for (const name of ["library", "memory", "skills"]) {
      if ((await this.api.files.stat(`${this.root}/.textus/${name}`))?.isDir)
        await walk(`.textus/${name}`);
    }
    described.set(this.root, seen);
    if (read || seen.size !== known.size) await this.cache.save(seen);
    return files;
  }
  private async holds(relative: string, expected: string) {
    const current = await this.read(relative);
    return !!current && (await hash(current)) === expected;
  }
  async remove(relative: string, expected: string) {
    await this.check();
    const path = this.path(relative);
    if (await this.open(path)) return "deferred" as const;
    if (!(await this.holds(relative, expected))) return false;
    await this.check();
    this.touched.add(path);
    try {
      await this.api.files.trash(path);
    } catch (error) {
      // No Trash here: kept in a folder of its own, else left in place.
      if (!(NO_TRASH.test(String(error)) && (await this.keepAside(relative)))) {
        this.touched.delete(path);
        return "refused" as const;
      }
    }
    return true;
  }
  /** Into the device's own trash folder, beside a file already there. */
  private async keepAside(relative: string) {
    if (!this.ownTrash) return false;
    const base = `${this.ownTrash}/${relative}`;
    for (const target of [base, beside(base, crypto.randomUUID())]) {
      const path = `${this.root.replace(/[/\\]$/, "")}/${target}`;
      if (await this.api.files.stat(path)) continue;
      try {
        await this.api.files.rename(this.path(relative), path);
        return true;
      } catch {
        /* Taken meanwhile, or refused: the next name, or left in place. */
      }
    }
    return false;
  }
  async move(from: string, to: string, expected: string) {
    await this.check();
    const source = this.path(from),
      target = this.path(to);
    // Renaming under an open tab would let its next save recreate the old file.
    if (
      (await this.open(source)) ||
      (await this.api.files.stat(target)) ||
      !(await this.holds(from, expected))
    )
      return false;
    await this.check();
    this.touched.add(source);
    try {
      await this.api.files.rename(source, target);
    } catch {
      return false;
    }
    return true;
  }
  async apply(
    relative: string,
    bytes: Uint8Array,
    expected: string | null,
  ): Promise<boolean | "deferred"> {
    await this.check();
    const path = this.path(relative);
    if (await this.open(path)) return "deferred";
    const previous = await this.read(relative);
    if ((previous ? await hash(previous) : null) !== expected) return false;
    await this.check();
    if (!previous) {
      if (!isText(relative)) {
        const created = await this.createBinary(relative, bytes);
        if (created !== true) return created;
      } else {
        try {
          const text = new TextDecoder("utf-8", {
            fatal: true,
            ignoreBOM: true,
          }).decode(bytes);
          await this.api.files.create(path, text);
        } catch {
          if (await this.api.files.stat(path)) return false;
          throw new SyncError("localWriteError", [relative]);
        }
      }
    } else {
      if (!isText(relative)) return false;
      const decoder = new TextDecoder("utf-8", {
        fatal: true,
        ignoreBOM: true,
      });
      const before = decoder.decode(previous),
        after = decoder.decode(bytes);
      let changed = false;
      await this.api.files.process(path, (current) => {
        changed = current === before;
        return changed ? after : current;
      });
      if (!changed) return false;
    }
    const after = await this.readRaw(relative);
    if (!after || (await hash(after)) !== (await hash(bytes)))
      return "deferred";
    await this.reservations.clear(relative);
    return true;
  }
}
