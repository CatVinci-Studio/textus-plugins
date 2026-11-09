// A database page's views beside its table: a board (cards dragged between
// lists), a calendar, a gallery and a list. view.js makes them with what
// they draw with; loaded before it.
window.databaseViews = function (page) {
  "use strict";
  const { el, icon, s, post, setSpec, shown, tag, isStatus, label, pageLink, newButton, capped, moreMark, render } = page;
  /** The calendar's month on screen; null: the month its rows begin in. */
  let month = null;

  // ---------------------------------------------------------------- board
  function board() {
    const key = page.data.group;
    if (!key) return el("div", { class: "tx-empty" }, s("noGroup"));
    const byRel = new Map(page.data.rows.map((r) => [r.rel, r]));
    const lanes = page.data.groups.map((g) => {
      const head = el("div", { class: "tx-lane-head lane-head", title: s("dragLane") },
        g.value ? tag(g.value, key, isStatus(key)) : el("span", { class: "tx-tag" }, s("noValue")),
        el("span", { class: "count" }, String(g.rels.length)));
      const lane = el("div", { class: "tx-lane lane", "data-value": g.value },
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
            const order = page.data.groups.map((x) => x.value).filter((v) => v !== g.value);
            order.splice(index, 0, g.value);
            if (order.join("\n") !== page.data.groups.map((x) => x.value).join("\n")) setSpec({ groupOrder: order });
            else render();
          },
        }));
      return lane;
    });
    return el("div", { class: "tx-board board" }, lanes);
  }

  function groupProps(key, value) {
    if (!value) return {};
    return { [key]: page.data.types[key] === "tags" ? [value] : value };
  }

  function card(row, key, lane) {
    const others = page.data.columns.filter((c) => c !== key && row.props[c] !== undefined && row.props[c] !== "").slice(0, 3);
    const node = el("div", { class: "tx-card record" },
      pageLink(row),
      others.map((c) => el("div", { class: "prop" }, shown(row.props[c], page.data.types[c], c))));
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
    const key = page.data.date;
    if (!key) return el("div", { class: "tx-empty" }, s("noDate"));
    if (!month) {
      const first = page.data.rows.map((r) => parseDay(r.props[key])).find(Boolean);
      const now = new Date();
      const inMonth = page.data.rows.some((r) => {
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
    for (const row of page.data.rows) {
      const from = parseDay(row.props[key]);
      if (!from) continue;
      const to = page.data.end ? parseDay(row.props[page.data.end]) : null;
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
        if (e.target === node || e.target.classList.contains("num")) post({ type: "add", folder: page.data.folder, props: { [key]: k } });
      });
      days.push(node);
    }
    return el("div", null, nav, el("div", { class: "month" }, names, days));
  }

  // -------------------------------------------------------------- gallery
  function gallery() {
    return el("div", null, el("div", { class: "gallery" },
      capped(page.data.rows).map((row) => {
        const cover = typeof row.props.cover === "string" && /^https?:\/\//.test(row.props.cover) ? row.props.cover : null;
        const glyph = typeof row.props.icon === "string" ? row.props.icon : null;
        return el("div", { class: "tx-card tile" },
          (cover || glyph) && el("div", { class: "cover", style: cover ? "background-image:url(" + JSON.stringify(cover) + ")" : null }, cover ? "" : glyph),
          el("div", { class: "text" }, pageLink(row),
            page.data.columns.filter((c) => c !== "cover" && row.props[c] !== undefined).slice(0, 3).map((c) => el("div", { class: "prop" }, shown(row.props[c], page.data.types[c], c)))));
      })), moreMark(page.data.rows.length));
  }

  // ----------------------------------------------------------------- list
  function list() {
    return el("div", null, el("ul", { class: "rows-list" },
      capped(page.data.rows).map((row) => el("li", null, pageLink(row),
        page.data.columns.filter((c) => row.props[c] !== undefined && row.props[c] !== "").slice(0, 3)
          .map((c) => el("span", { class: "prop" }, shown(row.props[c], page.data.types[c], c)))))),
      moreMark(page.data.rows.length));
  }

  return { board, calendar, gallery, list, resetMonth: () => (month = null) };
};
