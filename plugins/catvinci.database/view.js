// A database block's page: the rows host.js sends, as a table (cells
// edited in place), a board (cards dragged between lists), a calendar or a
// gallery. Every change goes back to the host, which writes the documents.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const VIEWS = ["table", "board", "calendar", "gallery"];
  let data = null;
  let month = null;

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

  /** A tag's colour, the same for the same word everywhere. */
  function hue(word) {
    let h = 0;
    for (const c of String(word)) h = (h * 31 + c.codePointAt(0)) % 360;
    return "hsl(" + h + " 55% 48%)";
  }
  const tag = (word) => el("span", { class: "tag", style: "--tag-hue:" + hue(word) }, String(word));

  function shown(value, type, key) {
    if (value === null || value === undefined || value === "") return "";
    if (Array.isArray(value)) return value.map(tag);
    if (type === "checkbox") return value ? "☑" : "☐";
    if (type === "number" && /^(rate|rating|stars?)$/i.test(key) && value >= 0 && value <= 5)
      return el("span", { class: "stars" }, "★".repeat(Math.round(value)) + "☆".repeat(5 - Math.round(value)));
    if (type === "url") return el("a", { href: value, target: "_blank" }, String(value));
    return String(value);
  }

  function pageLink(row) {
    const icon = typeof row.props.icon === "string" ? row.props.icon + " " : "";
    return el("button", { type: "button", class: "page-link", onclick: () => post({ type: "open", rel: row.rel }) }, icon + row.name);
  }

  // ---------------------------------------------------------------- table
  function table() {
    const head = el("tr", null, el("th", null, s("page")), data.columns.map((c) => el("th", null, c)));
    const rows = data.rows.map((row) =>
      el("tr", null, el("td", null, pageLink(row)), data.columns.map((key) => cell(row, key))),
    );
    return el("div", { class: "table-wrap" }, el("table", null, el("thead", null, head), el("tbody", null, rows)));
  }

  function cell(row, key) {
    const type = data.types[key] || "text";
    const value = row.props[key];
    const td = el("td", { class: "cell", "data-key": key }, shown(value, type, key));
    if (type === "checkbox") {
      td.addEventListener("click", () => post({ type: "set", rel: row.rel, key, value: !value }));
      return td;
    }
    td.addEventListener("click", () => {
      if (td.querySelector("input")) return;
      const input = el("input", {
        type: type === "date" ? "date" : type === "number" ? "number" : "text",
        value: Array.isArray(value) ? value.join(", ") : value === undefined || value === null ? "" : String(value),
      });
      let done = false;
      const commit = (keep) => {
        if (done) return;
        done = true;
        if (!keep) return render();
        const text = input.value.trim();
        const next =
          type === "tags" ? text.split(",").map((v) => v.trim()).filter(Boolean)
          : type === "number" ? (text === "" ? null : Number(text))
          : text;
        post({ type: "set", rel: row.rel, key, value: next });
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commit(true);
        if (e.key === "Escape") commit(false);
      });
      input.addEventListener("blur", () => commit(true));
      td.replaceChildren(input);
      input.focus();
    });
    return td;
  }

  // ---------------------------------------------------------------- board
  function board() {
    const key = data.group;
    if (!key) return el("div", { class: "empty" }, s("noGroup"));
    const byRel = new Map(data.rows.map((r) => [r.rel, r]));
    const lanes = data.groups.map((g) => {
      const lane = el(
        "div",
        { class: "lane", "data-value": g.value },
        el("div", { class: "lane-head" }, el("span", null, g.value || s("noValue")), el("span", { class: "prop" }, String(g.rels.length))),
        g.rels.map((rel) => card(byRel.get(rel), key, g.value)),
        el("button", { type: "button", class: "new", onclick: () => post({ type: "add", folder: data.folder, props: groupProps(key, g.value) }) }, "+ " + s("add")),
      );
      lane.addEventListener("dragover", (e) => {
        e.preventDefault();
        lane.classList.add("drop");
      });
      lane.addEventListener("dragleave", () => lane.classList.remove("drop"));
      lane.addEventListener("drop", (e) => {
        e.preventDefault();
        lane.classList.remove("drop");
        const moved = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
        if (moved.rel && moved.from !== g.value) post({ type: "move", rel: moved.rel, key, from: moved.from, to: g.value });
      });
      return lane;
    });
    return el("div", { class: "board" }, lanes);
  }

  function groupProps(key, value) {
    if (!value) return {};
    return { [key]: data.types[key] === "tags" ? [value] : value };
  }

  function card(row, key, lane) {
    const others = data.columns.filter((c) => c !== key && row.props[c] !== undefined).slice(0, 3);
    const node = el(
      "div",
      { class: "card", draggable: "true" },
      pageLink(row),
      others.map((c) => el("div", { class: "prop" }, shown(row.props[c], data.types[c], c))),
    );
    node.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", JSON.stringify({ rel: row.rel, from: lane })));
    return node;
  }

  // ------------------------------------------------------------- calendar
  const day = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const parseDay = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) ? new Date(v.slice(0, 10) + "T00:00:00") : null);

  function calendar() {
    const key = data.date;
    if (!key) return el("div", { class: "empty" }, s("noDate"));
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
    const title = new Intl.DateTimeFormat(lang, { year: "numeric", month: "long" }).format(month);
    const shift = (n) => {
      month = new Date(month.getFullYear(), month.getMonth() + n, 1);
      render();
    };
    const nav = el(
      "div",
      { class: "nav" },
      el("strong", null, title),
      el("button", { type: "button", "aria-label": s("prev"), onclick: () => shift(-1) }, "‹"),
      el("button", { type: "button", onclick: () => { month = null; render(); } }, s("today")),
      el("button", { type: "button", "aria-label": s("next"), onclick: () => shift(1) }, "›"),
    );
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
      const cls = "day" + (d.getMonth() !== month.getMonth() ? " other" : "") + (k === today ? " today" : "");
      const node = el(
        "div",
        { class: cls },
        el("span", { class: "num" }, String(d.getDate())),
        (on.get(k) || []).map((x) =>
          el("button", { type: "button", class: "chip" + (x.first ? "" : " cont"), title: x.row.name, onclick: () => post({ type: "open", rel: x.row.rel }) }, x.row.name),
        ),
      );
      node.addEventListener("dblclick", (e) => {
        if (e.target === node || e.target.classList.contains("num")) post({ type: "add", folder: data.folder, props: { [key]: k } });
      });
      days.push(node);
    }
    return el("div", null, nav, el("div", { class: "month" }, names, days));
  }

  // -------------------------------------------------------------- gallery
  function gallery() {
    return el(
      "div",
      { class: "gallery" },
      data.rows.map((row) => {
        const cover = typeof row.props.cover === "string" && /^https?:\/\//.test(row.props.cover) ? row.props.cover : null;
        const icon = typeof row.props.icon === "string" ? row.props.icon : null;
        return el(
          "div",
          { class: "tile" },
          (cover || icon) &&
            el("div", { class: "cover", style: cover ? "background-image:url(" + JSON.stringify(cover) + ")" : null }, cover ? "" : icon),
          el(
            "div",
            { class: "text" },
            pageLink(row),
            data.columns.filter((c) => c !== "cover" && row.props[c] !== undefined).slice(0, 3).map((c) => el("div", { class: "prop" }, shown(row.props[c], data.types[c], c))),
          ),
        );
      }),
    );
  }

  // ---------------------------------------------------------------- frame
  function render() {
    const body = $("body");
    if (!data) return;
    if (data.error) return body.replaceChildren(el("div", { class: "problem" }, data.error));
    if (data.missing) return body.replaceChildren(el("div", { class: "empty" }, s("missing")));
    const view = data.spec.view;
    $("views").replaceChildren(
      ...VIEWS.map((v) =>
        el("button", { type: "button", role: "tab", "aria-selected": String(v === view), onclick: () => v !== view && post({ type: "view", view: v }) }, s(v)),
      ),
    );
    $("count").textContent = s("count").replace("{0}", String(data.rows.length));
    $("add").textContent = "+ " + s("add");
    if (!data.rows.length && view !== "calendar") return body.replaceChildren(el("div", { class: "empty" }, s("empty")));
    body.replaceChildren(view === "board" ? board() : view === "calendar" ? calendar() : view === "gallery" ? gallery() : table());
  }

  $("add").addEventListener("click", () => data && post({ type: "add", folder: data.folder, props: {} }));
  api.onMessage((m) => {
    if (!m || m.type !== "data") return;
    if (data && data.spec && m.data.spec && data.spec.view !== m.data.spec.view) month = null;
    data = m.data;
    render();
  });
  post({ type: "ready" });
})();
