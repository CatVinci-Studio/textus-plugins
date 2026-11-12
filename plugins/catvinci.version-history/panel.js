(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  let opened = null;
  let data = { path: null, current: null, versions: [] };

  const when = (at) =>
    new Date(at).toLocaleString(api.language, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  function diffNode(version) {
    const box = document.createElement("div");
    box.className = "diff";
    const lines = window.lineDiff(version.text, data.current || "");
    if (!lines) {
      box.textContent = t("large");
      return box;
    }
    if (!lines.some((l) => l.kind !== "same")) {
      box.textContent = t("same");
      return box;
    }
    // Changed lines with two of context around them.
    for (const l of window.lineHunks(lines, 2)) {
      const row = document.createElement("div");
      row.className = l.kind;
      row.textContent =
        l.kind === "gap"
          ? "⋯"
          : (l.kind === "added" ? "+ " : l.kind === "removed" ? "− " : "  ") +
            l.line;
      box.append(row);
    }
    return box;
  }

  // Versions grouped by day: Today, Yesterday, then the date.
  const dayOf = (at) => new Date(at).toDateString();
  function dayLabel(at) {
    const day = new Date(at);
    const today = new Date();
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    );
    const words = new Intl.RelativeTimeFormat(api.language, {
      numeric: "auto",
    });
    if (day.toDateString() === today.toDateString())
      return words.format(0, "day");
    if (day.toDateString() === yesterday.toDateString())
      return words.format(-1, "day");
    return day.toLocaleDateString(api.language, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  /** A version's row, or its open card: one button opens and closes it. */
  function versionNode(version, older) {
    const isOpen = opened === version.id;
    const li = document.createElement("li");
    if (isOpen) li.className = "tx-card open";
    const toggle = document.createElement("button");
    toggle.className = isOpen ? "row-head" : "tx-list-row";
    toggle.dataset.id = version.id;
    toggle.setAttribute("aria-expanded", String(isOpen));
    const stamp = document.createElement("span");
    stamp.className = "when tx-list-label";
    stamp.textContent = when(version.at);
    const delta = document.createElement("span");
    delta.className = "delta tx-list-meta";
    const change = version.text.length - (older ? older.text.length : 0);
    const sign = document.createElement("span");
    sign.className = change >= 0 ? "plus" : "minus";
    sign.textContent = (change >= 0 ? "+" : "−") + Math.abs(change);
    delta.append(sign);
    toggle.append(stamp, delta);
    toggle.onclick = () => {
      opened = isOpen ? null : version.id;
      render(version.id);
    };
    li.append(toggle);
    if (!isOpen) return li;
    const label = document.createElement("div");
    label.className = "muted";
    label.textContent = t("since");
    const actions = document.createElement("div");
    actions.className = "actions";
    const button = (key, type, style) => {
      const b = document.createElement("button");
      b.className = style;
      b.textContent = t(key);
      b.onclick = () => api.postMessage({ type, id: version.id });
      return b;
    };
    actions.append(
      button("open", "open", "tx-button small"),
      button("restore", "restore", "tx-button small primary"),
    );
    li.append(label, diffNode(version), actions);
    return li;
  }

  const toggles = () => [...$("versions").querySelectorAll("[data-id]")];

  /** One tab stop for the list: the open version's button, else the first;
   *  `focusId`'s button takes focus when given. */
  function render(focusId) {
    const list = $("versions");
    list.textContent = "";
    let lastDay = null;
    $("full").hidden = !data.full;
    $("full").textContent = t("full");
    $("empty").hidden = !!(data.path && data.versions.length);
    $("empty").textContent = data.path ? t("none") : t("nodoc");
    data.versions.forEach((version, index) => {
      if (dayOf(version.at) !== lastDay) {
        lastDay = dayOf(version.at);
        const day = document.createElement("li");
        day.className = "tx-list-heading";
        const label = dayLabel(version.at);
        day.textContent =
          label.charAt(0).toLocaleUpperCase(api.language) + label.slice(1);
        list.append(day);
      }
      list.append(versionNode(version, data.versions[index + 1]));
    });
    const all = toggles();
    const stop = all.find((b) => b.dataset.id === String(opened)) || all[0];
    all.forEach((b) => (b.tabIndex = b === stop ? 0 : -1));
    const focus = all.find((b) => b.dataset.id === String(focusId));
    if (focus) focus.focus();
  }

  // Up and down move between the versions, Home and End to either end.
  $("versions").addEventListener("keydown", (e) => {
    const all = toggles();
    const at = all.indexOf(document.activeElement);
    if (at < 0) return;
    const to = {
      ArrowUp: at - 1,
      ArrowDown: at + 1,
      Home: 0,
      End: all.length - 1,
    }[e.key];
    if (to === undefined || !all[to]) return;
    e.preventDefault();
    all[at].tabIndex = -1;
    all[to].tabIndex = 0;
    all[to].focus();
  });

  api.onMessage((message) => {
    if (message.type !== "versions") return;
    if (message.path !== data.path) opened = null;
    data = message;
    // A refresh keeps the focused version's button focused.
    const focused = document.activeElement;
    render(focused && focused.dataset ? focused.dataset.id : undefined);
  });
  api.postMessage({ type: "ready" });
})();
