// Writing Stats: the document in front, the selection, today's writing
// against a daily goal, the run of days it was met, and - when opened - the
// whole folder. Today counts the words typed into any document today.

/* global folderPaths, writingCount */
const t = (key, ...args) => textus.l10n.t(key, ...args);
/** The plugin's own place, for today's tally and the days met. */
let store = null;
const fmt = (n) => n.toLocaleString();
const today = () => new Date().toLocaleDateString("en-CA");

let list = null;
let selection = "";
/** Each document's last count, so a change adds only what grew. */
const lastWords = new Map();

async function day() {
  const saved = (await store.get("day")) || {};
  return saved.date === today() ? saved : { date: today(), words: 0 };
}

/** The run of days the goal was met, today included once it is. */
async function streak(goal, todayWords) {
  const met = (await store.get("met")) || [];
  let run = todayWords >= goal ? 1 : 0;
  const d = new Date();
  for (;;) {
    d.setDate(d.getDate() - 1);
    if (!met.includes(d.toLocaleDateString("en-CA"))) break;
    run++;
  }
  return run;
}

/** The goal in words; 0 (or anything below) for none. */
async function goalWords() {
  return Math.max(0, Number(await textus.settings.get("goal")) || 0);
}

/** Only the user's own typing adds to today; any other call (another
 *  document in front, AI, disk, undo) just moves the baseline. */
let queue = Promise.resolve();
function onChange(source) {
  queue = queue.then(() => tally(source)).catch(() => {});
  return queue;
}

async function tally(source) {
  const path = (await textus.editor.getPath()) || "(unsaved)";
  const text = await textus.editor.getText();
  if (text === null) return;
  const words = writingCount.count(text).words;
  const before = lastWords.get(path);
  lastWords.set(path, words);
  if (source === "user" && before !== undefined && words > before) {
    const d = await day();
    d.words += words - before;
    await store.set("day", d);
    const goal = await goalWords();
    if (goal && d.words >= goal) {
      const met = (await store.get("met")) || [];
      if (!met.includes(d.date)) await store.set("met", met.concat(d.date).slice(-400));
    }
  }
  list.refresh();
}

function row(id, label, value, icon) {
  return { id: id, label: label, description: value, icon: icon };
}

/** The folder's documents and each one's counts, read again only for the
 *  paths metadata reports changed. */
const folder = { root: null, docs: null, counts: new Map(), changed: new Set() };

async function folderItems() {
  const root = await textus.files.root();
  if (root !== folder.root) {
    Object.assign(folder, { root: root, docs: null });
    folder.counts.clear();
  }
  if (!folder.docs || folder.changed.size) folder.docs = await textus.metadata.all();
  const live = new Set(folder.docs.map((d) => d.path));
  for (const path of folder.counts.keys()) if (!live.has(path)) folder.counts.delete(path);
  for (const path of folder.changed) folder.counts.delete(path);
  folder.changed.clear();
  let words = 0;
  let characters = 0;
  for (const doc of folder.docs) {
    let c = folder.counts.get(doc.path);
    if (!c) {
      c = writingCount.count(await textus.files.readText(doc.path).catch(() => ""));
      folder.counts.set(doc.path, c);
    }
    words += c.words;
    characters += c.characters;
  }
  const docs = folder.docs;
  return [
    row("folder:words", t("words"), fmt(words)),
    row("folder:chars", t("characters"), fmt(characters)),
    row("folder:docs", t("documents"), fmt(docs.length)),
  ];
}

async function items(parent) {
  if (parent) return folderItems();
  const out = [];
  const text = await textus.editor.getText();
  if (text !== null) {
    const c = writingCount.count(text);
    const g = t("document");
    out.push(
      Object.assign(row("doc:words", t("words"), fmt(c.words)), { group: g }),
      Object.assign(row("doc:chars", t("characters"), fmt(c.characters)), { group: g }),
      Object.assign(row("doc:read", t("reading"), t("minutes", writingCount.readingMinutes(c))), { group: g }),
    );
  }
  if (selection) {
    const s = writingCount.count(selection);
    out.push(
      Object.assign(row("sel:words", t("words"), fmt(s.words)), { group: t("selection") }),
      Object.assign(row("sel:chars", t("characters"), fmt(s.characters)), { group: t("selection") }),
    );
  }
  const d = await day();
  const goal = await goalWords();
  const g = t("today");
  out.push(
    Object.assign(row("day:words", t("written"), goal ? t("ofGoal", fmt(d.words), fmt(goal)) : fmt(d.words), "clock"), {
      group: g,
      badge: goal && d.words >= goal ? { text: t("done"), tone: "accent" } : undefined,
    }),
  );
  if (goal) {
    const run = await streak(goal, d.words);
    out.push(Object.assign(row("day:streak", t("streak"), t("days", run), "star"), { group: g }));
  }
  if (await textus.files.root())
    out.push({ id: "folder", label: t("folder"), icon: "folder", children: true, group: t("folderGroup") });
  return out;
}

/** Textus AI's tool: the counts of a document, a folder's documents, or
 *  the document in front. */
async function countWords(input) {
  const root = await textus.files.root();
  const total = { words: 0, characters: 0, cjk: 0 };
  const add = (text) => {
    const c = writingCount.count(text);
    for (const key in total) total[key] += c[key];
  };
  let target;
  let documents = 1;
  if (input.path === undefined || input.path === null) {
    const text = await textus.editor.getText();
    if (text === null) return { error: "No document is open." };
    add(text);
    target = folderPaths.rel(root, await textus.editor.getPath()) || "the document in front";
  } else {
    if (!root) return { error: "No folder is open." };
    const rel = folderPaths.clean(root, input.path, false);
    if (rel === null) return { error: "path must be in the open folder." };
    // A document's path ends in .md; else a folder's documents, or the
    // document of that name without its .md.
    const all = await textus.metadata.all();
    let inside = /\.(md|markdown)$/i.test(rel)
      ? all.filter((d) => d.rel === rel)
      : all.filter((d) => !rel || d.rel.startsWith(rel + "/"));
    if (!inside.length) inside = all.filter((d) => d.rel === rel + ".md");
    if (!inside.length) return { error: "No documents at " + rel + "." };
    for (const doc of inside) add(await textus.files.readText(doc.path).catch(() => ""));
    const one = inside.length === 1 && [rel, rel + ".md"].includes(inside[0].rel);
    target = one ? inside[0].rel : rel || "/";
    documents = inside.length;
  }
  return {
    path: target,
    documents: documents,
    words: total.words,
    characters: total.characters,
    reading_minutes: writingCount.readingMinutes(total),
  };
}

let folderTimer = 0;

exports.activate = function (ctx) {
  store = ctx.storage.global;
  list = textus.views.registerList("catvinci.writing-stats.panel", {
    items: items,
    emptyText: t("none"),
  });
  ctx.subscriptions.push(
    list,
    textus.editor.onDidChange((e) => onChange(e && e.source)),
    textus.editor.onDidChangeActive(() => onChange()),
    textus.editor.onDidChangeSelection((e) => {
      selection = e.text || "";
      list.refresh();
    }),
    textus.settings.onDidChange(() => list.refresh()),
    textus.metadata.onDidChange((e) => {
      const paths = (e && e.paths) || [];
      for (const path of paths) folder.changed.add(path);
      if (!paths.length) Object.assign(folder, { docs: null }).counts.clear();
      clearTimeout(folderTimer);
      folderTimer = setTimeout(() => list.refresh(), 500);
    }),
    textus.ai.registerTool("count_words", countWords),
  );
  void onChange();
};
