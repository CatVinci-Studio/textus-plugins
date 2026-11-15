// A stand-in Textus to test a plugin against, outside the app: runs its
// `main` files as the sandbox does (`exports`, `textus`) and keeps what it
// registers. `api` gives the parts a test needs; any other call the plugin
// API has does nothing, and a call it doesn't have throws, as it would
// in Textus.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DECLARED = new Set(
  [...readFileSync(new URL("./textus.d.ts", import.meta.url), "utf8").matchAll(/^\s+(?:readonly )?(\w+)\??[(:<]/gm)].map((m) => m[1]),
);
// What a register… gives back: a list's refresh and message too.
const disposable = () => ({ dispose() {}, refresh() {}, setMessage() {} });

/** `textus.<path>`: what `api` gives there, else a recorder, else a throw. */
function stand(api, registered, path = []) {
  return new Proxy(function () {}, {
    get(_t, key) {
      if (typeof key === "symbol" || key === "then") return undefined;
      const given = path.reduce((o, k) => o?.[k], api)?.[key];
      // A namespace given in part (`editor: { getText }`) keeps the rest.
      if (given !== undefined && (typeof given !== "object" || given === null)) return given;
      if (!DECLARED.has(key)) throw new Error(`textus.${[...path, key].join(".")} is not in the plugin API.`);
      return stand(api, registered, [...path, key]);
    },
    apply(_t, _this, args) {
      const name = path.at(-1);
      if (name.startsWith("register") || name === "onWillSave") {
        (registered[name] ??= new Map()).set(typeof args[0] === "string" ? args[0] : registered[name].size, args[1] ?? args[0]);
      }
      return name.startsWith("on") || name.startsWith("register") ? disposable() : undefined;
    },
  });
}

/** Memory for `ctx.storage.*`: get/set and text files. */
export function memoryStorage() {
  const values = new Map();
  return {
    get: async (key) => values.get(key),
    set: async (key, value) => void values.set(key, value),
    keys: async () => [...values.keys()],
    readText: async (path) => values.get(`file:${path}`) ?? null,
    writeText: async (path, text) => void values.set(`file:${path}`, text),
  };
}

/**
 * The plugin in folder `dir`, with `api` laid over the stand-in textus.
 * `activate()` runs it; `registered` holds what it registered, by kind
 * (`registerTool`, `register` for commands, `registerList`…) and id.
 */
export function loadPlugin(dir, api = {}) {
  const manifest = JSON.parse(readFileSync(join(dir, "textus-plugin.json"), "utf8"));
  const registered = {};
  const textus = stand(api, registered);
  const module = { exports: {} };
  for (const file of [manifest.main ?? []].flat())
    new Function("module", "exports", "textus", readFileSync(join(dir, file), "utf8"))(module, module.exports, textus);
  const ctx = {
    subscriptions: [],
    storage: { global: memoryStorage(), project: memoryStorage(), document: () => memoryStorage() },
    secrets: { get: async () => undefined, set: async () => {} },
    log: { info() {}, warn() {}, error() {} },
    plugin: { readText: async (path) => readFileSync(join(dir, path), "utf8") },
  };
  return {
    manifest,
    exports: module.exports,
    registered,
    async activate() {
      await module.exports.activate?.(ctx);
      return ctx;
    },
    /** Runs a command it registered. */
    run: (id, ...args) => registered.register?.get(id)?.(...args),
    /** Calls a tool it gave Textus AI. */
    callTool: (name, args = {}) => registered.registerTool?.get(name)?.(args),
  };
}
