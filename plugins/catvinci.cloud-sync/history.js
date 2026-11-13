"use strict";
(() => {
  // development/cloud-sync/src/history-page.ts
  var api = acquireTextusApi();
  var $ = (id) => document.getElementById(id);
  var statusLine = $("status");
  var list = $("list");
  var title = $("title");
  var preview = $("preview");
  var previewText = $("preview-text");
  var previewNote = $("preview-note");
  var restore = $("restore");
  var shown = null;
  var chosen = null;
  var started;
  var restoredNote = false;
  document.documentElement.lang = api.language;
  for (const item of document.querySelectorAll("[data-t]"))
    item.textContent = api.t(item.dataset.t);
  var when = (iso) => new Date(iso).toLocaleString(api.language, {
    dateStyle: "medium",
    timeStyle: "short"
  });
  var size = (n) => n < 1024 ? api.t("sizeBytes", n) : n < 1024 * 1024 ? api.t("sizeKb", (n / 1024).toFixed(1)) : api.t("sizeMb", (n / 1024 / 1024).toFixed(1));
  function say(text) {
    statusLine.textContent = text;
    statusLine.hidden = !text;
  }
  function rowButton(main, side, onPick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tx-list-row";
    b.tabIndex = list.childElementCount ? -1 : 0;
    b.setAttribute("role", "option");
    b.setAttribute("aria-selected", "false");
    const a = document.createElement("span");
    a.className = "tx-list-label";
    a.textContent = main;
    const c = document.createElement("span");
    c.className = "tx-list-meta";
    c.textContent = side;
    b.append(a, c);
    b.onclick = () => {
      for (const x of list.querySelectorAll("[aria-selected]")) {
        x.setAttribute("aria-selected", String(x === b));
        x.tabIndex = x === b ? 0 : -1;
      }
      onPick();
    };
    return b;
  }
  list.addEventListener("keydown", (e) => {
    const all = [...list.querySelectorAll(".tx-list-row")];
    const at = all.indexOf(document.activeElement);
    const to = { ArrowUp: at - 1, ArrowDown: at + 1, Home: 0, End: all.length - 1 }[e.key];
    if (at < 0 || to === void 0 || !all[to]) return;
    e.preventDefault();
    all[at].tabIndex = -1;
    all[to].tabIndex = 0;
    all[to].focus();
  });
  function render(l) {
    shown = l;
    chosen = null;
    preview.hidden = true;
    list.replaceChildren();
    if (started === void 0) started = l.path;
    $("head").hidden = started !== null || l.path === null;
    if (l.path === null) {
      title.textContent = api.t("deletedFiles");
      for (const d of l.deleted ?? [])
        list.append(
          rowButton(
            d.path,
            when(d.until ?? d.at),
            () => api.postMessage({ type: "open", path: d.path })
          )
        );
      say(l.deleted?.length ? "" : api.t("noDeleted"));
    } else {
      title.textContent = l.path;
      for (const v of l.versions ?? [])
        list.append(
          rowButton(
            [when(v.at), v.device].filter(Boolean).join(" \xB7 "),
            size(v.size),
            () => pick(v)
          )
        );
      say(
        l.versions?.length ? l.current ? api.t("currentVersion", when(l.current.at ?? "")) : api.t("deletedInCloud") : api.t("noVersions")
      );
    }
    title.hidden = list.hidden = !list.childElementCount;
    if (restoredNote) say(api.t("restored"));
    restoredNote = false;
  }
  function pick(v) {
    chosen = v;
    preview.hidden = false;
    previewText.hidden = true;
    previewNote.textContent = api.t("loading");
    restore.disabled = false;
    api.postMessage({ type: "preview", path: shown?.path, hash: v.hash });
  }
  restore.onclick = () => {
    if (!chosen || !shown?.path) return;
    restore.disabled = true;
    say(api.t("restoring"));
    api.postMessage({ type: "restore", path: shown.path, hash: chosen.hash });
  };
  $("back").onclick = () => api.postMessage({ type: "open", path: null });
  api.onMessage((raw) => {
    const m = raw;
    if (m.type === "list") render(m);
    else if (m.type === "preview" && m.hash === chosen?.hash) {
      previewNote.textContent = m.binary ? api.t("noPreview") : api.t("restoreHint");
      previewText.hidden = !!m.binary;
      previewText.textContent = m.text ?? "";
    } else if (m.type === "restored") {
      restoredNote = true;
      api.postMessage({ type: "open", path: m.path });
    } else if (m.type === "error") {
      say(m.message ?? "");
      restore.disabled = false;
    }
  });
  api.postMessage({ type: "ready" });
})();
