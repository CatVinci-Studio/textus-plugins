// Loaded with the Workspace plugin's other modules; its own scope, activated by host.js.
var activatePages = (function () {
// Pages: the open folder's documents as a tree of pages in the sidebar,
// sub-pages made in a folder beside their page and linked from it, page
// icons in front matter, and the pages above the one in front in the
// status bar.

/* global pages, folderPaths */
const t = (key, ...args) => textus.l10n.t("pages." + key, ...args);
const ICONS = ["📄", "📁", "📅", "🗓️", "✅", "📝", "📚", "💡", "🎯", "🚀", "⭐", "❤️", "🏠", "💼", "🎓", "🧪", "📊", "🔖"];

let root = null;
let docs = [];
let roots = [];
let list = null;
let crumb = null;

const join = folderPaths.abs;
const relOf = (path) => folderPaths.rel(root, path);
const label = (node) => (node.icon ? node.icon + " " : "") + node.name;

/** The folder's documents again, and the tree, list and status bar from them. */
async function reload() {
  root = await textus.files.root();
  const all = root ? await textus.metadata.all() : [];
  docs = all
    .filter((d) => /\.md$/i.test(d.rel))
    .map((d) => ({ rel: d.rel, icon: d.frontmatter && d.frontmatter.icon }));
  roots = pages.tree(docs);
  if (list) list.refresh();
  await showCrumb();
}

function item(node) {
  const path = node.rel ? join(root, node.rel) : null;
  return {
    id: node.rel || "dir:" + node.dir,
    label: label(node),
    icon: node.rel ? "file" : "folder",
    location: path ? { path: path } : undefined,
    children: node.children.length > 0,
    data: node,
    actions: path
      ? [
          { label: t("newSubpage"), command: "catvinci.database.newSubpage", args: [path] },
          { label: t("renamePage"), command: "catvinci.database.renamePage", args: [path] },
          { label: t("setIcon"), command: "catvinci.database.setIcon", args: [path] },
          { label: t("deletePage"), command: "catvinci.database.deletePage", args: [path] },
        ]
      : [],
  };
}

/** "Life › 2026 Calendar › Week 1" for a sub-page; nothing for a page at
 *  the top. */
async function showCrumb() {
  const rel = relOf(await textus.editor.getPath());
  const above = rel ? pages.ancestors(rel, docs.map((d) => d.rel)) : [];
  if (!above.length) {
    if (crumb) crumb.dispose();
    crumb = null;
    return;
  }
  const icons = new Map(docs.map((d) => [d.rel, d.icon]));
  const text = above
    .concat([rel])
    .map((r) => label({ name: pages.nameOf(r), icon: icons.get(r) }))
    .join(" › ");
  if (crumb) crumb.update({ text: text });
  else
    crumb = textus.ui.statusItem("catvinci.database.crumb", {
      text: text,
      tooltip: t("up"),
      command: "catvinci.database.up",
    });
}

async function newSubpage(path) {
  root = await textus.files.root();
  if (!root) return textus.ui.message(t("needsFolder"));
  const active = await textus.editor.getPath();
  const parent = typeof path === "string" ? path : active;
  if (!parent) return textus.ui.message(t("needsSaved"));
  const parentRel = relOf(parent);
  if (!parentRel) return textus.ui.message(t("outside"));
  const title = await textus.ui.input({ prompt: t("subpageTitle") });
  if (!title || !title.trim()) return;
  const rel = pages.subpage(await unitFor(parentRel), title);
  const file = join(root, rel);
  if (await textus.files.stat(file)) return textus.ui.message(t("exists", title.trim()));
  await textus.files.createFolder(join(root, rel.slice(0, rel.lastIndexOf("/")))).catch(() => {});
  await textus.files.create(file, "# " + title.trim() + "\n");
  if (parent === active)
    await textus.editor.insertText(pages.link(rel, docs.map((d) => d.rel).concat([rel])));
  await textus.layout.open(file);
}

/** A page about to have its first sub-page becomes a folder unit (Plans.md →
 *  Plans/Plans.md, links to it following); one with sub-pages beside it in
 *  the older layout stays as it is. Returns where the page is now. */
async function unitFor(rel) {
  const to = pages.unitOf(rel);
  if (!to || (await textus.files.stat(join(root, rel.replace(/\.md$/i, ""))))) return rel;
  await textus.files.createFolder(join(root, rel.replace(/\.md$/i, ""))).catch(() => {});
  await textus.files.rename(join(root, rel), join(root, to), { updateLinks: true });
  return to;
}

/** Every page with sub-pages in the older layout moved into its folder, once
 *  the list is confirmed; links follow. */
async function toUnits() {
  root = await textus.files.root();
  if (!root) return textus.ui.message(t("needsFolder"));
  await reload();
  const moves = pages.oldUnits(docs.map((d) => d.rel));
  if (!moves.length) return textus.ui.message(t("toUnitsNone"));
  const shown = moves.slice(0, 12).map((m) => m.from + " → " + m.to).join("\n");
  const more = moves.length > 12 ? "\n…" : "";
  const ok = await textus.ui.confirm(t("toUnitsAsk", moves.length) + "\n\n" + shown + more, { okLabel: t("toUnitsOk") });
  if (!ok) return;
  for (const m of moves) await textus.files.rename(join(root, m.from), join(root, m.to), { updateLinks: true });
  await textus.ui.notice(t("toUnitsDone", moves.length));
}

/** What a page is on disk: its unit's folder (Plans/ for Plans/Plans.md), else its file. */
const holderOf = (rel) => (pages.isUnit(rel) ? rel.slice(0, rel.lastIndexOf("/")) : rel);

/** A page renamed: its file, its unit's folder with it, and links to it. */
async function renamePage(path) {
  root = await textus.files.root();
  const rel = relOf(typeof path === "string" ? path : await textus.editor.getPath());
  if (!rel) return;
  const name = pages.nameOf(rel);
  const title = ((await textus.ui.input({ prompt: t("renamePage"), value: name })) || "").trim();
  const next = pages.fileName(title);
  if (!next || next === name) return;
  const dir = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "";
  if (pages.isUnit(rel)) {
    const up = dir.includes("/") ? dir.slice(0, dir.lastIndexOf("/") + 1) : "";
    if (await textus.files.stat(join(root, up + next))) return textus.ui.message(t("exists", title));
    // The folder first; its page follows it (onDidRename below).
    await textus.files.rename(join(root, dir), join(root, up + next), { updateLinks: true });
  } else {
    const to = (dir ? dir + "/" : "") + next + ".md";
    if (await textus.files.stat(join(root, to))) return textus.ui.message(t("exists", title));
    await textus.files.rename(join(root, rel), join(root, to), { updateLinks: true });
    // Its sub-pages beside it in the older layout keep with it.
    const old = (dir ? dir + "/" : "") + name;
    if (await textus.files.stat(join(root, old))) await textus.files.rename(join(root, old), join(root, (dir ? dir + "/" : "") + next), { updateLinks: true });
  }
}

/** A page to the Trash, its sub-pages with it, once confirmed. */
async function deletePage(path) {
  root = await textus.files.root();
  const rel = relOf(typeof path === "string" ? path : await textus.editor.getPath());
  if (!rel) return;
  const holder = holderOf(rel);
  const under = docs.filter((d) => d.rel !== rel && (d.rel.startsWith(holder + "/") || d.rel.startsWith(rel.replace(/\.md$/i, "") + "/"))).length;
  const ok = await textus.ui.confirm(t(under ? "deleteAskMany" : "deleteAsk", pages.nameOf(rel), under), { okLabel: t("deletePage"), danger: true });
  if (!ok) return;
  await textus.files.trash(join(root, holder));
  const beside = rel.replace(/\.md$/i, "");
  if (!pages.isUnit(rel) && (await textus.files.stat(join(root, beside)))) await textus.files.trash(join(root, beside));
}

/** A page dragged onto another: it goes in that page's unit, links following. */
async function movePage(item, target) {
  root = await textus.files.root();
  const from = item && item.data && item.data.rel;
  const onto = target && target.data && (target.data.rel || null);
  const ontoDir = target && target.data && !target.data.rel ? target.data.dir : null;
  if (!from) return;
  let dir = ontoDir;
  if (onto) {
    if (onto === from) return;
    // The page it lands on takes it as a sub-page: a unit first, if it isn't one.
    const unit = await unitFor(onto);
    dir = pages.isUnit(unit) ? unit.slice(0, unit.lastIndexOf("/")) : unit.replace(/\.md$/i, "");
  }
  if (dir === null || dir === undefined) return;
  const holder = holderOf(from);
  // Not into itself or a page under it.
  if (dir === holder || dir.startsWith(holder + "/")) return;
  const to = (dir ? dir + "/" : "") + holder.slice(holder.lastIndexOf("/") + 1);
  if (await textus.files.stat(join(root, to))) return textus.ui.message(t("exists", pages.nameOf(from)));
  await textus.files.rename(join(root, holder), join(root, to), { updateLinks: true });
}

/** A unit's folder renamed anywhere (the file tree too): its page takes the
 *  new name, so Plans/Plans.md stays a unit as Goals/Goals.md. */
async function followUnit(change) {
  root = await textus.files.root();
  const from = relOf(change.from);
  const to = relOf(change.to);
  if (!from || !to || /\.md$/i.test(to)) return;
  const oldPage = to + "/" + pages.nameOf(from + ".md") + ".md";
  const newPage = to + "/" + pages.nameOf(to + ".md") + ".md";
  if (oldPage === newPage || !(await textus.files.stat(join(root, oldPage))) || (await textus.files.stat(join(root, newPage)))) return;
  await textus.files.rename(join(root, oldPage), join(root, newPage), { updateLinks: true });
}

async function setIcon(path) {
  const file = typeof path === "string" ? path : await textus.editor.getPath();
  if (!file) return textus.ui.message(t("needsSaved"));
  const picked = await textus.ui.pick(
    ICONS.map((icon) => ({ label: icon, value: icon }))
      .concat([{ label: t("otherIcon"), value: "other" }, { label: t("removeIcon"), value: "none" }]),
    { placeholder: t("setIcon") },
  );
  if (!picked) return;
  const icon =
    picked === "other" ? ((await textus.ui.input({ prompt: t("iconPrompt") })) || "").trim() : picked;
  if (picked === "other" && !icon) return;
  await textus.files.frontmatter.update(file, (fm) => {
    if (picked === "none") delete fm.icon;
    else fm.icon = icon;
  });
}

async function up() {
  root = await textus.files.root();
  const rel = relOf(await textus.editor.getPath());
  if (!rel) return;
  const above = pages.ancestors(rel, docs.map((d) => d.rel));
  const picked = await textus.ui.pick(
    above.reverse().map((r) => ({ label: pages.nameOf(r), description: r, value: r })),
    { placeholder: t("up") },
  );
  if (picked) await textus.layout.open(join(root, picked));
}

/** Textus AI's tool: a page, or a sub-page of another, and the link to
 *  put in its parent. */
async function createPage(input) {
  root = await textus.files.root();
  if (!root) return { error: t("needsFolder") };
  const title = String(input.title || "").trim();
  if (!pages.fileName(title)) return { error: "The page has no title." };
  let parentRel = null;
  if (input.parent) {
    parentRel = folderPaths.clean(root, input.parent, true);
    if (!parentRel || !(await textus.files.stat(join(root, parentRel))))
      return { error: "No page " + (parentRel || input.parent) + " in the folder." };
  }
  if (parentRel) parentRel = await unitFor(parentRel);
  const rel = parentRel ? pages.subpage(parentRel, title) : pages.fileName(title) + ".md";
  const file = join(root, rel);
  if (await textus.files.stat(file)) return { error: t("exists", title) };
  if (rel.includes("/"))
    await textus.files.createFolder(join(root, rel.slice(0, rel.lastIndexOf("/")))).catch(() => {});
  const body = input.body ? "\n" + String(input.body).replace(/\s+$/, "") + "\n" : "";
  await textus.files.create(file, "# " + title + "\n" + body);
  if (input.icon) await textus.files.frontmatter.update(file, (fm) => void (fm.icon = String(input.icon)));
  const rels = docs.map((d) => d.rel).concat([rel]);
  return { path: rel, parent: parentRel, link: pages.link(rel, rels) };
}

return function activatePages(ctx) {
  let pending = null;
  const later = () => {
    clearTimeout(pending);
    pending = setTimeout(() => void reload(), 300);
  };
  list = textus.views.registerList("catvinci.database.pages", {
    items: (parent) => (parent ? parent.data.children : roots).map(item),
    onMove: (moved, target) => movePage(moved, target),
    emptyText: t("empty"),
    filterPlaceholder: t("filter"),
  });
  ctx.subscriptions.push(
    list,
    textus.commands.register("catvinci.database.newSubpage", newSubpage),
    textus.commands.register("catvinci.database.setIcon", setIcon),
    textus.commands.register("catvinci.database.up", up),
    textus.commands.register("catvinci.database.toUnits", toUnits),
    textus.commands.register("catvinci.database.renamePage", renamePage),
    textus.commands.register("catvinci.database.deletePage", deletePage),
    textus.files.onDidRename((change) => void followUnit(change)),
    textus.ai.registerTool("create_page", createPage),
    textus.files.onDidChangeRoot(later),
    textus.metadata.onDidChange(later),
    textus.files.onDidCreate(later),
    textus.files.onDidRename(later),
    textus.files.onDidDelete(later),
    textus.editor.onDidChangeActive(() => void showCrumb()),
    { dispose: () => crumb && crumb.dispose() },
  );
  void reload();
};
})();
