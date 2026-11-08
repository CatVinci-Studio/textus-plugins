// Quick Notes: short notes listed in a sidebar tab, kept in a document of
// the open folder - Inbox.md, or today's daily note under "## Quick notes" -
// as list items stamped with the time ("- 14:05 Call Anna"). With no
// folder open they stay in the plugin's storage. A note goes into the
// document at the caret, or opens as a new document of its own.
/* global folderConventions, folderPaths, dates */
/** What activate was given: the plugin's storage and own files. */
let ctx;

let panel = null;

/** The daily note's section: the language's name for it, or the English
 *  one written before. */
const headings = () => [textus.l10n.t("heading"), "Quick notes"];
const ITEM = /^([-*+]) (.*)$/;
const STAMP = /^(?:(\d{4}-\d{2}-\d{2}) )?(\d{1,2}):(\d{2})(?: |$)/;

/** The note's stamp: its time, and its day too unless that is `day`'s
 *  (YYYY-MM-DD; null for a file of no day). */
function stampOf(at, day) {
  const date = new Date(at);
  return (dates.day(date) === day ? "" : dates.day(date) + " ") + dates.format(date, "HH:mm");
}

/** A note as the lines of a list item; lines after the first indented. */
function itemLines(text, stamp, bullet = "-") {
  const lines = String(text).replace(/\s+$/, "").split(/\r?\n/);
  const first = bullet + " " + [stamp, lines[0]].filter(Boolean).join(" ");
  return [first].concat(lines.slice(1).map((l) => (l ? "  " + l : "")));
}

/** Where the notes are in `lines`: the whole file, or the section under
 *  `heading` up to the next heading; null when it has no such section. */
function sectionOf(lines, heading) {
  if (!heading) return { from: 0, to: lines.length, heading: -1 };
  const names = [].concat(heading).map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const at = lines.findIndex((l) => new RegExp("^##\\s+(?:" + names.join("|") + ")\\s*$", "i").test(l));
  if (at < 0) return null;
  let to = at + 1;
  while (to < lines.length && !/^#{1,6}\s/.test(lines[to])) to++;
  return { from: at + 1, to: to, heading: at };
}

/** The notes of a file's text: each top-level list item of the section,
 *  with its lines (start, end), text and stamp. `day` dates a stamp
 *  without one. */
function parseNotes(text, heading, day) {
  const lines = text.split(/\r?\n/);
  const section = sectionOf(lines, heading);
  const notes = [];
  if (!section) return { lines: lines, section: null, notes: notes };
  for (let i = section.from; i < section.to; i++) {
    const m = ITEM.exec(lines[i]);
    // In a file of its own, a list item is a note only with its stamp.
    if (!m || (!heading && !STAMP.test(m[2]))) continue;
    let end = i + 1;
    for (let j = i + 1; j < section.to && !ITEM.test(lines[j]); j++) {
      if (/^\s+\S/.test(lines[j])) end = j + 1;
      else if (lines[j].trim()) break;
    }
    const s = STAMP.exec(m[2]);
    const on = s && (s[1] || day);
    const rest = lines.slice(i + 1, end).map((l) => l.replace(/^ {1,2}|^\t/, ""));
    notes.push({
      start: i,
      end: end,
      bullet: m[1],
      stamp: s ? s[0].trim() : "",
      text: [s ? m[2].slice(s[0].length) : m[2]].concat(rest).join("\n"),
      at: on ? new Date(on + "T" + s[2].padStart(2, "0") + ":" + s[3] + ":00").getTime() : null,
    });
    i = end - 1;
  }
  return { lines: lines, section: section, notes: notes };
}

/** `text` with `item` (lines) added after the section's last note, the
 *  section made at the end when there is none. */
function appendItem(text, heading, item) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const { lines, section } = parseNotes(text, heading, null);
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (!section) {
    const head = heading ? ["## " + [].concat(heading)[0], ""] : [];
    return lines.concat(lines.length ? [""] : [], head, item).join(eol) + eol;
  }
  let last = Math.min(section.to, lines.length) - 1;
  while (last > section.heading && !lines[last].trim()) last--;
  const listed = last > section.heading && /^(\s*[-*+] |\s+\S)/.test(lines[last]);
  const after = lines.slice(last + 1);
  const middle = (listed || last < 0 ? [] : [""]).concat(item, after.length && after[0].trim() ? [""] : []);
  return lines.slice(0, last + 1).concat(middle, after).join(eol) + eol;
}

// Where the notes are kept: a document of the open folder, else storage.

/** The document notes go to now; null with no folder open. */
async function target() {
  const root = await textus.files.root();
  if (!root) return null;
  if ((await textus.settings.get("saveTo")) === "daily") {
    const app = await folderConventions.daily(root);
    const daily = app || { folder: folderConventions.DAILY.folder, format: folderConventions.DAILY.format, template: null };
    const today = new Date();
    const rel = dates.notePath(daily.folder, daily.format, today, textus.env.language);
    const template = async () => {
      if (!app) return folderConventions.DAILY.template;
      if (!daily.template) return "";
      const file = folderPaths.abs(root, daily.template.replace(/(\.md)?$/i, ".md"));
      return (await textus.files.readText(file).catch(() => null)) || "";
    };
    const begin = async () =>
      dates.fillNote(await template(), today, {
        format: daily.format,
        language: textus.env.language,
        title: rel.split("/").pop().replace(/\.md$/, ""),
      });
    return { path: folderPaths.abs(root, rel), heading: headings(), day: dates.day(today), begin: begin };
  }
  const own = String((await textus.settings.get("inbox")) || "Inbox.md");
  const rel = folderPaths.clean(root, own, true) || "Inbox.md";
  return { path: folderPaths.abs(root, rel), heading: null, day: null, begin: async () => "" };
}

/** The document's text, made first (a daily note from its template) when
 *  there is none. */
async function ensure(file) {
  if (await textus.files.stat(file.path)) return;
  await textus.files.createFolder(file.path.replace(/[\\/][^\\/]*$/, "")).catch(() => {});
  await textus.files.create(file.path, await file.begin()).catch(() => {});
}

/** Notes kept in a document, by their place in it (oldest first). */
function fileNotes(file) {
  const read = async () => {
    const text = await textus.files.readText(file.path).catch(() => null);
    return text === null ? [] : parseNotes(text, file.heading, file.day).notes;
  };
  const change = async (each) => {
    await ensure(file);
    await textus.files.process(file.path, each);
  };
  let removed = null;
  const removeAt = (id, keep) =>
    change((text) => {
      const parsed = parseNotes(text, file.heading, file.day);
      const note = parsed.notes[Number(id)];
      if (!note || (keep && keep(note))) return text;
      const eol = text.includes("\r\n") ? "\r\n" : "\n";
      removed = { lines: parsed.lines.slice(note.start, note.end), at: Number(id) };
      parsed.lines.splice(note.start, note.end - note.start);
      return parsed.lines.join(eol);
    });
  return {
    list: async () =>
      (await read()).map((n, i) => ({ id: String(i), text: n.text, at: n.at })).reverse(),
    /** Where note `id` is: its document and line. */
    place: async (id) => {
      const note = (await read())[Number(id)];
      return note ? { path: file.path, line: note.start } : null;
    },
    add: async (text) => {
      const at = Date.now();
      await change((t) => appendItem(t, file.heading, itemLines(text, stampOf(at, file.day))));
      return { id: String((await read()).length - 1), text: text, at: at };
    },
    edit: (id, value) =>
      change((text) => {
        const parsed = parseNotes(text, file.heading, file.day);
        const note = parsed.notes[Number(id)];
        if (!note) return text;
        const eol = text.includes("\r\n") ? "\r\n" : "\n";
        parsed.lines.splice(note.start, note.end - note.start, ...itemLines(value, note.stamp, note.bullet));
        return parsed.lines.join(eol);
      }),
    remove: async (id) => {
      removed = null;
      await removeAt(id);
      return removed && Object.assign({ path: file.path }, removed);
    },
    drop: (id) => removeAt(id, (note) => note.text.trim()),
    restore: (gone) =>
      gone.path === file.path &&
      change((text) => {
        const parsed = parseNotes(text, file.heading, file.day);
        const before = parsed.notes[gone.at];
        if (!before) return appendItem(text, file.heading, gone.lines);
        const eol = text.includes("\r\n") ? "\r\n" : "\n";
        parsed.lines.splice(before.start, 0, ...gone.lines);
        return parsed.lines.join(eol);
      }),
  };
}

/** Notes kept in the plugin's storage, newest first. */
const storedNotes = {
  list: async () => (await ctx.storage.global.get("notes")) || [],
  save: (list) => ctx.storage.global.set("notes", list),
  add: async (text) => {
    const note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: text,
      at: Date.now(),
    };
    await storedNotes.save([note].concat(await storedNotes.list()));
    return note;
  },
  edit: async (id, text) =>
    storedNotes.save((await storedNotes.list()).map((n) => (n.id === id ? Object.assign({}, n, { text: text }) : n))),
  remove: async (id) => {
    const list = await storedNotes.list();
    const at = list.findIndex((n) => n.id === id);
    if (at < 0) return null;
    await storedNotes.save(list.filter((n) => n.id !== id));
    return { note: list[at], at: at };
  },
  drop: async (id) => storedNotes.save((await storedNotes.list()).filter((n) => n.id !== id || n.text.trim())),
  restore: async (gone) => {
    if (!gone.note) return;
    const back = await storedNotes.list();
    back.splice(Math.min(gone.at, back.length), 0, gone.note);
    await storedNotes.save(back);
  },
};

/** Notes stored before they were kept in a document go to its end once,
 *  oldest first; the stored copy is cleared only after, a backup kept. */
async function migrate(file) {
  const old = (await ctx.storage.global.get("notes")) || [];
  if (!old.length) return;
  const items = old
    .slice()
    .sort((a, b) => a.at - b.at)
    .filter((n) => String(n.text).trim())
    .map((n) => itemLines(n.text, stampOf(n.at, file.day)));
  if (items.length) {
    await ensure(file);
    await textus.files.process(file.path, (text) => items.reduce((t, item) => appendItem(t, file.heading, item), text));
  }
  await ctx.storage.global.set("notesBackup", old);
  await ctx.storage.global.set("notes", []);
}

/** Where the notes are now, stored ones moved into it first. */
async function store() {
  const file = await target();
  if (!file) return storedNotes;
  await migrate(file);
  return fileNotes(file);
}

// One change at a time, in order: each reads the notes the last one wrote.
let queue = Promise.resolve();
function serial(run) {
  const next = queue.then(run);
  queue = next.catch(() => {});
  return next;
}

async function show() {
  const notes = await (await store()).list();
  if (panel) panel.postMessage({ type: "notes", notes: notes });
}

function add(text) {
  return serial(async () => {
    const note = await (await store()).add(text);
    await show();
    return note;
  });
}

/** Textus AI's tool: a note added to the top of the list. */
async function addNote(input) {
  const text = String(input.text || "").trim();
  if (!text) return { error: "The note has no text." };
  const note = await add(text);
  return { added: note.text, notes: (await serial(async () => (await store()).list())).length };
}

/** The note deleted last, for Undo. */
let lastDeleted = null;

async function handle(webview, message) {
  const notes = await store();
  if (message.type === "new") {
    const note = await notes.add("");
    await show();
    webview.postMessage({ type: "focus", id: note.id });
    return;
  }
  if (message.type === "edit") await notes.edit(message.id, message.text);
  if (message.type === "delete") lastDeleted = await notes.remove(message.id);
  // A note left empty: gone, with nothing to undo.
  if (message.type === "drop") await notes.drop(message.id);
  if (message.type === "undo" && lastDeleted) {
    await notes.restore(lastDeleted);
    lastDeleted = null;
  }
  const note = (await notes.list()).find((n) => n.id === message.id);
  // Asked for by a click: written at the caret at once, one undo away.
  if (message.type === "insert" && note) await textus.editor.insertText(note.text);
  if (message.type === "open" && note) {
    // A note in a document opens there, at its line.
    const notes = await store();
    const place = notes.place && (await notes.place(note.id));
    if (place) await textus.layout.open(place);
    else await textus.layout.openUntitled(note.text);
  }
  if (message.type !== "insert" && message.type !== "open") await show();
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("add_note", addNote);
  textus.commands.register("catvinci.quick-notes.capture", async function () {
    const text = await textus.ui.input({
      prompt: textus.l10n.t("prompt"),
      value: "",
    });
    if (text && text.trim()) await add(text.trim());
  });
  // Shown again when their document changes, or where they go.
  const again = () => serial(show).catch(() => {});
  textus.files.onDidChangeRoot(again);
  textus.settings.onDidChange(again);
  for (const event of ["onDidChange", "onDidSave", "onDidCreate", "onDidDelete"])
    textus.files[event](async (e) => {
      const file = panel && (await target().catch(() => null));
      if (file && e.path === file.path) again();
    });
  textus.views.registerWebview("catvinci.quick-notes.panel", {
    resolve: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(function (message) {
        return serial(() => handle(webview, message)).catch(() => {});
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
  // Stored notes move into the folder's document as soon as there is one.
  again();
};
