// A database page's row menu: a right-click on a row wherever it shows (a
// table row, a card, a tile, a day's chip), laid out as a Markdown table's
// in the editor. view.js wires it with what it does; loaded before it.
window.databaseRows = function (page) {
  "use strict";
  const { api, s, post, columnItems, columnChoice, addColumnMenu } = page;
  // Insert below and to the right first, then the row's and the column's.
  const prefixed = (prefix, items) =>
    items.map((item) => (item === "separator" ? item : item.items ? { ...item, items: prefixed(prefix, item.items) } : { ...item, value: prefix + item.value }));
  document.addEventListener("contextmenu", async (e) => {
    const row = e.target.closest("[data-rel]");
    if (!row) return;
    e.preventDefault();
    const at = { x: e.clientX, y: e.clientY };
    const key = (e.target.closest("[data-key]") || {}).dataset?.key;
    // A cell being edited: its text's own items first, as a table's in the
    // editor has cut, copy and paste above its rows and columns.
    const field = e.target.closest("input, textarea");
    if (field) field.setAttribute("data-menu-open", "");
    const text = field ? [...prefixed("text:", await api.textItems(field)), "separator"] : [];
    const items = [
      ...text,
      { label: s("insertRowBelow"), value: "new" },
      { label: s("insertColumnRight"), value: "column" },
      { label: s("rowGroup"), items: [{ label: s("open"), value: "open" }, "separator", { label: s("deleteRow"), value: "delete", danger: true }] },
    ];
    if (key) items.push({ label: s("columnGroup"), items: prefixed("col:", columnItems(key)) });
    const choice = await api.menu(items, at);
    if (field) {
      field.removeAttribute("data-menu-open");
      field.focus();
    }
    if (typeof choice === "string" && choice.startsWith("text:")) return api.editText(field, choice.slice(5));
    if (choice === "open") post({ type: "open", rel: row.dataset.rel });
    else if (choice === "delete") post({ type: "deleteRow", rel: row.dataset.rel });
    else if (choice === "column") addColumnMenu(at);
    else if (choice === "new") {
      const draft = document.querySelector(".new-row .new");
      if (draft) draft.click();
      else post({ type: "add", folder: page.data.folder, props: {} });
    } else if (typeof choice === "string" && choice.startsWith("col:")) columnChoice(choice.slice(4), key, e.target.closest("[data-key]"));
  });

};
