// Graph View: the open folder's documents and the links between them,
// from what Textus knows of the folder (textus.metadata - links.js makes
// the graph), drawn in a tab of its own and around the document in front
// in the sidebar. Each has a small settings panel - filters and colour
// groups - kept in the plugin's storage; how it looks adapts by itself.
// In an Obsidian vault, its own colour groups colour the notes too.
// Drawn again, a moment after, whenever the folder's documents change.
/** What activate was given: the plugin's storage and own files. */
let ctx;

/* global graphLinks, folderPaths, nameOrder */
let graph = null;
let building = null;
let stale = true;
const views = new Set();
let local = null;
let last = null;

/** The document in front; with a view in front (this graph, say), the
 *  last one that was, while it is still open. */
async function focusPath() {
  const path = await textus.editor.getPath();
  if (path) return (last = path);
  const open = (await textus.layout.tabs())
    .filter((tab) => tab.kind === "document" && tab.path)
    .map((tab) => tab.path);
  if (!open.includes(last)) last = open[0] || null;
  return last;
}

const DEFAULTS = {
  search: "",
  tags: false,
  existingOnly: false,
  orphans: true,
  groups: [],
};
const LOCAL_DEFAULTS = Object.assign({}, DEFAULTS, { depth: 1 });

async function settingsOf(isLocal) {
  const saved = await ctx.storage.global.get(isLocal ? "local" : "global");
  return Object.assign({}, isLocal ? LOCAL_DEFAULTS : DEFAULTS, saved);
}

/** `settings` with the vault's own colour groups after the panel's. */
async function withVaultGroups(settings) {
  // The nearest vault's, even one above the open folder.
  const saved = await textus.files.appSettings("obsidian", "graph.json").catch(() => null);
  if (!saved) return settings;
  const groups = graphLinks.obsidianGroups(saved);
  return groups.length ? Object.assign({}, settings, { groups: (settings.groups || []).concat(groups) }) : settings;
}

/** The folder's documents, each link to no file marked with the note a
 *  click on it would make (`missing`), as Textus resolves links. */
async function documents() {
  const docs = await textus.metadata.all();
  const asks = [];
  for (const doc of docs)
    for (const l of doc.links)
      if (!l.resolved && !/^[a-z][a-z0-9+.-]*:/i.test(l.target))
        asks.push(
          textus.metadata.resolveNote("[[" + l.target + "]]", doc.path).then((found) => {
            if (found && found.kind === "note") l[found.exists ? "resolved" : "missing"] = found.path;
          }),
        );
  await Promise.all(asks);
  return docs;
}

async function build() {
  const root = await textus.files.root();
  if (!root) return null;
  return graphLinks.graphFromMetadata(await documents(), { tags: true });
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
  const settings = await settingsOf(false);
  const focus = await focusPath();
  view.postMessage({
    type: "graph",
    graph: g && graphLinks.filterGraph(g, await withVaultGroups(settings)),
    focus: focus,
    settings: settings,
  });
}

async function sendLocal() {
  if (!local) return;
  const g = await current();
  const settings = await settingsOf(true);
  const focus = await focusPath();
  const known = g && focus && g.nodes.some((n) => n.id === focus);
  local.postMessage({
    type: "graph",
    graph: !g
      ? null
      : !known
        ? { nodes: [], edges: [] }
        : graphLinks.neighbourhood(
            graphLinks.filterGraph(
              g,
              Object.assign({}, await withVaultGroups(settings), { keep: focus }),
            ),
            focus,
            Math.min(5, Math.max(1, Number(settings.depth) || 1)),
          ),
    focus: focus,
    settings: settings,
  });
}

function sendAll() {
  for (const view of views) sendGlobal(view).catch(() => {});
  sendLocal().catch(() => {});
}

let timer = 0;
function changed() {
  stale = true;
  clearTimeout(timer);
  timer = setTimeout(sendAll, 400);
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
    if (message.type === "settings") {
      const key = isLocal ? "local" : "global";
      // Only what differs from the defaults is kept: "Reset" is null.
      const defaults = isLocal ? LOCAL_DEFAULTS : DEFAULTS;
      const next = {};
      for (const [k, v] of Object.entries(message.settings || {}))
        if (k in defaults && JSON.stringify(v) !== JSON.stringify(defaults[k]))
          next[k] = v;
      await ctx.storage.global.set(
        key,
        Object.keys(next).length ? next : null,
      );
      if (isLocal) await sendLocal();
      else for (const view of views) await sendGlobal(view);
    }
  });
}

async function page(webview, file) {
  const html = await ctx.plugin.readText(file);
  webview.html = html.replace("{{lang}}", textus.env.language);
  // Drawn again in the interface's language when that changes.
  const relabel = textus.env.onDidChangeLanguage(() => {
    webview.html = html.replace("{{lang}}", textus.env.language);
  });
  webview.onDidDispose(() => relabel.dispose());
}

/** Textus AI's tool: the notes within `depth` links of one, either way,
 *  each with how many links away, and the links between them. */
async function listNeighbours(input) {
  const root = await textus.files.root();
  if (!root) return { error: "No folder is open." };
  const rel = input.path ? folderPaths.clean(root, input.path, true) : null;
  const docs = await documents();
  const focus = rel ? (docs.find((d) => d.rel === rel) || {}).path : await focusPath();
  if (!focus || !docs.some((d) => d.path === focus))
    return { error: rel ? "No document " + rel + " in the folder." : "No document is open." };
  const g = graphLinks.graphFromMetadata(docs, { tags: !!input.tags });
  const depth = Math.min(3, Math.max(1, Number(input.depth) || 1));
  const near = graphLinks.neighbourhood(g, focus, depth);
  const away = new Map([[focus, 0]]);
  for (let d = 1; d <= depth; d++)
    for (const e of near.edges)
      for (const [a, b] of [[e.source, e.target], [e.target, e.source]])
        if (away.get(a) === d - 1 && !away.has(b)) away.set(b, d);
  const label = new Map(near.nodes.map((n) => [n.id, n.rel || n.name]));
  return {
    document: label.get(focus),
    notes: near.nodes
      .filter((n) => n.id !== focus)
      .map((n) => ({ name: n.name, path: n.rel, kind: n.kind, distance: away.get(n.id) }))
      .sort((a, b) => a.distance - b.distance || nameOrder.compareNames(a.name, b.name)),
    links: near.edges.map((e) => ({ from: label.get(e.source), to: label.get(e.target), both: e.both })),
  };
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_neighbours", listNeighbours);
  textus.metadata.onDidChange(changed);
  textus.files.onDidChangeRoot(changed);
  textus.files.onDidChange(function (event) {
    if (/[\\/]\.obsidian[\\/]graph\.json$/.test(event.path)) changed();
  });
  textus.editor.onDidChangeActive(sendAll);
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
