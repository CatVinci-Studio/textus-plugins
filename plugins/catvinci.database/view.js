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
  // Each reader's own: the view in front. Folding the block is Textus's.
  const state = Object.assign({ index: 0 }, api.getState() || {});
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

  /** A rating column: five stars when every row's value fits them, else
   *  each as a star and its number - one look down the whole column. */
  const isRating = (key) => /^(rate|rating|stars?)$/i.test(key || "");
  const fits = new WeakMap();
  function starsFit(key) {
    if (!fits.has(data)) fits.set(data, new Map());
    const known = fits.get(data);
    if (!known.has(key))
      known.set(key, data.rows.every((r) => {
        const v = r.props[key];
        return v === null || v === undefined || v === "" || (typeof v === "number" && v >= 0 && v <= 5);
      }));
    return known.get(key);
  }

  function shown(value, type, key) {
    if (type === "checkbox")
      return el("input", { type: "checkbox", class: "ui-check", checked: value === true, tabindex: "-1", "aria-label": key });
    if (value === null || value === undefined || value === "") return "";
    if (Array.isArray(value)) return el("span", { class: "tags" }, value.map((v) => tag(v, key)));
    if (type === "select") return tag(value, key, isStatus(key));
    if (type === "number" && isRating(key))
      return starsFit(key)
        ? el("span", { class: "tx-rating" }, "★".repeat(Math.round(value)) + "☆".repeat(5 - Math.round(value)))
        : el("span", { class: "tx-rating" }, "★ ", el("span", { class: "tx-value" }, String(value)));
    if (type === "url") return el("a", { href: value, target: "_blank", onclick: (e) => e.stopPropagation() }, String(value));
    return String(value);
  }

  const pageLink = (row) =>
    el("button", { type: "button", class: "page-link", onclick: () => post({ type: "open", rel: row.rel }) },
      (typeof row.props.icon === "string" ? row.props.icon + " " : "") + row.name);

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
    const rows = capped(data.rows).map((row) => el("tr", { "data-rel": row.rel }, titleCell(row), data.columns.map((key) => cell(row, key)), el("td", { class: "plus" })));
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

  /** A column dragged by its head among the others, as the sidebar's tabs
   *  are: the column itself lifts and follows the pointer, the ones it
   *  passes slide aside; letting go keeps the order in the view. */
  function moveColumn(e, node, key) {
    if (e.target.closest(".col-resize")) return;
    const frame = node.closest(".tx-table-frame");
    const cells = (k) => frame.querySelectorAll('[data-key="' + CSS.escape(k) + '"]');
    const order = data.columns.slice();
    let slots = [];
    let at = order.indexOf(key);
    // A page drawn in a zoomed document: the pointer moves in screen
    // pixels, the cells in the page's.
    let zoom = 1;
    /** Where it will land, kept as an outline. */
    const slot = el("div", { class: "col-slot", "aria-hidden": "true" });
    let frameLeft = 0;
    const place = (k, dx, lifted) => {
      for (const c of cells(k)) {
        c.style.transform = dx ? "translateX(" + dx + "px)" : "";
        c.classList.toggle("col-lifted", lifted);
      }
    };
    drag.track(e, {
      start: () => {
        // Where each column sits before anything moves.
        slots = order.map((k) => {
          const r = cells(k)[0].getBoundingClientRect();
          return { key: k, left: r.left, middle: r.left + r.width / 2, width: r.width };
        });
        zoom = node.getBoundingClientRect().width / node.offsetWidth || 1;
        frameLeft = frame.getBoundingClientRect().left;
        frame.classList.add("col-moving");
        frame.append(slot);
      },
      move: (x) => {
        const from = order.indexOf(key);
        const me = slots[from];
        const dx = (x - e.clientX) / zoom;
        const middle = me.middle + x - e.clientX;
        at = from;
        slots.forEach((s, i) => {
          if (i < from && middle < s.middle) at = Math.min(at, i);
          if (i > from && middle > s.middle) at = Math.max(at, i);
        });
        // The hole moves to where it would land: the others close it up.
        const landing = at <= from ? slots[at].left : slots[at].left + slots[at].width - me.width;
        slot.style.left = (landing - frameLeft) / zoom + "px";
        slot.style.width = me.width / zoom + "px";
        slots.forEach((s, i) => {
          if (i === from) return place(s.key, dx, true);
          const room = me.width / zoom;
          const shift = i >= at && i < from ? room : i <= at && i > from ? -room : 0;
          place(s.key, shift, false);
        });
      },
      end: (_x, _y, dropped) => {
        frame.classList.remove("col-moving");
        slot.remove();
        for (const k of order) place(k, 0, false);
        const from = order.indexOf(key);
        if (!dropped || at === from) return render();
        const next = order.filter((c) => c !== key);
        next.splice(at, 0, key);
        setSpec({ columns: next });
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

  const { DATE, dateInput } = databaseDates({ el, icon, s });

  /** `td` as a field holding `value`; `commit(text)` on Enter or leaving. */
  function editInline(td, value, kind, commit) {
    const text = value === undefined || value === null ? "" : String(value);
    const input = kind === "date" ? dateInput({ class: "tx-inline-input cell-input", value: text }) : el("input", { type: kind, class: "tx-inline-input cell-input", value: text });
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

  const views = databaseViews({
    el, icon, s, post, setSpec, shown, tag, isStatus, label, pageLink, newButton, capped, moreMark, render,
    get data() {
      return data;
    },
  });

  const { rules, filterMenu, sortMenu, filterOn } = databaseRules({
    api, $, el, icon, s, post, setSpec, label, typeOf, allKeys, render, dateInput,
    setEditing: (on) => (editing = on),
    get data() {
      return data;
    },
  });
  // ----------------------------------------------------------------- rows
  // A row's own menu, wherever it shows (a table row, a card, a tile, a
  // day's chip): open it, or delete it.
  document.addEventListener("contextmenu", async (e) => {
    const row = e.target.closest("[data-rel]");
    if (!row || e.target.closest("input, textarea")) return;
    e.preventDefault();
    const choice = await api.menu([
      { label: s("open"), value: "open" },
      "separator",
      { label: s("deleteRow"), value: "delete", danger: true },
    ], { x: e.clientX, y: e.clientY });
    if (choice === "open") post({ type: "open", rel: row.dataset.rel });
    else if (choice === "delete") post({ type: "deleteRow", rel: row.dataset.rel });
  });

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
        // Dragged along the others to a new place.
        onpointerdown: (e) =>
          drag.sortable(e, {
            item: e.currentTarget,
            axis: "x",
            lists: () => [$("views")],
            itemsOf: (l) => [...l.querySelectorAll('[role="tab"]')],
            onDrop: (_l, to) => (to !== v.index ? post({ type: "moveView", from: v.index, to }) : render()),
          }),
      }, icon(VIEW_ICONS[v.view] || "table"), v.name || s(v.view)));
    const add = el("button", { type: "button", class: "tx-icon-button", "aria-label": s("addView"), onclick: (e) => addViewMenu(e.currentTarget) }, icon("plus"));
    return tabs.concat([add]);
  }
  function choose(index) {
    state.index = index;
    more = 0;
    views.resetMonth();
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
    if (!data.rows.length && view !== "calendar" && view !== "table") return body.replaceChildren(el("div", { class: "tx-empty" }, s("empty")));
    nearEnd.disconnect();
    body.replaceChildren(({ board: views.board, calendar: views.calendar, gallery: views.gallery, list: views.list }[view] || table)());
  }

  $("add").addEventListener("click", () => {
    if (!data) return;
    const button = document.querySelector(".tx-table .new");
    if (button) button.click();
    else post({ type: "add", folder: data.folder, props: {} });
  });
  $("filter").addEventListener("click", (e) => data && filterMenu(e.currentTarget));
  $("sort").addEventListener("click", (e) => data && sortMenu(e.currentTarget));
  api.onMessage((m) => {
    if (m && m.type === "selected") {
      state.index = m.index;
      more = 0;
      keep();
      return;
    }
    if (!m || m.type !== "data") return;
    if (data && data.spec && m.data.spec && data.spec.view !== m.data.spec.view) views.resetMonth();
    data = m.data;
    if (editing) stale = true;
    else render();
  });
  post({ type: "ready", index: state.index });
})();
