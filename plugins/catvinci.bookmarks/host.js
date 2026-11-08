// Bookmarks: words of a document, kept with the plugin's global data
// (ctx.storage.global, "bookmarks") and listed in the sidebar by document;
// a click opens the document at those words. A renamed document's
// bookmarks follow it (files.onDidRename). In an Obsidian vault, Obsidian's
// own bookmarks (.obsidian/bookmarks.json) are listed too.
/* global folderPaths */
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

/** Textus AI's tool: the bookmarks, documents by their path in the open
 *  folder (in full when outside it). */
async function listBookmarks() {
  const root = await textus.files.root();
  return {
    bookmarks: (await all()).map((mark) => ({ text: mark.text, path: folderPaths.rel(root, mark.path) ?? mark.path })),
  };
}

/** Obsidian's bookmarks of notes, headings and blocks, groups flattened
 *  into "Obsidian › group". Searches, folders and the like are left out. */
async function obsidianMarks() {
  const root = await textus.files.root();
  if (!root) return [];
  let saved;
  try {
    saved = JSON.parse(await textus.files.readText(folderPaths.abs(root, ".obsidian/bookmarks.json")));
  } catch {
    return [];
  }
  const out = [];
  const walk = (items, group) => {
    for (const item of Array.isArray(items) ? items : []) {
      if (!item || typeof item !== "object") continue;
      if (item.type === "group") walk(item.items, group + " › " + (item.title || ""));
      if (!["file", "heading", "block"].includes(item.type) || typeof item.path !== "string") continue;
      const sub = typeof item.subpath === "string" ? item.subpath.replace(/^#/, "") : "";
      const location = { path: folderPaths.abs(root, item.path) };
      if (item.type === "heading" && sub) location.heading = sub;
      if (item.type === "block" && sub) location.block = sub.replace(/^\^/, "");
      out.push({ label: item.title || fileName(item.path).replace(/\.md$/i, "") + (sub ? " › " + sub : ""), group, path: item.path, location });
    }
  };
  walk(saved && saved.items, t("obsidian"));
  return out;
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_bookmarks", listBookmarks);
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
      })).concat(
        (await obsidianMarks()).map((mark, i) => ({
          id: "obsidian:" + i + ":" + mark.path,
          label: mark.label,
          group: mark.group,
          detail: mark.path,
          icon: "star",
          location: mark.location,
        })),
      );
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
