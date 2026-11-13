// A filter on a property with options (a select, tags, a checkbox), as
// Notion has it: a bubble under its chip with the rule's verb and a box to
// tick for each option, each tick applied at once; Clear selection takes
// the filter off. view.js's rules row opens it; loaded before view.js.
window.databaseFilterPopover = function (page) {
  "use strict";
  const { api, el, s, setSpec, label, typeOf } = page;

  /** The rule's verbs for a property: "any of" and "none of" (by equality,
   *  or by contains for tags), and whether it is empty. */
  function verbs(key) {
    const tags = typeOf(key) === "tags";
    return [
      { op: tags ? "hasAny" : "in", label: s(tags ? "contains" : "is") },
      { op: tags ? "!hasAny" : "!in", label: s(tags ? "notContains" : "isNot") },
      { op: "empty", label: s("isEmpty") },
      { op: "!empty", label: s("notEmpty") },
    ];
  }

  /** The values a property's boxes offer. */
  function choices(key) {
    if (typeOf(key) === "checkbox") return ["true", "false"];
    return page.data.options[key] || [];
  }
  const shown = (key, value) =>
    typeOf(key) === "checkbox" ? (value === "true" ? "☑" : "☐") : value;

  /** Whether a property's filter is ticked here rather than typed. */
  const ticked = (key) => ["select", "tags", "checkbox"].includes(typeOf(key)) && choices(key).length > 0;

  /** The chip's words: "Status: To do, Doing", "Due: is empty". */
  function chipText(f) {
    const values = [].concat(f.value).map((v) => shown(f.key, v));
    const verb = verbs(f.key).find((v) => v.op === f.op);
    if (f.op === "in" || f.op === "hasAny") return label(f.key) + ": " + values.join(", ");
    if (f.op === "empty" || f.op === "!empty") return label(f.key) + ": " + verb.label.toLowerCase();
    return label(f.key) + ": " + (verb ? verb.label.toLowerCase() + " " : "") + values.join(", ");
  }

  let open = null;
  function close() {
    if (!open) return;
    open.remove();
    open = null;
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", escape, true);
  }
  const outside = (e) => open && !open.contains(e.target) && !e.target.closest(".tx-chip") && close();
  const escape = (e) => e.key === "Escape" && close();

  /** The bubble for the filter at `index` (or a new one on `key`), under
   *  `chip`. */
  function show(chip, key, index) {
    close();
    const filters = () => page.data.spec.filters;
    const start = index === undefined ? null : filters()[index];
    // Kept here, ahead of the page's data, which arrives once the host has
    // saved: two quick ticks both count.
    const state = {
      // A rule of one value, from before or written by hand, as one tick.
      op: start ? ({ "=": "in", "!=": "!in", has: "hasAny", "!has": "!hasAny" }[start.op] || start.op) : verbs(key)[0].op,
      values: start && start.value !== "" ? [].concat(start.value) : [],
    };
    const write = (rule) => {
      const rest = filters().filter((_, i) => i !== index);
      if (rule && index === undefined) index = rest.length;
      setSpec({ filters: rule ? rest.slice(0, index).concat([rule], rest.slice(index)) : rest });
    };
    // The verb is the app's menu button, not the system's dropdown.
    const verbName = el("span", {});
    const verb = el(
      "button",
      { type: "button", class: "tx-select", "aria-label": s("filter"), "aria-haspopup": "menu" },
      verbName,
      el("span", { class: "tx-icon", "data-icon": "chevron" }),
    );
    const named = () => (verbName.textContent = verbs(key).find((v) => v.op === state.op)?.label || "");
    named();
    const boxes = el("div", { class: "filter-boxes" });
    const draw = () => {
      const empty = state.op === "empty" || state.op === "!empty";
      boxes.replaceChildren(
        ...(empty
          ? []
          : choices(key).map((value) => {
              const box = el("input", { type: "checkbox", class: "ui-check" });
              box.checked = state.values.includes(value);
              box.addEventListener("change", () => {
                state.values = state.values.filter((v) => v !== value);
                if (box.checked) state.values.push(value);
                write(state.values.length ? { key, op: state.op, value: state.values } : null);
              });
              return el("label", { class: "filter-box" }, box, shown(key, value));
            })),
      );
    };
    verb.addEventListener("click", async () => {
      const chosen = await api.menu(
        verbs(key).map((v) => ({ label: v.label, value: v.op, checked: v.op === state.op })),
        verb,
      );
      if (typeof chosen !== "string" || chosen === state.op) return;
      state.op = chosen;
      named();
      const empty = state.op === "empty" || state.op === "!empty";
      if (empty) write({ key, op: state.op, value: "" });
      else if (state.values.length) write({ key, op: state.op, value: state.values });
      draw();
    });
    const clear = el("button", { type: "button", class: "tx-button small" }, s("clearSelection"));
    clear.addEventListener("click", () => {
      write(null);
      close();
    });
    open = el(
      "div",
      { class: "tx-bubble filter-popover", "data-bubble-tail": "top", role: "dialog", "aria-label": label(key) },
      el("div", { class: "filter-head" }, label(key), verb),
      boxes,
      clear,
    );
    draw();
    const at = chip.getBoundingClientRect();
    open.style.left = at.left + window.scrollX + "px";
    open.style.top = at.bottom + window.scrollY + 8 + "px";
    document.body.append(open);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", escape, true);
  }

  return { ticked, chipText, show, close };
};
