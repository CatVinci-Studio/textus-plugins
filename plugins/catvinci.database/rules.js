// A database page's rules row: the view's filters and sorts as chips, and
// the menus that add and change them. view.js makes it with what it draws
// with; loaded before it.
window.databaseRules = function (page) {
  "use strict";
  const { api, $, el, icon, s, post, setSpec, label, typeOf, allKeys, render, dateInput, setEditing } = page;

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
    } else if ((type === "select" || type === "tags") && (page.data.options[key] || []).length) {
      value = await api.menu(page.data.options[key].map((o) => ({ label: o })), at);
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
        ? dateInput({ class: "tx-inline-input cell-input", "aria-label": s("value") })
        : el("input", { type: type === "number" ? "number" : "text", class: "tx-inline-input cell-input", "aria-label": s("value") });
    holder.append(input);
    setEditing(true);
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      setEditing(false);
      if (ok && input.value.trim() !== "") post({ type: "addFilter", key, op, value: input.value.trim(), replace });
      render();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish(true);
      if (e.key === "Escape") finish(false);
    });
    // Not while Textus's text menu is open over it (data-menu-open).
    input.addEventListener("blur", () => input.hasAttribute("data-menu-open") || finish(true));
    input.focus();
    if (input.openMonth) input.openMonth();
  }

  async function filterMenu(at) {
    const key = await api.menu(allKeys().map((k) => ({ label: label(k), value: k })), at);
    if (key !== null) filterOn(key, at);
  }

  async function sortMenu(at) {
    const sort = page.data.spec.sort;
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
    const chips = page.data.spec.filters.map((f, i) =>
      f.raw !== undefined ? el("button", {
        type: "button",
        class: "tx-chip raw",
        title: String(f.raw),
        onclick: async (e) => {
          const choice = await api.menu([{ label: s("remove"), value: "remove", danger: true }], e.currentTarget);
          if (choice === "remove") setSpec({ filters: page.data.spec.filters.filter((_, j) => j !== i) });
        },
      }, String(f.raw)) : el("button", {
        type: "button",
        class: "tx-chip",
        onclick: async (e) => {
          const at = e.currentTarget;
          const choice = await api.menu([{ label: s("filter") + "…", value: "change" }, { label: s("remove"), value: "remove", danger: true }], at);
          if (choice === "remove") setSpec({ filters: page.data.spec.filters.filter((_, j) => j !== i) });
          if (choice === "change") filterOn(f.key, at, i);
        },
      }, filterText(f), icon("chevron")),
    );
    for (const x of page.data.spec.sort)
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
          const rest = page.data.spec.sort.filter((y) => y.key !== x.key);
          setSpec({ sort: choice === "remove" ? rest : page.data.spec.sort.map((y) => (y.key === x.key ? { key: y.key, desc: choice === "desc" } : y)) });
        },
      }, icon("sort"), label(x.key), icon("chevron")));
    return chips;
  }

  return { rules, filterMenu, sortMenu, filterOn };
};
