// Databases as Obsidian writes them: a base (a ```base block or a .base
// file) - filters choosing the vault's notes, and views (table, cards,
// list, kanban; calendar is ours). A note is a row, its front matter the
// row's properties. Pure functions shared by the host and the tests; paths
// are "/"-separated and relative to the open folder.

/* global yaml, bexpr */
(function (root) {
  /** The views drawn here, by the names the page uses; Bases' names beside. */
  const VIEWS = ["table", "board", "calendar", "gallery", "list"];
  const TO_BASES = { table: "table", board: "kanban", gallery: "cards", list: "list", calendar: "calendar" };
  const FROM_BASES = { table: "table", kanban: "board", board: "board", cards: "gallery", list: "list", calendar: "calendar" };
  /** A property's kinds as the page shows them; "tags" is a list. */
  const TYPES = ["text", "number", "select", "tags", "date", "checkbox", "url"];
  /** Obsidian's property types (.obsidian/types.json) and ours. */
  const FROM_OBSIDIAN = { text: "text", number: "number", checkbox: "checkbox", date: "date", datetime: "date", multitext: "tags", tags: "tags", aliases: "tags" };
  const TO_OBSIDIAN = { text: "text", select: "text", url: "text", number: "number", checkbox: "checkbox", date: "date", tags: "multitext" };
  const DATE = /^\d{4}-\d{2}-\d{2}/;
  // The filter language (base-filters.js, loaded first).
  const { text: filterText, read: readFilter, statements } = root.baseFilters;

  /** The filters for folder `F`'s rows (F an expression): the notes right in
   *  it and the units one level down (a row with sub-pages), not their
   *  sub-pages. Written so they hold wherever the vault's top is. */
  const rowsIn = (F) => [
    "file.inFolder(" + F + ")",
    "file.folder == " + F + " || file.folder == if(" + F + ".isEmpty(), file.basename, " + F + ' + "/" + file.basename)',
  ];
  /** A folder unit's own database: its folder's rows, not its own page. */
  const UNIT_ROWS = [rowsIn("this.file.folder")[0], "file.path != this.file.path", rowsIn("this.file.folder")[1]];

  // ------------------------------------------------------------ the base
  /** A base's text read: `{ base }`, or `{ error }` for text that isn't one. */
  function parseBase(source) {
    let base;
    try {
      base = String(source).trim() ? yaml.parse(source) : {};
    } catch (err) {
      return { error: String((err && err.message) || err) };
    }
    if (!base || typeof base !== "object" || Array.isArray(base)) return { error: "Not a base" };
    if (!Array.isArray(base.views) || !base.views.length) base.views = [{ type: "table", name: "Table" }];
    base.views = base.views.map((v) => (v && typeof v === "object" ? v : { type: "table", name: "Table" }));
    return { base };
  }

  const writeBase = (base) => yaml.stringify(base);

  /** A view's id for a property: "file.name" is the page's name. */
  const keyOf = (id) => {
    const s = String(id);
    if (s === "file.name" || s === "file.basename") return "name";
    return s.startsWith("note.") ? s.slice(5) : s;
  };
  const idOf = (key) => (key === "name" ? "file.name" : key);

  /** What view `i` of `base` asks for, as the page uses it. */
  function viewSpec(base, i) {
    const v = base.views[i] || base.views[0];
    const group = v.groupBy && typeof v.groupBy === "object" ? v.groupBy.property : v.groupBy;
    const props = base.properties && typeof base.properties === "object" ? base.properties : {};
    const kinds = {};
    for (const [id, conf] of Object.entries(props))
      if (conf && typeof conf === "object" && TYPES.includes(conf.kind)) kinds[keyOf(id)] = conf.kind;
    return {
      view: FROM_BASES[String(v.type)] || "table",
      unknownView: FROM_BASES[String(v.type)] ? null : String(v.type || ""),
      name: v.name ? String(v.name) : null,
      columns: Array.isArray(v.order) ? v.order.map(keyOf).filter((k) => k !== "name") : null,
      // Obsidian's columnSize: a column's width in pixels, by property.
      widths: Object.fromEntries(
        Object.entries(v.columnSize && typeof v.columnSize === "object" ? v.columnSize : {})
          .filter(([, w]) => typeof w === "number" && w > 0)
          .map(([id, w]) => [keyOf(id), w]),
      ),
      sort: (Array.isArray(v.sort) ? v.sort : [])
        .filter((s) => s && s.property)
        .map((s) => ({ key: keyOf(s.property), desc: String(s.direction).toUpperCase() === "DESC" })),
      filters: statements(v.filters).map((f) => (typeof f === "string" ? readFilter(f) : { raw: f })),
      group: group ? keyOf(group) : null,
      groupOrder: Array.isArray(v.groupOrder) ? v.groupOrder.map((g) => (g === null ? "" : String(g))) : null,
      limit: typeof v.limit === "number" && v.limit > 0 ? v.limit : null,
      date: v.date ? keyOf(v.date) : null,
      end: v.end ? keyOf(v.end) : null,
      kinds,
      views: base.views.map((x, n) => ({ index: n, name: x.name ? String(x.name) : null, view: FROM_BASES[String(x.type)] || "table" })),
    };
  }

  /** `base` with view `i` set to what `spec` says; keys it doesn't know are kept. */
  function setView(base, i, spec) {
    const v = { ...base.views[i] };
    if (spec.view) v.type = TO_BASES[spec.view] || spec.view;
    if (spec.name !== undefined && spec.name !== null) v.name = spec.name;
    if (spec.columns) v.order = ["file.name"].concat(spec.columns.map(idOf));
    if (spec.width) {
      const sizes = { ...(v.columnSize && typeof v.columnSize === "object" ? v.columnSize : {}) };
      // Whichever way the property was written ("status", "note.status").
      for (const id of Object.keys(sizes)) if (keyOf(id) === spec.width.key) delete sizes[id];
      if (spec.width.px) sizes[idOf(spec.width.key)] = Math.round(spec.width.px);
      if (Object.keys(sizes).length) v.columnSize = sizes;
      else delete v.columnSize;
    }
    if (spec.sort) {
      if (spec.sort.length) v.sort = spec.sort.map((s) => ({ property: idOf(s.key), direction: s.desc ? "DESC" : "ASC" }));
      else delete v.sort;
    }
    if (spec.filters) {
      const list = spec.filters.map((f) => (f.raw !== undefined ? f.raw : filterText(f)));
      if (!list.length) delete v.filters;
      else v.filters = { and: list };
    }
    if (spec.group !== undefined) {
      if (spec.group) v.groupBy = { property: idOf(spec.group), direction: (v.groupBy && v.groupBy.direction) || "ASC" };
      else delete v.groupBy;
    }
    if (spec.groupOrder !== undefined) {
      if (spec.groupOrder) v.groupOrder = spec.groupOrder.map((g) => (g === "" ? null : g));
      else delete v.groupOrder;
    }
    if (spec.limit !== undefined) {
      if (spec.limit) v.limit = spec.limit;
      else delete v.limit;
    }
    for (const k of ["date", "end"])
      if (spec[k] !== undefined) {
        if (spec[k]) v[k] = idOf(spec[k]);
        else delete v[k];
      }
    const views = base.views.slice();
    views[i] = v;
    const next = { ...base, views };
    if (spec.kinds) {
      const props = { ...(base.properties || {}) };
      for (const [key, kind] of Object.entries(spec.kinds)) {
        const id = idOf(key);
        const conf = { ...(props[id] || {}) };
        if (kind === "select" || kind === "url") conf.kind = kind;
        else delete conf.kind;
        if (Object.keys(conf).length) props[id] = conf;
        else delete props[id];
      }
      if (Object.keys(props).length) next.properties = props;
      else delete next.properties;
    }
    return next;
  }

  /** `base` with a view of `view`'s kind added at the end. */
  function addView(base, view, name) {
    return { ...base, views: base.views.concat([{ type: TO_BASES[view] || "table", name: name || view }]) };
  }

  /** `base` with property `from` called `to` wherever a view names it. */
  function renameKey(base, from, to) {
    const swap = (id) => (keyOf(id) === from ? idOf(to) : id);
    const text = (s) => {
      const f = readFilter(s);
      return f.raw === undefined && f.key === from ? filterText({ ...f, key: to }) : s;
    };
    const views = base.views.map((v) => {
      const n = { ...v };
      if (Array.isArray(n.order))
        n.order = n.order.map(swap).filter((id, i, all) => all.findIndex((x) => keyOf(x) === keyOf(id)) === i);
      if (n.columnSize && typeof n.columnSize === "object") {
        // A column already there keeps its own width.
        const sized = Object.keys(n.columnSize).some((id) => keyOf(id) === to);
        n.columnSize = Object.fromEntries(
          Object.entries(n.columnSize)
            .filter(([id]) => !(sized && keyOf(id) === from))
            .map(([id, px]) => [swap(id), px]),
        );
      }
      if (Array.isArray(n.sort)) n.sort = n.sort.map((s) => ({ ...s, property: swap(s.property) }));
      if (n.groupBy && n.groupBy.property) n.groupBy = { ...n.groupBy, property: swap(n.groupBy.property) };
      for (const k of ["date", "end"]) if (n[k]) n[k] = swap(n[k]);
      if (n.filters) n.filters = { and: statements(n.filters).map((f) => (typeof f === "string" ? text(f) : f)) };
      return n;
    });
    const next = { ...base, views };
    // Whichever way the base wrote the property.
    const was = Object.keys(base.properties || {}).filter((id) => keyOf(id) === from);
    if (was.length) {
      const props = { ...base.properties };
      const there = Object.keys(props).some((id) => keyOf(id) === to);
      // A name already there keeps its own display.
      if (!there) props[idOf(to)] = props[was[0]];
      for (const id of was) delete props[id];
      next.properties = props;
    }
    return next;
  }

  /** `base` without property `key` in any view. */
  function dropKey(base, key) {
    const keep = (id) => keyOf(id) !== key;
    const views = base.views.map((v) => {
      const n = { ...v };
      if (Array.isArray(n.order)) n.order = n.order.filter(keep);
      if (n.columnSize && typeof n.columnSize === "object")
        n.columnSize = Object.fromEntries(Object.entries(n.columnSize).filter(([id]) => keep(id)));
      if (Array.isArray(n.sort)) n.sort = n.sort.filter((s) => keep(s.property));
      if (n.groupBy && !keep(n.groupBy.property)) delete n.groupBy;
      for (const k of ["date", "end"]) if (n[k] && !keep(n[k])) delete n[k];
      if (n.filters)
        n.filters = { and: statements(n.filters).filter((f) => typeof f !== "string" || readFilter(f).key !== key) };
      return n;
    });
    const next = { ...base, views };
    const was = Object.keys(base.properties || {}).filter((id) => keyOf(id) === key);
    if (was.length) {
      const props = { ...base.properties };
      for (const id of was) delete props[id];
      next.properties = props;
    }
    return next;
  }

  // ------------------------------------------------------------ rows
  const dirOf = (rel) => (rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "");
  const stem = (rel) => rel.replace(/\.md$/i, "");

  /** The notes `base` (in note `thisRel`, or a .base file there) chooses,
   *  each `{ rel, name, props, file }`, and the statements it couldn't read. */
  function rowsOf(base, docs, thisRel) {
    const self = thisRel ? bexpr.fileOf({ rel: thisRel }) : null;
    const formulas = formulasOf(base);
    const { test, skipped } = bexpr.filterOf(base.filters);
    const rows = [];
    for (const d of docs) {
      if (!/\.md$/i.test(d.rel)) continue;
      const file = bexpr.fileOf(d);
      const ctx = { file, this: self, formulas };
      if (!test(ctx)) continue;
      // Each formula's value beside the note's own properties, as formula.<name>.
      const props = { ...file.properties };
      for (const name of Object.keys(formulas)) props["formula." + name] = bexpr.formulaValue(name, ctx);
      rows.push({ rel: d.rel, name: file.basename, props, file });
    }
    return { rows, skipped };
  }

  /** The base's formulas by name, as text. */
  const formulasOf = (base) =>
    base.formulas && typeof base.formulas === "object" && !Array.isArray(base.formulas)
      ? Object.fromEntries(Object.entries(base.formulas).map(([k, v]) => [k, String(v)]))
      : {};

  /** Where a new row of `base` goes: the folder its filters keep it to
   *  (this note's for a unit's database), else beside this note. */
  function folderOf(base, thisRel) {
    const here = thisRel ? dirOf(thisRel) : "";
    const all = [];
    const walk = (f) => {
      if (typeof f === "string") all.push(f.trim());
      else if (f && typeof f === "object") for (const k of ["and", "or"]) if (Array.isArray(f[k])) f[k].forEach(walk);
    };
    walk(base.filters);
    // The first file.inFolder(...), its folder worked out as the filter would.
    const self = thisRel ? bexpr.fileOf({ rel: thisRel }) : null;
    for (const f of all) {
      if (!f.startsWith("file.inFolder(") || !f.endsWith(")")) continue;
      try {
        const folder = bexpr.str(bexpr.compile(f.slice("file.inFolder(".length, -1))({ file: self, this: self }));
        return folder.replace(/^\/+|\/+$/g, "");
      } catch {
        continue;
      }
    }
    return here;
  }

  /** The same rows shown on a note in `fromDir`: folder unit `folder`, found from
   *  that note's folder (up and down as far as it takes), not from the vault's top. */
  function folderRows(fromDir, folder) {
    const from = fromDir ? fromDir.split("/") : [];
    const to = folder.split("/");
    let same = 0;
    while (same < from.length && same < to.length && from[same] === to[same]) same++;
    const up = from.length - same;
    const rest = to.slice(same).join("/");
    const B = up ? 'this.file.folder.split("/").slice(0, -' + up + ').join("/")' : "this.file.folder";
    const F = rest ? "if(" + B + '.isEmpty(), "' + rest + '", ' + B + ' + "/' + rest + '")' : B;
    const name = to[to.length - 1];
    const [inside, direct] = rowsIn("(" + F + ")");
    return [inside, "file.path != (" + F + ') + "/' + name + '.md"', direct];
  }

  /** A database made in folder unit `folder`: its rows the unit's. */
  function unitBase(view, extra) {
    return Object.assign({ filters: { and: UNIT_ROWS.slice() }, views: [{ type: TO_BASES[view] || "table", name: viewName(view) }] }, extra || {});
  }
  const viewName = (view) => ({ table: "Table", board: "Board", calendar: "Calendar", gallery: "Gallery", list: "List" })[view] || "Table";

  /** Each property's kind: Obsidian's types first, then what the values
   *  suggest - "date", "number", "checkbox", "tags", "url", "select" (text
   *  said again and again) or "text"; the base's own choice over all. */
  function typesOf(rows, obsidian, kinds) {
    const out = {};
    for (const row of rows)
      for (const [key, value] of Object.entries(row.props)) {
        const kind = kindOf(value);
        if (!kind) continue;
        out[key] = out[key] && out[key] !== kind ? "text" : kind;
      }
    for (const [key, kind] of Object.entries(out)) {
      if (kind !== "text") continue;
      const said = rows.map((r) => text(r.props[key])).filter(Boolean);
      const values = new Set(said);
      if (values.size <= 10 && values.size < said.length && [...values].every((v) => v.length <= 40)) out[key] = "select";
    }
    for (const [key, type] of Object.entries(obsidian || {})) {
      const kind = FROM_OBSIDIAN[type];
      if (kind && kind !== "text" && key in out) out[key] = kind;
      if (kind === "text" && out[key] && out[key] !== "select" && out[key] !== "url") out[key] = "text";
    }
    return Object.assign(out, kinds || {});
  }

  function kindOf(value) {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) return "tags";
    if (typeof value === "boolean") return "checkbox";
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    const t = String(value);
    if (DATE.test(t)) return "date";
    if (/^https?:\/\//.test(t)) return "url";
    return "text";
  }

  /** A select's or list's choices, in the order first met. */
  function options(rows, key) {
    const seen = new Set();
    for (const row of rows) {
      const value = row.props[key];
      for (const v of (Array.isArray(value) ? value : [value]).map(text)) if (v) seen.add(v);
    }
    return [...seen];
  }

  /** The columns: the view's, else every property in the order first met. */
  function columnsOf(spec, rows) {
    if (spec.columns) return spec.columns;
    const seen = [];
    for (const row of rows)
      for (const key of Object.keys(row.props)) if (!seen.includes(key) && key !== "icon" && key !== "cover") seen.push(key);
    return seen;
  }

  function text(value) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(text).join(", ");
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
  }

  const valueAt = (row, key) => (key === "name" ? row.name : key.startsWith("file.") ? row.file && row.file[key.slice(5)] : row.props[key]);

  /** The rows a view shows: through its filters, sorted (by name at the last). */
  function viewRows(rows, spec, thisRel, formulas) {
    const self = thisRel ? bexpr.fileOf({ rel: thisRel }) : null;
    const filters = spec.filters.map((f) => (f.raw !== undefined ? f.raw : filterText(f)));
    const { test } = bexpr.filterOf({ and: filters });
    const kept = rows.filter((row) =>
      test({ file: row.file || bexpr.fileOf({ rel: row.rel, frontmatter: row.props }), this: self, formulas: formulas || {} }),
    );
    return kept.sort((a, b) => {
      for (const s of spec.sort) {
        const x = text(valueAt(a, s.key));
        const y = text(valueAt(b, s.key));
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

  /** The property a board groups by: the view's, else a select or list. */
  function groupKey(spec, rows, types) {
    if (spec.group) return spec.group;
    return (
      Object.keys(types).find((k) => types[k] === "select") ||
      Object.keys(types).find((k) => types[k] === "tags") ||
      null
    );
  }

  /** The board's lists: in `order` first (groupOrder), then the rest as
   *  met, then "" for rows without a value. A row with several values is in
   *  each of their lists. */
  function groups(rows, key, order) {
    const met = [];
    const of = new Map();
    const add = (value, row) => {
      if (!of.has(value)) {
        of.set(value, []);
        met.push(value);
      }
      of.get(value).push(row);
    };
    for (const row of rows) {
      const value = key ? row.props[key] : null;
      const values = (Array.isArray(value) ? value : [value]).map(text).filter(Boolean);
      if (!values.length) add("", row);
      for (const v of values) add(v, row);
    }
    const first = (order || []).filter((v) => v !== "");
    const named = first.concat(met.filter((v) => v !== "" && !first.includes(v)));
    return named.concat(of.has("") ? [""] : []).map((value) => ({ value, rows: of.get(value) || [] }));
  }

  /** A row's property after it moves from list `from` to list `to`. */
  function regroup(value, from, to) {
    if (Array.isArray(value)) {
      const kept = value.map(text).filter((v) => v !== from);
      if (to && !kept.includes(to)) kept.push(to);
      return kept;
    }
    return to || null;
  }

  function dateKey(spec, types) {
    return spec.date || Object.keys(types).find((k) => types[k] === "date") || null;
  }

  root.database = {
    VIEWS,
    TYPES,
    TO_OBSIDIAN,
    UNIT_ROWS,
    parseBase,
    writeBase,
    viewSpec,
    setView,
    addView,
    renameKey,
    dropKey,
    rowsOf,
    folderOf,
    unitBase,
    folderRows,
    viewName,
    typesOf,
    options,
    columnsOf,
    viewRows,
    formulasOf,
    groupKey,
    groups,
    regroup,
    dateKey,
    text,
    stem,
  };
})(typeof window !== "undefined" ? window : globalThis);
