// Reminders: the folder's `(@2026-11-02 09:00)` marks become system
// notifications that Textus keeps and shows on time - with a window open,
// or with none in background mode. A click opens the line.

/* global reminders */
const t = (key, ...args) => textus.l10n.t(key, ...args);
const LIMIT = 30;

const DOC = /\.(md|markdown)$/i;

let list = null;
let soon = [];
// Each document's reminders by path, for the folder at `cachedRoot`;
// `loading` is its first full read, shared by whoever asks meanwhile.
const byPath = new Map();
let cachedRoot = null;
let loading = null;

const under = (path, dir) => path === dir || (path.startsWith(dir) && "/\\".includes(path[dir.length]));
const relOf = (path, root) => path.slice(root.length + 1).replace(/\\/g, "/");

async function readOne(path, root, text) {
  byPath.delete(path);
  if (!DOC.test(path) || !under(path, root)) return;
  if (text === undefined) text = await textus.files.readText(path).catch(() => "");
  if (!text.includes("(@")) return;
  const rel = relOf(path, root);
  byPath.set(path, reminders.find(text).map((r) => Object.assign({ path, rel }, r)));
}

function drop(path) {
  for (const key of [...byPath.keys()]) if (under(key, path)) byPath.delete(key);
}

/** Every reminder in the folder's documents; read in full once a folder. */
async function readAll(root) {
  if (cachedRoot !== root) {
    byPath.clear();
    cachedRoot = root;
    loading = (async () => {
      for (const doc of await textus.files.find()) await readOne(doc.path, root);
    })();
  }
  await loading;
  return [].concat(...byPath.values());
}

/** The next reminders scheduled; this folder's jobs no longer in a
 *  document are cleared, other folders' (other windows') kept. */
async function sync() {
  const root = await textus.files.root();
  if (!root) {
    soon = [];
    if (list) list.refresh();
    return;
  }
  soon = reminders.upcoming(await readAll(root), new Date(), LIMIT);
  const keep = new Set(soon.map((r) => reminders.jobId(r.rel, r)));
  for (const job of await textus.schedule.list()) {
    const path = job.notify && job.notify.open && job.notify.open.path;
    if (!keep.has(job.id) && (!path || under(path, root))) await textus.schedule.clear(job.id);
  }
  for (const r of soon)
    await textus.schedule.set(reminders.jobId(r.rel, r), {
      at: r.when,
      catchUp: "once",
      notify: { title: r.text || t("name"), body: r.rel, open: { path: r.path, line: r.line } },
    });
  if (list) list.refresh();
}

/** A mark at the caret, for a time picked from a few or typed. */
async function remind() {
  const now = new Date();
  const at = (days, hour, minute) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, minute || 0);
    return d;
  };
  const inHour = new Date(now.getTime() + 3600000);
  const choices = [
    { label: t("inHour"), value: inHour },
    { label: t("tonight"), value: at(0, 20) },
    { label: t("tomorrow"), value: at(1, 9) },
    { label: t("nextWeek"), value: at(7 - ((now.getDay() + 6) % 7), 9) },
    { label: t("pickTime"), value: "pick" },
  ].filter((c) => c.value === "pick" || c.value > now);
  const picked = await textus.ui.pick(
    choices.map((c, i) => ({ label: c.label, description: c.value === "pick" ? "" : reminders.mark(c.value).slice(2, -1), value: i })),
    { placeholder: t("when") },
  );
  if (picked === null || picked === undefined) return;
  let when = choices[picked].value;
  if (when === "pick") {
    const typed = await textus.ui.input({ prompt: t("typeTime"), value: reminders.mark(at(1, 9)).slice(2, -1) });
    const m = typed && /^(\d{4}-\d{2}-\d{2})(?:\s+(\d{1,2}):(\d{2}))?$/.exec(typed.trim());
    if (!m) return typed && textus.ui.message(t("badTime"));
    when = new Date(m[1] + "T" + (m[2] || "09").padStart(2, "0") + ":" + (m[3] || "00") + ":00");
    if (isNaN(when)) return textus.ui.message(t("badTime"));
  }
  await textus.editor.insertText(" " + reminders.mark(when));
}

// Textus AI's tools.
const WHEN = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/;

async function listReminders(input) {
  const root = await textus.files.root();
  if (!root) return { error: "No folder is open." };
  const limit = Math.max(1, Number(input.limit) || LIMIT);
  return {
    reminders: reminders.upcoming(await readAll(root), new Date(), limit).map((r) => ({
      when: r.when.replace("T", " "),
      text: r.text,
      path: r.rel,
      line: r.line,
    })),
  };
}

async function addReminder(input) {
  const m = WHEN.exec(String(input.when || "").trim());
  if (!m) return { error: "when must be YYYY-MM-DD HH:MM, or YYYY-MM-DD for nine that morning." };
  const at = new Date(m[1] + "T" + (m[2] || "9").padStart(2, "0") + ":" + (m[3] || "00") + ":00");
  if (isNaN(at)) return { error: "when is not a date." };
  const text = String(input.text || "").replace(/\s*\n\s*/g, " ").trim();
  if (!text) return { error: "The reminder has no text." };
  const line = "- [ ] " + text + " " + reminders.mark(at);
  // Only the document in front can be written to (editor.write).
  if (!(await textus.editor.edit({ action: "append", text: line })))
    return { error: "Couldn't add it to the document in front." };
  return { added: line, past: at < new Date() };
}

exports.activate = function (ctx) {
  // Events gather the paths to read again; `null` reads the folder anew.
  let pending = null;
  let dirty = new Map();
  const flush = async () => {
    const root = await textus.files.root();
    const work = dirty;
    dirty = new Map();
    if (root && cachedRoot === root && !work.has(null))
      for (const [path, text] of work) {
        if (text === false) drop(path);
        else await readOne(path, root, text);
      }
    else cachedRoot = null;
    await sync();
  };
  const later = (path, text) => {
    dirty.set(path, text);
    clearTimeout(pending);
    pending = setTimeout(() => void flush(), 800);
  };
  list = textus.views.registerList("catvinci.reminders.list", {
    items: () =>
      soon.map((r) => ({
        id: reminders.jobId(r.rel, r),
        label: r.text || r.rel,
        description: r.when.replace("T", " "),
        detail: r.rel,
        icon: "clock",
        location: { path: r.path, line: r.line },
      })),
    emptyText: t("none"),
  });
  ctx.subscriptions.push(
    list,
    textus.commands.register("catvinci.reminders.remind", remind),
    textus.files.onDidChangeRoot(() => later(null)),
    textus.files.onDidSave((e) => later(e.path, e.text)),
    textus.files.onDidChange((e) => later(e.path)),
    textus.files.onDidCreate((e) => later(e.path)),
    textus.files.onDidDelete((e) => later(e.path, false)),
    // A folder renamed carries documents the event doesn't name.
    textus.files.onDidRename((e) => (DOC.test(e.to) ? (later(e.from, false), later(e.to)) : later(null))),
    textus.ai.registerTool("list_reminders", listReminders),
    textus.ai.registerTool("add_reminder", addReminder),
  );
  void sync();
};
