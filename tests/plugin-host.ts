import { readFileSync } from "node:fs";

/** Runs an official plugin's host as the sandbox does - its `main` files in
 *  order, with `exports` and a `textus` - and gives back the tools it
 *  registered for Textus AI. `api` holds the parts of `textus` a test
 *  needs; anything else is a no-op that returns a disposable. */

const ROOT = new URL("../plugins/", import.meta.url);
const libs: Record<string, string> = JSON.parse(
  readFileSync(new URL("../libs.json", import.meta.url), "utf8"),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
export type Tool = (args: Record<string, unknown>) => Promise<Any>;

function sourceOf(id: string, file: string): string {
  const lib = libs[`${id}/${file}`];
  if (!lib) return readFileSync(new URL(`${id}/${file}`, ROOT), "utf8");
  const from = lib.startsWith("./")
    ? new URL(`../${lib.slice(2)}`, import.meta.url)
    : new URL(`../node_modules/${lib}`, import.meta.url);
  return readFileSync(from, "utf8");
}

export function manifestOf(id: string): Any {
  return JSON.parse(readFileSync(new URL(`${id}/textus-plugin.json`, ROOT), "utf8"));
}

const noop = (): Any =>
  new Proxy(function () {}, {
    get: (_t, key) => (key === "then" ? undefined : key === "dispose" ? () => {} : noop()),
    apply: () => noop(),
  });

/** `api` laid over a `textus` whose every other member is a no-op. */
function fake(api: Any): Any {
  return new Proxy(api, {
    get(target, key) {
      if (key === "then") return undefined;
      if (key in target) {
        const value = target[key];
        return value && typeof value === "object" && !Array.isArray(value) ? fake(value) : value;
      }
      return noop();
    },
  });
}

/** A plugin's own global storage, in memory. */
export function memoryStorage(files: Record<string, string> = {}) {
  const values = new Map<string, unknown>();
  return {
    get: async (key: string) => values.get(key),
    set: async (key: string, value: unknown) => void values.set(key, structuredClone(value)),
    files: async () => Object.keys(files),
    readText: async (name: string) => files[name],
    writeText: async (name: string, text: string) => void (files[name] = text),
  };
}

export function loadPlugin(id: string, api: Any = {}, storage = memoryStorage()) {
  const manifest = manifestOf(id);
  const main: string[] = [].concat(manifest.main);
  const tools = new Map<string, Tool>();
  // Nothing open unless the test says so.
  const defaults: Any = {
    l10n: { t: (key: string, ...args: unknown[]) => [key, ...args].join(" ") },
    env: { language: "en" },
    files: { root: async () => null },
    editor: { getPath: async () => null, getText: async () => null, getBlocks: async () => null },
    settings: { get: async () => undefined },
    metadata: { all: async () => [] },
  };
  const merged: Any = { ...defaults, ...api };
  for (const key of Object.keys(defaults))
    if (api[key]) merged[key] = { ...defaults[key], ...api[key] };
  const textus = fake({
    ...merged,
    ai: {
      registerTool(name: string, run: Tool) {
        tools.set(name, async (args) => run(args));
        return { dispose() {} };
      },
    },
  });
  const exports: Any = {};
  // markdownlint's entity decoding makes an element of the host frame's
  // page as it loads; Marp takes a page for a browser's, so gets none.
  const document = main.includes("lib/markdownlint.js")
    ? { createElement: () => ({ innerHTML: "", textContent: "" }) }
    : undefined;
  new Function("exports", "textus", "document", main.map((f) => sourceOf(id, f)).join("\n;\n"))(
    exports,
    textus,
    document,
  );
  exports.activate({
    subscriptions: [],
    storage: { global: storage },
    plugin: { readText: async (file: string) => sourceOf(id, file) },
  });
  return { tools, manifest };
}

/** A folder of documents at /root, `files` by their path in it: enough of
 *  textus.files for the tools. */
export function folder(files: Record<string, string>) {
  const root = "/root";
  const rel = (path: string) => path.slice(root.length + 1);
  const entry = (r: string) => ({
    name: r.split("/").pop(),
    path: root + "/" + r,
    rel: r,
    isDir: false,
    size: files[r].length,
    modifiedMs: 0,
  });
  return {
    files,
    root: async () => root,
    find: async (glob = "**/*.md") => {
      const re = new RegExp(
        "^" + glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*\//g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, "(?:.*/)?") + "$",
      );
      return Object.keys(files).filter((r) => re.test(r)).map((r) => ({ path: root + "/" + r, rel: r }));
    },
    list: async (dir: string) => {
      const prefix = rel(dir.replace(/\/$/, "") + "/x").slice(0, -1);
      return Object.keys(files)
        .filter((r) => r.startsWith(prefix) && !r.slice(prefix.length).includes("/"))
        .map(entry);
    },
    stat: async (path: string) => (rel(path) in files ? entry(rel(path)) : null),
    readText: async (path: string) => {
      if (!(rel(path) in files)) throw new Error("No file " + path);
      return files[rel(path)];
    },
    writeText: async (path: string, text: string) => void (files[rel(path)] = text),
    create: async (path: string, text = "") => {
      if (rel(path) in files) throw new Error("Exists: " + path);
      files[rel(path)] = text;
    },
    process: async (path: string, change: (text: string) => string) => {
      if (!(rel(path) in files)) throw new Error("No file " + path);
      return (files[rel(path)] = change(files[rel(path)]));
    },
    createFolder: async () => {},
  };
}
