// Builds what Textus downloads: each plugin in plugins/ as a zip, with the
// libraries libs.json lists copied in from node_modules, and the catalog
// (index.json) Settings › Plugins lists them from - each plugin's
// manifest, where its zip is and its SHA-256, which Textus checks before
// it installs. Run `npm run build`; `--check` only reads the manifests.
//
// The zips go up as GitHub release assets, one release per plugin version
// (`<id>-v<version>`), and index.json on the `catalog` release
// (.github/workflows/release.yml).

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import JSZip from "jszip";

const ROOT = new URL("..", import.meta.url).pathname;
const PLUGINS = join(ROOT, "plugins");
const DIST = join(ROOT, "dist");
const REPOSITORY = "https://github.com/CatVinci-Studio/textus-plugins";
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const check = process.argv.includes("--check");

const libs = JSON.parse(readFileSync(join(ROOT, "libs.json"), "utf8"));

function files(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...files(path));
    else out.push(path);
  }
  return out;
}

function manifestOf(id) {
  const path = join(PLUGINS, id, "textus-plugin.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest.id !== id) throw new Error(`${id}: the manifest's id is ${manifest.id}`);
  if (!ID.test(id)) throw new Error(`${id}: not a plugin id`);
  if (!VERSION.test(manifest.version ?? ""))
    throw new Error(`${id}: version "${manifest.version}" is not x.y.z`);
  for (const key of ["name", "publisher", "description"])
    if (typeof manifest[key] !== "string" || !manifest[key])
      throw new Error(`${id}: the manifest has no ${key}`);
  if (typeof manifest.engines?.textus !== "string")
    throw new Error(`${id}: the manifest has no engines.textus`);
  return manifest;
}

const ids = readdirSync(PLUGINS)
  .filter((name) => statSync(join(PLUGINS, name)).isDirectory())
  .sort();
const catalog = [];
if (!check) mkdirSync(DIST, { recursive: true });

for (const id of ids) {
  const manifest = manifestOf(id);
  if (check) continue;
  const zip = new JSZip();
  // Fixed dates and no folder entries (JSZip would date those now): the
  // same sources make the same zip, and the same hash.
  const options = { date: new Date("2026-01-01T00:00:00Z"), createFolders: false };
  for (const path of files(join(PLUGINS, id)))
    zip.file(relative(join(PLUGINS, id), path), readFileSync(path), options);
  for (const [target, lib] of Object.entries(libs)) {
    if (!target.startsWith(`${id}/`)) continue;
    zip.file(
      target.slice(id.length + 1),
      readFileSync(join(ROOT, "node_modules", lib)),
      options,
    );
  }
  const bytes = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
  const file = `${id}-${manifest.version}.zip`;
  writeFileSync(join(DIST, file), bytes);
  catalog.push({
    id,
    version: manifest.version,
    // Made by CatVinci Studio and published from this repository: Textus
    // marks it Official.
    official: manifest.publisher === "catvinci",
    manifest,
    url: `${REPOSITORY}/releases/download/${id}-v${manifest.version}/${file}`,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    size: bytes.length,
  });
  console.log(`${file}  ${(bytes.length / 1024).toFixed(0)} KB`);
}

if (check) console.log(`${ids.length} manifests read`);
else
  writeFileSync(
    join(DIST, "index.json"),
    `${JSON.stringify({ schema: 1, plugins: catalog }, null, 2)}\n`,
  );
