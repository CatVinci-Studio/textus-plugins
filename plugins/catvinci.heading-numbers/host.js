// Heading Numbers: each heading's number (1, 1.1, 1.2...) drawn before it
// while writing - the text stays as it is - and, in an HTML or PDF export,
// the same numbers from CSS counters.
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

/** The export's numbers: CSS counters from `start` to h6. */
function exportCss(start) {
  let css = "";
  for (let level = start; level <= 6; level++) {
    const name = "tx-h" + level;
    const own = [];
    for (let l = start; l <= level; l++) own.push("counter(tx-h" + l + ")");
    css +=
      "h" +
      level +
      " { counter-increment: " +
      name +
      ";" +
      (level < 6 ? " counter-reset: tx-h" + (level + 1) + ";" : "") +
      " }\n" +
      "h" +
      level +
      "::before { content: " +
      own.join(' "." ') +
      ' " "; }\n';
  }
  return ".milkdown { counter-reset: tx-h" + start + "; }\n" + css;
}

/** A number already before a heading's words: 1, 1.2, 3. */
const OLD_NUMBER = /^\d{1,2}(?:\.\d{1,2})*\.?\s+/;

/** Textus AI's tool: the headings of some Markdown numbered in their text,
 *  as the editor draws them; or, with `remove`, their numbers taken out. */
function numberHeadings(input) {
  const lines = String(input.text || "").split("\n");
  const blocks = [];
  let fence = null;
  lines.forEach((line, i) => {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (f && (!fence || f[1][0] === fence[0])) fence = fence ? null : f[1];
    else if (!fence && /^#{1,6}\s/.test(line)) {
      const [, marks, words] = /^(#+\s+)(.*)$/.exec(line);
      blocks.push({ id: i, kind: "heading", marks: marks, words: words.replace(OLD_NUMBER, "") });
    }
  });
  const shown = blocks.map((b) => ({ id: b.id, kind: b.kind, markdown: b.marks }));
  const number = input.remove ? {} : numbers(shown, startOf(shown));
  for (const b of blocks) lines[b.id] = b.marks + (number[b.id] ? number[b.id] + " " : "") + b.words;
  return { text: lines.join("\n") };
}

exports.activate = function () {
  textus.ai.registerTool("number_headings", numberHeadings);
  textus.editor.registerDecorations({
    decorate: async function (inSight) {
      const blocks = (await textus.editor.getBlocks()) || [];
      const all = numbers(blocks, startOf(blocks));
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
    return {
      css: exportCss(startOf((await textus.editor.getBlocks()) || [])),
    };
  });
};
