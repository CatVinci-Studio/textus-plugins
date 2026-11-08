// Database: the documents of a folder as rows, their front matter as
// properties. What a ```database block asks for and the rows it gets. Pure
// functions, shared by the host and the tests; paths are `/`-separated and
// relative to the open folder.

(function (root) {
  const VIEWS = ["table", "board", "calendar", "gallery"];
  /** A property's kinds, as Notion has them; "tags" is a multi-select. */
  const TYPES = ["text", "number", "select", "tags", "date", "checkbox", "url"];
  const DATE = /^\d{4}-\d{2}-\d{2}/;

  /** A block's lines, `key: value` each: from, view, columns, sort, group,
   *  date and end (a calendar's), types (a property's kind, when it isn't
   *  the one its values suggest) and any number of filter lines. */
  function parseSpec(source) {
    const spec = { from: null, view: "table", columns: null, sort: [], filters: [], group: null, date: null, end: null, types: {}, table: [], folders: null };
    const all = String(source).split("\n");
    for (let i = 0; i < all.length; i++) {
      const raw = all[i];
      // "rows:" and the Markdown table under it: the rows with no page of their own.
      if (raw.trim() === "rows:") {
        spec.table = parseTable(all.slice(i + 1));
        break;
      }
      const line = raw.replace(/\s+#.*$/, "").trim();
      const m = /^([A-Za-z]+)\s*:\s*(.*)$/.exec(line);
      if (!m) continue;
      const key = m[1].toLowerCase();
      const value = m[2].trim();
      if (key === "from") spec.from = value.replace(/^["']|["']$/g, "");
      else if (key === "view" && VIEWS.includes(value.toLowerCase())) spec.view = value.toLowerCase();
      else if (key === "columns") spec.columns = splitList(value);
      else if (key === "sort")
        spec.sort = splitList(value).map((s) =>
          s.startsWith("-") ? { key: s.slice(1), desc: true } : { key: s, desc: false },
        );
      else if (key === "group") spec.group = value || null;
      else if (key === "date") spec.date = value || null;
      else if (key === "end") spec.end = value || null;
      // folders: status, or folders: due:year - the rows' files kept in a subfolder per value.
      else if (key === "folders") {
        const [k, by] = value.split(":").map((x) => x.trim());
        spec.folders = k ? { key: k, by: by === "year" ? "year" : "value" } : null;
      }
      else if (key === "types")
        for (const pair of splitList(value)) {
          const [k, kind] = pair.split("=").map((x) => x.trim());
          if (k && TYPES.includes(kind)) spec.types[k] = kind;
        }
      else if (key === "filter") {
        const f = /^(\S+)\s*(!=|>=|<=|=|>|<|!has|has|!empty|empty)\s*(.*)$/.exec(value);
        if (f) spec.filters.push({ key: f[1], op: f[2], value: f[3].trim() });
      }
    }
    return spec;
  }

  /** `spec` written back as a block's source. */
  function writeSpec(spec) {
    const lines = [];
    if (spec.from) lines.push("from: " + spec.from);
    lines.push("view: " + spec.view);
    if (spec.columns) lines.push("columns: " + spec.columns.join(", "));
    if (spec.sort.length) lines.push("sort: " + spec.sort.map((s) => (s.desc ? "-" : "") + s.key).join(", "));
    for (const f of spec.filters) lines.push(("filter: " + f.key + " " + f.op + " " + (f.value || "")).trimEnd());
    if (spec.group) lines.push("group: " + spec.group);
    if (spec.date) lines.push("date: " + spec.date);
    if (spec.end) lines.push("end: " + spec.end);
    if (spec.folders) lines.push("folders: " + spec.folders.key + (spec.folders.by === "year" ? ":year" : ""));
    const types = Object.entries(spec.types || {});
    if (types.length) lines.push("types: " + types.map(([k, kind]) => k + "=" + kind).join(", "));
    if (spec.table && spec.table.length) lines.push("rows:", writeTable(spec.table));
    return lines.join("\n");
  }

  // Rows without a page of their own live in the block, a Markdown table under "rows:" -
  // readable in any editor. Its first column is the row's name; a list is written [a, b].
  const NAME = "Name";

  function cellOf(value) {
    if (value === null || value === undefined) return "";
    const text = Array.isArray(value) ? "[" + value.map(String).join(", ") + "]" : String(value);
    return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
  }

  function valueOf(cell) {
    const text = cell.replace(/\\\|/g, "|").trim();
    if (!text) return undefined;
    // [a, b] is a list; [text](link), one link, is not.
    if (/^\[.*\]$/.test(text) && !/^\[[^\]]*\]\([^)]*\)$/.test(text))
      return text.slice(1, -1).split(/,\s*/).map((x) => x.trim()).filter(Boolean);
    if (text === "true" || text === "false") return text === "true";
    if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
    return text;
  }

  /** A table's cells: split on | not escaped, the outer bars left out. */
  function cells(line) {
    const inner = line.trim().replace(/^\|/, "").replace(/(^|[^\\])\|$/, "$1");
    return inner.split(/(?<!\\)\|/).map((c) => c.trim());
  }

  function parseTable(lines) {
    const rows = lines.filter((l) => l.trim().startsWith("|"));
    if (rows.length < 2) return [];
    const head = cells(rows[0]);
    return rows.slice(2).map((line) => {
      const c = cells(line);
      const props = {};
      head.slice(1).forEach((key, i) => {
        const value = valueOf(c[i + 1] || "");
        if (key && value !== undefined) props[key] = value;
      });
      return { name: (c[0] || "").replace(/\\\|/g, "|"), props };
    });
  }

  function writeTable(table) {
    const keys = [];
    for (const row of table) for (const k of Object.keys(row.props)) if (!keys.includes(k)) keys.push(k);
    const line = (values) => "| " + values.join(" | ") + " |";
    return [line([NAME].concat(keys)), line([NAME].concat(keys).map(() => "---"))]
      .concat(table.map((row) => line([cellOf(row.name)].concat(keys.map((k) => cellOf(row.props[k]))))))
      .join("\n");
  }

  /** The subfolder a row's file belongs in, by `folders`: its value (a year, for :year), or "" at
   *  the database's top when it has none. */
  function subfolderOf(spec, props) {
    if (!spec.folders) return "";
    const value = props[spec.folders.key];
    const one = Array.isArray(value) ? value[0] : value;
    if (one === undefined || one === null || one === "") return "";
    const text = spec.folders.by === "year" ? String(one).slice(0, 4) : String(one);
    return text.trim().replace(/[\\/:*?"<>|#^[\]]/g, "-");
  }

  /** The block's own rows as the view's rows: "#0", "#1"… for their place in the table. */
  function tableRows(spec) {
    return (spec.table || []).map((row, i) => ({ rel: "#" + i, name: row.name, props: row.props, inline: true }));
  }

  /** `spec` with property `from` called `to` wherever it names it. */
  function renameKey(spec, from, to) {
    const name = (k) => (k === from ? to : k);
    const types = {};
    for (const [k, kind] of Object.entries(spec.types || {})) types[name(k)] = kind;
    return {
      ...spec,
      columns: spec.columns && spec.columns.map(name),
      sort: spec.sort.map((s) => ({ ...s, key: name(s.key) })),
      filters: spec.filters.map((f) => ({ ...f, key: name(f.key) })),
      group: spec.group && name(spec.group),
      date: spec.date && name(spec.date),
      end: spec.end && name(spec.end),
      types,
    };
  }

  /** `spec` without property `key` anywhere. */
  function dropKey(spec, key) {
    const types = { ...(spec.types || {}) };
    delete types[key];
    const keep = (k) => k !== key;
    return {
      ...spec,
      columns: spec.columns && spec.columns.filter(keep),
      sort: spec.sort.filter((s) => keep(s.key)),
      filters: spec.filters.filter((f) => keep(f.key)),
      group: spec.group === key ? null : spec.group,
      date: spec.date === key ? null : spec.date,
      end: spec.end === key ? null : spec.end,
      types,
    };
  }

  function splitList(value) {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const dirOf = (rel) => (rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "");
  const stem = (rel) => rel.replace(/\.md$/i, "");

  /** The folder a block in `docRel` means by `from`: from the document's
   *  folder, from the open folder's top when it starts with "/", and the
   *  document's own sub-page folder when there is none. */
  /** Whether `rel` is a folder unit's own page: Papers/Papers.md. */
  function isUnitPage(rel) {
    const dir = dirOf(rel);
    return dir !== "" && stem(rel).slice(stem(rel).lastIndexOf("/") + 1) === dir.slice(dir.lastIndexOf("/") + 1);
  }

  function folderOf(from, docRel) {
    // Without from: a folder unit's own folder (Papers/Papers.md shows Papers/), else the
    // folder beside the document named as it.
    if (!from) return docRel ? (isUnitPage(docRel) ? dirOf(docRel) : stem(docRel)) : "";
    if (from.startsWith("/")) return from.replace(/^\/+|\/+$/g, "");
    const base = docRel ? dirOf(docRel) : "";
    const parts = (base ? base.split("/") : []).concat(from.replace(/\/+$/, "").split("/"));
    const out = [];
    for (const p of parts) {
      if (p === "..") out.pop();
      else if (p && p !== ".") out.push(p);
    }
    return out.join("/");
  }

  /** The rows: the documents right in `folder`, each `{ rel, name, props }`. */
  function rowsOf(docs, folder, deep) {
    // A folder unit's own page (Papers/Papers.md) holds the database; it isn't a row.
    const own = folder ? folder + "/" + folder.slice(folder.lastIndexOf("/") + 1) + ".md" : null;
    // With folders: the rows in the subfolders too, one level down.
    const inside = (rel) => dirOf(rel) === folder || (deep && dirOf(dirOf(rel)) === folder && dirOf(rel) !== "");
    return docs
      .filter((d) => /\.md$/i.test(d.rel) && inside(d.rel) && d.rel !== own)
      .map((d) => ({
        rel: d.rel,
        name: stem(d.rel).slice(stem(d.rel).lastIndexOf("/") + 1),
        props: d.frontmatter && typeof d.frontmatter === "object" ? d.frontmatter : {},
      }));
  }

  /** Each property's kind, from the values the rows hold: "date",
   *  "number", "checkbox", "tags" (a list), "url" or "text". */
  function typesOf(rows, chosen) {
    const kinds = {};
    for (const row of rows)
      for (const [key, value] of Object.entries(row.props)) {
        const kind = kindOf(value);
        if (!kind) continue;
        kinds[key] = kinds[key] && kinds[key] !== kind ? "text" : kind;
      }
    // Text a few values long, said again and again, is a select: a status.
    for (const [key, kind] of Object.entries(kinds)) {
      if (kind !== "text") continue;
      const said = rows.map((r) => text(r.props[key])).filter(Boolean);
      const values = new Set(said);
      if (values.size <= 10 && values.size < said.length && [...values].every((v) => v.length <= 40)) kinds[key] = "select";
    }
    return Object.assign(kinds, chosen || {});
  }

  /** A select's or multi-select's choices: every value its rows have, in
   *  the order first met. */
  function options(rows, key) {
    const seen = [];
    for (const row of rows) {
      const value = row.props[key];
      for (const v of (Array.isArray(value) ? value : [value]).map(text))
        if (v && !seen.includes(v)) seen.push(v);
    }
    return seen;
  }

  function kindOf(value) {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) return "tags";
    if (typeof value === "boolean") return "checkbox";
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    const text = String(value);
    if (DATE.test(text)) return "date";
    if (/^https?:\/\//.test(text)) return "url";
    return "text";
  }

  /** The columns shown: the block's, else every property in the order
   *  first met; the page's name comes first either way. */
  function columnsOf(spec, rows) {
    if (spec.columns) return spec.columns;
    const seen = [];
    for (const row of rows) for (const key of Object.keys(row.props)) if (!seen.includes(key) && key !== "icon") seen.push(key);
    return seen;
  }

  /** A value as text to compare and sort: a date's day, a list's items. */
  function text(value) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(text).join(", ");
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
  }

  function matches(row, f) {
    const value = f.key === "name" ? row.name : row.props[f.key];
    const items = Array.isArray(value) ? value.map(text) : [text(value)];
    const want = f.value.replace(/^["']|["']$/g, "");
    const lower = (s) => s.toLowerCase();
    switch (f.op) {
      case "=":
        return items.some((i) => lower(i) === lower(want));
      case "!=":
        return !items.some((i) => lower(i) === lower(want));
      case "has":
        return items.some((i) => lower(i).includes(lower(want)));
      case "!has":
        return !items.some((i) => lower(i).includes(lower(want)));
      case "empty":
        return items.every((i) => i === "");
      case "!empty":
        return items.some((i) => i !== "");
      default: {
        const a = text(value);
        const n = Number(a);
        const m = Number(want);
        const cmp = !isNaN(n) && !isNaN(m) && a !== "" ? n - m : a.localeCompare(want);
        if (a === "") return false;
        return f.op === ">" ? cmp > 0 : f.op === "<" ? cmp < 0 : f.op === ">=" ? cmp >= 0 : cmp <= 0;
      }
    }
  }

  /** The rows the block shows, filtered and sorted (by name at the last). */
  function viewRows(rows, spec) {
    const kept = rows.filter((row) => spec.filters.every((f) => matches(row, f)));
    const value = (row, key) => (key === "name" ? row.name : row.props[key]);
    return kept.sort((a, b) => {
      for (const s of spec.sort) {
        const x = text(value(a, s.key));
        const y = text(value(b, s.key));
        if (x === y) continue;
        if (x === "") return 1;
        if (y === "") return -1;
        const n = Number(x) - Number(y);
        const c = !isNaN(n) && x.trim() !== "" && y.trim() !== "" ? n : x.localeCompare(y, undefined, { numeric: true });
        if (c) return s.desc ? -c : c;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }

  /** The property a board groups by: the block's, else the first list or
   *  short text property with a few values. */
  function groupKey(spec, rows, types) {
    if (spec.group) return spec.group;
    return (
      Object.keys(types).find((k) => types[k] === "select") ||
      Object.keys(types).find((k) => types[k] === "tags") ||
      Object.keys(types).find((k) => {
        if (types[k] !== "text") return false;
        const values = new Set(rows.map((r) => text(r.props[k])).filter(Boolean));
        return values.size > 0 && values.size <= 8;
      }) ||
      null
    );
  }

  /** The board's lists: each value of `key` in the order met, then "" for
   *  rows without one. A row with several values is in each of their lists. */
  function groups(rows, key) {
    const order = [];
    const of = new Map();
    const add = (value, row) => {
      if (!of.has(value)) {
        of.set(value, []);
        order.push(value);
      }
      of.get(value).push(row);
    };
    for (const row of rows) {
      const value = key ? row.props[key] : null;
      const values = (Array.isArray(value) ? value : [value]).map(text).filter(Boolean);
      if (!values.length) add("", row);
      for (const v of values) add(v, row);
    }
    const named = order.filter((v) => v !== "");
    return named.concat(of.has("") ? [""] : []).map((value) => ({ value, rows: of.get(value) }));
  }

  /** A row's property after it is dragged from list `from` to list `to`:
   *  a list loses `from` and gains `to`; anything else becomes `to`. */
  function regroup(value, from, to) {
    if (Array.isArray(value)) {
      const kept = value.map(text).filter((v) => v !== from);
      if (to && !kept.includes(to)) kept.push(to);
      return kept;
    }
    return to || null;
  }

  /** The date property a calendar places rows by: the block's, else the
   *  first date property. */
  function dateKey(spec, types) {
    return spec.date || Object.keys(types).find((k) => types[k] === "date") || null;
  }

  root.database = {
    VIEWS,
    TYPES,
    parseSpec,
    writeSpec,
    tableRows,
    subfolderOf,
    renameKey,
    dropKey,
    options,
    folderOf,
    rowsOf,
    typesOf,
    columnsOf,
    viewRows,
    groupKey,
    groups,
    regroup,
    dateKey,
    text,
  };
})(typeof window !== "undefined" ? window : globalThis);
