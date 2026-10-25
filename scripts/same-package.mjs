// Whether a plugin version built now is the package already released.
// Zips made before folder entries were left out carry a folder dated when
// they were built, so the bytes differ though every file is the same:
// this compares the files. When they match, the catalog keeps the
// released zip's hash and size, the ones Textus checks a download against.
//   node scripts/same-package.mjs <released zip> <built zip> <id>
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import JSZip from "jszip";

const [released, built, id] = process.argv.slice(2);

async function filesOf(path) {
  const zip = await JSZip.loadAsync(readFileSync(path));
  const files = new Map();
  for (const entry of Object.values(zip.files))
    if (!entry.dir) files.set(entry.name, await entry.async("nodebuffer"));
  return files;
}

const [have, made] = await Promise.all([filesOf(released), filesOf(built)]);
const same =
  have.size === made.size &&
  [...made].every(([name, bytes]) => have.get(name)?.equals(bytes));
if (!same) process.exit(1);

const bytes = readFileSync(released);
const index = JSON.parse(readFileSync("dist/index.json", "utf8"));
const plugin = index.plugins.find((p) => p.id === id);
plugin.sha256 = createHash("sha256").update(bytes).digest("hex");
plugin.size = bytes.length;
writeFileSync("dist/index.json", `${JSON.stringify(index, null, 2)}\n`);
