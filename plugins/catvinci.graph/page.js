// The graph pages: the whole folder's (global.html) and the sidebar's,
// around the document in front (local.html), each with Obsidian's
// settings panel - filters, groups, display, forces. What filters the
// graph goes to the host, which sends it back filtered; how it looks and
// moves changes here at once.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const local = document.documentElement.dataset.local === "true";
  const t = api.t;
  // "3 notes", in the language's plural form ("notes.one", "notes.few"…).
  const count = (key, n) => {
    const form = key + "." + new Intl.PluralRules(api.language).select(n);
    const text = t(form, n);
    return text === form ? t(key + ".other", n) : text;
  };
  const $ = (id) => document.getElementById(id);
  const view = window.createGraphView($("graph"), {
    onOpen: (path, newTab) =>
      api.postMessage({ type: "open", path: path, newTab: newTab }),
  });
  if ($("fit")) {
    $("fit").textContent = t("fit");
    $("fit").onclick = () => view.zoomToFit();
  }
  if ($("full")) {
    $("full").textContent = t("full");
    $("full").onclick = () => api.postMessage({ type: "full" });
  }

  // The panel, section by section: [key, kind, range]. "local" rows are
  // the sidebar's only, "global" the full graph's.
  const SECTIONS = [
    [
      "filters",
      [
        ["search", "search"],
        ["depth", "range", [1, 5, 1], "local"],
        ["incoming", "toggle", null, "local"],
        ["outgoing", "toggle", null, "local"],
        ["neighbours", "toggle", null, "local"],
        ["tags", "toggle"],
        ["existingOnly", "toggle"],
        ["orphans", "toggle", null, "global"],
      ],
    ],
    ["groups", []],
    [
      "display",
      [
        ["arrows", "toggle"],
        ["textFade", "range", [-3, 3, 0.1]],
        ["nodeSize", "range", [0.5, 3, 0.1]],
        ["linkThickness", "range", [0.5, 4, 0.1]],
      ],
    ],
    [
      "forces",
      [
        ["center", "range", [0, 1, 0.05]],
        ["repel", "range", [0, 20, 0.5]],
        ["linkForce", "range", [0, 1, 0.05]],
        ["linkDistance", "range", [30, 300, 5]],
      ],
    ],
  ];
  // Changing these needs the graph again; the rest is how it is drawn.
  const FILTERS = new Set(SECTIONS[0][1].map((row) => row[0]).concat("groups"));
  const GROUP_COLORS = ["#e0607e", "#4d9de0", "#3bb273", "#e1bc29", "#7768ae"];

  let settings = null;
  const open = new Set(["filters"]);
  const panel = $("panel");
  let sending = 0;

  function el(tag, props, children) {
    const node = Object.assign(document.createElement(tag), props);
    for (const child of children || []) node.append(child);
    return node;
  }

  function change(key, value) {
    settings[key] = value;
    if (!FILTERS.has(key)) view.setOptions(drawing());
    // Typing in a field or dragging a slider waits a moment.
    clearTimeout(sending);
    sending = setTimeout(
      () => api.postMessage({ type: "settings", settings: settings }),
      200,
    );
  }

  function row([key, kind, range, only]) {
    if (only && only !== (local ? "local" : "global")) return null;
    const label = t("set." + key);
    if (kind === "search") {
      const input = el("input", {
        type: "search",
        value: settings.search,
        placeholder: t("search"),
      });
      input.setAttribute("aria-label", t("search"));
      input.addEventListener("input", () => change("search", input.value));
      return el("label", {}, [input]);
    }
    if (kind === "toggle") {
      const input = el("input", { type: "checkbox", checked: !!settings[key] });
      input.addEventListener("change", () => change(key, input.checked));
      return el("label", {}, [el("span", { textContent: label }), input]);
    }
    const [min, max, step] = range;
    const input = el("input", {
      type: "range",
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(settings[key]),
    });
    input.addEventListener("input", () =>
      change(key, Number(input.value)),
    );
    return el("label", {}, [el("span", { textContent: label }), input]);
  }

  function groupRows() {
    const rows = settings.groups.map((group, i) => {
      const color = el("input", { type: "color", value: group.color });
      color.setAttribute("aria-label", t("set.color"));
      const query = el("input", {
        type: "text",
        value: group.query,
        placeholder: t("set.groupQuery"),
      });
      query.setAttribute("aria-label", t("set.groupQuery"));
      const remove = el("button", {
        type: "button",
        className: "icon",
        textContent: "×",
        title: t("set.removeGroup"),
      });
      remove.setAttribute("aria-label", t("set.removeGroup"));
      const update = (patch) =>
        change(
          "groups",
          settings.groups.map((g, j) => (j === i ? Object.assign({}, g, patch) : g)),
        );
      color.addEventListener("input", () => update({ color: color.value }));
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
    const add = el("button", { type: "button", textContent: t("set.newGroup") });
    add.onclick = () => {
      change(
        "groups",
        settings.groups.concat({
          query: "",
          color: GROUP_COLORS[settings.groups.length % GROUP_COLORS.length],
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
      const details = el("details", { open: open.has(name) }, [
        el("summary", { textContent: t("set." + name) }),
      ]);
      details.addEventListener("toggle", () =>
        details.open ? open.add(name) : open.delete(name),
      );
      const items = name === "groups" ? groupRows() : rows.map(row);
      for (const item of items) if (item) details.append(item);
      return details;
    });
    const reset = el("button", {
      type: "button",
      className: "icon",
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

  function drawing() {
    const keys = [
      "arrows",
      "textFade",
      "nodeSize",
      "linkThickness",
      "center",
      "repel",
      "linkForce",
      "linkDistance",
    ];
    const opts = { groups: settings.groups.some((g) => g.query.trim()) };
    for (const key of keys) opts[key] = settings[key];
    return opts;
  }

  const gear = $("settings");
  gear.title = t("set.title");
  gear.setAttribute("aria-label", t("set.title"));
  gear.onclick = () => {
    panel.hidden = !panel.hidden;
    gear.setAttribute("aria-expanded", String(!panel.hidden));
  };
  panel.addEventListener("submit", (e) => e.preventDefault());

  let first = true;
  api.onMessage((message) => {
    if (message.type !== "graph") return;
    const graph = message.graph;
    // While the panel is being typed in, what it holds is newer.
    const typing = settings && panel.contains(document.activeElement);
    if (!typing) {
      const fresh =
        JSON.stringify(message.settings) !== JSON.stringify(settings);
      settings = message.settings;
      if (fresh) render();
    }
    view.setOptions(drawing());
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
      setTimeout(() => view.zoomToFit(), 1200);
    }
  });
  api.postMessage({ type: "ready" });
})();
