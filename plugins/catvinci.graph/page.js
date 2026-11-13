// The graph pages: the whole folder's (global.html) and the sidebar's,
// around the document in front (local.html). The full graph has a small
// settings panel - filters and colour groups. The host filters the graph
// and sends it back; how it looks adapts by itself (graph-view.js).
(function () {
  "use strict";
  const api = acquireTextusApi();
  const local = document.documentElement.dataset.local === "true";
  const t = api.t;
  // "3 notes", in the language's plural form ("notes.one", "notes.few"…);
  // only Russian has more forms than one and other.
  const count = (key, n) => {
    const rule = new Intl.PluralRules(api.language).select(n);
    const form = key + "." + (/^ru\b/.test(api.language) || rule === "one" ? rule : "other");
    const text = t(form, n);
    return text === form ? t(key + ".other", n) : text;
  };
  const $ = (id) => document.getElementById(id);
  const view = window.createGraphView($("graph"), {
    onOpen: (path, beside) =>
      api.postMessage({ type: "open", path: path, beside: beside }),
  });
  if ($("fit")) {
    $("fit").textContent = t("fit");
    $("fit").onclick = () => view.zoomToFit();
  }

  // The full graph's panel, section by section: [key, kind].
  const SECTIONS = [
    [
      "filters",
      [
        ["search", "search"],
        ["tags", "toggle"],
        ["existingOnly", "toggle"],
        ["attachments", "toggle"],
        ["orphans", "toggle"],
      ],
    ],
    ["groups", []],
  ];
  // A new group's colour: the theme's tones, in their order, as #rrggbb
  // (what a colour field takes).
  const TONES = ["blue", "green", "orange", "purple", "red", "teal", "yellow", "pink"];
  const ink = document.createElement("canvas").getContext("2d");
  const toneHex = (name) => {
    ink.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--tone-" + name).trim();
    return ink.fillStyle;
  };

  let settings = null;
  const open = new Set(["filters"]);
  const panel = $("panel");
  let sending = 0;

  function el(tag, props, children) {
    const node = Object.assign(document.createElement(tag), props);
    for (const child of children || []) node.append(child);
    return node;
  }
  function icon(name) {
    const node = el("span", { className: "tx-icon" });
    node.dataset.icon = name;
    return node;
  }

  function change(key, value) {
    settings[key] = value;
    // Typing in a field or dragging a slider waits a moment.
    clearTimeout(sending);
    sending = setTimeout(
      () => api.postMessage({ type: "settings", settings: settings }),
      200,
    );
  }

  function row([key, kind]) {
    const label = t("set." + key);
    if (kind === "search") {
      const input = el("input", {
        type: "search",
        className: "tx-input",
        value: settings.search,
        placeholder: t("search"),
      });
      input.setAttribute("aria-label", t("search"));
      input.addEventListener("input", () => change("search", input.value));
      return el("label", {}, [input]);
    }
    const input = el("input", { type: "checkbox", className: "tx-switch", role: "switch", checked: !!settings[key] });
    input.addEventListener("change", () => change(key, input.checked));
    // Only the switch turns it on or off, not a click on its words.
    input.setAttribute("aria-label", label);
    return el("div", { className: "row" }, [el("span", { textContent: label }), input]);
  }

  function groupRows() {
    const rows = settings.groups.map((group, i) => {
      // Its colour, picked in Textus's colour picker (textus.ui.pickColor).
      const color = el("button", { type: "button", className: "color-swatch" });
      color.style.background = group.color;
      color.setAttribute("aria-label", t("set.color"));
      color.onclick = () => api.postMessage({ type: "pickColor", index: i, value: group.color });
      const query = el("input", {
        type: "text",
        className: "tx-input",
        value: group.query,
        placeholder: t("set.groupQuery"),
      });
      query.setAttribute("aria-label", t("set.groupQuery"));
      const remove = el("button", { type: "button", className: "tx-icon-button" }, [
        icon("close"),
      ]);
      remove.setAttribute("aria-label", t("set.removeGroup"));
      const update = (patch) =>
        change(
          "groups",
          settings.groups.map((g, j) => (j === i ? Object.assign({}, g, patch) : g)),
        );
      query.addEventListener("input", () => update({ query: query.value }));
      remove.onclick = () => {
        change(
          "groups",
          settings.groups.filter((_, j) => j !== i),
        );
        render();
      };
      return el("div", { className: "group" }, [color, query, remove]);
    });
    const add = el("button", { type: "button", className: "tx-button small", textContent: t("set.newGroup") });
    add.onclick = () => {
      change(
        "groups",
        settings.groups.concat({
          query: "",
          color: toneHex(TONES[settings.groups.length % TONES.length]),
        }),
      );
      render();
      const fields = panel.querySelectorAll(".group input[type=text]");
      fields[fields.length - 1]?.focus();
    };
    return rows.concat(el("div", { className: "actions" }, [add]));
  }

  function render() {
    const sections = SECTIONS.map(([name, rows]) => {
      const details = el("details", { className: "tx-disclosure", open: open.has(name) }, [
        el("summary", {}, [el("span", { textContent: t("set." + name) })]),
      ]);
      details.addEventListener("toggle", () =>
        details.open ? open.add(name) : open.delete(name),
      );
      const items = name === "groups" ? groupRows() : rows.map(row);
      for (const item of items) details.append(item);
      return details;
    });
    const reset = el("button", {
      type: "button",
      className: "tx-button small",
      textContent: t("set.reset"),
    });
    reset.onclick = () => {
      reset.blur();
      api.postMessage({ type: "settings", settings: {} });
    };
    panel.replaceChildren(
      ...sections,
      el("div", { className: "actions" }, [reset]),
    );
  }

  const gear = $("settings");
  if (gear) {
    gear.setAttribute("aria-label", t("set.title"));
    gear.onclick = () => {
      panel.hidden = !panel.hidden;
      gear.setAttribute("aria-expanded", String(!panel.hidden));
    };
    panel.addEventListener("submit", (e) => e.preventDefault());
  }

  let first = true;
  api.onMessage((message) => {
    if (message.type === "color") {
      change(
        "groups",
        settings.groups.map((g, j) => (j === message.index ? Object.assign({}, g, { color: message.hex }) : g)),
      );
      return render();
    }
    if (message.type === "focus") return view.setFocus(message.focus || null);
    if (message.type !== "graph") return;
    const graph = message.graph;
    // While the panel is being typed in, what it holds is newer.
    const typing = settings && panel && panel.contains(document.activeElement);
    if (!typing) {
      const fresh =
        JSON.stringify(message.settings) !== JSON.stringify(settings);
      settings = message.settings;
      if (fresh && panel) render();
    }
    view.setGroups(settings.groups.some((g) => g.query.trim()));
    $("status").textContent = !graph
      ? t("nofolder")
      : local && !graph.nodes.length
        ? t("nodoc")
        : local && graph.nodes.length === 1
          ? t("alone")
          : "";
    const data = graph || { nodes: [], edges: [] };
    view.setData(data, message.focus);
    const notes = data.nodes.filter((n) => n.kind === "note").length;
    $("stats").textContent = graph
      ? count("notes", notes) + " · " + count("links", view.edgeCount())
      : "";
    if (first && data.nodes.length) {
      first = false;
      view.zoomToFit();
      // Too big to lay out at once: fitted again once it has settled.
      if (view.moving()) setTimeout(() => view.zoomToFit(), 1200);
    }
  });
  api.postMessage({ type: "ready" });
})();
