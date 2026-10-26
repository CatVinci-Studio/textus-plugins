// Hello: a first Textus plugin. It counts the words of the document in
// front (a command, under the Plugins menu) and lists that document's
// headings in a sidebar tab Textus draws (views.registerList); a click on
// one goes to it. Change it, and load the folder in Settings › Extensions
// › Plugins › Load a plugin folder… - it reloads as you save.
//
// Every textus.* call is in docs/dev/textus.d.ts in the Textus repository.

const t = (key, ...args) => textus.l10n.t(key, ...args);

/** Words, counting each Chinese, Japanese or Korean character as one. */
function countWords(text) {
  const cjk = text.match(/[぀-ヿ㐀-鿿가-힯]/g) ?? [];
  const latin = text
    .replace(/[぀-ヿ㐀-鿿가-힯]/g, " ")
    .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
  return cjk.length + latin.length;
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.commands.register("your-name.hello.count", async () => {
      const text = (await textus.editor.getText()) ?? "";
      await textus.ui.message(t("words", countWords(text)));
    }),
  );

  // The headings of the document in front, each going to its line.
  const list = textus.views.registerList("your-name.hello.headings", {
    async items() {
      const path = await textus.editor.getPath();
      const outline = (await textus.editor.getOutline()) ?? [];
      list.setMessage(outline.length ? "" : t("none"));
      return outline.map((heading, i) => ({
        id: `${i}:${heading.text}`,
        label: "  ".repeat(heading.level - 1) + heading.text,
        location: path ? { path, line: heading.line } : undefined,
      }));
    },
  });
  ctx.subscriptions.push(
    list,
    // Asked again when another document comes up, or this one changes.
    textus.editor.onDidChangeActive(() => list.refresh()),
    textus.editor.onDidChange(() => list.refresh()),
  );
};

// For tests; Textus reads only activate.
exports.countWords = countWords;
