// A ```tasks block's query, in the words of Obsidian's Tasks plugin, one
// rule a line: the common ones read (done, dates, path, tags, priority,
// sort, group, limit), the display ones (hide, show) passed over, and the
// rest given back so the block can say what it left out. The tasks it runs
// on are obsidianTasks.parse's, with the document's rel path, line and heading.
/* global obsidianTasks */
(function (root) {
  "use strict";

  const RANK = { highest: 0, high: 1, medium: 2, null: 3, low: 4, lowest: 5 };
  // Status groups in Obsidian Tasks' order, not by name.
  const STATUS_RANK = { todo: 0, in_progress: 1, done: 2, cancelled: 3 };
  const PRIORITY_WORD = { highest: "highest", high: "high", medium: "medium", none: "null", normal: "null", low: "low", lowest: "lowest" };
  const DATE_FIELD = { due: ["due"], scheduled: ["scheduled"], start: ["start"], starts: ["start"], done: ["done"], created: ["created"], cancelled: ["cancelled"], happens: ["due", "scheduled", "start"] };
  const DATES = "(due|scheduled|starts?|done|created|cancelled|happens)";
  const fileName = (rel) => rel.split("/").pop().replace(/\.md$/i, "");
  const folderOf = (rel) => (rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/") + 1) : "/");
  const lower = (s) => String(s || "").toLowerCase();
  const TEXT = {
    path: (t) => t.rel.replace(/\.md$/i, ""),
    filename: (t) => fileName(t.rel),
    folder: (t) => folderOf(t.rel),
    description: (t) => t.description,
    heading: (t) => t.heading || "",
  };

  /** The days of `fields` a task has. */
  const datesOf = (task, fields) => fields.map((f) => task[f]).filter(Boolean);

  // A rule of the query: [pattern, (match, today) => filter or null].
  const FILTERS = [
    [/^not done$/, () => (t) => t.open],
    [/^done$/, () => (t) => !t.open],
    [
      new RegExp("^" + DATES + " (on or before|on or after|before|after|on|in) (.+)$"),
      (m, today) => {
        const at = obsidianTasks.span(m[3], today);
        if (!at) return null;
        const test = {
          before: (d) => d < at.from,
          after: (d) => d > at.to,
          on: (d) => d >= at.from && d <= at.to,
          in: (d) => d >= at.from && d <= at.to,
          "on or before": (d) => d <= at.to,
          "on or after": (d) => d >= at.from,
        }[m[2]];
        return (t) => datesOf(t, DATE_FIELD[m[1]]).some(test);
      },
    ],
    [
      new RegExp("^" + DATES + " (.+)$"),
      (m, today) => {
        const at = obsidianTasks.span(m[2], today);
        return at && ((t) => datesOf(t, DATE_FIELD[m[1]]).some((d) => d >= at.from && d <= at.to));
      },
    ],
    [new RegExp("^no " + DATES + " date$"), (m) => (t) => !datesOf(t, DATE_FIELD[m[1]]).length],
    [new RegExp("^has " + DATES + " date$"), (m) => (t) => datesOf(t, DATE_FIELD[m[1]]).length > 0],
    [
      /^(path|filename|folder|description|heading) (includes|does not include) (.+)$/,
      (m) => {
        const words = lower(m[3]);
        const has = (t) => lower(TEXT[m[1]](t)).includes(words);
        return m[2] === "includes" ? has : (t) => !has(t);
      },
    ],
    [
      /^tags? (includes?|does not include|do not include) (.+)$/,
      (m) => {
        const words = lower(m[2]);
        const has = (t) => t.tags.some((tag) => lower(tag).includes(words));
        return /not/.test(m[1]) ? (t) => !has(t) : has;
      },
    ],
    [/^(no|has) tags$/, (m) => (t) => (t.tags.length > 0) === (m[1] === "has")],
    [/^is (not )?recurring$/, (m) => (t) => !!t.recurrence !== !!m[1]],
    [
      /^priority is (above |below |not )?(highest|high|medium|none|normal|low|lowest)$/,
      (m) => {
        const want = RANK[PRIORITY_WORD[m[2]]];
        const rank = (t) => RANK[t.priority];
        const by = { "above ": (r) => r < want, "below ": (r) => r > want, "not ": (r) => r !== want };
        const test = by[m[1] || ""] || ((r) => r === want);
        return (t) => test(rank(t));
      },
    ],
    [
      /^status\.type is (not )?(todo|in_progress|done|cancelled)$/,
      (m) => (t) => (t.status === m[2]) !== !!m[1],
    ],
  ];

  /** The sort and group keys: a value to order by, and a group's name. */
  const KEYS = {
    status: { order: (t) => (t.open ? 0 : 1), name: (t) => t.status, rank: (x) => STATUS_RANK[x] },
    due: { order: (t) => t.due || "~", name: (t) => t.due || "" },
    scheduled: { order: (t) => t.scheduled || "~", name: (t) => t.scheduled || "" },
    start: { order: (t) => t.start || "~", name: (t) => t.start || "" },
    done: { order: (t) => t.done || "~", name: (t) => t.done || "" },
    created: { order: (t) => t.created || "~", name: (t) => t.created || "" },
    priority: { order: (t) => RANK[t.priority], name: (t) => t.priority || "", rank: (x) => RANK[x] },
    path: { order: (t) => lower(t.rel), name: TEXT.path },
    filename: { order: (t) => lower(fileName(t.rel)), name: TEXT.filename },
    folder: { order: (t) => lower(folderOf(t.rel)), name: TEXT.folder },
    heading: { order: (t) => lower(t.heading), name: TEXT.heading },
    description: { order: (t) => lower(t.description), name: TEXT.description },
  };
  const ALIAS = { starts: "start" };
  const keyOf = (word) => KEYS[ALIAS[word] || word] && (ALIAS[word] || word);
  // Obsidian Tasks' order when the query names none, after its own.
  const DEFAULT_SORT = ["status", "due", "priority", "path"].map((key) => ({ key: key, reverse: false }));
  // Lines about how the list looks, not which tasks: passed over.
  const IGNORED = /^(?:#|(?:hide|show) |(?:short|full) mode$|explain$|ignore global query$)/;

  /** `source` read: its filters, sorts, groups, limit and the lines it
   *  doesn't understand. */
  function parse(source, today) {
    const query = { filters: [], sorts: [], groups: [], limit: null, unsupported: [] };
    for (const raw of String(source).split(/\r?\n/)) {
      const line = raw.trim();
      const words = line.toLowerCase().replace(/\s+/g, " ");
      if (!words || IGNORED.test(words)) continue;
      let m = /^limit (?:to )?(\d+)(?: tasks?)?$/.exec(words);
      if (m) {
        query.limit = +m[1];
        continue;
      }
      m = /^sort by ([a-z]+)( reverse)?$/.exec(words);
      if (m && keyOf(m[1])) {
        query.sorts.push({ key: keyOf(m[1]), reverse: !!m[2] });
        continue;
      }
      m = /^group by ([a-z]+)( reverse)?$/.exec(words);
      if (m && keyOf(m[1])) {
        query.groups.push({ key: keyOf(m[1]), reverse: !!m[2] });
        continue;
      }
      let filter = null;
      for (const [re, make] of FILTERS) {
        const found = re.exec(words);
        if (found && (filter = make(found, today))) break;
      }
      if (filter) query.filters.push(filter);
      else query.unsupported.push(line);
    }
    return query;
  }

  function compare(sorts) {
    return (a, b) => {
      for (const s of sorts) {
        const x = KEYS[s.key].order(a);
        const y = KEYS[s.key].order(b);
        if (x !== y) return (x < y ? -1 : 1) * (s.reverse ? -1 : 1);
      }
      return a.rel === b.rel ? a.line - b.line : a.rel < b.rel ? -1 : 1;
    };
  }

  /** The tasks `query` picks, sorted, limited and grouped: { groups: [{
   *  names, tasks }], total }. A group's names are one per `group by`, ""
   *  for a task without that value; with no grouping, one group of none. */
  function run(query, tasks) {
    const found = tasks.filter((t) => query.filters.every((f) => f(t)));
    found.sort(compare(query.sorts.concat(DEFAULT_SORT)));
    const shown = query.limit === null ? found : found.slice(0, query.limit);
    const groups = new Map();
    for (const task of shown) {
      const names = query.groups.map((g) => KEYS[g.key].name(task));
      const id = JSON.stringify(names);
      if (!groups.has(id)) groups.set(id, { names: names, tasks: [] });
      groups.get(id).tasks.push(task);
    }
    // Groups in order of their names; a group without a value last.
    const ordered = Array.from(groups.values()).sort((a, b) => {
      for (let i = 0; i < query.groups.length; i++) {
        const x = a.names[i];
        const y = b.names[i];
        if (x === y) continue;
        if (!x || !y) return x ? -1 : 1;
        const rank = KEYS[query.groups[i].key].rank || ((v) => v);
        const ox = rank(x);
        const oy = rank(y);
        return (ox < oy ? -1 : 1) * (query.groups[i].reverse ? -1 : 1);
      }
      return 0;
    });
    return { groups: ordered, total: found.length };
  }

  root.tasksQuery = { parse: parse, run: run };
})(typeof window !== "undefined" ? window : globalThis);
