// A database page's view tabs: one a view, picked with a click, changed
// from its right-click menu, dragged to a new place; and the + that adds
// one. view.js makes them with what they draw with; loaded before it.
window.databaseTabs = function (page) {
  "use strict";
  const { api, $, el, icon, s, post, render, choose } = page;
  const VIEWS = ["table", "board", "calendar", "gallery", "list"];
  const VIEW_ICONS = { table: "table", board: "board", calendar: "calendar", gallery: "gallery", list: "list" };
  // A tab dragged along the others to a new place, kept in the base.
  window.textus.drag.reorder($("views"), {
    items: '[role="tab"]',
    axis: "x",
    onDrop: (from, to) => post({ type: "moveView", from: page.data.views[from].index, to }),
  });

  /** A view's name in the menus: ours by its kind, another plugin's by
   *  its label. */
  const kindLabel = (k) => {
    const other = (page.data.pluginViews || []).find((v) => v.id === k);
    return other ? other.label : s(k);
  };
  /** Every kind of view: ours, then other plugins'. */
  const kinds = () => VIEWS.concat((page.data.pluginViews || []).map((v) => v.id));

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
        // No text selected from the press: in WebKit a selection starts a
        // drag of its own and the tab never moves.
        onpointerdown: (e) => e.pointerType === "mouse" && e.preventDefault(),
      }, icon(VIEW_ICONS[v.view] || "list"), el("span", { class: "tx-segment-label" }, v.name || kindLabel(v.view))));
    const add = el("button", { type: "button", class: "tx-icon-button", "aria-label": s("addView"), onclick: (e) => addViewMenu(e.currentTarget) }, icon("plus"));
    return tabs.concat([add]);
  }

  async function viewMenu(at, v) {
    const items = [
      { label: s("type"), items: kinds().map((k) => ({ label: kindLabel(k), value: "as:" + k, checked: v.view === k })) },
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
    const choice = await api.menu(kinds().map((k) => ({ label: kindLabel(k), value: k })), at);
    if (choice !== null) post({ type: "addView", view: choice });
  }

  /** In a narrow block, the tabs as one button: the view shown, opening a
   *  menu of all of them and Add View. */
  function viewPicker() {
    const data = page.data;
    const now = data.views.find((v) => v.index === data.index) || data.views[0];
    return now
      ? [icon(VIEW_ICONS[now.view] || "list"), el("span", { class: "label" }, now.name || kindLabel(now.view)), icon("chevron")]
      : [];
  }

  async function pickView(at) {
    const data = page.data;
    const items = data.views.map((v) => ({ label: v.name || kindLabel(v.view), value: "view:" + v.index, checked: v.index === data.index }));
    items.push("separator", { label: s("addView"), items: kinds().map((k) => ({ label: kindLabel(k), value: "add:" + k })) });
    const choice = await api.menu(items, at);
    if (choice === null) return;
    const [kind, value] = String(choice).split(":");
    if (kind === "add") post({ type: "addView", view: value });
    else if (Number(value) !== data.index) choose(Number(value));
  }

  return { viewTabs, viewPicker, pickView };
};
