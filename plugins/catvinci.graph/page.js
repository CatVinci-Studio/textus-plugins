// The graph pages: the whole folder's (global.html) and the sidebar's,
// around the document in front (local.html).
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
    onOpen: (path) => api.postMessage({ type: "open", path: path }),
  });
  if ($("search")) {
    $("search").placeholder = t("search");
    $("search").addEventListener("input", () =>
      view.setQuery($("search").value),
    );
  }
  if ($("fit")) {
    $("fit").textContent = t("fit");
    $("fit").onclick = () => view.zoomToFit();
  }
  if ($("full")) {
    $("full").textContent = t("full");
    $("full").onclick = () => api.postMessage({ type: "full" });
  }

  let first = true;
  api.onMessage((message) => {
    if (message.type !== "graph") return;
    const graph = message.graph;
    $("status").textContent = !graph
      ? t("nofolder")
      : local && !graph.nodes.length
        ? t("nodoc")
        : local && graph.nodes.length === 1
          ? t("alone")
          : "";
    const data = graph || { nodes: [], edges: [] };
    view.setData(data, message.focus);
    $("stats").textContent = graph
      ? count("notes", view.nodeCount()) +
        " · " +
        count("links", view.edgeCount())
      : "";
    if (first && data.nodes.length) {
      first = false;
      setTimeout(() => view.zoomToFit(), 1200);
    }
  });
  api.postMessage({ type: "ready" });
})();
