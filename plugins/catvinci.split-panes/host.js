// Split Panes: two documents at once, side by side or one above the
// other. The panes, the line between them and which tab shows where are
// the app's (textus.window.splitEditor); this plugin offers the commands.

/** The commands that rearrange an open split need Textus 1.3.0-beta.2
 *  (window.arrangeSplit); before it they say so. */
async function arrange(change) {
  if (!textus.window.arrangeSplit) {
    await textus.window.showMessage(textus.l10n.t("needsNewer"));
    return;
  }
  const layout = await textus.window.layout();
  if (layout.split) await textus.window.arrangeSplit(change);
}

textus.commands.registerCommand("catvinci.split-panes.right", function () {
  return textus.window.splitEditor("row");
});

textus.commands.registerCommand("catvinci.split-panes.down", function () {
  return textus.window.splitEditor("column");
});

textus.commands.registerCommand("catvinci.split-panes.close", function () {
  return textus.window.closeSplit();
});

// One key for both: split side by side, or back to one document.
textus.commands.registerCommand(
  "catvinci.split-panes.toggle",
  async function () {
    const layout = await textus.window.layout();
    return layout.split
      ? textus.window.closeSplit()
      : textus.window.splitEditor("row");
  },
);

// Side by side becomes one above the other, and back.
textus.commands.registerCommand("catvinci.split-panes.turn", async function () {
  const layout = await textus.window.layout();
  if (layout.split)
    await textus.window.splitEditor(layout.split === "row" ? "column" : "row");
});

textus.commands.registerCommand("catvinci.split-panes.swap", function () {
  return arrange({ swap: true });
});

textus.commands.registerCommand("catvinci.split-panes.even", function () {
  return arrange({ ratio: 0.5 });
});
