// Each plugin README's "Tools for Textus AI" section, made from the
// manifest: the tools in contributes.aiTools, each with its description in
// the README's language (the manifest's l10n, else English). The section
// sits between <!-- ai-tools --> markers at the end of the README.
// `node scripts/readme-tools.mjs` writes them; `--check` fails when one is
// missing or out of date.

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

function run(check) {
  const stale = [];
  for (const id of readdirSync(PLUGINS)) {
    const dir = join(PLUGINS, id);
    const manifestPath = join(dir, "textus-plugin.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const name of readdirSync(dir)) {
      const m = README.exec(name);
      if (!m) continue;
      const path = join(dir, name);
      const before = readFileSync(path, "utf8");
      const after = withSection(before, toolSection(manifest, m[1] ?? "en"));
      if (after === before) continue;
      if (check) stale.push(`plugins/${id}/${name}`);
      else writeFileSync(path, after);
    }
  }
  if (stale.length) {
    console.error(`READMEs without their current Textus AI tools; run node scripts/readme-tools.mjs:\n${stale.join("\n")}`);
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) run(process.argv.includes("--check"));
