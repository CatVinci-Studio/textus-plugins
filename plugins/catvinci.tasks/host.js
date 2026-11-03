// Tasks: every Markdown task in the open folder's documents - "- [ ] …" and
// "- [x] …" - in a list in the sidebar that Textus draws (views.registerList):
// the ones due soon first, then by document, each under the heading it
// sits beneath. What Textus knows of the folder (textus.metadata) says
// where they are; ticking one changes that one line of its file - in its
// tab if it is open - after checking the line still says what was listed.

const TASK = /^(\s*(?:[-*+]|\d+[.)])\s+\[)( |x|X)(\]\s+)(.*)$/;
// A due date written after a task, as Obsidian's Tasks writes it
// ("📅 2026-10-30") or plainly ("due:2026-10-30").
const DUE = /\s*(?:📅|due::?)\s*(\d{4}-\d{2}-\d{2})/u;
/** How far ahead "Due soon" looks. */
const SOON_DAYS = 7;

const t = (key, ...args) => textus.l10n.t(key, ...args);

/** The local date `offset` days from today, as YYYY-MM-DD. */
function day(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const two = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
}

/** "3 open tasks", in the language's plural form ("open.few"…). */
function count(key, n) {
  const form = key + "." + new Intl.PluralRules(textus.env.language).select(n);
  const text = t(form, n);
  return text === form ? t(key + ".other", n) : text;
}

/** The heading a line sits beneath, from the document's headings. */
function headingAt(headings, line) {
  let found = null;
  for (const h of headings) {
    if (h.line > line) break;
    found = h.text;
  }
  return found;
}

/** A task as the list shows it. */
function itemOf(doc, task, group) {
  const today = day(0);
  return {
    // Listed twice - due soon, and in its document - under two ids.
    id: group + ":" + doc.path + ":" + task.line,
    label: task.text.replace(DUE, "").trim(),
    description: headingAt(doc.headings, task.line) || undefined,
    detail: group === "soon" ? doc.rel : undefined,
    group: group === "soon" ? t("dueSoon") : doc.rel,
    checkbox: task.done,
    badge: task.due
      ? {
          text: task.due,
          tone: task.done
            ? "muted"
            : task.due < today
              ? "danger"
              : task.due <= day(SOON_DAYS)
                ? "warning"
                : "muted",
        }
      : undefined,
    location: { path: doc.path, line: task.line, text: task.text },
    data: { path: doc.path, line: task.line, text: task.text },
  };
}

async function items() {
  if (!(await textus.files.root())) {
    list.setMessage(t("nofolder"));
    return [];
  }
  const showDone = await textus.settings.get("showDone");
  const docs = await textus.metadata.all();
  const soonUntil = day(SOON_DAYS);
  const soon = [];
  const rest = [];
  let open = 0;
  for (const doc of docs)
    for (const task of doc.tasks) {
      if (!task.done) open++;
      if (task.done && !showDone) continue;
      if (!task.done && task.due && task.due <= soonUntil)
        soon.push(itemOf(doc, task, "soon"));
      rest.push(itemOf(doc, task, "doc"));
    }
  soon.sort((a, b) => (a.badge.text < b.badge.text ? -1 : 1));
  list.setMessage(count("open", open));
  return soon.concat(rest);
}

/** Ticks or unticks the task on `line` of `path`, if it is still there. */
async function setDone(task, done) {
  await textus.files.process(task.path, function (text) {
    const eol = text.includes("\r\n") ? "\r\n" : "\n";
    const lines = text.split(/\r?\n/);
    const m = TASK.exec(lines[task.line] || "");
    // The file changed since it was listed: nothing is written; the list
    // is drawn again from what is there now.
    if (!m || m[4].trim() !== task.text.trim()) return text;
    lines[task.line] = m[1] + (done ? "x" : " ") + m[3] + m[4];
    return lines.join(eol);
  });
}

// Textus AI's tools. Paths are the documents' paths in the folder, lines
// count from 1.

/* global folderPaths */
const NO_FOLDER = { error: "No folder is open." };
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;

async function listTasks(input) {
  const root = await textus.files.root();
  if (!root) return NO_FOLDER;
  const status = input.status || "open";
  const path = input.path ? folderPaths.clean(root, input.path, true) : null;
  const tag = input.tag ? String(input.tag).replace(/^#/, "") : null;
  const query = String(input.query || "").toLowerCase();
  const found = [];
  for (const doc of await textus.metadata.all())
    for (const task of doc.tasks) {
      if (status !== "all" && task.done !== (status === "done")) continue;
      if (path && doc.rel !== path) continue;
      if (tag && !(task.tags || []).some((name) => name.replace(/^#/, "") === tag)) continue;
      if (input.due_before && !(task.due && task.due <= input.due_before)) continue;
      if (query && !task.text.toLowerCase().includes(query)) continue;
      found.push({
        text: task.text.replace(DUE, "").trim(),
        done: task.done,
        due: task.due || null,
        path: doc.rel,
        line: task.line + 1,
      });
    }
  const limit = Math.max(1, Number(input.limit) || 100);
  return { tasks: found.slice(0, limit), total: found.length };
}

/** Where a new task goes in `lines`: after the last line of the section
 *  under `heading`, or of the document; -1 for a heading it hasn't. */
function placeFor(lines, heading) {
  let start = 0;
  let end = lines.length;
  if (heading) {
    const wanted = String(heading).replace(/^#+\s*/, "").trim().toLowerCase();
    const at = lines.findIndex((l) => {
      const m = HEADING.exec(l);
      return m && m[2].toLowerCase() === wanted;
    });
    if (at < 0) return -1;
    const level = HEADING.exec(lines[at])[1].length;
    start = at + 1;
    end = lines.findIndex((l, i) => i > at && HEADING.test(l) && HEADING.exec(l)[1].length <= level);
    if (end < 0) end = lines.length;
  }
  let last = end - 1;
  while (last >= start && !lines[last].trim()) last--;
  return Math.max(last + 1, start);
}

async function addTask(input) {
  const root = await textus.files.root();
  if (!root) return NO_FOLDER;
  const text = String(input.text || "").replace(/\s*\n\s*/g, " ").trim();
  if (!text) return { error: "The task has no text." };
  if (input.due && !DAY.test(input.due)) return { error: "due must be a date as YYYY-MM-DD." };
  const rel = folderPaths.clean(root, input.path, true);
  if (!rel) return { error: "path must be a document's path in the open folder." };
  const task = "- [ ] " + text + (input.due ? " 📅 " + input.due : "");
  const file = folderPaths.abs(root, rel);
  if (!(await textus.files.stat(file))) {
    const head = input.heading ? "## " + String(input.heading).replace(/^#+\s*/, "") + "\n\n" : "";
    if (rel.includes("/"))
      await textus.files.createFolder(folderPaths.abs(root, rel.slice(0, rel.lastIndexOf("/")))).catch(() => {});
    await textus.files.create(file, head + task + "\n");
    return { path: rel, line: head ? 3 : 1, task: task, created: true };
  }
  let line = 0;
  await textus.files.process(file, function (old) {
    const eol = old.includes("\r\n") ? "\r\n" : "\n";
    const lines = old.split(/\r?\n/);
    let at = placeFor(lines, input.heading);
    if (at < 0) {
      // A heading the document hasn't: added at its end, the task under it.
      at = placeFor(lines, null);
      lines.splice(at, 0, "", "## " + String(input.heading).replace(/^#+\s*/, ""), "");
      at += 3;
    }
    // After a paragraph or heading, a blank line first: a list of its own.
    if (at > 0 && lines[at - 1].trim() && !/^\s*(?:[-*+]|\d+[.)])\s/.test(lines[at - 1]))
      lines.splice(at++, 0, "");
    lines.splice(at, 0, task);
    line = at + 1;
    return lines.join(eol);
  });
  return { path: rel, line: line, task: task };
}

async function completeTask(input) {
  const root = await textus.files.root();
  if (!root) return NO_FOLDER;
  const rel = folderPaths.clean(root, input.path, true);
  const index = Number(input.line) - 1;
  if (!rel || !(index >= 0)) return { error: "Give the task's path and line, as list_tasks gives them." };
  const done = input.done !== false;
  let problem = null;
  let text = null;
  await textus.files.process(folderPaths.abs(root, rel), function (old) {
    const eol = old.includes("\r\n") ? "\r\n" : "\n";
    const lines = old.split(/\r?\n/);
    const m = TASK.exec(lines[index] || "");
    problem = !m
      ? "Line " + input.line + " of " + rel + " is not a task; list the tasks again."
      : input.text && !m[4].includes(String(input.text).trim())
        ? "Line " + input.line + " of " + rel + " is now another task: " + m[4]
        : null;
    if (problem) return old;
    text = m[4].replace(DUE, "").trim();
    lines[index] = m[1] + (done ? "x" : " ") + m[3] + m[4];
    return lines.join(eol);
  });
  return problem ? { error: problem } : { path: rel, line: index + 1, text: text, done: done };
}

let list = null;

exports.activate = function (ctx) {
  list = textus.views.registerList("catvinci.tasks.panel", {
    items: items,
    onCheck: function (item, checked) {
      return setDone(item.data, checked).finally(() => list.refresh());
    },
    filterPlaceholder: t("filter"),
    emptyText: t("none"),
  });
  const refresh = () => list.refresh();
  ctx.subscriptions.push(
    list,
    textus.metadata.onDidChange(refresh),
    textus.files.onDidChangeRoot(refresh),
    textus.settings.onDidChange(refresh),
    // Its count and dates in the interface's language.
    textus.env.onDidChangeLanguage(refresh),
    textus.ai.registerTool("list_tasks", listTasks),
    textus.ai.registerTool("add_task", addTask),
    textus.ai.registerTool("complete_task", completeTask),
  );
};
