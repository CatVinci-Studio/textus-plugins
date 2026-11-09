#!/usr/bin/env node
// Every source file within 500 lines, as in the app: a longer one is doing
// more than one job, and is split by those jobs. Bundles built from
// development/ (checked there), vendored libraries and tests are not counted.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LINES = 500;
/** Written by scripts/cloud-sync.mjs from development/cloud-sync/src. */
const BUILT = new Set(["plugins/catvinci.cloud-sync/host.js", "plugins/catvinci.cloud-sync/panel.js"]);
const SOURCE = /\.(m?js|ts|css|html)$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "lib" || name === "types") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (SOURCE.test(name) && !/\.(test|e2e)\.ts$/.test(name)) out.push(path);
  }
  return out;
}

const long = ["plugins", "shared", "scripts", "development"]
  .flatMap((dir) => walk(dir))
  .filter((path) => !BUILT.has(path))
  .map((path) => [path, readFileSync(path, "utf8").split("\n").length - 1])
  .filter(([, lines]) => lines > MAX_LINES);
for (const [path, lines] of long) console.error(`${path}: ${lines} lines, over ${MAX_LINES}: split it by what each part does`);
if (long.length) process.exit(1);
console.log(`lines: every source file within ${MAX_LINES}`);
