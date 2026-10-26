// Markdown Lint: markdownlint's rules, run on each block in sight, its
// findings underlined where they are; Fix Markdown applies the fixes it
// knows, a block at a time, as one undo step.
// Rules about the document as a whole (heading levels, the first line,
// blank lines between blocks) are off: a block is checked on its own, and
// Textus writes the blank lines itself.
const CONFIG = {
  default: true,
  MD001: false,
  MD012: false,
  MD013: false,
  MD022: false,
  MD024: false,
  MD025: false,
  MD031: false,
  MD032: false,
  MD033: false,
  MD041: false,
  MD047: false,
};
const SKIP = new Set(["code", "math", "html"]);

function lint(markdown) {
  return markdownlint.lint({ strings: { block: markdown }, config: CONFIG })
    .block;
}

function tooltip(error) {
  return (
    error.ruleNames[0] +
    ": " +
    error.ruleDescription +
    (error.errorDetail ? " (" + error.errorDetail + ")" : "")
  );
}

exports.activate = function () {
  textus.editor.registerDecorations({
    decorate: function (blocks) {
      const marks = [];
      for (const block of blocks) {
        if (SKIP.has(block.kind)) continue;
        for (const error of lint(block.markdown))
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

  textus.commands.registerEditorCommand(
    "catvinci.markdown-lint.fix",
    async function (editor) {
      const changes = [];
      for (const block of (await editor.getBlocks()) || []) {
        if (SKIP.has(block.kind)) continue;
        const fixable = lint(block.markdown).filter((e) => e.fixInfo);
        if (!fixable.length) continue;
        const fixed = markdownlint
          .applyFixes(block.markdown, fixable)
          .replace(/\n+$/, "");
        if (fixed !== block.markdown)
          changes.push({ action: "replace", block: block.id, text: fixed });
      }
      if (!changes.length) return textus.ui.notice(textus.l10n.t("clean"));
      await editor.edit(changes);
      textus.ui.notice(textus.l10n.t("fixed", changes.length), {
        tone: "success",
      });
    },
  );
};
