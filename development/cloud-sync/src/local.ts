import { OBSIDIAN_SETTINGS, inScope, isText } from "./config";
import { scopeOf, type Scope } from "./scope";
import { describe, hash } from "./content";
import { Reservations } from "./reservations";
import {
  MAX_FILES,
  MAX_FILE_SIZE,
  SyncError,
  checkAbort,
  type Entry,
  type LocalFiles,
} from "./model";

/** What a file was found to hold, by folder and path, with the size and
 *  time it had: a later sync reads again only what changed since. */
const described = new Map<
  string,
  Map<string, { size: number; modifiedMs: number; at: number; entry: Entry }>
>();
/** A file changed this close to when it was read may change again within
 *  the same tick of its clock: read again (as Git's racy check does). */
const SETTLED_MS = 2000;

export class Workspace implements LocalFiles {
  private reservations: Reservations;
  /** Paths this run trashed or renamed, so their file events start no new sync. */
  readonly touched = new Set<string>();
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
  ) {
    this.reservations = new Reservations(storage, root);
  }
  wants(path: string) {
    return this.scope.wants(path);
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
    const known = described.get(this.root) ?? new Map();
    const seen = new Map();
    const add = async (
      rel: string,
      stat: { size: number; modifiedMs: number | null } | null,
    ) => {
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
        } else if (this.scope.wants(rel)) {
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
    await this.api.files.trash(path);
    return true;
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
