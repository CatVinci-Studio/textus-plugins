// CJK Spacing: a command for the document in front, the same on every save
// when that setting is on (files.onWillSave), and - from Textus 1.4.4 - a
// slip underlined where a space is missing, fixed from its card.
const SKIP = new Set(markdownKeep.SKIP_KINDS);

/** Textus AI's tool: the text spaced, nothing written. */
function fixSpacing(input) {
  const text = String(input.text || "");
  const spaced = cjkSpacing.spaceDocument(text);
  return { text: spaced, changed: spaced !== text };
}

/** The first place `spaced` differs from `text`: the two characters a
 *  space goes between, to underline them. */
function missingAt(text, spaced) {
  let i = 0;
  while (i < text.length && text[i] === spaced[i]) i++;
  return i > 0 && i < text.length ? text.slice(i - 1, i + 1) : undefined;
}

exports.activate = function () {
  textus.ai.registerTool("fix_cjk_spacing", fixSpacing);
  if (textus.editor.registerDiagnostics)
    textus.editor.registerDiagnostics("spacing", {
      check: async (blocks) => {
        if ((await textus.settings.get("underline")) === false) return [];
        const out = [];
        for (const block of blocks) {
          if (SKIP.has(block.kind)) continue;
          const spaced = cjkSpacing.spaceDocument(block.markdown);
          if (spaced === block.markdown) continue;
          out.push({
            block: block.id,
            anchor: missingAt(block.markdown, spaced),
            severity: "info",
            message: textus.l10n.t("missing"),
            fix: { markdown: spaced, label: textus.l10n.t("addSpaces") },
          });
        }
        return out;
      },
    });
  textus.commands.registerEditorCommand(
    "catvinci.cjk-spacing.space",
    async function (editor) {
      const changes = [];
      for (const block of (await editor.getBlocks()) || []) {
        if (SKIP.has(block.kind)) continue;
        // As on save: fenced code in a list or quote stays as it is.
        const spaced = cjkSpacing.spaceDocument(block.markdown);
        if (spaced !== block.markdown)
          changes.push({ action: "replace", block: block.id, text: spaced });
      }
      if (!changes.length) return textus.ui.notice(textus.l10n.t("none"));
      await editor.edit(changes);
      textus.ui.notice(textus.l10n.t("done", changes.length), {
        tone: "success",
      });
    },
  );
  textus.files.onWillSave(async function (event) {
    if (!(await textus.settings.get("onSave"))) return;
    // From 1.3.9 the blocks come too: only the prose ones change.
    if (!Array.isArray(event.blocks)) return cjkSpacing.spaceDocument(event.text);
    const edits = [];
    for (const block of event.blocks) {
      if (SKIP.has(block.kind)) continue;
      const before = event.text.slice(block.from, block.to);
      const spaced = cjkSpacing.spaceDocument(before);
      if (spaced !== before) edits.push({ block: block.id, markdown: spaced });
    }
    return edits.length ? edits : undefined;
  });
};
