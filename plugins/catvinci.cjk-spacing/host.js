// CJK Spacing: a command for the document in front, and - when the
// setting is on - the same on every save (files.onWillSave).
const SKIP = new Set(markdownKeep.SKIP_KINDS);

/** Textus AI's tool: the text spaced, nothing written. */
function fixSpacing(input) {
  const text = String(input.text || "");
  const spaced = cjkSpacing.spaceDocument(text);
  return { text: spaced, changed: spaced !== text };
}

exports.activate = function () {
  textus.ai.registerTool("fix_cjk_spacing", fixSpacing);
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
