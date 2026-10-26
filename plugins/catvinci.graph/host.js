// Graph View: the open folder's documents and the links between them,
// from what Textus knows of the folder (textus.metadata - links.js makes
// the graph), drawn in a tab of its own and around the document in front
// in the sidebar. Drawn again, a moment after, whenever the folder's
// documents change.
/** What activate was given: the plugin's storage and own files. */
let ctx;

/* global graphLinks */
let graph = null;
let building = null;
let stale = true;
const views = new Set();
let local = null;

async function build() {
  const root = await textus.files.root();
  if (!root) return null;
  return graphLinks.graphFromMetadata(await textus.metadata.all());
}

async function current() {
  // A save while a build ran makes it out of date: build again.
  while (stale || !graph) {
    if (!building) {
      stale = false;
      building = build().finally(() => (building = null));
    }
    graph = await building;
    if (!graph) break;
  }
  return graph;
}

async function sendGlobal(view) {
  const g = await current();
  const orphans = await textus.settings.get("orphans");
  if (!g) return view.postMessage({ type: "graph", graph: null });
  let shown = g;
  if (!orphans) {
    const linked = new Set();
    for (const e of g.edges) linked.add(e.source).add(e.target);
    shown = { nodes: g.nodes.filter((n) => linked.has(n.id)), edges: g.edges };
  }
  view.postMessage({
    type: "graph",
    graph: shown,
    focus: await textus.editor.getPath(),
  });
}

async function sendLocal() {
  if (!local) return;
  const g = await current();
  const focus = await textus.editor.getPath();
  if (!g || !focus || !g.nodes.some((n) => n.id === focus))
    return local.postMessage({
      type: "graph",
      graph: g ? { nodes: [], edges: [] } : null,
      focus: focus,
    });
  const depth = Number(await textus.settings.get("depth")) || 1;
  local.postMessage({
    type: "graph",
    graph: graphLinks.neighbourhood(g, focus, depth),
    focus: focus,
  });
}

let timer = 0;
function changed() {
  stale = true;
  clearTimeout(timer);
  timer = setTimeout(function () {
    for (const view of views) sendGlobal(view).catch(() => {});
    sendLocal().catch(() => {});
  }, 400);
}

function wire(webview, isLocal) {
  webview.onDidReceiveMessage(async function (message) {
    if (message.type === "ready") {
      if (isLocal) await sendLocal();
      else await sendGlobal(webview);
    }
    if (message.type === "open" && message.path)
      await textus.layout.open(message.path);
    if (message.type === "full")
      await textus.layout.openView("catvinci.graph.global");
  });
}

async function page(webview, file) {
  const html = await ctx.plugin.readText(file);
  webview.html = html.replace("{{lang}}", textus.env.language);
}

exports.activate = function (context) {
  ctx = context;
  textus.metadata.onDidChange(changed);
  textus.files.onDidChangeRoot(changed);
  textus.settings.onDidChange(changed);
  textus.editor.onDidChangeActive(function () {
    sendLocal().catch(() => {});
    for (const view of views) sendGlobal(view).catch(() => {});
  });
  textus.commands.register("catvinci.graph.open", function () {
    return textus.layout.openView("catvinci.graph.global");
  });
  textus.views.registerWebview("catvinci.graph.global", {
    resolve: async function (webview) {
      views.add(webview);
      webview.onDidDispose(() => views.delete(webview));
      wire(webview, false);
      await page(webview, "global.html");
    },
  });
  textus.views.registerWebview("catvinci.graph.local", {
    resolve: async function (webview) {
      local = webview;
      webview.onDidDispose(function () {
        if (local === webview) local = null;
      });
      wire(webview, true);
      await page(webview, "local.html");
    },
  });
};
