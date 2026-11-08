// A task line as Obsidian's Tasks plugin reads and writes it: its status
// ([ ] [/] [x] [-]), the fields it keeps at the end of the line (📅 due,
// ⏳ scheduled, 🛫 start, ➕ created, ✅ done, ❌ cancelled, a priority,
// 🔁 a rule), a tick that writes the done date, and the next occurrence of
// a recurring task. Dates are YYYY-MM-DD strings throughout.
(function (root) {
  "use strict";

  const LINE = /^(\s*(?:[-*+]|\d+[.)])\s+\[)([^\]])(\]\s+)(.*)$/;
  // Unknown symbols count as to do, as in Obsidian Tasks.
  const STATUS = { " ": "todo", "/": "in_progress", x: "done", X: "done", "-": "cancelled" };
  const OPEN = { todo: true, in_progress: true };

  const D = "(\\d{4}-\\d{2}-\\d{2})";
  const dateField = (emoji) => new RegExp("\\s*(?:" + emoji + ")\\uFE0F? *" + D + "$", "u");
  // Read from the end of the line, as Obsidian Tasks reads them.
  const FIELDS = [
    ["priority", /\s*([🔺⏫🔼🔽⏬])️?$/u],
    ["start", dateField("🛫")],
    ["created", dateField("➕")],
    ["scheduled", dateField("⏳|⌛")],
    ["due", dateField("📅|📆|🗓")],
    ["done", dateField("✅")],
    ["cancelled", dateField("❌")],
    ["recurrence", /\s*🔁️? ?([a-zA-Z0-9, !]+)$/iu],
    ["onCompletion", /\s*🏁️? *([a-zA-Z]+)$/iu],
    ["dependsOn", /\s*⛔️? *([a-zA-Z0-9_-]+(?: *, *[a-zA-Z0-9_-]+)*)$/u],
    ["id", /\s*🆔️? *([a-zA-Z0-9_-]+)$/u],
  ];
  const EMOJI = { start: "🛫", created: "➕", scheduled: "⏳|⌛", due: "📅|📆|🗓", done: "✅", cancelled: "❌" };
  const TRAILING_TAG = /\s+(#[^\s#]+)$/u;
  const BLOCK_LINK = /(\s+\^[a-zA-Z0-9-]+)$/;
  // Textus's own plain due date, anywhere on the line.
  const PLAIN_DUE = /\s*\[?due::?\s*(\d{4}-\d{2}-\d{2})\]?/u;
  const PRIORITY = { "🔺": "highest", "⏫": "high", "🔼": "medium", "🔽": "low", "⏬": "lowest" };
  const TAG = /(?:^|\s)(#[^\s#,.;:!?"'()[\]{}]+)/gu;

  /** A task's text after its checkbox, read into its description and fields. */
  function fieldsOf(text) {
    const fields = {};
    const tags = [];
    let body = String(text);
    const link = BLOCK_LINK.exec(body);
    if (link) body = body.slice(0, link.index);
    for (let found = true, runs = 0; found && runs < 30; runs++) {
      found = false;
      for (const [name, re] of FIELDS) {
        const m = re.exec(body);
        if (!m) continue;
        fields[name] = m[1].trim();
        body = body.slice(0, m.index);
        found = true;
      }
      // A tag among the fields stays in the description.
      const tag = TRAILING_TAG.exec(body);
      if (tag) {
        tags.unshift(tag[1]);
        body = body.slice(0, tag.index);
        found = true;
      }
    }
    const plain = PLAIN_DUE.exec(body);
    if (plain) {
      if (!fields.due) fields.due = plain[1];
      body = body.replace(PLAIN_DUE, "");
    }
    const description = (body.trim() + (tags.length ? " " + tags.join(" ") : "")).trim();
    return { description: description, fields: fields };
  }

  /** A task line read whole; null for a line that isn't a task. */
  function parse(line) {
    const m = LINE.exec(String(line));
    if (!m) return null;
    const read = fieldsOf(m[4]);
    const status = STATUS[m[2]] || "todo";
    const f = read.fields;
    return {
      symbol: m[2],
      status: status,
      open: !!OPEN[status],
      text: m[4],
      description: read.description,
      due: f.due || null,
      scheduled: f.scheduled || null,
      start: f.start || null,
      created: f.created || null,
      done: f.done || null,
      cancelled: f.cancelled || null,
      priority: PRIORITY[f.priority] || null,
      recurrence: f.recurrence || null,
      tags: (read.description.match(TAG) || []).map((t) => t.trim()),
    };
  }

  // ------------------------------------------------------------ dates
  const toTime = (day) => Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10));
  const toDay = (time) => new Date(time).toISOString().slice(0, 10);
  const addDays = (day, n) => toDay(toTime(day) + n * 86400000);
  const between = (a, b) => Math.round((toTime(b) - toTime(a)) / 86400000);
  const weekday = (day) => new Date(toTime(day)).getUTCDay();
  const lastOfMonth = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  /** The day `n` months on, kept within its month (Jan 31 + 1 is Feb 28). */
  function addMonths(day, n, dayOfMonth) {
    const total = +day.slice(0, 4) * 12 + (+day.slice(5, 7) - 1) + n;
    const y = Math.floor(total / 12);
    const m = total % 12;
    const d = Math.min(dayOfMonth || +day.slice(8, 10), lastOfMonth(y, m));
    return toDay(Date.UTC(y, m, d));
  }

  // ------------------------------------------------------------ recurrence
  const DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  /** "monday, wednesday and friday" as weekday numbers; null if not days. */
  function daysOf(text) {
    const words = text.split(/\s*(?:,|\band\b)\s*/).filter(Boolean);
    const days = words.map((w) => DAYS[(/^(sun|mon|tue|wed|thu|fri|sat)[a-z]*$/.exec(w) || [])[1]]);
    return days.length && days.every((d) => d !== undefined) ? days : null;
  }

  /** The first day after `from`, `every` weeks apart, on one of `days`. */
  function nextOnDays(from, days, every) {
    for (let d = addDays(from, 1); weekday(d) !== 1; d = addDays(d, 1)) if (days.includes(weekday(d))) return d;
    const monday = addDays(from, ((8 - weekday(from)) % 7 || 7) + 7 * (every - 1));
    for (let i = 0; i < 7; i++) if (days.includes(weekday(addDays(monday, i)))) return addDays(monday, i);
    return null;
  }

  /** Day `at` (a number, or "last") of the first month after `from` that has it. */
  function nextInMonth(from, at, every) {
    const wanted = (day) => (at === "last" ? lastOfMonth(+day.slice(0, 4), +day.slice(5, 7) - 1) : at);
    for (let k = 0; k <= 48; k += every) {
      const first = addMonths(from.slice(0, 8) + "01", k);
      const d = wanted(first);
      if (d > lastOfMonth(+first.slice(0, 4), +first.slice(5, 7) - 1)) continue;
      const day = first.slice(0, 8) + String(d).padStart(2, "0");
      if (day > from) return day;
    }
    return null;
  }

  // The rules most vaults use, as Obsidian Tasks words them.
  const RULES = [
    [/^every (?:(\d+) )?days?$/, (m) => (d) => addDays(d, +(m[1] || 1))],
    [/^every (?:(\d+) )?weeks?$/, (m) => (d) => addDays(d, 7 * +(m[1] || 1))],
    [/^every (?:(\d+) )?months?$/, (m) => (d) => addMonths(d, +(m[1] || 1))],
    [/^every (?:(\d+) )?years?$/, (m) => (d) => addMonths(d, 12 * +(m[1] || 1))],
    [/^every weekday$/, () => (d) => nextOnDays(d, [1, 2, 3, 4, 5], 1)],
    [/^every weekend$/, () => (d) => nextOnDays(d, [6, 0], 1)],
    [/^every (?:(\d+) )?weeks? on (.+)$/, (m) => daysOf(m[2]) && ((d) => nextOnDays(d, daysOf(m[2]), +(m[1] || 1)))],
    [/^every (.+)$/, (m) => daysOf(m[1]) && ((d) => nextOnDays(d, daysOf(m[1]), 1))],
    [
      /^every (?:(\d+) )?months? on the (\d{1,2})(?:st|nd|rd|th)?$/,
      (m) => +m[2] >= 1 && +m[2] <= 31 && ((d) => nextInMonth(d, +m[2], +(m[1] || 1))),
    ],
    [/^every (?:(\d+) )?months? on the last(?: day)?$/, (m) => (d) => nextInMonth(d, "last", +(m[1] || 1))],
  ];

  /** A 🔁 rule read: { next(day), whenDone }; null for one not understood. */
  function rule(text) {
    const words = String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
    const whenDone = / when done$/.test(words);
    const core = words.replace(/ when done$/, "");
    for (const [re, make] of RULES) {
      const m = re.exec(core);
      const next = m && make(m);
      if (next) return { next: next, whenDone: whenDone };
    }
    return null;
  }

  /** The dates of a recurring task's next occurrence, moved together from
   *  its due (or scheduled, or start) date; {} when it has none; null when
   *  its rule isn't understood. */
  function nextDates(task, today) {
    const r = rule(task.recurrence);
    if (!r) return null;
    const base = task.due || task.scheduled || task.start;
    if (!base) return {};
    const next = r.next(r.whenDone ? today : base);
    if (!next) return null;
    const moved = {};
    for (const key of ["due", "scheduled", "start"])
      if (task[key]) moved[key] = addDays(next, between(base, task[key]));
    return moved;
  }

  // ------------------------------------------------------------ writing
  const fieldRe = (key, flags) => new RegExp("\\s*(?:" + EMOJI[key] + ")\\uFE0F? *\\d{4}-\\d{2}-\\d{2}", flags || "u");
  const without = (text, keys) => keys.reduce((t, key) => t.replace(fieldRe(key, "gu"), ""), text);
  /** `text` with `field` added at its end, before a block link. */
  function append(text, field) {
    const link = BLOCK_LINK.exec(text);
    return link ? text.slice(0, link.index) + " " + field + link[1] : text.replace(/\s+$/, "") + " " + field;
  }
  function moveDates(text, moved) {
    let out = text;
    for (const key of Object.keys(moved))
      out = out.replace(new RegExp("((?:" + EMOJI[key] + ")\\uFE0F? *)\\d{4}-\\d{2}-\\d{2}", "u"), "$1" + moved[key]);
    return out;
  }

  /**
   * A task line ticked (`done` true) or opened again, as Obsidian Tasks
   * does it: ticking writes ✅ today, and for a recurring task puts its next
   * occurrence on a line above; opening takes the done and cancelled dates
   * off. The lines to put in its place, or null for a line that isn't a task.
   */
  function setDone(line, done, today) {
    const m = LINE.exec(String(line));
    if (!m) return null;
    const task = parse(line);
    if (!done) {
      if (task.open) return { lines: [line], next: null };
      return { lines: [m[1] + " " + m[3] + without(m[4], ["done", "cancelled"])], next: null };
    }
    if (task.status === "done") return { lines: [line], next: null };
    const ticked = m[1] + "x" + m[3] + append(without(m[4], ["done", "cancelled"]), "✅ " + today);
    const moved = task.open && task.recurrence ? nextDates(task, today) : null;
    if (!moved) return { lines: [ticked], next: null };
    const body = moveDates(without(m[4], ["done", "cancelled", "created"]), moved).replace(BLOCK_LINK, "");
    const next = m[1] + " " + m[3] + body;
    return { lines: [next, ticked], next: next };
  }

  // ------------------------------------------------------------ query dates
  /** A date or span a query names: { from, to } as days; null if none. */
  function span(text, today) {
    const words = String(text).trim().toLowerCase();
    if (/^\d{4}-\d{2}-\d{2}$/.test(words)) return { from: words, to: words };
    const single = { today: 0, tomorrow: 1, yesterday: -1 }[words];
    if (single !== undefined) return { from: addDays(today, single), to: addDays(today, single) };
    const m = /^(last|this|next) (week|month|year)$/.exec(words);
    if (!m) return null;
    const step = { last: -1, this: 0, next: 1 }[m[1]];
    if (m[2] === "week") {
      const monday = addDays(today, -((weekday(today) + 6) % 7) + 7 * step);
      return { from: monday, to: addDays(monday, 6) };
    }
    if (m[2] === "month") {
      const first = addMonths(today.slice(0, 8) + "01", step);
      return { from: first, to: addDays(addMonths(first, 1), -1) };
    }
    const year = String(+today.slice(0, 4) + step);
    return { from: year + "-01-01", to: year + "-12-31" };
  }

  root.obsidianTasks = {
    LINE: LINE,
    parse: parse,
    setDone: setDone,
    rule: rule,
    nextDates: nextDates,
    span: span,
    addDays: addDays,
  };
})(typeof window !== "undefined" ? window : globalThis);
