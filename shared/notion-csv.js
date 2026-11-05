// Notion's export, as plain data: a database is a CSV beside a folder of
// its pages, each name ending in a 32-character id; a page's properties are
// `Key: value` lines under its title. Shared by Database and Notion Import:
// each lists this as lib/notion-csv.js in libs.json and runs it before its
// own scripts.

(function (root) {
  /** RFC 4180 CSV as rows of cells; a leading BOM goes. */
  function parseCsv(source) {
    const s = String(source).replace(/^﻿/, "");
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (quoted) {
        if (c === '"' && s[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && s[i + 1] === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else cell += c;
    }
    if (cell !== "" || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter((r) => r.some((c) => c !== ""));
  }

  /** A Notion name without its id: "Week1 1a2b…(32 hex)" is "Week1". */
  const withoutId = (name) => String(name).replace(/\s+[0-9a-f]{32}$/i, "").trim();

  /** The page id a name, path or notion.so address ends in; null for none. */
  function idOf(text) {
    const m = /([0-9a-f]{32})(?:\.\w+)?(?:[?#].*)?$/i.exec(String(text));
    return m ? m[1].toLowerCase() : null;
  }

  const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const pad = (n) => String(n).padStart(2, "0");
  const day = (y, m, d) => (m >= 1 && m <= 12 && d >= 1 && d <= 31 ? y + "-" + pad(m) + "-" + pad(d) : null);
  /** A month's number from its English name or its first three or four
   *  letters ("Sept"); 0 for anything else. */
  function month(name) {
    const n = name.toLowerCase();
    return MONTHS.findIndex((m) => m === n || (n.length >= 3 && n.length <= 4 && m.startsWith(n))) + 1;
  }

  /** A date as Notion writes it in its export - "January 4, 2026",
   *  "4 January 2026", "2026/01/04", "2026-01-04", "2026年1月4日",
   *  "2026년 1월 4일", a time after it or not - as 2026-01-04; null for
   *  anything else. */
  function dateOf(text) {
    const v = String(text).trim();
    let m = /^([A-Za-z]{3,9})\.? (\d{1,2}), (\d{4})\b/.exec(v);
    if (m && month(m[1])) return day(m[3], month(m[1]), Number(m[2]));
    m = /^(\d{1,2}) ([A-Za-z]{3,9})\.? (\d{4})\b/.exec(v);
    if (m && month(m[2])) return day(m[3], month(m[2]), Number(m[1]));
    m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?![\d])/.exec(v);
    if (m) return day(m[1], Number(m[2]), Number(m[3]));
    m = /^(\d{4})\s*[年년]\s*(\d{1,2})\s*[月월]\s*(\d{1,2})\s*[日일]/.exec(v);
    if (m) return day(m[1], Number(m[2]), Number(m[3]));
    return null;
  }

  /** A date range's two ends ("January 4, 2026 → January 6, 2026"); null
   *  when `text` isn't one. */
  function rangeOf(text) {
    const parts = String(text).split(/\s+(?:→|->|–)\s+/);
    if (parts.length !== 2) return null;
    const start = dateOf(parts[0]);
    const end = dateOf(parts[1]);
    return start && end ? { start, end } : null;
  }

  /** A relation cell's pages: "Alpha (Projects/Alpha 1a2b….md), Beta (…)"
   *  or with notion.so addresses, as `{ title, target }` each; null when
   *  the cell is something else. */
  function relationItems(cell) {
    const v = String(cell).trim();
    if (!v) return null;
    const items = [];
    const item = /\s*(?:,\s*)?([^()]*?)\s*\(([^()\s]*(?:\.md|[0-9a-f]{32})(?:[?#][^()\s]*)?)\)/giy;
    let m;
    let end = 0;
    while ((m = item.exec(v))) {
      items.push({ title: m[1], target: m[2] });
      end = item.lastIndex;
    }
    return items.length && end === v.length ? items : null;
  }

  /** A Notion cell as a front matter value: its dates as 2026-01-04 (a
   *  range's first day), Yes/No as true/false, numbers as numbers, and a
   *  multi-select's "a, b" as a list when the column holds lists. */
  function cellValue(cell, asList) {
    const v = String(cell).trim();
    if (v === "") return null;
    const date = dateOf(v);
    if (date) return date;
    if (v === "Yes" || v === "No") return v === "Yes";
    if (asList) return v.split(",").map((s) => s.trim()).filter(Boolean);
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    return v;
  }

  /** A Notion CSV as documents: `{ name, props }` each, the first column
   *  the name. A column whose cells hold commas in most rows is a list; one
   *  whose cells all name pages is a relation, each page given as
   *  `options.relation(item)` makes it (its title by default); a date
   *  range's end is in `<key>_end`. */
  function fromNotionCsv(source, options) {
    const relation = (options && options.relation) || ((item) => item.title);
    const [head, ...body] = parseCsv(source);
    if (!head) return [];
    const keys = head.map((h) => h.trim());
    const filled = keys.map((_, i) => body.map((r) => (r[i] || "").trim()).filter(Boolean));
    const related = filled.map((cells) => cells.length > 0 && cells.every((v) => relationItems(v)));
    const listy = filled.map((cells) => {
      const commas = cells.filter((v) => v.includes(", ") && !dateOf(v) && !rangeOf(v));
      return cells.length > 0 && commas.length * 2 >= cells.length;
    });
    return body.map((cells) => {
      const props = {};
      keys.forEach((key, i) => {
        if (i === 0) return;
        const cell = cells[i] || "";
        const name = propertyName(key);
        if (related[i]) {
          const items = relationItems(cell);
          if (items) props[name] = items.map(relation);
          return;
        }
        const range = rangeOf(cell);
        if (range) {
          props[name] = range.start;
          props[name + "_end"] = range.end;
          return;
        }
        const value = cellValue(cell, listy[i]);
        if (value !== null) props[name] = value;
      });
      return { name: withoutId(cells[0] || "Untitled"), props };
    });
  }

  /** A Notion column's name as a front matter key: "Start Day" is
   *  "start_day". */
  function propertyName(name) {
    return (
      String(name)
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "_")
        .replace(/^_+|_+$/g, "") || "property"
    );
  }

  /** A Notion page's parts: its title, the `Key: value` lines under it (as
   *  `[key, value]` pairs, in order) and the rest. */
  function pageParts(text) {
    const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
    let i = 0;
    while (i < lines.length && lines[i].trim() === "") i++;
    const heading = /^# (.*)$/.exec(lines[i] || "");
    const title = heading ? heading[1].trim() : null;
    if (heading) i++;
    let j = i;
    while (j < lines.length && lines[j].trim() === "") j++;
    const props = [];
    let k = j;
    for (; k < lines.length; k++) {
      const m = /^([^:\n#>|*`[\]-][^:\n]{0,59}): (.+)$/.exec(lines[k]);
      if (!m) break;
      props.push([m[1].trim(), m[2].trim()]);
    }
    // Property lines are a block of their own; a paragraph that starts
    // "Note: …" and goes on is body text.
    const block = props.length && (k === lines.length || lines[k].trim() === "");
    const from = heading && block ? k : heading ? i : 0;
    return {
      title,
      props: heading && block ? props : [],
      body: lines.slice(from).join("\n").trim(),
    };
  }

  /** A Notion page's text without its title and the property lines under it,
   *  which are in the front matter now. */
  const notionBody = (text) => pageParts(text).body;

  root.notionCsv = {
    parseCsv,
    withoutId,
    idOf,
    dateOf,
    rangeOf,
    relationItems,
    cellValue,
    fromNotionCsv,
    propertyName,
    pageParts,
    notionBody,
  };
})(typeof window !== "undefined" ? window : globalThis);
