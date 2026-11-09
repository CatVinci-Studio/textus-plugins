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

  /** `lines`, a list (as a block holds it), with each level's finished
   *  tasks after its open ones. */
  function orderList(lines) {
    if (!lines.length || !ITEM.test(lines[0])) return lines;
    const base = indentOf(lines[0]);
    const items = [];
    for (const line of lines) {
      const starts = ITEM.test(line) && indentOf(line) <= base;
      if (starts || !items.length) items.push([line]);
      else items[items.length - 1].push(line);
    }
    // What is under each item, in order too.
    const ordered = items.map((item) => {
      const under = item.slice(1);
      const from = under.findIndex((l) => ITEM.test(l));
      if (from < 0) return item;
      return [item[0], ...under.slice(0, from), ...orderList(under.slice(from))];
    });
    if (!BULLET.test(lines[0])) return ordered.flat();
    const open = ordered.filter((item) => !finished(item[0]));
    const done = ordered.filter((item) => finished(item[0]));
    return open.concat(done).flat();
  }

  /** `text`'s list around line `at` (from 0) put in order: the new text,
   *  or null when nothing moves. */
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
    const list = lines.slice(from, to);
    const ordered = orderList(list);
    if (ordered.every((l, i) => l === list[i])) return null;
    return lines.slice(0, from).concat(ordered, lines.slice(to)).join("\n");
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
