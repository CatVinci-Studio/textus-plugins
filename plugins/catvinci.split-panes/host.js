// Split Panes: two documents at once, side by side or one above the
// other. The panes, the line between them and which tab shows where are
// the app's (textus.window.splitEditor); this plugin offers the commands.

textus.commands.registerCommand("catvinci.split-panes.right", function () {
  return textus.window.splitEditor("row");
});

textus.commands.registerCommand("catvinci.split-panes.down", function () {
  return textus.window.splitEditor("column");
});

textus.commands.registerCommand("catvinci.split-panes.close", function () {
  return textus.window.closeSplit();
});
