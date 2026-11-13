// Heading Numbers: each heading's number (1, 1.1, 1.2...) drawn before it
// while writing - the text stays as it is - and, in an HTML or PDF export,
// the same numbers from CSS counters. None for a document numbered by
// hand, or one Obsidian's Number Headings is told to leave alone.
function headingLevel(block) {
  return block.kind === "heading"
    ? (/^#+/.exec(block.markdown) || [""])[0].length
    : 0;
}

/**
 * The level numbering starts at: the document's highest heading level, or
 * the next one down when that level holds a single heading - its title.
 */
function startOf(blocks) {
  const levels = blocks.map(headingLevel).filter((l) => l > 0);
  if (!levels.length) return 1;
  const top = Math.min(...levels);
  const below = levels.filter((l) => l > top);
  return levels.filter((l) => l === top).length === 1 && below.length
    ? Math.min(...below)
    : top;
}

/** Every heading's number, by block id, counting from level `start`. */
function numbers(blocks, start) {
  const counts = [];
  const out = {};
  for (const block of blocks) {
    const level = headingLevel(block);
    if (level < start) continue;
    const depth = level - start;
    counts.length = depth + 1;
    for (let i = 0; i < depth; i++) counts[i] = counts[i] || 0;
    counts[depth] = (counts[depth] || 0) + 1;
    out[block.id] = counts.join(".");
  }
  return out;
}

/** The export's numbers: CSS counters from `start` to h6, on top-level
 *  headings only, as the editor numbers them. */
function exportCss(start) {
  let css = "";
  for (let level = start; level <= 6; level++) {
    const h = ".ProseMirror > h" + level;
    const own = [];
    for (let l = start; l <= level; l++) own.push("counter(tx-h" + l + ")");
    const reset = level < 6 ? " counter-reset: tx-h" + (level + 1) + ";" : "";
    css += h + " { counter-increment: tx-h" + level + ";" + reset + " }\n";
    css += h + "::before { content: " + own.join(' "." ') + ' " "; }\n';
  }
  return ".milkdown { counter-reset: tx-h" + start + "; }\n" + css;
}

/** A dotted number already before a heading's words: 1.2, 3. or 1.2. */
const OLD_NUMBER = /^\d{1,2}(?:\.\d{1,2})*\.\s+|^\d{1,2}(?:\.\d{1,2})+\s+/;

/** `words` without the number before them: a dotted one, or a bare one
 *  only when it is the number this heading gets ("7 Methods" keeps its 7). */
function withoutNumber(words, mine) {
  if (mine && words.startsWith(mine + " ")) return words.slice(mine.length + 1);
  return words.replace(OLD_NUMBER, "");
}

/** A number written before a heading's words: 1. 1.2 一、 第一章 (一) */
const HAND_NUMBER =
  /^(?:\d+(?:\.\d+)+\.?|\d+\.)(?:\s|$)|^(?:[一二三四五六七八九十百零〇]+[、.．]|第[一二三四五六七八九十百零〇\d]+[章节節部篇]|[(（][一二三四五六七八九十\d]+[)）])/;

/** `number headings: off` in the front matter, for Obsidian's Number
 *  Headings plugin. */
function turnedOff(text) {
  const front = /^---\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/.exec(text || "");
  const line = front && /^number headings[ \t]*:(.*)$/im.exec(front[1]);
  if (!line) return false;
  const value = line[1].trim().replace(/^(["'])(.*)\1$/, "$2");
  return value.split(",").some((part) => part.trim().toLowerCase() === "off");
}

/** The numbers to draw: none when the front matter turns them off, or
 *  when most headings at the top numbered level already have one. */
function drawn(text, blocks) {
  if (turnedOff(text)) return {};
  const start = startOf(blocks);
  const all = numbers(blocks, start);
  const top = blocks.filter((b) => headingLevel(b) === start);
  const words = (b) => b.markdown.replace(/^#+\s*/, "");
  const hand = top.filter((b) => HAND_NUMBER.test(words(b)) || words(b).startsWith(all[b.id] + " "));
  return top.length && hand.length * 2 >= top.length ? {} : all;
}

/** Textus AI's tool: the headings of some Markdown numbered in their text,
 *  as the editor draws them; or, with `remove`, their numbers taken out. */
function numberHeadings(input) {
  const lines = String(input.text || "").split("\n");
  const blocks = [];
  let fence = null;
  // Front matter's `# comment` lines are YAML, not headings.
  const frontEnd = /^---\s*$/.test(lines[0])
    ? lines.findIndex((l, i) => i > 0 && /^(?:---|\.\.\.)\s*$/.test(l))
    : -1;
  lines.forEach((line, i) => {
    if (i <= frontEnd) return;
    const f = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    // A fence closes only on a bare one of its character, at least as long.
    const closes = f && fence && f[1][0] === fence[0] && f[1].length >= fence.length && !f[2].trim();
    if (closes) fence = null;
    else if (f && !fence) fence = f[1];
    else if (!fence && /^#{1,6}\s/.test(line)) {
      const [, marks, words] = /^(#+\s+)(.*)$/.exec(line);
      blocks.push({ id: i, kind: "heading", marks: marks, words: words });
    }
  });
  const shown = blocks.map((b) => ({ id: b.id, kind: b.kind, markdown: b.marks }));
  const mine = numbers(shown, startOf(shown));
  const number = input.remove ? {} : mine;
  for (const b of blocks) {
    const words = withoutNumber(b.words, mine[b.id]);
    lines[b.id] = b.marks + (number[b.id] ? number[b.id] + " " : "") + words;
  }
  return { text: lines.join("\n") };
}

exports.activate = function () {
  textus.ai.registerTool("number_headings", numberHeadings);
  textus.editor.registerDecorations({
    // The document the blocks are of comes with them (Textus 1.4.1): it
    // can be beside the one in front. Older hosts read the one in front.
    decorate: async function (inSight, doc) {
      const blocks = doc ? doc.blocks : (await textus.editor.getBlocks()) || [];
      const head = doc ? (blocks[0] || {}).markdown : await textus.editor.getText();
      const all = drawn(head, blocks);
      return inSight
        .filter((block) => all[block.id])
        .map((block) => ({
          block: block.id,
          style: "badge",
          before: true,
          text: all[block.id],
        }));
    },
  });
  textus.export.onWillExport(async function () {
    if (!(await textus.settings.get("inExports"))) return;
    const blocks = (await textus.editor.getBlocks()) || [];
    if (!Object.keys(drawn(await textus.editor.getText(), blocks)).length) return;
    return { css: exportCss(startOf(blocks)) };
  });
};
