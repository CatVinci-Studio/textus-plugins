// A database page's view tabs: one a view, picked with a click, changed
// from its right-click menu, dragged to a new place; and the + that adds
// one. view.js makes them with what they draw with; loaded before it.
window.databaseTabs = function (page) {
  "use strict";
  const { api, $, el, icon, s, post, render, choose } = page;
  const VIEWS = ["table", "board", "calendar", "gallery", "list"];
  const VIEW_ICONS = { table: "table", board: "board", calendar: "calendar", gallery: "gallery", list: "list" };

  /** The base's views, one tab each, and the +. */
  function viewTabs() {
    const data = page.data;
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
        onpointerdown: (e) => moveTab(e, v),
      }, icon(VIEW_ICONS[v.view] || "table"), v.name || s(v.view)));
    const add = el("button", { type: "button", class: "tx-icon-button", "aria-label": s("addView"), onclick: (e) => addViewMenu(e.currentTarget) }, icon("plus"));
    return tabs.concat([add]);
  }

  /** A tab dragged along the others to a new place, kept in the base. */
  function moveTab(e, v) {
    // No text selected from the press: in WebKit a selection starts a drag
    // of its own and the tab never moves.
    if (e.pointerType === "mouse") e.preventDefault();
    drag.sortable(e, {
      item: e.currentTarget,
      axis: "x",
      lists: () => [$("views")],
      itemsOf: (l) => [...l.querySelectorAll('[role="tab"]')],
      onDrop: (_l, to) => (to !== v.index ? post({ type: "moveView", from: v.index, to }) : render()),
    });
  }

  async function viewMenu(at, v) {
    const items = [
      { label: s("type"), items: VIEWS.map((k) => ({ label: s(k), value: "as:" + k, checked: v.view === k })) },
      { label: s("renameView") + "…", value: "rename" },
    ];
    if (page.data.views.length > 1) items.push("separator", { label: s("deleteView"), value: "delete", danger: true });
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

  return { viewTabs };
};
