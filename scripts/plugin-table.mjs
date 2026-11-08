// The README's table of plugins, made from their manifests: each listed
// plugin's name and description in English, by name. It sits between
// <!-- plugins --> markers. `--check` fails when it is out of date.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const README = "README.md";
const START = "<!-- plugins -->";
const END = "<!-- /plugins -->";
const unlisted = new Set(JSON.parse(readFileSync("unlisted.json", "utf8")));
const text = (m, value) => {
  const key = /^%(.+)%$/.exec(value)?.[1];
  return key ? (m.l10n?.en?.[key] ?? value) : value;
};
const rows = readdirSync("plugins")
  .filter((id) => !unlisted.has(id))
  .map((id) => {
    const m = JSON.parse(readFileSync(`plugins/${id}/textus-plugin.json`, "utf8"));
    const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
    return [cell(text(m, m.name)), cell(text(m, m.description))];
  })
  .sort((a, b) => a[0].localeCompare(b[0], "en"));
const table = [
  START,
  "| Plugin | What it does |",
  "| --- | --- |",
  ...rows.map(([name, what]) => `| ${name} | ${what} |`),
  END,
].join("\n");
const readme = readFileSync(README, "utf8");
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a < 0 || b < 0) throw new Error(`${README} has no ${START} … ${END}`);
const next = readme.slice(0, a) + table + readme.slice(b + END.length);
if (process.argv.includes("--check")) {
  if (next !== readme) {
    console.error(`${README}'s plugin table is out of date: run node scripts/plugin-table.mjs`);
    process.exit(1);
  }
} else writeFileSync(README, next);
