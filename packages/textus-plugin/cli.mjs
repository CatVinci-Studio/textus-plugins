#!/usr/bin/env node
// textus-plugin check [folder...]: what Textus would refuse or ignore in
// each plugin folder (check.mjs). Exits 1 when any has an error.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { checkPlugin } from "./check.mjs";

function filesOf(dir, root = dir, out = new Map()) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) filesOf(path, root, out);
    else out.set(relative(root, path).replaceAll("\\", "/"), readFileSync(path, "utf8"));
  }
  return out;
}

const [command, ...folders] = process.argv.slice(2);
if (command !== "check") {
  console.log("Usage: textus-plugin check [folder...]");
  process.exit(command ? 1 : 0);
}
let failed = false;
for (const folder of folders.length ? folders : ["."]) {
  const problems = checkPlugin(filesOf(folder));
  failed ||= problems.some((p) => p.level === "error");
  if (!problems.length) console.log(`${folder}: ok`);
  for (const p of problems) console.log(`${folder}: ${p.level}: ${p.message}`);
}
process.exit(failed ? 1 : 0);
