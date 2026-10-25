// Builds what Textus downloads: each plugin in plugins/ as a zip, with the
// libraries libs.json lists copied in from node_modules, and the catalog
// (index.json) Settings › Plugins lists them from - each plugin's
// manifest, where its zip is and its SHA-256, which Textus checks before
// it installs. Run `npm run build`; `--check` only reads the manifests.
//
// The zips go up as GitHub release assets, one release per plugin version
// (`<id>-v<version>`), and index.json on the `catalog` release
// (.github/workflows/release.yml). The skills in skills/ - a skill file
// each - go up on the `catalog` release too, as skill-<name>.md, and
// index.json lists them beside the plugins.

import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import JSZip from "jszip";

const ROOT = new URL("..", import.meta.url).pathname;
const PLUGINS = join(ROOT, "plugins");
const SKILLS = join(ROOT, "skills");
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
  if (manifest.id !== id)
    throw new Error(`${id}: the manifest's id is ${manifest.id}`);
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
  const options = {
    date: new Date("2026-01-01T00:00:00Z"),
    createFolders: false,
  };
  for (const path of files(join(PLUGINS, id)))
    zip.file(relative(join(PLUGINS, id), path), readFileSync(path), options);
  for (const [target, lib] of Object.entries(libs)) {
    if (!target.startsWith(`${id}/`)) continue;
    const from = join(ROOT, "node_modules", lib);
    // A folder (its name ends in "/"): every file in it.
    const sources = lib.endsWith("/")
      ? files(from).map((path) => [target + relative(from, path), path])
      : [[target, from]];
    for (const [name, path] of sources)
      zip.file(name.slice(id.length + 1), readFileSync(path), options);
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

/** A skill file's front matter: its name, description and the metadata
 *  the catalog lists (Textus reads the file itself the same way). */
function skillOf(file) {
  const text = readFileSync(join(SKILLS, file), "utf8");
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!front) throw new Error(`${file}: no front matter`);
  const field = (key) => {
    const m = new RegExp(
      `^${key}:\\s*(>-)?\\s*\n?((?:.*\\S.*\\n?)(?:  .*\\n?)*)`,
      "m",
    ).exec(front[1]);
    if (!m) return "";
    return m[2]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/^"|"$/g, "");
  };
  const name = field("name");
  const description = field("description");
  const version =
    (/textus-version:\s*"?([^"\n]+)"?/.exec(front[1]) ?? [])[1] ?? "";
  if (!name || name !== file.replace(/\.md$/, ""))
    throw new Error(`${file}: its name must be its file's`);
  if (!description) throw new Error(`${file}: no description`);
  if (!VERSION.test(version))
    throw new Error(`${file}: textus-version "${version}" is not x.y.z`);
  if (!text.slice(front[0].length).trim())
    throw new Error(`${file}: no instructions`);
  return { name, description, version, bytes: Buffer.from(text) };
}

const skillFiles = readdirSync(SKILLS)
  .filter((f) => f.endsWith(".md"))
  .sort();
const skills = [];
for (const file of skillFiles) {
  const skill = skillOf(file);
  if (check) continue;
  const asset = `skill-${skill.name}.md`;
  writeFileSync(join(DIST, asset), skill.bytes);
  skills.push({
    name: skill.name,
    version: skill.version,
    description: skill.description,
    author: "CatVinci Studio",
    official: true,
    url: `${REPOSITORY}/releases/download/catalog/${asset}`,
    sha256: createHash("sha256").update(skill.bytes).digest("hex"),
    size: skill.bytes.length,
  });
  console.log(`${asset}  ${skill.bytes.length} bytes`);
}

if (check)
  console.log(`${ids.length} manifests and ${skillFiles.length} skills read`);
else
  writeFileSync(
    join(DIST, "index.json"),
    `${JSON.stringify({ schema: 1, plugins: catalog, skills }, null, 2)}\n`,
  );
