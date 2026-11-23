import { describe, hash } from "./content";
import {
  emptyBase,
  type Base,
  type Entry,
  type LocalFiles,
  type ObjectStore,
  type KeepChoice,
  type KeepDays,
} from "./model";
import { synchronize, type Options } from "./engine";

export const bytes = (text: string) => new TextEncoder().encode(text);
export const text = (value: Uint8Array | null | undefined) =>
  value && new TextDecoder().decode(value);
export class MemoryStore implements ObjectStore {
  values = new Map<string, Uint8Array>();
  puts: string[] = [];
  async get(key: string) {
    return this.values.get(key)?.slice() ?? null;
  }
  async has(key: string) {
    return this.values.has(key);
  }
  async put(key: string, value: Uint8Array) {
    this.puts.push(key);
    this.values.set(key, value.slice());
  }
  async create(key: string, value: Uint8Array) {
    if (this.values.has(key)) return false;
    this.values.set(key, value.slice());
    return true;
  }
  async remove(key: string) {
    this.values.delete(key);
  }
}
export class MemoryLocal implements LocalFiles {
  files = new Map<string, Uint8Array>();
  deferred = new Set<string>();
  binary = new Set<string>();
  trashed: [string, Uint8Array][] = [];
  /** A device with no Trash (a phone): every trash is refused. */
  noTrash = false;
  base: Base = emptyBase();
  beforeApply?: () => void;
  /** What this device leaves out, as the user's rules would. */
  leaves = (_path: string) => false;
  wants(path: string) {
    return !this.leaves(path);
  }
  constructor(files: Record<string, string> = {}) {
    for (const [p, t] of Object.entries(files)) this.files.set(p, bytes(t));
  }
  async check() {}
  async scan() {
    const entries: Record<string, Entry> = {};
    for (const [p, value] of this.files)
      if (this.wants(p)) entries[p] = await describe(value);
    return entries;
  }
  async read(path: string) {
    return this.files.get(path)?.slice() ?? null;
  }
  async apply(path: string, value: Uint8Array, expected: string | null) {
    this.beforeApply?.();
    if (this.deferred.has(path)) return "deferred" as const;
    const old = this.files.get(path);
    if (
      (old ? await hash(old) : null) !== expected ||
      (this.binary.has(path) && !!old)
    )
      return false;
    this.files.set(path, value.slice());
    return true;
  }
  async remove(path: string, expected: string) {
    if (this.deferred.has(path)) return "deferred" as const;
    const old = this.files.get(path);
    if (!old || (await hash(old)) !== expected) return false;
    if (this.noTrash) return "refused" as const;
    this.trashed.push([path, old]);
    this.files.delete(path);
    return true;
  }
  async move(from: string, to: string, expected: string) {
    const old = this.files.get(from);
    if (
      this.deferred.has(from) ||
      this.files.has(to) ||
      !old ||
      (await hash(old)) !== expected
    )
      return false;
    this.files.set(to, old);
    this.files.delete(from);
    return true;
  }
  async sync(
    store: ObjectStore,
    signal?: AbortSignal,
    extra: Partial<Options> = {},
  ) {
    return synchronize({
      local: this,
      store,
      base: this.base,
      signal,
      keep: keep(90),
      ...extra,
      saveBase: async (base) => {
        this.base = base;
      },
    });
  }
}

/** A keep setting; `chosen`: just picked on this device. */
export const keep = (days: KeepDays, chosen = false): KeepChoice => ({
  days,
  chosen,
});

/** Textus's files over a folder in memory, `files` by whole path, each
 *  listed with its size and a time that changes with its content; `trash`
 *  as `platform` has it. */
export function memoryFolder(
  root: string,
  files: Map<string, Uint8Array>,
  platform = "macos",
) {
  const under = (dir: string) =>
    [...files.keys()].filter((p) => p.startsWith(`${dir}/`));
  const time = (p: string) =>
    files.get(p)!.reduce((h, b) => (h * 31 + b) | 0, 7) >>> 0;
  const api = {
    env: { platform },
    layout: { tabs: async () => [] },
    files: {
      root: async () => root,
      list: async (dir: string) => {
        const names = new Map<string, boolean>();
        for (const p of under(dir)) {
          const [name, ...rest] = p.slice(dir.length + 1).split("/");
          names.set(name, rest.length > 0 || !!names.get(name));
        }
        return [...names].map(([name, isDir]) => ({
          name,
          isDir,
          size: isDir ? 0 : files.get(`${dir}/${name}`)!.length,
          modifiedMs: isDir ? 0 : time(`${dir}/${name}`),
        }));
      },
      stat: async (p: string) =>
        files.has(p)
          ? { isDir: false, size: files.get(p)!.length, modifiedMs: time(p) }
          : under(p).length
            ? { isDir: true, size: 0, modifiedMs: 1 }
            : null,
      read: async (p: string) => files.get(p)!.slice(),
      create: async (p: string, t: string) => {
        if (files.has(p)) throw Error("exists");
        files.set(p, bytes(t));
      },
      write: async (p: string, b: Uint8Array) => {
        files.set(p, b.slice());
      },
      process: async (p: string, fn: (t: string) => string) => {
        files.set(p, bytes(fn(text(files.get(p))!)));
      },
      trash: async (p: string) => {
        if (platform === "android")
          throw Error(`${p} can't be moved to the Trash here. [noTrash]`);
        files.delete(p);
      },
      rename: async (from: string, to: string) => {
        if (files.has(to)) throw Error("exists");
        files.set(to, files.get(from)!);
        files.delete(from);
      },
    },
  };
  return api as typeof api & Textus.Api;
}

/** Plugin storage in memory. */
export function memoryStorage() {
  const saved = new Map<string, unknown>();
  return {
    saved,
    get: async (key: string) => structuredClone(saved.get(key)),
    set: async (key: string, value: unknown) => {
      saved.set(key, structuredClone(value));
    },
  };
}
