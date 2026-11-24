#!/usr/bin/env node
// Writes Material Icon Theme's icons and theme JSON from an unpacked
// material-icon-theme npm package: `node scripts/material-icons.mjs <dir>`,
// <dir> holding its package.json. Only the icons named below are copied,
// each checked to be a plain picture.
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const pkg = process.argv[2];
if (!pkg) throw new Error("Name the unpacked material-icon-theme package.");
const OUT = "plugins/catvinci.material-icons";
const src = JSON.parse(
  readFileSync(join(pkg, "dist", "material-icons.json"), "utf8"),
);

const FILES =
  `markdown mdx document pdf image svg word powerpoint table json yaml toml
xml settings javascript typescript typescript-def react react_ts python jupyter
rust go c cpp h hpp java kotlin swift ruby php csharp console html css sass vue
database lua r tex bibliography audio video zip font git readme license
changelog todo nodejs lock log epub excalidraw docker makefile key file`.split(
    /\s+/,
  );
const FOLDERS =
  `images resource docs src test public dist scripts config git github
node vscode content archive audio video font template pdf markdown lib app
components i18n export download temp private attachment meta`.split(/\s+/);

// Extensions VS Code finds by language id rather than by extension, and
// files Textus itself knows: Obsidian Bases, Apple's Numbers and Pages, Quarto.
const EXTRA = {
  javascript: "js mjs cjs",
  typescript: "ts mts cts",
  python: "py",
  go: "go",
  rust: "rs",
  c: "c",
  cpp: "cpp cc cxx",
  h: "h",
  hpp: "hpp hh hxx",
  java: "java",
  kotlin: "kt kts",
  swift: "swift",
  ruby: "rb",
  php: "php",
  csharp: "cs",
  console: "sh bash zsh fish",
  html: "html htm",
  css: "css",
  sass: "scss sass",
  vue: "vue",
  database: "sql",
  lua: "lua",
  r: "r",
  tex: "tex sty cls",
  json: "json jsonc json5",
  yaml: "yaml yml",
  xml: "xml",
  settings: "ini conf cfg properties",
  toml: "toml",
  document: "txt",
  react: "jsx",
  react_ts: "tsx",
  log: "log",
  table: "base numbers",
  word: "pages",
  markdown: "md markdown qmd",
};

const keep = new Set([...FILES, "folder", "folder-open"]);
for (const f of FOLDERS) keep.add(`folder-${f}`).add(`folder-${f}-open`);
const ids = [...keep].sort();

const sorted = (o) =>
  Object.fromEntries(
    Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
/** The names that point at a kept icon, lowercase; the first of a clash wins. */
function kept(table) {
  const out = {};
  for (const [name, id] of Object.entries(sorted(table)))
    if (keep.has(id)) out[name.toLowerCase()] ??= id;
  return sorted(out);
}

const fileExtensions = kept(src.fileExtensions);
for (const [id, exts] of Object.entries(EXTRA))
  for (const ext of exts.split(" ")) fileExtensions[ext] ??= id;
const theme = {
  iconDefinitions: Object.fromEntries(
    ids.map((id) => [id, { iconPath: `./icons/${id}.svg` }]),
  ),
  file: "file",
  folder: "folder",
  folderExpanded: "folder-open",
  fileExtensions: sorted(fileExtensions),
  fileNames: kept(src.fileNames),
  folderNames: kept(src.folderNames),
  folderNamesExpanded: kept(src.folderNamesExpanded),
};

const UNSAFE = /<script|\bon\w+\s*=|<foreignObject|href\s*=\s*["'](?!#)/i;
mkdirSync(join(OUT, "icons"), { recursive: true });
for (const old of readdirSync(join(OUT, "icons")))
  if (!keep.has(old.replace(/\.svg$/, "")))
    throw new Error(`icons/${old} is no longer named: remove it first.`);
for (const id of ids) {
  const from = join(pkg, "icons", `${id}.svg`);
  const svg = readFileSync(from, "utf8");
  if (
    UNSAFE.test(svg) ||
    svg.length > 32768 ||
    !svg.trimStart().startsWith("<svg")
  )
    throw new Error(`${id}.svg isn't a plain picture.`);
  copyFileSync(from, join(OUT, "icons", `${id}.svg`));
}
writeFileSync(
  join(OUT, "material-icons.json"),
  JSON.stringify(theme, null, 1) + "\n",
);
console.log(`${ids.length} icons written to ${OUT}`);
