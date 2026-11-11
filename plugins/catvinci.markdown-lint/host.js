// Tidy: markdownlint's rules, run on each block in sight, its findings
// underlined where they are, and Fix Markdown for the fixes it knows; then
// one command per text rule (tidy.js). Each change is one undo step, and
// none touches what markdownKeep keeps.
// Rules about the document as a whole (heading levels, the first line,
// blank lines between blocks, anchors and reference definitions) are off:
// a block is checked on its own, and Textus writes the blank lines itself.
// MD018 is off because "#tag" at a line's start is a tag, not a heading.
const CONFIG = {
  default: true,
  MD001: false,
  MD012: false,
  MD013: false,
  MD018: false,
  MD022: false,
  MD024: false,
  MD025: false,
  MD031: false,
  MD032: false,
  MD033: false,
  MD041: false,
  MD047: false,
  MD051: false,
  MD052: false,
  MD053: false,
};
const SKIP = new Set(markdownKeep.SKIP_KINDS);
const RULES = [
  "removeBlankLines",
  "trimTrailing",
  "fullPunctuation",
  "halfPunctuation",
  "halfLetters",
  "joinLines",
  "toBulletList",
  "toOrderedList",
  "toTaskList",
];
// Rules for lines picked, never a whole document, and what they ask for.
const SELECTION_ONLY = {
  joinLines: "selectFirst",
  toBulletList: "selectLists",
  toOrderedList: "selectLists",
  toTaskList: "selectLists",
};

/** The rules, less the ones the user turned off in settings. */
async function config() {
  const off = (await textus.settings.get("off")) || [];
  const rules = { ...CONFIG };
  for (const name of off) if (String(name).trim()) rules[String(name).trim()] = false;
  return rules;
}

/** Whether a span of a masked line holds something kept; an insertion
 *  counts when it lands inside one. */
function touches(masked, column, length) {
  if (length > 0) return masked.slice(column - 1, column - 1 + length).includes("\0");
  return masked[column - 2] === "\0" && masked[column - 1] === "\0";
}

/** Whether an issue, or its fix, touches what no rewriting plugin changes. */
function inKept(prose, masked, error) {
  const at = error.lineNumber - 1;
  if (!prose[at]) return true;
  if (error.errorRange && touches(masked[at], ...error.errorRange)) return true;
  const fix = error.fixInfo;
  if (!fix) return false;
  const line = (fix.lineNumber || error.lineNumber) - 1;
  const length = fix.deleteCount < 0 ? Infinity : fix.deleteCount || 0;
  return !prose[line] || touches(masked[line], fix.editColumn || 1, length);
}

function lint(markdown, config) {
  const errors = markdownlint.lint({ strings: { block: markdown }, config }).block;
  const prose = markdownKeep.proseLines(markdown);
  const masked = markdown.split("\n").map(markdownKeep.mask);
  return errors.filter((e) => !inKept(prose, masked, e));
}

function tooltip(error) {
  return (
    error.ruleNames[0] +
    ": " +
    error.ruleDescription +
    (error.errorDetail ? " (" + error.errorDetail + ")" : "")
  );
}

/** Textus AI's tool: the issues in some Markdown, or the document in
 *  front, and with `fix` the text with the fixes markdownlint knows. */
async function lintMarkdown(input) {
  const text = typeof input.text === "string" ? input.text : await textus.editor.getText();
  if (text === null) return { error: "Give the Markdown to check, or open a document." };
  const errors = lint(text, await config()).sort((a, b) => a.lineNumber - b.lineNumber);
  const out = {
    issues: errors.map((e) => ({
      line: e.lineNumber,
      rule: e.ruleNames.join("/"),
      description: e.ruleDescription,
      detail: e.errorDetail || undefined,
      context: e.errorContext || undefined,
      fixable: !!e.fixInfo,
    })),
  };
  if (input.fix) out.fixed = markdownlint.applyFixes(text, errors.filter((e) => e.fixInfo));
  return out;
}

async function fixMarkdown(editor) {
  const rules = await config();
  const changes = [];
  for (const block of (await editor.getBlocks()) || []) {
    if (SKIP.has(block.kind)) continue;
    const fixable = lint(block.markdown, rules).filter((e) => e.fixInfo);
    if (!fixable.length) continue;
    const fixed = markdownlint.applyFixes(block.markdown, fixable).replace(/\n+$/, "");
    if (fixed !== block.markdown) changes.push({ action: "replace", block: block.id, text: fixed });
  }
  if (!changes.length) return textus.ui.notice(textus.l10n.t("clean"));
  await editor.edit(changes);
  textus.ui.notice(textus.l10n.t("fixed", changes.length), { tone: "success" });
}

/** An empty paragraph as Markdown writes one. */
const isBlank = (markdown) => /^\s*(&nbsp;|<br\s*\/?>|\\)?\s*$/i.test(markdown);

/** One text rule, on the selection when there is one, else on the
 *  document in front once the user says so. */
async function tidyText(rule, editor) {
  const selection = await editor.getSelection();
  const selected = selection && (selection.markdown ?? selection.text);
  if (selected) {
    const tidied = textTidy.tidy(selected, rule, { all: true });
    if (tidied === selected) return textus.ui.notice(textus.l10n.t("none"));
    await editor.replaceSelection(tidied);
    return textus.ui.notice(textus.l10n.t("doneSelection"), { tone: "success" });
  }
  const ask = SELECTION_ONLY[rule];
  if (ask) return textus.ui.notice(textus.l10n.t(ask));
  const ok = await textus.ui.confirm(textus.l10n.t("confirmWhole"), {
    okLabel: textus.l10n.t("confirmOk"),
  });
  if (!ok) return;
  const changes = [];
  for (const block of (await editor.getBlocks()) || []) {
    if (rule === "removeBlankLines") {
      if (block.kind === "paragraph" && isBlank(block.markdown)) changes.push({ action: "delete", block: block.id });
      continue;
    }
    if (SKIP.has(block.kind)) continue;
    const tidied = textTidy.tidy(block.markdown, rule);
    if (tidied !== block.markdown) changes.push({ action: "replace", block: block.id, text: tidied });
  }
  if (!changes.length) return textus.ui.notice(textus.l10n.t("none"));
  await editor.edit(changes);
  textus.ui.notice(textus.l10n.t("done", changes.length), { tone: "success" });
}

exports.activate = function () {
  textus.ai.registerTool("lint_markdown", lintMarkdown);
  textus.editor.registerDecorations({
    decorate: async function (blocks) {
      if ((await textus.settings.get("underline")) === false) return [];
      const rules = await config();
      const marks = [];
      for (const block of blocks) {
        if (SKIP.has(block.kind)) continue;
        for (const error of lint(block.markdown, rules))
          marks.push({
            block: block.id,
            anchor: error.errorContext || undefined,
            style: "underline",
            tone: "warning",
            tooltip: tooltip(error),
          });
      }
      return marks;
    },
  });
  textus.commands.registerEditorCommand("catvinci.markdown-lint.fix", fixMarkdown);
  for (const rule of RULES)
    textus.commands.registerEditorCommand("catvinci.markdown-lint." + rule, (editor) => tidyText(rule, editor));
};
