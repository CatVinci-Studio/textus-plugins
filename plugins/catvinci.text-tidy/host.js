// Text Tidy: one command per rule (tidy.js), on the selection when there is
// one, else on the document in front, as one undo step.
const SKIP = new Set(markdownKeep.SKIP_KINDS);
const RULES = ["removeBlankLines", "trimTrailing", "fullPunctuation", "halfPunctuation", "halfLetters", "joinLines"];

/** An empty paragraph as Markdown writes one. */
const isBlank = (markdown) => /^\s*(&nbsp;|<br\s*\/?>|\\)?\s*$/i.test(markdown);

async function run(rule, editor) {
  const selection = await editor.getSelection();
  const selected = selection && (selection.markdown ?? selection.text);
  if (selected) {
    const tidied = textTidy.tidy(selected, rule, { all: true });
    if (tidied === selected) return textus.ui.notice(textus.l10n.t("none"));
    await editor.replaceSelection(tidied);
    return textus.ui.notice(textus.l10n.t("doneSelection"), { tone: "success" });
  }
  // Joining lines is for a few lines picked, never a whole document.
  if (rule === "joinLines") return textus.ui.notice(textus.l10n.t("selectFirst"));
  // A whole document changes without the user picking it: asked first.
  const ok = await textus.ui.confirm(textus.l10n.t("confirmWhole"), {
    okLabel: textus.l10n.t("confirmOk"),
  });
  if (!ok) return;
  const changes = [];
  for (const block of (await editor.getBlocks()) || []) {
    if (rule === "removeBlankLines") {
      if (block.kind === "paragraph" && isBlank(block.markdown))
        changes.push({ action: "delete", block: block.id });
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
  for (const rule of RULES)
    textus.commands.registerEditorCommand("catvinci.text-tidy." + rule, (editor) => run(rule, editor));
};
