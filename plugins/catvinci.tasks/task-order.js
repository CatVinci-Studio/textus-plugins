// Finished tasks after the open ones: a list's items put in order, each
// with what is indented under it, open ones first and each keeping its
// place among its own kind. A numbered list keeps its order (its numbers
// would be wrong). Runs after obsidian-tasks.js.
(function (root) {
  "use strict";

  const ITEM = /^(\s*)(?:[-*+]|\d+[.)])\s/;
  const BULLET = /^\s*[-*+]\s/;
  const indentOf = (line) => /^\s*/.exec(line)[0].replace(/\t/g, "    ").length;
  const finished = (line) => {
    const task = root.obsidianTasks.parse(line);
    return !!task && !task.open;
  };

  /** `rows` ({ text }), a list's lines, with each level's finished tasks
   *  after their open ones; the same row objects, moved. */
  function orderRows(rows) {
    if (!rows.length || !ITEM.test(rows[0].text)) return rows;
    const base = indentOf(rows[0].text);
    const items = [];
    for (const row of rows) {
      const starts = ITEM.test(row.text) && indentOf(row.text) <= base;
      if (starts || !items.length) items.push([row]);
      else items[items.length - 1].push(row);
    }
    // What is under each item, in order too.
    const ordered = items.map((item) => {
      const under = item.slice(1);
      const from = under.findIndex((r) => ITEM.test(r.text));
      if (from < 0) return item;
      return [item[0], ...under.slice(0, from), ...orderRows(under.slice(from))];
    });
    if (!BULLET.test(rows[0].text)) return ordered.flat();
    const open = ordered.filter((item) => !finished(item[0].text));
    const done = ordered.filter((item) => finished(item[0].text));
    return open.concat(done).flat();
  }

  /** `lines`, a list (as a block holds it), put in order. */
  const orderList = (lines) => orderRows(lines.map((text) => ({ text }))).map((r) => r.text);

  /** `text`'s list around line `at` (from 0) put in order: { text, place }
   *  where place(i) is the line i (from 0) moved to; null when nothing moves. */
  function orderAround(text, at) {
    const lines = text.split("\n");
    if (!lines[at] || !ITEM.test(lines[at])) return null;
    const inList = (l) => l.trim() !== "" && (ITEM.test(l) || /^\s/.test(l));
    let from = at;
    while (from > 0 && inList(lines[from - 1])) from--;
    // The list starts at its first item at the left.
    while (from < at && !ITEM.test(lines[from])) from++;
    let to = at + 1;
    while (to < lines.length && inList(lines[to])) to++;
    const rows = lines.slice(from, to).map((line, i) => ({ text: line, was: from + i }));
    const ordered = orderRows(rows);
    if (ordered.every((r, i) => r === rows[i])) return null;
    const moved = new Map(ordered.map((r, i) => [r.was, from + i]));
    return {
      text: lines.slice(0, from).concat(ordered.map((r) => r.text), lines.slice(to)).join("\n"),
      place: (i) => (moved.has(i) ? moved.get(i) : i),
    };
  }

  /** A list block's Markdown with only its boxes' marks and done dates
   *  taken out: two that read alike differ by a tick. */
  function unticked(markdown) {
    return markdown
      .split("\n")
      .map((l) => l.replace(/^(\s*(?:[-*+]|\d+[.)])\s+\[)[^\]](\])/, "$1 $2").replace(/\s*[✅❌] \d{4}-\d{2}-\d{2}/g, ""))
      .join("\n");
  }

  root.taskOrder = { orderList, orderAround, unticked };
})(typeof window !== "undefined" ? window : globalThis);
