// CJK Spacing: a command for the document in front, and - when the
// setting is on - the same on every save (files.onWillSave).
// "other" is the front matter.
const SKIP = new Set(["code", "math", "html", "other"]);

exports.activate = function () {
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
    return cjkSpacing.spaceDocument(event.text);
  });
};
