// A ```tasks block's page: the tasks its query picks (host.js), in their
// groups, each with its box, its due date and its document. Ticking a box
// ticks the task in its file; its text or document opens it there.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const TONES = { danger: "red", warning: "orange", muted: "gray" };
  const $ = (id) => document.getElementById(id);

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (v !== false && v !== null && v !== undefined) node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false && c !== "") node.append(c);
    return node;
  }

  const open = (task) => api.postMessage({ type: "open", path: task.path, line: task.line });

  function row(task) {
    const box = el("input", {
      type: "checkbox",
      class: "ui-check",
      checked: !task.open,
      "aria-label": task.description,
      onchange: (e) =>
        api.postMessage({ type: "check", path: task.path, line: task.line, text: task.text, done: e.target.checked }),
    });
    return el(
      "li",
      { class: "task", "data-status": task.status, "data-open": task.open },
      box,
      el("span", { class: "text", onclick: () => open(task) }, task.description),
      task.priority || task.recurring ? el("span", { class: "mark" }, (task.priority || "") + (task.recurring ? "🔁" : "")) : null,
      task.due ? el("span", { class: "tx-tag", "data-tone": TONES[task.tone] }, task.due) : null,
      el("span", { class: "file", title: task.rel, onclick: () => open(task) }, task.file),
    );
  }

  function draw(result) {
    $("count").textContent = result.count || result.message || "";
    $("unsupported").textContent = result.unsupported || "";
    $("unsupported").hidden = !result.unsupported;
    const body = $("body");
    if (result.message) return body.replaceChildren();
    if (!result.groups.length) return body.replaceChildren(el("div", { class: "tx-empty" }, result.empty));
    const parts = [];
    let last = [];
    for (const group of result.groups) {
      // A heading for each level of grouping from the first that changes.
      const from = group.names.findIndex((name, i) => name !== last[i]);
      if (from >= 0)
        group.names.slice(from).forEach((name, k) => parts.push(el("div", { class: "group level-" + (from + k) }, name)));
      last = group.names;
      parts.push(el("ul", { class: "tasks" }, group.tasks.map(row)));
    }
    body.replaceChildren(...parts);
  }

  api.onMessage((m) => {
    if (m && m.type === "result") draw(m.result);
  });
  api.postMessage({ type: "ready" });
})();
