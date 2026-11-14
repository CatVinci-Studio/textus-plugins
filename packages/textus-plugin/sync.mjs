// Copies what this package carries from the Textus repository, their one
// source: the API's types, the manifest's schema and the permission table.
//
//   node sync.mjs [--from ../../../app]          copy them
//   node sync.mjs [--from ../../../app] --check  fail if a copy is old
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const at = process.argv.indexOf("--from");
const app = resolve(here, at > 0 ? process.argv[at + 1] : "../../../app");
const check = process.argv.includes("--check");
const FILES = ["textus.d.ts", "textus-plugin.schema.json", "plugin-permissions.json"];

const stale = [];
for (const file of FILES) {
  const source = await readFile(join(app, "docs/dev", file), "utf8");
  if (!check) await writeFile(join(here, file), source);
  else if ((await readFile(join(here, file), "utf8").catch(() => "")) !== source) stale.push(file);
}
if (stale.length) {
  console.error(`Out of date, run node sync.mjs: ${stale.join(", ")}`);
  process.exit(1);
}
console.log(`${FILES.length} files ${check ? "checked" : "copied"} from ${app}`);
