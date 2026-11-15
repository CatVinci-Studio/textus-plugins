#!/usr/bin/env node
// Makes a new plugin folder from one of the examples:
//
//   create-textus-plugin <folder> [--from hello|page|code-block|ai-tool] [--id you.name]
//
// The example's `your-name.<example>` becomes the id everywhere it is
// written. In this repository the examples are ../../examples; a packed
// copy carries them in ./examples (prepack.mjs).
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KINDS = ["hello", "page", "code-block", "ai-tool"];
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

const here = fileURLToPath(new URL(".", import.meta.url));
const examples = [join(here, "examples"), join(here, "../../examples")].find(existsSync);

function option(name, fallback) {
  const at = process.argv.indexOf(`--${name}`);
  return at > 0 ? process.argv[at + 1] : fallback;
}

/** Every file under `dir`. */
function filesOf(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesOf(path) : [path];
  });
}

/** Copies example `kind` to `target`, its id changed to `id`. */
export function create(target, kind, id) {
  if (!KINDS.includes(kind)) throw new Error(`No example "${kind}": ${KINDS.join(", ")}.`);
  if (!ID.test(id)) throw new Error(`The id "${id}" must be publisher.name, lowercase: jane.word-count.`);
  if (existsSync(target) && readdirSync(target).length) throw new Error(`${target} isn't empty.`);
  const from = join(examples, kind);
  const old = JSON.parse(readFileSync(join(from, "textus-plugin.json"), "utf8"));
  const [publisher] = id.split(".");
  cpSync(from, target, { recursive: true });
  for (const file of filesOf(target)) {
    const text = readFileSync(file, "utf8");
    const next = text.replaceAll(old.id, id).replaceAll(`"publisher": "${old.publisher}"`, `"publisher": "${publisher}"`);
    if (next !== text) writeFileSync(file, next);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target || target.startsWith("--")) {
    console.log(`Usage: create-textus-plugin <folder> [--from ${KINDS.join("|")}] [--id you.name]`);
    process.exit(1);
  }
  const name = basename(resolve(target)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  try {
    create(target, option("from", "hello"), option("id", `your-name.${name}`));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  console.log(`Made ${target}. In Textus: Settings › Extensions › Plugins › Load a plugin folder…, and pick it.`);
}
