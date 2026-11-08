// A database block's page: the rows host.js sends, as a table (cells
// edited in place), a board (cards dragged between lists), a calendar or a
// gallery. Drawn with Textus's own controls (tx- classes) and menus
// (api.menu); filters, sorts, columns and types are kept in the block's
// lines. Every change goes back to the host, which writes the documents or
// the block; what a menu can't hold (a name, a value) the host asks for.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const VIEWS = ["table", "board", "calendar", "gallery", "list"];
  const VIEW_ICONS = { table: "table", board: "board", calendar: "calendar", gallery: "gallery", list: "list" };
  /** Rows drawn at first, and again each time the list is scrolled to its
   *  end, when the view sets no limit of its own. */
  const PAGE = 25;
  const TYPES = ["text", "number", "select", "tags", "date", "checkbox", "url"];
  const TYPE_ICONS = { text: "text", number: "number", select: "select", tags: "multi", date: "date", checkbox: "checkbox", url: "url" };
  // The order tones are given in (design standard 3.4).
  const TONES = ["blue", "green", "orange", "purple", "red", "teal", "yellow", "pink", "gray"];
  let data = null;
  let month = null;
  // Each reader's own: the view in front and whether the base is folded.
  const state = Object.assign({ index: 0, folded: false }, api.getState() || {});
  const keep = () => api.setState(state);
  /** How many rows scrolling has let through, past the first page. */
  let more = 0;
  /** A field being typed in: the view waits for it before drawing again. */
  let editing = false;
  let stale = false;

  const $ = (id) => document.getElementById(id);
  const post = (message) => api.postMessage(message);
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") node.className = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (v !== false && v !== null && v !== undefined) node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) node.append(c);
    return node;
  }
  const s = (key) => (data && data.strings && data.strings[key]) || key;
  const icon = (name) => el("span", { class: "tx-icon", "data-icon": name });
  const typeOf = (key) => (key === "name" ? "text" : data.types[key] || "text");
  const label = (key) => (key === "name" ? s("page") : key.replace(/^formula\./, "ƒ "));
  /** A formula's column: worked out by the base, not typed in. */
  const isFormula = (key) => key.startsWith("formula.");
  const allKeys = () => ["name"].concat(data.keys);
  /** What the block says, changed: filters, sorts, columns or types. */
  const setSpec = (change) => post({ type: "spec", spec: change });

  // ------------------------------------------------------------ values
  /** An option's tone, from its words: the same word keeps its colour
   *  whatever the rows, their order or the base. */
  function tone(word) {
    let h = 0;
    for (const ch of String(word)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return TONES[h % TONES.length];
  }
  const tag = (word, key, status) =>
    el("span", { class: "tx-tag" + (status ? " status" : ""), "data-tone": tone(word) }, String(word));
  /** A select that reads as a state - status, stage - gets the dot. */
  const isStatus = (key) => /^(status|state|stage|phase|进度|状态)$/i.test(key || "");

  function shown(value, type, key) {
    if (type === "checkbox")
      return el("input", { type: "checkbox", class: "ui-check", checked: value === true, tabindex: "-1", "aria-label": key });
    if (value === null || value === undefined || value === "") return "";
    if (Array.isArray(value)) return el("span", { class: "tags" }, value.map((v) => tag(v, key)));
    if (type === "select") return tag(value, key, isStatus(key));
    if (type === "number" && /^(rate|rating|stars?)$/i.test(key) && value >= 0 && value <= 5)
      return el("span", { class: "stars" }, "★".repeat(Math.round(value)) + "☆".repeat(5 - Math.round(value)));
    if (type === "url") return el("a", { href: value, target: "_blank", onclick: (e) => e.stopPropagation() }, String(value));
    return String(value);
  }

  const pageLink = (row) =>
    el("button", { type: "button", class: "page-link", onclick: () => post({ type: "open", rel: row.rel }) },
      (typeof row.props.icon === "string" ? row.props.icon + " " : "") + row.name);

  // ------------------------------------------------- filters and sorts
  const OPS = {
    text: ["has", "!has", "=", "!=", "empty", "!empty"],
    url: ["has", "!has", "empty", "!empty"],
    select: ["=", "!=", "empty", "!empty"],
    tags: ["has", "!has", "empty", "!empty"],
    number: ["=", "!=", ">", "<", "empty", "!empty"],
    date: ["=", ">", "<", "empty", "!empty"],
    checkbox: ["="],
  };
  const OP_NAMES = { "=": "is", "!=": "isNot", has: "contains", "!has": "notContains", empty: "isEmpty", "!empty": "notEmpty", ">": "greater", "<": "less", ">=": "greater", "<=": "less" };
  const opsFor = (key) => OPS[typeOf(key)] || OPS.text;
  const filterText = (f) =>
    label(f.key) + " " + s(OP_NAMES[f.op] || "is").toLowerCase() + (f.op === "empty" || f.op === "!empty" ? "" : " " + f.value);

  /** A filter on `key`, by menus: its operator, then its value - one of the
   *  options where there are some, else asked by the host. */
  async function filterOn(key, at, replace) {
    const op = await api.menu(opsFor(key).map((o) => ({ label: s(OP_NAMES[o]), value: o })), at);
    if (op === null) return;
    const type = typeOf(key);
    let value;
    if (op === "empty" || op === "!empty") value = "";
    else if (type === "checkbox") {
      value = await api.menu([{ label: "☑", value: "true" }, { label: "☐", value: "false" }], at);
      if (value === null) return;
    } else if ((type === "select" || type === "tags") && (data.options[key] || []).length) {
      value = await api.menu(data.options[key].map((o) => ({ label: o })), at);
      if (value === null) return;
    } else return valueField(key, op, replace);
    post({ type: "addFilter", key, op, value, replace });
  }

  /** The filter's value typed in place, in the rules row: Enter keeps it. */
  function valueField(key, op, replace) {
    const type = typeOf(key);
    const holder = el("span", { class: "tx-chip editing" }, label(key) + " " + s(OP_NAMES[op] || "is").toLowerCase() + " ");
    $("rules").append(holder);
    const input =
      type === "date"
        ? dateInput({ class: "cell-input", "aria-label": s("value") })
        : el("input", { type: type === "number" ? "number" : "text", class: "cell-input", "aria-label": s("value") });
    holder.append(input);
    editing = true;
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      editing = false;
      if (ok && input.value.trim() !== "") post({ type: "addFilter", key, op, value: input.value.trim(), replace });
      render();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish(true);
      if (e.key === "Escape") finish(false);
    });
    input.addEventListener("blur", () => finish(true));
    input.focus();
  }

  async function filterMenu(at) {
    const key = await api.menu(allKeys().map((k) => ({ label: label(k), value: k })), at);
    if (key !== null) filterOn(key, at);
  }

  async function sortMenu(at) {
    const sort = data.spec.sort;
    const items = allKeys().map((k) => {
      const now = sort.find((x) => x.key === k);
      return {
        label: label(k),
        items: [
          { label: s("ascending"), value: k + "\n+", checked: !!now && !now.desc },
          { label: s("descending"), value: k + "\n-", checked: !!now && now.desc },
        ],
      };
    });
    if (sort.length) items.push("separator", { label: s("clear"), value: "\nclear" });
    const choice = await api.menu(items, at);
    if (choice === null) return;
    if (choice === "\nclear") return setSpec({ sort: [] });
    const [key, dir] = String(choice).split("\n");
    setSpec({ sort: sort.filter((x) => x.key !== key).concat([{ key, desc: dir === "-" }]) });
  }

  /** The rules in force, under the bar: a chip each, its menu to change it. */
  function rules() {
    const chips = data.spec.filters.map((f, i) =>
      f.raw !== undefined ? el("button", {
        type: "button",
        class: "tx-chip raw",
        title: String(f.raw),
        onclick: async (e) => {
          const choice = await api.menu([{ label: s("remove"), value: "remove", danger: true }], e.currentTarget);
          if (choice === "remove") setSpec({ filters: data.spec.filters.filter((_, j) => j !== i) });
        },
      }, String(f.raw)) : el("button", {
        type: "button",
        class: "tx-chip",
        onclick: async (e) => {
          const at = e.currentTarget;
          const choice = await api.menu([{ label: s("filter") + "…", value: "change" }, { label: s("remove"), value: "remove", danger: true }], at);
          if (choice === "remove") setSpec({ filters: data.spec.filters.filter((_, j) => j !== i) });
          if (choice === "change") filterOn(f.key, at, i);
        },
      }, filterText(f), icon("chevron")),
    );
    for (const x of data.spec.sort)
      chips.push(el("button", {
        type: "button",
        class: "tx-chip",
        onclick: async (e) => {
          const choice = await api.menu([
            { label: s("ascending"), value: "asc", checked: !x.desc },
            { label: s("descending"), value: "desc", checked: x.desc },
            "separator",
            { label: s("remove"), value: "remove", danger: true },
          ], e.currentTarget);
          if (choice === null) return;
          const rest = data.spec.sort.filter((y) => y.key !== x.key);
          setSpec({ sort: choice === "remove" ? rest : data.spec.sort.map((y) => (y.key === x.key ? { key: y.key, desc: choice === "desc" } : y)) });
        },
      }, icon("sort"), label(x.key), icon("chevron")));
    return chips;
  }

  // ------------------------------------------------------- table header
  async function columnMenu(th, key) {
    const items = [
      { label: s("ascending"), value: "asc" },
      { label: s("descending"), value: "desc" },
      { label: s("filter") + "…", value: "filter" },
    ];
    if (key !== "name")
      items.push(
        "separator",
        { label: s("type"), items: TYPES.map((k) => ({ label: s("type." + k), value: "type:" + k, checked: typeOf(key) === k })) },
        { label: s("rename") + "…", value: "rename" },
        { label: s("hide"), value: "hide" },
        "separator",
        { label: s("deleteProperty"), value: "delete", danger: true },
      );
    const choice = await api.menu(items, th);
    if (choice === null) return;
    if (choice === "asc" || choice === "desc") setSpec({ sort: [{ key, desc: choice === "desc" }] });
    else if (choice === "filter") filterOn(key, th);
    else if (choice === "rename") post({ type: "renameProp", from: key });
    else if (choice === "hide") setSpec({ columns: data.columns.filter((c) => c !== key) });
    else if (choice === "delete") post({ type: "deleteProp", key });
    else if (String(choice).startsWith("type:")) setSpec({ types: { [key]: String(choice).slice(5) } });
  }

  /** The last column's +: a new property of a kind, or a hidden one back. */
  async function addColumnMenu(th) {
    const hidden = data.keys.filter((k) => !data.columns.includes(k));
    const items = [{ label: s("newProperty"), items: TYPES.map((k) => ({ label: s("type." + k), value: "new:" + k })) }];
    if (hidden.length)
      items.push("separator", ...hidden.map((k) => ({ label: k, value: "show:" + k })), { label: s("showAll"), value: "all" });
    const choice = await api.menu(items, th);
    if (choice === null) return;
    if (choice === "all") setSpec({ columns: null });
    else if (String(choice).startsWith("show:")) setSpec({ columns: data.columns.concat([String(choice).slice(5)]) });
    else post({ type: "addProp", kind: String(choice).slice(4), columns: data.columns });
  }

  // ------------------------------------------------------------- table
  function table() {
    const sorted = (key) => {
      const x = data.spec.sort.find((r) => r.key === key);
      return x ? icon(x.desc ? "chevron" : "sort") : null;
    };
    const widths = data.spec.widths || {};
    const th = (key) => {
      const node = el("th", { tabindex: "0", "data-key": key, onclick: (e) => columnMenu(e.currentTarget, key) },
        icon(TYPE_ICONS[typeOf(key)]), label(key), sorted(key), resizer(key));
      // A column but the title is dragged along the head to a new place.
      if (key !== "name") node.addEventListener("pointerdown", (e) => moveColumn(e, node, key));
      return node;
    };
    const head = el("tr", null, th("name"), data.columns.map(th),
      el("th", { class: "plus", tabindex: "0", "aria-label": s("newProperty"), onclick: (e) => addColumnMenu(e.currentTarget) }, icon("plus")));
    const rows = capped(data.rows).map((row) => el("tr", null, titleCell(row), data.columns.map((key) => cell(row, key)), el("td", { class: "plus" })));
    const span = String(data.columns.length + 2);
    const more = moreMark(data.rows.length);
    const tail = [
      more && el("tr", { class: "more-row" }, el("td", { colspan: span }, more)),
      el("tr", { class: "new-row" }, el("td", { colspan: span }, newButton({}))),
    ];
    const frame = el("div", { class: "tx-table-frame" }, el("table", { class: "tx-table" }, el("thead", null, head), el("tbody", null, rows, tail)));
    for (const [key, px] of Object.entries(widths)) sizeColumn(frame, key, px);
    return el("div", null, frame);
  }

  /** The table's head kept in view while its rows scroll by: the page
   *  scrolls (in a tab, or in a block's own height) and the frame scrolls
   *  sideways, so a sticky head has nothing to stick to; it is moved. */
  function pinHead() {
    const head = document.querySelector(".tx-table thead");
    if (!head) return;
    const table = head.closest("table").getBoundingClientRect();
    const height = head.getBoundingClientRect().height;
    const by = Math.max(0, Math.min(-table.top, table.height - height * 2));
    head.classList.toggle("pinned", by > 0);
    for (const th of head.querySelectorAll("th")) th.style.transform = by ? "translateY(" + by + "px)" : "";
  }

  /** Every cell of column `key` `px` wide, its text cut short to fit. */
  function sizeColumn(frame, key, px) {
    const cells = frame.querySelectorAll('[data-key="' + CSS.escape(key) + '"]');
    for (const c of cells) {
      c.style.width = c.style.minWidth = c.style.maxWidth = px ? px + "px" : "";
      c.classList.toggle("sized", !!px);
    }
  }

  /** The handle at a column head's right edge: dragged, the column's width,
   *  kept in the base (columnSize); a double click goes back to fitting. */
  function resizer(key) {
    const handle = el("span", { class: "col-resize", "aria-hidden": "true" });
    handle.addEventListener("click", (e) => e.stopPropagation());
    handle.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      setSpec({ width: { key: key, px: 0 } });
    });
    handle.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      const frame = handle.closest(".tx-table-frame");
      const from = handle.parentElement.getBoundingClientRect().width;
      let px = from;
      drag.track(e, {
        move: (x) => sizeColumn(frame, key, (px = Math.max(MIN_COLUMN, Math.round(from + x - e.clientX)))),
        end: (_x, _y, dropped) => (dropped ? setSpec({ width: { key: key, px: px } }) : sizeColumn(frame, key, widthsOf(key))),
      });
    });
    return handle;
  }
  const MIN_COLUMN = 64;
  const widthsOf = (key) => (data.spec.widths || {})[key] || 0;

  /** A column's head dragged among the others: the view's column order. */
  function moveColumn(e, node, key) {
    if (e.target.closest(".col-resize")) return;
    const row = node.parentElement;
    drag.sortable(e, {
      item: node,
      axis: "x",
      lists: () => [row],
      itemsOf: (r) => [...r.children].filter((c) => c.dataset.key && c.dataset.key !== "name"),
      onDrop: (_row, index) => {
        const columns = data.columns.filter((c) => c !== key);
        columns.splice(index, 0, key);
        if (columns.join("\n") !== data.columns.join("\n")) setSpec({ columns: columns });
        else render();
      },
    });
  }

  /** A page's title: click to rename it, the arrow beside it to open it. */
  function titleCell(row) {
    const td = el("td", { class: "title", "data-key": "name" },
      el("span", { class: "name" }, (typeof row.props.icon === "string" ? row.props.icon + " " : "") + row.name),
      el("button", { type: "button", class: "tx-icon-button open", "aria-label": s("open"), onclick: (e) => { e.stopPropagation(); post({ type: "open", rel: row.rel }); } }, icon("open")));
    td.addEventListener("click", () => {
      if (!td.querySelector("input")) editInline(td, row.name, "text", (text) => post({ type: "renamePage", rel: row.rel, title: text }));
    });
    return td;
  }

  /** `td` as a field holding `value`; `commit(text)` on Enter or leaving. */
  /** A date as it is written in the note, the way the table shows it: the
   *  system's date field would show it in its own order (11/02/2026). */
  const DATE = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/;

  function dateInput(attrs) {
    return el("input", { ...attrs, type: "text", placeholder: "YYYY-MM-DD", inputmode: "numeric", spellcheck: "false" });
  }

  function editInline(td, value, kind, commit) {
    const text = value === undefined || value === null ? "" : String(value);
    const input = kind === "date" ? dateInput({ class: "cell-input", value: text }) : el("input", { type: kind, class: "cell-input", value: text });
    let done = false;
    editing = true;
    const finish = (keep) => {
      if (done) return;
      done = true;
      editing = false;
      const typed = input.value.trim();
      // Not a date: the cell keeps what it had.
      const valid = kind !== "date" || typed === "" || DATE.test(typed);
      const changed = keep && valid && typed !== String(value ?? "");
      if (changed) commit(input.value.trim());
      if (!changed || stale) render();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish(true);
      if (e.key === "Escape") finish(false);
    });
    input.addEventListener("blur", () => finish(true));
    td.replaceChildren(input);
    input.focus();
    if (kind === "text" || kind === "date") input.select();
  }

  function cell(row, key) {
    const type = typeOf(key);
    const value = row.props[key];
    const td = el("td", { class: "cell cell-" + type, "data-key": key, tabindex: "0" }, shown(value, type, key));
    const set = (next) => post({ type: "set", rel: row.rel, key, value: next });
    if (isFormula(key)) return td;
    if (type === "checkbox") td.addEventListener("click", () => set(value !== true));
    else if (type === "select" || type === "tags") td.addEventListener("click", () => optionsMenu(td, row, key));
    else
      td.addEventListener("click", () => {
        if (!td.querySelector("input"))
          editInline(td, value, type === "date" ? "date" : type === "number" ? "number" : "text", (text) =>
            set(type === "number" ? (text === "" ? null : Number(text)) : text));
      });
    return td;
  }

  /** A select's or multi-select's options, in Textus's menu: one picked,
   *  or toggled for a multi-select; a new one asked for by the host. */
  async function optionsMenu(td, row, key) {
    const multi = typeOf(key) === "tags";
    const value = row.props[key];
    const chosen = (Array.isArray(value) ? value : value ? [value] : []).map(String);
    const items = (data.options[key] || []).map((o) => ({ label: o, checked: chosen.includes(o) }));
    if (items.length) items.push("separator");
    items.push({ label: s("create") + "…", value: "\nnew" });
    if (chosen.length) items.push({ label: s("clear"), value: "\nclear" });
    const choice = await api.menu(items, td);
    if (choice === null) return;
    const set = (next) => post({ type: "set", rel: row.rel, key, value: next });
    if (choice === "\nnew") return post({ type: "newOption", rel: row.rel, key, multi, current: chosen });
    if (choice === "\nclear") return set(null);
    if (!multi) return set(choice === chosen[0] ? null : choice);
    set(chosen.includes(choice) ? chosen.filter((o) => o !== choice) : chosen.concat([choice]));
  }

  /** "+ New": a page named where it's made, with `props` already set. */
  function newButton(props) {
    const button = el("button", { type: "button", class: "tx-button small new" }, icon("plus"), s("add"));
    button.addEventListener("click", () => {
      const holder = el("div", { class: "new-title" });
      button.replaceWith(holder);
      editInline(holder, "", "text", (title) => post({ type: "add", folder: data.folder, props, title }));
      holder.querySelector("input").placeholder = s("untitled");
    });
    return button;
  }

  // ---------------------------------------------------------------- board
  function board() {
    const key = data.group;
    if (!key) return el("div", { class: "tx-empty" }, s("noGroup"));
    const byRel = new Map(data.rows.map((r) => [r.rel, r]));
    const lanes = data.groups.map((g) => {
      const head = el("div", { class: "lane-head", title: s("dragLane") },
        g.value ? tag(g.value, key, isStatus(key)) : el("span", { class: "tx-tag" }, s("noValue")),
        el("span", { class: "count" }, String(g.rels.length)));
      const lane = el("div", { class: "lane", "data-value": g.value },
        head,
        capped(g.rels).map((rel) => card(byRel.get(rel), key, g.value)),
        moreMark(g.rels.length),
        newButton(groupProps(key, g.value)));
      // A list moved by its head, the others making way: the board's order,
      // kept in the base (groupOrder).
      head.addEventListener("pointerdown", (e) =>
        drag.sortable(e, {
          item: lane,
          axis: "x",
          lists: () => [lane.parentElement],
          itemsOf: (b) => [...b.children],
          onDrop: (_board, index) => {
            const order = data.groups.map((x) => x.value).filter((v) => v !== g.value);
            order.splice(index, 0, g.value);
            if (order.join("\n") !== data.groups.map((x) => x.value).join("\n")) setSpec({ groupOrder: order });
            else render();
          },
        }));
      return lane;
    });
    return el("div", { class: "board" }, lanes);
  }

  function groupProps(key, value) {
    if (!value) return {};
    return { [key]: data.types[key] === "tags" ? [value] : value };
  }

  function card(row, key, lane) {
    const others = data.columns.filter((c) => c !== key && row.props[c] !== undefined && row.props[c] !== "").slice(0, 3);
    const node = el("div", { class: "tx-card record" },
      pageLink(row),
      others.map((c) => el("div", { class: "prop" }, shown(row.props[c], data.types[c], c))));
    // Dragged to another list: the row takes that list's value. Within a
    // list the view's sort decides the order.
    node.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, input, textarea")) return;
      drag.sortable(e, {
        item: node,
        lists: () => [...document.querySelectorAll(".lane")],
        itemsOf: (l) => [...l.children].filter((n) => n.classList.contains("record")),
        after: (l) => l.querySelector(":scope > .more, :scope > .new"),
        onDrop: (to) => {
          if (to.dataset.value !== lane) post({ type: "move", rel: row.rel, key, from: lane, to: to.dataset.value });
          else render();
        },
      });
    });
    return node;
  }

  // ------------------------------------------------------------- calendar
  const day = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const parseDay = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) ? new Date(v.slice(0, 10) + "T00:00:00") : null);

  function calendar() {
    const key = data.date;
    if (!key) return el("div", { class: "tx-empty" }, s("noDate"));
    if (!month) {
      const first = data.rows.map((r) => parseDay(r.props[key])).find(Boolean);
      const now = new Date();
      const inMonth = data.rows.some((r) => {
        const d = parseDay(r.props[key]);
        return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
      const base = inMonth || !first ? now : first;
      month = new Date(base.getFullYear(), base.getMonth(), 1);
    }
    const lang = s("locale");
    const shift = (n) => {
      month = new Date(month.getFullYear(), month.getMonth() + n, 1);
      render();
    };
    const nav = el("div", { class: "tx-bar month-bar" },
      el("strong", null, new Intl.DateTimeFormat(lang, { year: "numeric", month: "long" }).format(month)),
      el("span", { class: "tx-spacer" }),
      el("button", { type: "button", class: "tx-icon-button", "aria-label": s("prev"), onclick: () => shift(-1) }, icon("left")),
      el("button", { type: "button", class: "tx-button small", onclick: () => { month = null; render(); } }, s("today")),
      el("button", { type: "button", class: "tx-icon-button", "aria-label": s("next"), onclick: () => shift(1) }, icon("right")));
    // Monday first; six weeks always, so the block keeps its height.
    const start = new Date(month);
    start.setDate(1 - ((month.getDay() + 6) % 7));
    const names = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      names.push(el("div", { class: "weekday" }, new Intl.DateTimeFormat(lang, { weekday: "short" }).format(d)));
    }
    const on = new Map();
    for (const row of data.rows) {
      const from = parseDay(row.props[key]);
      if (!from) continue;
      const to = data.end ? parseDay(row.props[data.end]) : null;
      const last = to && to >= from && (to - from) / 864e5 <= 62 ? to : from;
      for (let d = new Date(from); d <= last; d.setDate(d.getDate() + 1)) {
        const k = day(d);
        if (!on.has(k)) on.set(k, []);
        on.get(k).push({ row, first: day(d) === day(from) });
      }
    }
    const today = day(new Date());
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const k = day(d);
      const weekend = i % 7 >= 5;
      const node = el("div", { class: "day" + (d.getMonth() !== month.getMonth() ? " other" : "") + (weekend ? " weekend" : "") + (k === today ? " today" : "") },
        el("span", { class: "num" }, String(d.getDate())),
        (on.get(k) || []).map((x) =>
          el("button", { type: "button", class: "chip" + (x.first ? "" : " cont"), title: x.row.name, onclick: () => post({ type: "open", rel: x.row.rel }) }, x.row.name)));
      node.addEventListener("dblclick", (e) => {
        if (e.target === node || e.target.classList.contains("num")) post({ type: "add", folder: data.folder, props: { [key]: k } });
      });
      days.push(node);
    }
    return el("div", null, nav, el("div", { class: "month" }, names, days));
  }

  // -------------------------------------------------------------- gallery
  function gallery() {
    return el("div", null, el("div", { class: "gallery" },
      capped(data.rows).map((row) => {
        const cover = typeof row.props.cover === "string" && /^https?:\/\//.test(row.props.cover) ? row.props.cover : null;
        const glyph = typeof row.props.icon === "string" ? row.props.icon : null;
        return el("div", { class: "tx-card tile" },
          (cover || glyph) && el("div", { class: "cover", style: cover ? "background-image:url(" + JSON.stringify(cover) + ")" : null }, cover ? "" : glyph),
          el("div", { class: "text" }, pageLink(row),
            data.columns.filter((c) => c !== "cover" && row.props[c] !== undefined).slice(0, 3).map((c) => el("div", { class: "prop" }, shown(row.props[c], data.types[c], c)))));
      })), moreMark(data.rows.length));
  }

  // ----------------------------------------------------------------- list
  function list() {
    return el("div", null, el("ul", { class: "rows-list" },
      capped(data.rows).map((row) => el("li", null, pageLink(row),
        data.columns.filter((c) => row.props[c] !== undefined && row.props[c] !== "").slice(0, 3)
          .map((c) => el("span", { class: "prop" }, shown(row.props[c], data.types[c], c)))))),
      moreMark(data.rows.length));
  }

  // ------------------------------------------------------ how many shown
  const cap = () => (data.spec.limit || PAGE) + more;
  const capped = (list) => list.slice(0, cap());
  /** The end of a list cut short: scrolled into view, the next rows come. */
  function moreMark(total) {
    if (total <= cap()) return null;
    const mark = el("div", { class: "more", "aria-hidden": "true" });
    nearEnd.observe(mark);
    return mark;
  }
  const nearEnd = new IntersectionObserver(
    (seen) => {
      if (!seen.some((x) => x.isIntersecting) || editing) return;
      more += PAGE;
      render();
    },
    { rootMargin: "0px 0px 200px 0px" },
  );

  // ---------------------------------------------------------------- views
  /** The base's views, one tab each. */
  function viewTabs() {
    const tabs = data.views.map((v) =>
      el("button", {
        type: "button",
        class: "tx-segment",
        role: "tab",
        "aria-selected": String(v.index === data.index),
        onclick: () => v.index !== data.index && choose(v.index),
        // A view's type, name or removal: its right-click menu.
        oncontextmenu: (e) => {
          e.preventDefault();
          viewMenu(e.currentTarget, v);
        },
      }, icon(VIEW_ICONS[v.view] || "table"), v.name || s(v.view)));
    const add = el("button", { type: "button", class: "tx-icon-button", "aria-label": s("addView"), onclick: (e) => addViewMenu(e.currentTarget) }, icon("plus"));
    return tabs.concat([add]);
  }
  function choose(index) {
    state.index = index;
    more = 0;
    month = null;
    keep();
    post({ type: "select", index });
  }
  async function viewMenu(at, v) {
    const items = [
      { label: s("type"), items: VIEWS.map((k) => ({ label: s(k), value: "as:" + k, checked: v.view === k })) },
      { label: s("renameView") + "…", value: "rename" },
    ];
    if (data.views.length > 1) items.push("separator", { label: s("deleteView"), value: "delete", danger: true });
    const choice = await api.menu(items, at);
    if (choice === null) return;
    if (choice === "rename") post({ type: "renameView", name: v.name, index: v.index });
    else if (choice === "delete") post({ type: "deleteView", index: v.index });
    else if (String(choice).startsWith("as:")) post({ type: "view", view: String(choice).slice(3), index: v.index });
  }
  async function addViewMenu(at) {
    const choice = await api.menu(VIEWS.map((k) => ({ label: s(k), value: k })), at);
    if (choice !== null) post({ type: "addView", view: choice });
  }

  // ---------------------------------------------------------------- frame
  function render() {
    stale = false;
    const body = $("body");
    if (!data) return;
    if (data.error) return body.replaceChildren(el("div", { class: "tx-empty problem" }, data.error, data.detail ? el("div", { class: "detail" }, data.detail) : null));
    if (data.missing) return body.replaceChildren(el("div", { class: "tx-empty" }, s("missing")));
    const view = data.spec.view;
    $("fold").setAttribute("aria-label", s(state.folded ? "unfold" : "fold"));
    $("fold").setAttribute("aria-expanded", String(!state.folded));
    document.body.classList.toggle("folded", state.folded);
    $("views").replaceChildren(...viewTabs());
    $("filter").setAttribute("aria-label", s("filter"));
    $("sort").setAttribute("aria-label", s("sort"));
    $("count").textContent = s("count").replace("{0}", String(data.rows.length));
    $("add").replaceChildren(icon("plus"), s("add"));
    $("rules").replaceChildren(...rules());
    const notes = [];
    if (data.skipped && data.skipped.length) notes.push(el("div", { class: "tx-footnote skipped", title: data.skipped.join("\n") }, s("skipped").replace("{0}", String(data.skipped.length))));
    if (data.spec.unknownView) notes.push(el("div", { class: "tx-footnote" }, s("unknownView").replace("{0}", data.spec.unknownView)));
    $("notes").replaceChildren(...notes);
    if (state.folded) return body.replaceChildren();
    if (!data.rows.length && view !== "calendar" && view !== "table") return body.replaceChildren(el("div", { class: "tx-empty" }, s("empty")));
    nearEnd.disconnect();
    body.replaceChildren(view === "board" ? board() : view === "calendar" ? calendar() : view === "gallery" ? gallery() : view === "list" ? list() : table());
    pinHead();
  }
  window.addEventListener("scroll", pinHead, { passive: true });

  $("add").addEventListener("click", () => {
    if (!data) return;
    const button = document.querySelector(".tx-table .new");
    if (button) button.click();
    else post({ type: "add", folder: data.folder, props: {} });
  });
  $("filter").addEventListener("click", (e) => data && filterMenu(e.currentTarget));
  $("fold").addEventListener("click", () => {
    state.folded = !state.folded;
    keep();
    post({ type: "fold", folded: state.folded });
    render();
  });
  $("sort").addEventListener("click", (e) => data && sortMenu(e.currentTarget));
  api.onMessage((m) => {
    if (m && m.type === "selected") {
      state.index = m.index;
      if (typeof m.folded === "boolean") state.folded = m.folded;
      more = 0;
      keep();
      return;
    }
    if (!m || m.type !== "data") return;
    if (data && data.spec && m.data.spec && data.spec.view !== m.data.spec.view) month = null;
    data = m.data;
    if (editing) stale = true;
    else render();
  });
  post({ type: "ready", index: state.index });
})();
