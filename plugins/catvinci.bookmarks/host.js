// Bookmarks: words of a document, kept with the plugin's global data
// (ctx.storage.global, "bookmarks") and listed in the sidebar by document;
// a click opens the document at those words. A renamed document's
// bookmarks follow it (files.onDidRename). In an Obsidian vault, Obsidian's
// own bookmarks (.obsidian/bookmarks.json) are listed too, and a new one is
// written there as well - a heading's, or a block's with a ^id - so
// Obsidian has it; removed here, it goes from there too.
/* global folderPaths, obsidianBookmarks */
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
const MAX = 120;

/** A row's label: the kept words, cut at a word when they were cut. */
function labelOf(mark) {
  if (!(mark.cut ?? mark.text.length >= MAX)) return mark.text;
  const at = mark.text.lastIndexOf(" ");
  return (at > MAX / 2 ? mark.text.slice(0, at) : mark.text).trimEnd() + "…";
}

/** Textus AI's tool: the bookmarks, documents by their path in the open
 *  folder (in full when outside it). */
async function listBookmarks() {
  const root = await textus.files.root();
  return {
    bookmarks: (await all()).map((mark) => ({ text: mark.text, path: folderPaths.rel(root, mark.path) ?? mark.path })),
  };
}

/** The open folder's .obsidian/bookmarks.json; null outside a vault. */
async function vaultFile() {
  const root = await textus.files.root();
  if (!root) return null;
  const config = await textus.files.stat(folderPaths.abs(root, ".obsidian")).catch(() => null);
  return config && config.isDir ? { root, path: folderPaths.abs(root, ".obsidian/bookmarks.json") } : null;
}

/** Changes the vault's bookmarks.json through `change` (its text, "" for
 *  none, to the new text or null to leave it); whether it changed. */
async function changeVaultFile(file, change) {
  let changed = false;
  const run = (text) => {
    const next = change(text);
    changed = next !== null && next !== text;
    return changed ? next : text;
  };
  if (await textus.files.stat(file.path).catch(() => null)) await textus.files.process(file.path, run);
  else {
    const text = run("");
    if (changed) await textus.files.writeText(file.path, text);
  }
  return changed;
}

/** Obsidian's bookmarks of notes, headings and blocks, groups flattened
 *  into "Obsidian › group". Searches, folders and the like are left out.
 *  Null without the file. */
async function obsidianMarks() {
  const root = await textus.files.root();
  if (!root) return null;
  let saved;
  try {
    saved = JSON.parse(await textus.files.readText(folderPaths.abs(root, ".obsidian/bookmarks.json")));
  } catch {
    return null;
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
      out.push({ label: item.title || fileName(item.path).replace(/\.md$/i, "") + (sub ? " › " + sub : ""), group, path: item.path, location, ctime: item.ctime });
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
      const vault = await obsidianMarks();
      const root = await textus.files.root();
      // One written to the vault and taken out there is gone.
      const ours = (mark) => mark.ctime && root && folderPaths.rel(root, mark.path) !== null;
      const there = new Set((vault || []).map((mark) => mark.ctime));
      const marks = (await all()).filter((mark) => !vault || !ours(mark) || there.has(mark.ctime));
      const mine = new Set(marks.map((mark) => mark.ctime).filter(Boolean));
      const where = (mark) => (root && folderPaths.rel(root, mark.path)) ?? mark.path;
      // One group per document; time order kept inside it.
      const sorted = marks.map((mark) => [where(mark), mark]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      return sorted.map(([group, mark], i) => ({
        id: String(mark.id),
        label: labelOf(mark),
        group,
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
        (vault || []).filter((mark) => !mine.has(mark.ctime)).map((mark, i) => ({
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
      const full = selection ? selection.text.trim() : "";
      if (!full) return textus.ui.notice(t("select"));
      const mark = { id: Date.now(), path, text: full.slice(0, MAX), cut: full.length > MAX };
      const file = await vaultFile();
      const rel = file && folderPaths.rel(file.root, path);
      if (rel) {
        const blocks = (await editor.getBlocks()) || [];
        let found = obsidianBookmarks.markFor(blocks, selection.markdown || selection.text);
        if (found && found.markdown && !(await editor.edit({ action: "replace", block: found.block.id, text: found.markdown }).catch(() => false)))
          found = null;
        const entry = Object.assign({ type: "file" }, found && found.entry);
        const written = { type: entry.type, ctime: mark.id, path: rel };
        if (entry.subpath) written.subpath = entry.subpath;
        if (await changeVaultFile(file, (saved) => obsidianBookmarks.withEntry(saved, written))) mark.ctime = mark.id;
      }
      await keep([...(await all()), mark]);
    },
  );
  textus.commands.register("catvinci.bookmarks.remove", async function (id) {
    const marks = await all();
    const gone = marks.find((mark) => mark.id === id);
    const file = gone && gone.ctime && (await vaultFile());
    const rel = file && folderPaths.rel(file.root, gone.path);
    if (rel) await changeVaultFile(file, (saved) => (saved ? obsidianBookmarks.withoutEntry(saved, gone.ctime, rel) : null));
    await keep(marks.filter((mark) => mark.id !== id));
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
    if (!next.some((mark, i) => mark.path !== marks[i].path)) return;
    const file = await vaultFile();
    const from = file && folderPaths.rel(file.root, event.from);
    const to = file && folderPaths.rel(file.root, event.to);
    const ctimes = marks.map((mark) => mark.ctime).filter(Boolean);
    if (from && to && ctimes.length)
      await changeVaultFile(file, (saved) => (saved ? obsidianBookmarks.movedEntries(saved, ctimes, from, to) : null));
    await keep(next);
  });
};
