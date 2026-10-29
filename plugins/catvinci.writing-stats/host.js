// Writing Stats: the document in front, the selection, today's writing
// against a daily goal, the run of days it was met, and - when opened - the
// whole folder. Today counts the words added to any document today.

/* global writingCount */
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

async function onChange() {
  const path = (await textus.editor.getPath()) || "(unsaved)";
  const text = await textus.editor.getText();
  if (text === null) return;
  const words = writingCount.count(text).words;
  const before = lastWords.get(path);
  lastWords.set(path, words);
  if (before !== undefined && words > before) {
    const d = await day();
    d.words += words - before;
    await store.set("day", d);
    const goal = Number(await textus.settings.get("goal")) || 0;
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

async function folderItems() {
  const docs = await textus.metadata.all();
  let words = 0;
  let characters = 0;
  for (const doc of docs) {
    const c = writingCount.count(await textus.files.readText(doc.path).catch(() => ""));
    words += c.words;
    characters += c.characters;
  }
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
      Object.assign(row("doc:words", t("words"), fmt(c.words), "file"), { group: g }),
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
  const goal = Number(await textus.settings.get("goal")) || 0;
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

exports.activate = function (ctx) {
  store = ctx.storage.global;
  list = textus.views.registerList("catvinci.writing-stats.panel", {
    items: items,
    emptyText: t("none"),
  });
  ctx.subscriptions.push(
    list,
    textus.editor.onDidChange(onChange),
    textus.editor.onDidChangeActive(() => onChange()),
    textus.editor.onDidChangeSelection((e) => {
      selection = e.text || "";
      list.refresh();
    }),
    textus.settings.onDidChange(() => list.refresh()),
  );
  void onChange();
};
