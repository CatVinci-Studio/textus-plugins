// Plain Text: two interfaces of API 1.8.
// - export.registerFormat adds a format to File › Export; Textus asks
//   where to save and writes what `export` returns.
// - ui.registerContextMenu adds items to the editor's (or the file tree's)
//   right-click menu, worked out as it opens.

const t = (key, ...args) => textus.l10n.t(key, ...args);

/** The document's words without Markdown's marks. */
function plain(markdown) {
  return markdown
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|~~|`)/g, "");
}

function countWords(text) {
  const cjk = text.match(/[぀-ヿ㐀-鿿가-힯]/g) ?? [];
  const other =
    text.replace(/[぀-ヿ㐀-鿿가-힯]/g, " ").match(/[\p{L}\p{N}]+/gu) ?? [];
  return cjk.length + other.length;
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.export.registerFormat("txt", {
      label: t("format"),
      extension: "txt",
      export: ({ markdown }) => plain(markdown),
    }),

    textus.commands.register("your-name.plain-text.count", (text) =>
      textus.ui.notice(t("words", countWords(String(text ?? "")))),
    ),

    textus.ui.registerContextMenu("editor", ({ selectedText }) =>
      selectedText
        ? [
            {
              label: t("count"),
              command: "your-name.plain-text.count",
              args: [selectedText],
            },
          ]
        : [],
    ),
  );
};
