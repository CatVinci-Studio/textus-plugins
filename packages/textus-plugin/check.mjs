// What Textus would refuse, or silently ignore, in a plugin: the checks
// install and the catalog run, over the plugin's files. Pure: give it the
// files, get the problems back (cli.mjs reads a folder).
import { readFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const SCHEMA = read("./textus-plugin.schema.json");
const TABLE = read("./plugin-permissions.json");

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Each permission's calls as a plugin's code writes them (`.files.writeText`). */
const CALLS = TABLE.map(({ permission, calls }) => [
  new RegExp(`\\.(?:${calls.map((c) => escape(c) + (c.endsWith(".") ? "" : "\\b")).join("|")})`),
  permission,
]);
const KNOWN = new Set(SCHEMA.properties.permissions.items.anyOf?.flatMap((p) => p.enum ?? []) ?? SCHEMA.properties.permissions.items.enum ?? []);
const known = (p) => KNOWN.has(p) || /^(network|commands|hidden):.+/.test(p);

/**
 * The problems of the plugin whose files are `files` (path → text), each
 * `{ level: "error" | "warning", message }`. Errors stop an install or a
 * listing; warnings are what would silently do nothing.
 */
export function checkPlugin(files) {
  const problems = [];
  const error = (message) => problems.push({ level: "error", message });
  const warn = (message) => problems.push({ level: "warning", message });
  const text = files.get("textus-plugin.json");
  if (text === undefined) return error("No textus-plugin.json."), problems;
  let m;
  try {
    m = JSON.parse(text);
  } catch (e) {
    return error(`textus-plugin.json is not JSON: ${e.message}`), problems;
  }
  for (const key of ["id", "name", "version", "publisher"])
    if (typeof m[key] !== "string" || !m[key]) error(`"${key}" is missing.`);
  if (m.id && !ID.test(m.id)) error(`id "${m.id}" must be publisher.name, lowercase.`);
  if (m.version && !VERSION.test(m.version)) error(`version "${m.version}" must be like 1.0.0.`);
  if (typeof m.engines?.textus !== "string") error('"engines": { "textus": ">=1.4.3" } is missing.');

  const mains = [m.main ?? [], m.background ?? []].flat();
  for (const file of mains) if (!files.has(file)) error(`${file}, named in the manifest, isn't there.`);
  const code = mains.map((f) => files.get(f) ?? "").join("\n");

  const granted = new Set(m.permissions ?? []);
  for (const p of granted) if (!known(p)) error(`No permission "${p}".`);
  if (granted.has("files.write")) granted.add("files.read");
  for (const [call, permission] of CALLS)
    if (call.test(code) && !granted.has(permission))
      error(`The code calls ${code.match(call)[0].slice(1)}, which needs "${permission}" in permissions.`);

  const c = m.contributes ?? {};
  const own = (what, id) => typeof id === "string" && !id.startsWith(`${m.id}.`) && error(`${what} "${id}" must start with "${m.id}.".`);
  for (const x of c.commands ?? []) {
    own("Command", x.command);
    if (!x.runs && !code.includes(`"${x.command}"`) && !code.includes(`'${x.command}'`))
      warn(`Command ${x.command} is declared but never registered: it does nothing.`);
  }
  for (const key of ["sidebarTabs", "views", "floatingViews", "statusItems", "completions", "embeds"])
    for (const x of c[key] ?? []) own(key, x.id);
  for (const tool of c.aiTools ?? []) {
    if (!/registerTool\(/.test(code) || !code.includes(tool.name))
      warn(`AI tool ${tool.name} is declared but never registered.`);
    if (!granted.has("ai.tools")) error(`AI tool ${tool.name} needs "ai.tools" in permissions.`);
  }

  // Every %key% has an English string.
  const en = m.l10n?.en ?? {};
  for (const [, key] of text.matchAll(/"%([^%"]+)%"/g))
    if (!(key in en)) error(`%${key}% has no English string in l10n.en.`);
  return problems;
}
