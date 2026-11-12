// Calendar & Daily Notes: a note per day, YYYY-MM-DD.md in a folder of
// the open folder (Settings: "Daily" by default), made from a template the
// first time a day is opened. The sidebar's calendar marks the days that
// have one. Where the folder's app sets daily notes (an Obsidian vault, a
// Logseq graph, Foam...), its folder, name format and template win; an
// Obsidian vault that sets none keeps them at its top, as Obsidian does.
// Weekly and monthly notes, when turned on, work the same way, a vault's
// Periodic Notes settings winning.
/* global folderConventions, folderPaths */
const today = () => textus.dates.format(new Date());
/** What activate was given: the plugin's storage and own files. */
let ctx;

let panel = null;
/** The daily notes folder the calendar last showed; file events elsewhere
 *  leave it as it is. */
let shownWhere = null;

/** Each kind of note: the settings it is kept by, and their defaults. */
const PERIODS = {
  daily: {
    on: null,
    folderKey: "folder",
    formatKey: null,
    templateKey: "template",
    folder: "Daily",
    format: "YYYY-MM-DD",
  },
  weekly: {
    on: "weekly",
    folderKey: "weeklyFolder",
    formatKey: "weeklyFormat",
    templateKey: "weeklyTemplate",
    folder: "Weekly",
    format: "gggg-[W]ww",
  },
  monthly: {
    on: "monthly",
    folderKey: "monthlyFolder",
    formatKey: "monthlyFormat",
    templateKey: "monthlyTemplate",
    folder: "Monthly",
    format: "YYYY-MM",
  },
};

/** Where `period`'s notes go and how they are named and begun: the
 *  folder's app's settings when it has them (Periodic Notes for weeks and
 *  months), else the plugin's. */
async function folder(period = "daily") {
  const root = await textus.files.root();
  if (!root) return null;
  const kind = PERIODS[period];
  const setting = (key) => (key ? textus.settings.get(key) : null);
  const app = period === "daily" ? await folderConventions.daily(root) : await folderConventions.periodic(root, period);
  const own = String((await setting(kind.folderKey)) || kind.folder);
  const rel = app ? app.folder : own.replace(/\\/g, "/").replace(/^[./]+|\/+$/g, "");
  return {
    root: root,
    rel: rel,
    dir: folderPaths.abs(root, rel),
    format: (app ? app.format : await setting(kind.formatKey)) || kind.format,
    template: app ? (app.template ? { file: app.template } : { text: "" }) : null,
    templateKey: kind.templateKey,
    enabled: !kind.on || (app ? app.enabled : !!(await setting(kind.on))),
  };
}

/** The note of `date` (YYYY-MM-DD) and its path in the folder. */
function noteFor(where, date) {
  const name = textus.dates.format(dayOf(date), where.format);
  const rel = (where.rel ? where.rel + "/" : "") + name + ".md";
  return { rel: rel, path: folderPaths.abs(where.root, rel) };
}

function dayOf(date) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** The date a document is the note of, from its path; null for none. */
function dateAt(where, path) {
  const inside = folderPaths.rel(where.root, path);
  const prefix = where.rel ? where.rel + "/" : "";
  return inside !== null && inside.startsWith(prefix)
    ? textus.dates.parse(inside.slice(prefix.length).replace(/\.md$/i, ""), where.format)
    : null;
}

/** The dates that have a note, from the folder's file names. */
async function noteDates(where) {
  if (!where) return null;
  const files = await textus.files.find((where.rel ? where.rel + "/" : "") + "**/*.md").catch(() => []);
  return files.map((f) => dateAt(where, f.path)).filter(Boolean);
}

/** Where the system's region starts its weeks: Sunday in the US, Monday
 *  in most of the world. */
function weekStart() {
  try {
    const locale = new Intl.Locale(Intl.DateTimeFormat().resolvedOptions().locale);
    const info = locale.getWeekInfo ? locale.getWeekInfo() : locale.weekInfo;
    return info && info.firstDay === 7 ? "sunday" : "monday";
  } catch {
    return "monday";
  }
}

/** The week number a weekly note's name format counts: ISO's (W) or the
 *  language's (w). */
function weekToken(format) {
  return /W|GGGG/.test(String(format).replace(/\[[^\]]*\]/g, "")) ? "W" : "w";
}

async function refresh() {
  if (!panel) return;
  const where = await folder();
  shownWhere = where;
  const weekly = await folder("weekly");
  const monthly = await folder("monthly");
  panel.postMessage({
    type: "dates",
    dates: await noteDates(where),
    weekStart: weekStart(),
    week: weekly && weekly.enabled ? weekToken(weekly.format) : null,
    month: !!(monthly && monthly.enabled),
  });
}

/** `date` (YYYY-MM-DD) `days` later, or earlier when negative. */
function shift(date, days) {
  const day = dayOf(date);
  day.setDate(day.getDate() + days);
  return textus.dates.format(day);
}

/** Whether a file event at `path` may change the calendar: a note under
 *  the daily folder, or (`folders`) a folder holding or inside it. */
function concerns(path, folders) {
  const w = shownWhere;
  if (!w || !path) return true;
  const inside = folderPaths.rel(w.root, path);
  if (inside === null) return false;
  const prefix = w.rel ? w.rel + "/" : "";
  if (/\.md$/i.test(inside)) return inside.startsWith(prefix);
  return !!folders && (inside.startsWith(prefix) || prefix.startsWith(inside + "/"));
}

/** The day of the note in front - a daily note's name - else today. */
async function dayInFront() {
  const where = await folder();
  const path = await textus.editor.getPath().catch(() => null);
  return (where && dateAt(where, path)) || today();
}

/** A new note's template: the vault's template note, a template of the
 *  Templates folder named by the setting, or the setting's own text. */
async function templateText(where) {
  const read = (rel) => textus.files.readText(folderPaths.abs(where.root, rel)).catch(() => null);
  if (where.template) return where.template.file ? (await read(where.template.file.replace(/(\.md)?$/i, ".md"))) || "" : "";
  const setting = String((await textus.settings.get(where.templateKey)) || folderConventions.DAILY.template);
  if (/[{}\n\\]/.test(setting)) return setting;
  const templates = await folderConventions.templatesFolder(where.root);
  return (await read(templates + "/" + setting.replace(/\.md$/i, "") + ".md")) || setting;
}

/** The day's note, made from the template if there is none. Created only
 *  where there is no note: one already there, even one that can't be read
 *  just now, is never written over. */
async function ensureNote(where, note, date) {
  const title = note.rel.split("/").pop().replace(/\.md$/, "");
  const parent = note.path.replace(/[\\/][^\\/]*$/, "");
  await textus.files.createFolder(parent).catch(() => {});
  const filled = await textus.templates.fill(await templateText(where), {
    date: date,
    format: where.format,
    title: title,
  });
  const text = filled.text;
  await textus.files.create(note.path, text).catch(() => {});
}

/** The note of `date`'s day, week or month (`period`), made if new. */
async function openDay(date, period) {
  const where = await folder(period);
  if (!where || !where.enabled) {
    await textus.ui.message(textus.l10n.t(where ? period + "Off" : "needsFolder"));
    return;
  }
  const note = noteFor(where, date);
  await ensureNote(where, note, date);
  await textus.layout.open(note.path);
  await refresh();
}

// Textus AI's tools: a day as YYYY-MM-DD, today when not given.
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;

async function noteOf(input) {
  const where = await folder();
  if (!where) return { error: "No folder is open." };
  const date = input.date ? String(input.date).trim() : today();
  if (!DAY.test(date)) return { error: "date must be YYYY-MM-DD." };
  if (textus.dates.format(dayOf(date)) !== date) return { error: "date must be a real day, YYYY-MM-DD." };
  const note = noteFor(where, date);
  return { date: date, path: note.path, rel: note.rel, where: where, note: note };
}

async function readDailyNote(input) {
  const note = await noteOf(input);
  if (note.error) return note;
  const exists = !!(await textus.files.stat(note.path));
  return {
    date: note.date,
    path: note.rel,
    exists: exists,
    text: exists ? await textus.files.readText(note.path) : null,
  };
}

async function appendToDailyNote(input) {
  const note = await noteOf(input);
  if (note.error) return note;
  const add = String(input.text || "").replace(/\s+$/, "");
  if (!add.trim()) return { error: "There is no text to add." };
  await ensureNote(note.where, note.note, note.date);
  await textus.files.process(note.path, function (text) {
    const kept = text.replace(/\s+$/, "");
    const last = kept.slice(kept.lastIndexOf("\n") + 1);
    // A list item after a list item stays in its list.
    const gap = !kept ? "" : LIST_ITEM.test(last) && LIST_ITEM.test(add) ? "\n" : "\n\n";
    return kept + gap + add + "\n";
  });
  await refresh();
  return { date: note.date, path: note.rel, added: add };
}

exports.activate = function (context) {
  ctx = context;
  textus.commands.register("catvinci.daily-notes.today", function () {
    return openDay(today());
  });
  // From a day's note to the one before or after it.
  textus.commands.register("catvinci.daily-notes.previous", async function () {
    return openDay(shift(await dayInFront(), -1));
  });
  textus.commands.register("catvinci.daily-notes.next", async function () {
    return openDay(shift(await dayInFront(), 1));
  });
  textus.commands.register("catvinci.daily-notes.week", function () {
    return openDay(today(), "weekly");
  });
  textus.commands.register("catvinci.daily-notes.month", function () {
    return openDay(today(), "monthly");
  });
  textus.ai.registerTool("read_daily_note", readDailyNote);
  textus.ai.registerTool("append_to_daily_note", appendToDailyNote);
  textus.files.onDidChangeRoot(refresh);
  textus.files.onDidChangeConventions(refresh);
  textus.files.onDidSave((e) => concerns(e && e.path) && refresh());
  textus.files.onDidCreate((e) => concerns(e && e.path) && refresh());
  textus.files.onDidDelete((e) => concerns(e && e.path, true) && refresh());
  textus.files.onDidRename((e) => (concerns(e && e.from, true) || concerns(e && e.to, true)) && refresh());
  textus.settings.onDidChange(refresh);
  textus.views.registerWebview("catvinci.daily-notes.calendar", {
    resolve: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready") await refresh();
        if (message.type === "open") await openDay(message.date, message.period);
      });
      const html = await ctx.plugin.readText("panel.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
      // Drawn again in the interface's language when that changes.
      const relabel = textus.env.onDidChangeLanguage(() => {
        webview.html = html.replace("{{lang}}", textus.env.language);
      });
      webview.onDidDispose(() => relabel.dispose());
    },
  });
};
