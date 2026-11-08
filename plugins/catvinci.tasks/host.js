// Tasks: every Markdown task in the open folder's documents - "- [ ] …",
// "- [x] …" and Obsidian Tasks' "[/]" and "[-]" - in a list in the sidebar
// that Textus draws (views.registerList): the ones due soon first, then by
// document, each under the heading it sits beneath; and ```tasks blocks,
// Obsidian Tasks' queries, drawn as a list (block.html). What Textus knows
// of the folder (textus.metadata) says where they are; ticking one changes
// that line of its file - in its tab if it is open - after checking the
// line still says what was listed, the way Obsidian Tasks writes it
// (obsidian-tasks.js): a done date, and a recurring task's next one.

/* global obsidianTasks, tasksQuery, folderPaths */
/** How far ahead "Due soon" looks. */
const SOON_DAYS = 7;
// A Kanban board's cards are tasks in Markdown but live on the board.
const isBoard = (doc) =>
  /\.kanban\.md$/i.test(doc.path) || !!(doc.frontmatter && "kanban-plugin" in doc.frontmatter);

const t = (key, ...args) => textus.l10n.t(key, ...args);

/** The local date `offset` days from today, as YYYY-MM-DD. */
function day(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return textus.dates.format(d);
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
  for (const h of headings || []) {
    if (h.line > line) break;
    found = h.text;
  }
  return found;
}

// Textus's index says only whether a task's box is empty; what is in a
// ticked one ([x], [-], [/]) is read from its file, again only once the
// file has changed.
const symbols = new Map();
async function symbolsOf(doc) {
  if (!doc.tasks.some((task) => task.done)) return {};
  // The tasks as indexed, ticks included: a tick changes it even within one modified time.
  const key = doc.modifiedMs + "\n" + doc.tasks.map((task) => (task.done ? "x" : " ") + task.line + task.text).join("\n");
  const known = symbols.get(doc.path);
  if (known && known.key === key) return known.byLine;
  let rows = [];
  try {
    rows = textLines.split(await textus.files.readText(doc.path));
  } catch {
    // Gone since it was indexed: its tasks read as ticked.
  }
  const byLine = {};
  for (const task of doc.tasks) {
    const m = obsidianTasks.LINE.exec(rows[task.line] ? rows[task.line].text : "");
    if (m) byLine[task.line] = m[2];
  }
  symbols.set(doc.path, { key: key, byLine: byLine });
  return byLine;
}

/** Every task in the folder, read as Obsidian Tasks reads it, with its
 *  document; a board's cards only when `boards`. */
async function collect(boards) {
  const found = [];
  for (const doc of await textus.metadata.all()) {
    if (!boards && isBoard(doc)) continue;
    const byLine = await symbolsOf(doc);
    for (const meta of doc.tasks) {
      const symbol = byLine[meta.line] || (meta.done ? "x" : " ");
      const task = obsidianTasks.parse("- [" + symbol + "] " + meta.text);
      if (!task) continue;
      if (!task.due && meta.due) task.due = meta.due;
      found.push(
        Object.assign(task, {
          path: doc.path,
          rel: doc.rel,
          line: meta.line,
          heading: headingAt(doc.headings, meta.line),
        }),
      );
    }
  }
  return found;
}

/** A task's due date as a badge's tone. */
function dueTone(task) {
  if (!task.open) return "muted";
  if (task.due < day(0)) return "danger";
  return task.due <= day(SOON_DAYS) ? "warning" : "muted";
}

/** A task as the list shows it. */
function itemOf(task, group) {
  const where = { path: task.path, line: task.line, text: task.text };
  return {
    // Listed twice - due soon, and in its document - under two ids.
    id: group + ":" + task.path + ":" + task.line,
    label: task.description,
    description: task.heading || undefined,
    detail: group === "soon" ? task.rel : undefined,
    group: group === "soon" ? t("dueSoon") : task.rel,
    checkbox: !task.open,
    badge: task.due ? { text: task.due, tone: dueTone(task) } : undefined,
    location: where,
    data: where,
  };
}

async function items() {
  if (!(await textus.files.root())) {
    list.setMessage(t("nofolder"));
    return [];
  }
  const showDone = await textus.settings.get("showDone");
  const soonUntil = day(SOON_DAYS);
  const soon = [];
  const rest = [];
  let open = 0;
  for (const task of await collect(false)) {
    if (task.open) open++;
    else if (!showDone) continue;
    if (task.open && task.due && task.due <= soonUntil) soon.push(itemOf(task, "soon"));
    rest.push(itemOf(task, "doc"));
  }
  soon.sort((a, b) => (a.badge.text < b.badge.text ? -1 : 1));
  list.setMessage(count("open", open));
  return soon.concat(rest);
}

/** Ticks or opens again the task on `line` of `path` (lines from 0), if
 *  it still says `text`: the problem when it doesn't, or what was done. */
async function setDone(task, done) {
  let result = { problem: "gone" };
  await textus.files.process(task.path, function (text) {
    const rows = textLines.split(text);
    const row = rows[task.line];
    const m = obsidianTasks.LINE.exec(row ? row.text : "");
    // The file changed since it was listed: nothing is written; the list
    // is drawn again from what is there now.
    if (!m) return text;
    if (task.text !== undefined && !m[4].includes(String(task.text).trim())) {
      result = { problem: "changed", now: m[4] };
      return text;
    }
    const changed = obsidianTasks.setDone(row.text, done, day(0));
    row.text = changed.lines[changed.lines.length - 1];
    textLines.insert(rows, task.line, changed.lines.slice(0, -1));
    result = { next: changed.next, line: task.line + changed.lines.length - 1, text: m[4] };
    return textLines.join(rows);
  });
  return result;
}

// ```tasks blocks: the query run on every task in the folder, its result
// sent to the block's page; a box ticked there ticks the task in its file.

const PRIORITY_MARK = { highest: "🔺", high: "⏫", medium: "🔼", low: "🔽", lowest: "⏬" };
const DATE_KEYS = ["due", "scheduled", "start", "done", "created"];

/** A group's name as the block shows it. */
function groupName(key, name) {
  if (key === "status") return t("status." + name);
  if (key === "priority") return name ? PRIORITY_MARK[name] : t("query.noPriority");
  if (name) return name;
  return t(DATE_KEYS.includes(key) ? "query.noDate" : "query.noHeading");
}

/** What a block's page draws for `source`. */
async function queryResult(source) {
  if (!(await textus.files.root())) return { message: t("nofolder") };
  const today = day(0);
  const query = tasksQuery.parse(source, today);
  const result = tasksQuery.run(query, await collect(true));
  const shown = result.groups.reduce((n, g) => n + g.tasks.length, 0);
  return {
    count: count("query.count", result.total) + (shown < result.total ? " · " + t("query.shown", shown) : ""),
    unsupported: query.unsupported.length ? t("query.unsupported", query.unsupported.join(" · ")) : "",
    empty: t("query.none"),
    groups: result.groups.map((g) => ({
      names: g.names.map((name, i) => groupName(query.groups[i].key, name)),
      tasks: g.tasks.map((task) => ({
        path: task.path,
        rel: task.rel,
        file: task.rel.split("/").pop().replace(/\.md$/i, ""),
        line: task.line,
        text: task.text,
        description: task.description,
        status: task.status,
        open: task.open,
        priority: PRIORITY_MARK[task.priority] || "",
        recurring: !!task.recurrence,
        due: task.due,
        tone: task.due ? dueTone(task) : null,
      })),
    })),
  };
}

const queryPages = new Set();
function renderQuery(ctx) {
  return async function (block, webview) {
    webview.html = await ctx.plugin.readText("block.html");
    let sent = 0;
    const send = async function () {
      const mine = ++sent;
      const result = await queryResult(block.source);
      // A slower answer for older text: the newer one is on its way.
      if (mine === sent) webview.postMessage({ type: "result", result: result });
    };
    queryPages.add(send);
    webview.onDidDispose(() => queryPages.delete(send));
    block.onDidChange(send);
    webview.onDidReceiveMessage(async function (m) {
      if (!m) return;
      if (m.type === "ready") await send();
      if (m.type === "open") textus.layout.open({ path: m.path, line: m.line });
      if (m.type === "check") {
        await setDone({ path: m.path, line: m.line, text: m.text }, m.done);
        await send();
      }
    });
  };
}

// Textus AI's tools. Paths are the documents' paths in the folder, lines
// count from 1.

const NO_FOLDER = { error: "No folder is open." };
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
// What a tool gives of a task beyond its text: only the fields it has.
const EXTRA = ["scheduled", "start", "priority", "recurrence"];

async function listTasks(input) {
  const root = await textus.files.root();
  if (!root) return NO_FOLDER;
  const status = input.status || "open";
  const path = input.path ? folderPaths.clean(root, input.path, true) : null;
  const tag = input.tag ? String(input.tag).replace(/^#/, "").toLowerCase() : null;
  const query = String(input.query || "").toLowerCase();
  const found = [];
  for (const task of await collect(false)) {
    if (status !== "all" && task.open === (status === "done")) continue;
    if (path && task.rel !== path) continue;
    if (tag && !task.tags.some((name) => name.replace(/^#/, "").toLowerCase() === tag)) continue;
    if (input.due_before && !(task.due && task.due <= input.due_before)) continue;
    if (query && !task.text.toLowerCase().includes(query)) continue;
    const item = {
      text: task.description,
      done: !task.open,
      status: task.status,
      due: task.due || null,
      path: task.rel,
      line: task.line + 1,
    };
    for (const key of EXTRA) if (task[key]) item[key] = task[key];
    found.push(item);
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
    const rows = textLines.split(old);
    const lines = rows.map((r) => r.text);
    let at = placeFor(lines, input.heading);
    const added = [];
    if (at < 0) {
      // A heading the document hasn't: added at its end, the task under it.
      at = placeFor(lines, null);
      added.push("", "## " + String(input.heading).replace(/^#+\s*/, ""), "");
    }
    // After a paragraph or heading, a blank line first: a list of its own.
    const before = added.length ? added[added.length - 1] : at > 0 ? lines[at - 1] : "";
    if (before.trim() && !/^\s*(?:[-*+]|\d+[.)])\s/.test(before)) added.push("");
    added.push(task);
    textLines.insert(rows, at, added);
    line = at + added.length;
    return textLines.join(rows);
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
  const result = await setDone({ path: folderPaths.abs(root, rel), line: index, text: input.text }, done);
  if (result.problem === "gone") return { error: "Line " + input.line + " of " + rel + " is not a task; list the tasks again." };
  if (result.problem) return { error: "Line " + input.line + " of " + rel + " is now another task: " + result.now };
  const out = {
    path: rel,
    line: result.line + 1,
    text: obsidianTasks.parse("- [ ] " + result.text).description,
    done: done,
  };
  // A recurring task's next one went in above it.
  if (result.next) out.next = { line: index + 1, text: result.next };
  return out;
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
  const refresh = () => {
    list.refresh();
    for (const send of queryPages) send();
  };
  ctx.subscriptions.push(
    list,
    textus.views.registerCodeBlock("tasks", { render: renderQuery(ctx) }),
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
