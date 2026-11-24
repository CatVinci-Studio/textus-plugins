// The History tab: the document's versions by day; the open one a card
// with what changed - against the document now or another version, word
// by word in the lines that changed - each change restorable on its own.
// Texts come from the host when a card opens, never with the list.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  let opened = null;
  let against = "current";
  let data = { path: null, versions: [], commits: [] };
  /** Versions and commits: what a card compares with, or picks. */
  const everything = () =>
    data.versions.concat(data.commits || [], ...(data.others || []).map((o) => o.versions));
  /** Kept elsewhere - a Git commit, another plugin's version: opened,
   *  not named or pinned. */
  const keptElsewhere = (item) => /^(git|src):/.test(String(item.id));
  /** Texts the host sent, by version and what it is compared with. */
  const texts = new Map();
  const textKey = (id, other) => id + "|" + other;

  const when = (at) =>
    new Date(at).toLocaleString(api.language, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const labelOf = (v) => v.subject || v.name || when(v.at);
  /** A row's time: its day is the heading above it. */
  const timeOf = (at) => new Date(at).toLocaleTimeString(api.language, { hour: "2-digit", minute: "2-digit" });
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  /** A changed line, its changed words marked. */
  function lineNode(kind, pieces, line) {
    const row = el("div", kind);
    row.append(kind === "added" ? "+ " : kind === "removed" ? "− " : "  ");
    if (!pieces) row.append(line);
    else
      for (const piece of pieces)
        row.append(piece.changed ? el(kind === "added" ? "ins" : "del", "", piece.text) : piece.text);
    return row;
  }

  /** The words that changed in each run of changed lines, by line. */
  function wordsByLine(parts) {
    const marks = new Map();
    for (const [start, end] of window.changeGroups(parts)) {
      const run = parts.slice(start, end);
      const removed = run.filter((p) => p.kind === "removed").map((p) => p.line);
      const added = run.filter((p) => p.kind === "added").map((p) => p.line);
      if (!removed.length || !added.length) continue;
      const words = window.wordDiff(removed.join("\n"), added.join("\n"));
      if (!words) continue;
      // Back into lines: the pieces split where their text has a newline.
      const split = (pieces) => {
        const lines = [[]];
        for (const piece of pieces)
          piece.text.split("\n").forEach((text, i) => {
            if (i) lines.push([]);
            if (text) lines[lines.length - 1].push({ text: text, changed: piece.changed });
          });
        return lines;
      };
      const before = split(words.before);
      const after = split(words.after);
      let r = 0;
      let a = 0;
      for (let i = start; i < end; i++)
        marks.set(i, parts[i].kind === "removed" ? before[r++] : after[a++]);
    }
    return marks;
  }

  function diffNode(version) {
    const box = el("div", "diff");
    const both = texts.get(textKey(version.id, against));
    if (!both) return box;
    const parts = window.lineDiff(both.from, both.to || "");
    if (!parts) return (box.textContent = t("large")), box;
    if (!parts.some((p) => p.kind !== "same")) return (box.textContent = t("same")), box;
    const marks = wordsByLine(parts);
    const groups = window.changeGroups(parts);
    // Changed lines with two of context around them; against the document
    // now, each run of changes ends with a button taking it back.
    const indexed = parts.map((p, i) => Object.assign({ i: i }, p));
    for (const p of window.lineHunks(indexed, 2)) {
      if (p.kind === "gap") {
        box.append(el("div", "gap", "⋯"));
        continue;
      }
      box.append(lineNode(p.kind, marks.get(p.i), p.line));
      const group = groups.find((g) => g[1] - 1 === p.i);
      if (group && against === "current") {
        const undo = el("button", "tx-button small part", t("restorePart"));
        undo.onclick = () => api.postMessage({ type: "restoreText", text: window.revertGroup(parts, group) });
        box.append(undo);
      }
    }
    return box;
  }

  async function chooseAgainst(version, button) {
    const others = everything().filter((v) => v.id !== version.id);
    const picked = await api.menu(
      [{ label: t("now"), value: "current", checked: against === "current" }, "separator"].concat(
        others.map((v) => ({ label: labelOf(v), value: v.id, checked: against === v.id })),
      ),
      button,
    );
    if (picked === null || picked === undefined) return;
    against = picked;
    load(version);
    render(version.id);
  }

  async function more(version, button) {
    const items = keptElsewhere(version)
      ? [{ label: t("open"), value: "open" }]
      : [
          { label: t("nameVersion"), value: "name" },
          { label: version.pinned ? t("unpin") : t("pin"), value: "pin" },
          { label: t("open"), value: "open" },
        ];
    const picked = await api.menu(items, button);
    if (picked) api.postMessage({ type: picked, id: version.id });
  }

  function load(version) {
    if (!texts.has(textKey(version.id, against)))
      api.postMessage({ type: "load", id: version.id, against: against });
  }

  /** A version's row, or its open card: one button opens and closes it. */
  function versionNode(version, older) {
    const isOpen = opened === version.id;
    const li = el("li", isOpen ? "tx-card open" : "");
    const toggle = el("button", isOpen ? "row-head" : "tx-list-row");
    toggle.dataset.id = version.id;
    toggle.setAttribute("aria-expanded", String(isOpen));
    const stamp = el("span", "when tx-list-label", keptElsewhere(version) ? version.subject || timeOf(version.at) : timeOf(version.at));
    if (version.name) stamp.prepend(el("strong", "name", version.name + " "));
    if (version.pinned) stamp.append(" ", el("span", "tx-tag", t("pinned")));
    const meta = el("span", "delta tx-list-meta");
    if (keptElsewhere(version)) meta.append(el("span", "outside", when(version.at)));
    else {
      if (version.source === "disk") meta.append(el("span", "outside", t("outside") + " "));
      const change = (version.chars || 0) - (older ? older.chars || 0 : 0);
      meta.append(el("span", change >= 0 ? "plus" : "minus", (change >= 0 ? "+" : "−") + Math.abs(change)));
    }
    toggle.append(stamp, meta);
    toggle.onclick = () => {
      opened = isOpen ? null : version.id;
      against = "current";
      if (opened) load(version);
      render(version.id);
    };
    li.append(toggle);
    if (!isOpen) return li;
    const compare = el("div", "compare");
    const otherVersion = everything().find((v) => v.id === against);
    const select = el("button", "tx-select", otherVersion ? labelOf(otherVersion) : t("now"));
    select.append(el("span", "tx-icon", ""));
    select.lastChild.dataset.icon = "chevron";
    select.onclick = () => chooseAgainst(version, select);
    compare.append(el("span", "muted", t("compareWith")), select);
    const actions = el("div", "actions");
    const moreButton = el("button", "tx-button small", t("more"));
    moreButton.onclick = () => more(version, moreButton);
    const restore = el("button", "tx-button small primary", t("restore"));
    restore.onclick = () => api.postMessage({ type: "restore", id: version.id });
    actions.append(moreButton, restore);
    li.append(compare, diffNode(version), actions);
    return li;
  }

  // Versions grouped by day: Today, Yesterday, then the date.
  const dayOf = (at) => new Date(at).toDateString();
  function dayLabel(at) {
    const day = new Date(at);
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const words = new Intl.RelativeTimeFormat(api.language, { numeric: "auto" });
    if (day.toDateString() === today.toDateString()) return words.format(0, "day");
    if (day.toDateString() === yesterday.toDateString()) return words.format(-1, "day");
    return day.toLocaleDateString(api.language, { weekday: "short", month: "short", day: "numeric" });
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
    $("empty").hidden = !!(data.path && everything().length);
    $("empty").textContent = data.path ? t("none") : t("nodoc");
    data.versions.forEach((version, index) => {
      if (dayOf(version.at) !== lastDay) {
        lastDay = dayOf(version.at);
        const label = dayLabel(version.at);
        list.append(el("li", "tx-list-heading", label.charAt(0).toLocaleUpperCase(api.language) + label.slice(1)));
      }
      list.append(versionNode(version, data.versions[index + 1]));
    });
    // The document's Git commits, under the branch's name.
    if ((data.commits || []).length) {
      const heading = t("commits") + (data.branch ? " · " + data.branch : "");
      list.append(el("li", "tx-list-heading", heading));
      data.commits.forEach((commit) => list.append(versionNode(commit)));
    }
    // Other plugins' versions (Cloud Sync's), each under its name.
    for (const other of data.others || []) {
      list.append(el("li", "tx-list-heading", other.label));
      other.versions.forEach((version) => list.append(versionNode(version)));
    }
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
    const to = { ArrowUp: at - 1, ArrowDown: at + 1, Home: 0, End: all.length - 1 }[e.key];
    if (to === undefined || !all[to]) return;
    e.preventDefault();
    all[at].tabIndex = -1;
    all[to].tabIndex = 0;
    all[to].focus();
  });

  api.onDidReceiveMessage((message) => {
    if (message.type === "texts") {
      texts.set(textKey(message.id, message.against), { from: message.from, to: message.to });
      if (opened === message.id && against === message.against) render();
      return;
    }
    if (message.type !== "versions") return;
    if (message.path !== data.path) opened = null;
    data = message;
    // The document changed, or a version did: compared texts read again.
    texts.clear();
    const open = everything().find((v) => v.id === opened);
    if (open) load(open);
    // A refresh keeps the focused version's button focused.
    const focused = document.activeElement;
    render(focused && focused.dataset ? focused.dataset.id : undefined);
  });
  api.postMessage({ type: "ready" });
})();
