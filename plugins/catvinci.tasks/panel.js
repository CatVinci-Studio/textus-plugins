(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  // "3 open tasks", in the language's plural form ("open.one", "open.few"…).
  const count = (key, n) => {
    const form = key + "." + new Intl.PluralRules(api.language).select(n);
    const text = t(form, n);
    return text === form ? t(key + ".other", n) : text;
  };
  const $ = (id) => document.getElementById(id);
  // The icon buttons' names, in the UI's language.
  for (const [id, key] of [["refresh", "refresh"]])
    for (const attr of ["aria-label", "title"])
      $(id).setAttribute(attr, api.t(key));
  $("done-label").textContent = t("done");
  $("filter").placeholder = t("filter");
  $("filter").setAttribute("aria-label", t("filter"));
  $("filter").addEventListener("input", () => render());

  // A due date written after a task, as Obsidian's Tasks writes it
  // ("📅 2026-10-30") or plainly ("due:2026-10-30").
  const DUE = /\s*(?:📅|due:)\s*(\d{4}-\d{2}-\d{2})/u;
  const dayOf = (d) => d.toISOString().slice(0, 10);
  const today = () =>
    dayOf(new Date(Date.now() - new Date().getTimezoneOffset() * 60000));
  const soonUntil = () =>
    dayOf(
      new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000 + 7 * 86400000,
      ),
    );
  function dueOf(task) {
    const m = DUE.exec(task.text);
    return m ? { date: m[1], text: task.text.replace(DUE, "").trim() } : null;
  }
  function dueBadge(date) {
    const badge = document.createElement("span");
    badge.className = "due" + (date < today() ? " overdue" : "");
    badge.textContent = new Intl.DateTimeFormat(api.language, {
      month: "short",
      day: "numeric",
    }).format(new Date(date + "T00:00:00"));
    badge.title = date;
    return badge;
  }
  function matches(task, file, words) {
    const hay = (
      task.text +
      "\n" +
      file.rel +
      "\n" +
      (task.heading || "")
    ).toLowerCase();
    return words.every((w) => hay.includes(w));
  }
  $("refresh").onclick = () => api.postMessage({ type: "refresh" });
  let files = [];
  let showDone = !!(api.getState() || {}).showDone;
  $("done").checked = showDone;
  $("done").onchange = () => {
    showDone = $("done").checked;
    api.setState({ showDone: showDone });
    render();
  };

  function taskRow(file, task, where) {
    const row = document.createElement("div");
    row.className = "task" + (task.done ? " done" : "");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.setAttribute("aria-label", task.text);
    check.onchange = () =>
      api.postMessage({
        type: "toggle",
        path: file.path,
        line: task.line,
        text: task.text,
      });
    const text = document.createElement("span");
    text.className = "text";
    const due = dueOf(task);
    text.textContent = due ? due.text : task.text;
    if (due) text.append(dueBadge(due.date));
    if (where) {
      const at = document.createElement("span");
      at.className = "where";
      at.textContent = where;
      text.append(at);
    }
    text.onclick = () =>
      api.postMessage({
        type: "open",
        path: file.path,
        heading: task.heading,
      });
    row.append(check, text);
    return row;
  }

  function render() {
    const box = $("files");
    box.textContent = "";
    const words = $("filter").value.toLowerCase().split(/\s+/).filter(Boolean);
    if (files === null) {
      $("summary").textContent = "";
      $("empty").textContent = t("nofolder");
      $("empty").hidden = false;
      return;
    }
    let open = 0;
    // Due soon: the open tasks past their date or due within a week, from
    // every document, soonest first.
    const soon = [];
    for (const file of files)
      for (const task of file.tasks) {
        const due = !task.done && dueOf(task);
        if (due && due.date <= soonUntil() && matches(task, file, words))
          soon.push({ file: file, task: task, date: due.date });
      }
    if (soon.length) {
      soon.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      const section = document.createElement("section");
      section.className = "file soon";
      const title = document.createElement("h3");
      title.textContent = t("dueSoon");
      section.append(title);
      for (const { file, task } of soon)
        section.append(
          taskRow(file, task, file.rel.replace(/\.(md|markdown)$/i, "")),
        );
      box.append(section);
    }
    for (const file of files) {
      const shown = file.tasks.filter(
        (task) => (showDone || !task.done) && matches(task, file, words),
      );
      open += file.tasks.filter((task) => !task.done).length;
      if (!shown.length) continue;
      const section = document.createElement("section");
      section.className = "file";
      const title = document.createElement("h3");
      title.textContent = file.rel;
      title.title = file.path;
      title.onclick = () => api.postMessage({ type: "open", path: file.path });
      section.append(title);
      for (const task of shown)
        section.append(taskRow(file, task, task.heading));
      box.append(section);
    }
    $("summary").textContent = count("open", open);
    $("empty").textContent = t("none");
    $("empty").hidden = box.children.length > 0;
  }

  api.onMessage((message) => {
    if (message.type !== "tasks") return;
    files = message.files;
    if (api.getState() === null) {
      showDone = !!message.showDone;
      $("done").checked = showDone;
    }
    render();
  });
  api.postMessage({ type: "ready" });
})();
