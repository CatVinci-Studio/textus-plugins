// Calendar & Daily Notes: a note per day, YYYY-MM-DD.md in a folder of
// the open folder (Settings: "Daily" by default), made from a template the
// first time a day is opened. The sidebar's calendar marks the days that
// have one.
/** What activate was given: the plugin's storage and own files. */
let ctx;

let panel = null;

const pad = (n) => String(n).padStart(2, "0");
function dateOf(day) {
  return (
    day.getFullYear() + "-" + pad(day.getMonth() + 1) + "-" + pad(day.getDate())
  );
}

/** `root` and `parts` joined with the root's own separator. */
function join(root) {
  const sep = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  const parts = Array.prototype.slice.call(arguments, 1).filter(Boolean);
  return [root.replace(/[\\/]+$/, "")].concat(parts).join(sep);
}

async function folder() {
  const root = await textus.files.root();
  if (!root) return null;
  const name = String((await textus.settings.get("folder")) || "Daily").replace(
    /^[\\/]+|[\\/]+$/g,
    "",
  );
  return { root: root, dir: join(root, name) };
}

/** The dates that have a note, from the folder's file names. */
async function noteDates() {
  const where = await folder();
  if (!where) return null;
  try {
    const entries = await textus.files.list(where.dir);
    return entries
      .map((e) => /^(\d{4}-\d{2}-\d{2})\.md$/.exec(e.name))
      .filter(Boolean)
      .map((m) => m[1]);
  } catch {
    // No folder yet: no notes yet.
    return [];
  }
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

async function refresh() {
  if (!panel) return;
  panel.postMessage({
    type: "dates",
    dates: await noteDates(),
    weekStart: weekStart(),
  });
}

/** `date` (YYYY-MM-DD) `days` later, or earlier when negative. */
function shift(date, days) {
  const [y, m, d] = date.split("-").map(Number);
  return dateOf(new Date(y, m - 1, d + days));
}

/** A new day's note: the template with its {{…}} filled in for `date`. */
function fill(template, date) {
  const [y, m, d] = date.split("-").map(Number);
  const now = new Date();
  const values = {
    date: date,
    weekday: new Date(y, m - 1, d).toLocaleDateString(textus.env.language, {
      weekday: "long",
    }),
    yesterday: shift(date, -1),
    tomorrow: shift(date, 1),
    time: pad(now.getHours()) + ":" + pad(now.getMinutes()),
  };
  return template
    .replace(/\{\{(\w+)\}\}/g, (all, name) =>
      name in values ? values[name] : all,
    )
    .replace(/\\n/g, "\n");
}

/** The day of the note in front - a daily note's name - else today. */
async function dayInFront() {
  const path = await textus.editor.getPath().catch(() => null);
  const m = path && /(\d{4}-\d{2}-\d{2})\.md$/.exec(path);
  return m ? m[1] : dateOf(new Date());
}

/** The day's note, made from the template if there is none. Created only
 *  where there is no note: one already there, even one that can't be read
 *  just now, is never written over. */
async function ensureNote(path, date) {
  const template = String(
    (await textus.settings.get("template")) || "# {{date}}\\n\\n",
  );
  await textus.files.create(path, fill(template, date)).catch(() => {});
}

async function openDay(date) {
  const where = await folder();
  if (!where) {
    await textus.ui.message(textus.l10n.t("needsFolder"));
    return;
  }
  const path = join(where.dir, date + ".md");
  await ensureNote(path, date);
  await textus.layout.open(path);
  await refresh();
}

// Textus AI's tools: a day as YYYY-MM-DD, today when not given.
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;

async function noteOf(input) {
  const where = await folder();
  if (!where) return { error: "No folder is open." };
  const date = input.date ? String(input.date).trim() : dateOf(new Date());
  if (!DAY.test(date)) return { error: "date must be YYYY-MM-DD." };
  const path = join(where.dir, date + ".md");
  const rel = path.slice(where.root.replace(/[\\/]+$/, "").length + 1).replace(/\\/g, "/");
  return { date: date, path: path, rel: rel };
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
  await textus.files.createFolder(note.path.replace(/[\\/][^\\/]*$/, "")).catch(() => {});
  await ensureNote(note.path, note.date);
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
    return openDay(dateOf(new Date()));
  });
  // From a day's note to the one before or after it.
  textus.commands.register("catvinci.daily-notes.previous", async function () {
    return openDay(shift(await dayInFront(), -1));
  });
  textus.commands.register("catvinci.daily-notes.next", async function () {
    return openDay(shift(await dayInFront(), 1));
  });
  textus.ai.registerTool("read_daily_note", readDailyNote);
  textus.ai.registerTool("append_to_daily_note", appendToDailyNote);
  textus.files.onDidChangeRoot(refresh);
  textus.files.onDidSave(refresh);
  textus.files.onDidCreate(refresh);
  textus.files.onDidDelete(refresh);
  textus.files.onDidRename(refresh);
  textus.settings.onDidChange(refresh);
  textus.views.registerWebview("catvinci.daily-notes.calendar", {
    resolve: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready") await refresh();
        if (message.type === "open") await openDay(message.date);
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
