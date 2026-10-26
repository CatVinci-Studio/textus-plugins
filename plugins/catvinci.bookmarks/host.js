// Bookmarks: words of a document, kept with the plugin's global data
// (ctx.storage.global, "bookmarks") and listed in the sidebar by document;
// a click opens the document at those words. A renamed document's
// bookmarks follow it (files.onDidRename).
let ctx;
let list;
const t = (key, ...args) => textus.l10n.t(key, ...args);
const KEY = "bookmarks";

async function all() {
  return (await ctx.storage.global.get(KEY)) || [];
}

async function keep(bookmarks) {
  await ctx.storage.global.set(KEY, bookmarks);
  if (list) list.refresh();
}

const fileName = (path) => path.split(/[\\/]/).pop();

exports.activate = function (context) {
  ctx = context;
  list = textus.views.registerList("catvinci.bookmarks.panel", {
    emptyText: t("empty"),
    items: async function () {
      return (await all()).map((mark, i) => ({
        id: String(mark.id),
        label: mark.text,
        group: fileName(mark.path),
        detail: mark.path,
        icon: "star",
        location: { path: mark.path, text: mark.text },
        actions: [
          {
            label: t("remove"),
            command: "catvinci.bookmarks.remove",
            args: [mark.id],
          },
        ],
        data: i,
      }));
    },
  });
  textus.commands.registerEditorCommand(
    "catvinci.bookmarks.add",
    async function (editor) {
      const path = await editor.getPath();
      if (!path) return textus.ui.message(t("saveFirst"));
      const selection = await editor.getSelection();
      const text = selection && selection.text.trim().slice(0, 120);
      if (!text) return textus.ui.notice(t("select"));
      await keep([...(await all()), { id: Date.now(), path, text }]);
    },
  );
  textus.commands.register("catvinci.bookmarks.remove", async function (id) {
    await keep((await all()).filter((mark) => mark.id !== id));
  });
  textus.files.onDidRename(async function (event) {
    const moved = (path) =>
      path === event.from
        ? event.to
        : path.startsWith(event.from + "/") ||
            path.startsWith(event.from + "\\")
          ? event.to + path.slice(event.from.length)
          : path;
    const marks = await all();
    const next = marks.map((mark) => ({ ...mark, path: moved(mark.path) }));
    if (next.some((mark, i) => mark.path !== marks[i].path)) await keep(next);
  });
};
