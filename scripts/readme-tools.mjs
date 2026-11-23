// The parts of each plugin README in every language that come from one
// place. Its "Tools for Textus AI" section, made from the manifest: the
// tools in contributes.aiTools, each with its description in the README's
// language (the manifest's l10n, else English), between <!-- ai-tools -->
// markers at the end. And its Changes: the English README's list, in
// English, under the heading in the README's language, so a release edits
// README.md alone.
// `node scripts/readme-tools.mjs` writes them; `--check` fails when one is
// missing or out of date, or a version's line sits outside Changes.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PLUGINS = join(ROOT, "plugins");
const START = "<!-- ai-tools -->";
const END = "<!-- /ai-tools -->";

/** The heading and the line before the list, per README language. */
const WORDS = {
  en: ["Tools for Textus AI", "Once it is installed, Textus AI can use these in a conversation:"],
  zh: ["Textus AI 工具", "装上这个插件后，Textus AI 在对话中可以使用："],
  "zh-Hant": ["Textus AI 工具", "裝上這個外掛後，Textus AI 在對話中可以使用："],
  ja: ["Textus AI のツール", "このプラグインを入れると、Textus AI が会話の中で使えます："],
  ko: ["Textus AI 도구", "이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:"],
  es: ["Herramientas para Textus AI", "Con el plugin instalado, Textus AI puede usarlas en una conversación:"],
  fr: ["Outils pour Textus AI", "Une fois le plugin installé, Textus AI peut s’en servir dans une conversation :"],
  de: ["Werkzeuge für Textus AI", "Ist das Plugin installiert, kann Textus AI sie im Gespräch nutzen:"],
  ru: ["Инструменты для Textus AI", "Когда плагин установлен, Textus AI может пользоваться ими в разговоре:"],
  pt: ["Ferramentas para o Textus AI", "Com o plugin instalado, o Textus AI pode usá-las numa conversa:"],
};

/** The Changes heading, per README language. */
const CHANGES = {
  en: "Changes",
  zh: "更新日志",
  "zh-Hant": "更新紀錄",
  ja: "更新履歴",
  ko: "변경 내역",
  es: "Cambios",
  fr: "Changements",
  de: "Änderungen",
  ru: "Изменения",
  pt: "Alterações",
};
const VERSION_LINE = /^- \*\*\d+\.\d+\.\d+/;

const README = /^README(?:\.([A-Za-z]{2,3}(?:-[A-Za-z]+)?))?\.md$/;

/** A manifest string in `lang`: a `%key%` looked up in l10n. */
function text(manifest, lang, value) {
  const key = /^%(.+)%$/.exec(value)?.[1];
  if (!key) return value;
  return manifest.l10n?.[lang]?.[key] ?? manifest.l10n?.en?.[key] ?? value;
}

/** The section for `lang`, or "" for a plugin without tools. */
export function toolSection(manifest, lang) {
  const tools = manifest.contributes?.aiTools ?? [];
  if (!tools.length) return "";
  const [heading, intro] = WORDS[lang] ?? WORDS.en;
  const colon = ["zh", "zh-Hant", "ja"].includes(lang) ? "：" : ": ";
  const lines = tools.map((tool) => `- \`${tool.name}\`${colon}${text(manifest, lang, tool.description)}`);
  return `${START}\n## ${heading}\n\n${intro}\n\n${lines.join("\n")}\n${END}\n`;
}

/** `readme` with its section replaced by `section` (or added at the end). */
export function withSection(readme, section) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (!section && start < 0) return readme;
  const body = (start >= 0 && end > start ? readme.slice(0, start) + readme.slice(end + END.length) : readme)
    .replace(/\s+$/, "");
  return section ? `${body}\n\n${section}` : `${body}\n`;
}

/** The lines of `readme`'s section under `## heading`, as [first body
 *  line, end): up to the next heading or the ai-tools section. */
function span(lines, heading) {
  const at = lines.indexOf(`## ${heading}`);
  if (at < 0) return null;
  let end = at + 1;
  while (end < lines.length && !lines[end].startsWith("## ") && lines[end] !== START) end++;
  return [at + 1, end];
}

/** The English README's list of changes, or null when it has none. */
export function changesOf(readme) {
  const lines = readme.split("\n");
  const found = span(lines, CHANGES.en);
  return found ? lines.slice(...found).join("\n").trim() : null;
}

/** `readme` with the list under its Changes heading (in `lang`) replaced by
 *  `list`; a README without that heading gets one before its tools. */
export function withChanges(readme, lang, list) {
  if (list === null) return readme;
  const heading = CHANGES[lang] ?? CHANGES.en;
  const lines = readme.split("\n");
  const found = span(lines, heading);
  if (found) {
    lines.splice(found[0], found[1] - found[0], "", list, "");
    return lines.join("\n");
  }
  const tools = readme.indexOf(START);
  const head = (tools >= 0 ? readme.slice(0, tools) : readme).replace(/\s+$/, "");
  return `${head}\n\n## ${heading}\n\n${list}\n` + (tools >= 0 ? `\n${readme.slice(tools)}` : "");
}

/** Lines naming a version outside the Changes section of `readme`. */
export function strayVersions(readme, lang) {
  const lines = readme.split("\n");
  const found = span(lines, CHANGES[lang] ?? CHANGES.en) ?? [0, 0];
  return lines.filter((line, i) => VERSION_LINE.test(line) && (i < found[0] || i >= found[1]));
}

function run(check) {
  const stale = [];
  const stray = [];
  for (const id of readdirSync(PLUGINS)) {
    const dir = join(PLUGINS, id);
    const manifestPath = join(dir, "textus-plugin.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const english = join(dir, "README.md");
    const list = existsSync(english) ? changesOf(readFileSync(english, "utf8")) : null;
    for (const name of readdirSync(dir)) {
      const m = README.exec(name);
      if (!m) continue;
      const lang = m[1] ?? "en";
      const path = join(dir, name);
      const before = readFileSync(path, "utf8");
      const after = withSection(withChanges(before, lang, list), toolSection(manifest, lang));
      for (const line of strayVersions(after, lang)) stray.push(`plugins/${id}/${name}: ${line.slice(0, 40)}`);
      if (after === before) continue;
      if (check) stale.push(`plugins/${id}/${name}`);
      else writeFileSync(path, after);
    }
  }
  if (stale.length)
    console.error(`READMEs without their current changes or Textus AI tools; run node scripts/readme-tools.mjs:\n${stale.join("\n")}`);
  if (stray.length) console.error(`A version's line outside the Changes section:\n${stray.join("\n")}`);
  if (stale.length || stray.length) process.exit(1);
}

if (process.argv[1] === new URL(import.meta.url).pathname) run(process.argv.includes("--check"));
