// Backlinks: for the document in front, the notes linking to it, the ones
// naming it without a link (right-click one to link it), and where it
// links to - in a list in the sidebar that Textus draws. What Textus
// knows of the folder (textus.metadata) says where they are.

/* global backlinkMentions, folderPaths */
const t = (key, ...args) => textus.l10n.t(key, ...args);
/** Unlinked mentions are looked for up to this many lines. */
const SEARCH_LIMIT = 300;

const stem = (path) =>
  path
    .split(/[\\/]/)
    .pop()
    .replace(/\.(md|markdown)$/i, "");
const short = (text) => (text.length > 200 ? text.slice(0, 199) + "…" : text);

/** The lines of each file, read once a refresh. */
async function linesOf(path, cache) {
  if (!cache.has(path))
    cache.set(
      path,
      textus.files.readText(path).then(
        (text) => text.split(/\r?\n/),
        () => [],
      ),
    );
  return cache.get(path);
}

let last = null;

/** The document in front; with a view in front (a graph, say), the last
 *  one that was, while it is still open. */
async function focusPath() {
  const path = await textus.editor.getPath();
  if (path) return (last = path);
  const open = (await textus.layout.tabs())
    .filter((tab) => tab.kind === "document" && tab.path)
    .map((tab) => tab.path);
  if (!open.includes(last)) last = open[0] || null;
  return last;
}

/** What links to `focus`, the lines naming it without a link, and where
 *  it links to. Lines count from 0, as the index does. */
async function gather(focus, doc) {
  const files = new Map();
  const linked = [];
  const linkedLines = new Set();
  for (const b of await textus.metadata.backlinks(focus)) {
    if (b.path === focus || linkedLines.has(b.path + ":" + b.line)) continue;
    linkedLines.add(b.path + ":" + b.line);
    const line = (await linesOf(b.path, files))[b.line] || b.text;
    linked.push({ path: b.path, line: b.line, text: line });
  }

  const full = await textus.metadata.get(focus);
  const names = backlinkMentions.namesOf(
    stem(focus),
    doc.title,
    full && full.frontmatter,
  );
  const unlinked = [];
  const seen = new Set();
  for (const name of names) {
    const found = await textus.metadata.search(name, { limit: SEARCH_LIMIT });
    for (const hit of found.hits) {
      // Search counts lines from 1, the index from 0.
      const line = hit.line - 1;
      const key = hit.path + ":" + line;
      if (hit.path === focus || linkedLines.has(key) || seen.has(key)) continue;
      const text = (await linesOf(hit.path, files))[line];
      if (text === undefined || backlinkMentions.findMention(text, name) < 0)
        continue;
      seen.add(key);
      unlinked.push({ path: hit.path, line: line, text: text, name: name });
    }
  }

  const outgoing = [];
  const out = new Set();
  for (const l of doc.links) {
    const name = l.resolved ? stem(l.resolved) : l.target.split("#")[0].trim();
    // A web address isn't a note; a [[link]] to no note still shows.
    if (!name || (!l.resolved && /^[a-z][a-z0-9+.-]*:|[\\/]/i.test(name)))
      continue;
    const key = (l.resolved || name).toLowerCase();
    if (out.has(key)) continue;
    out.add(key);
    outgoing.push({ name: name, resolved: l.resolved, line: l.line, text: l.text, key: key });
  }
  return { linked: linked, unlinked: unlinked, outgoing: outgoing };
}

async function items() {
  if (!(await textus.files.root())) {
    list.setMessage(t("nofolder"));
    return [];
  }
  const focus = await focusPath();
  const docs = focus ? await textus.metadata.all() : [];
  const doc = docs.find((d) => d.path === focus);
  if (!doc) {
    list.setMessage(focus ? t("notInFolder") : t("nodoc"));
    return [];
  }
  list.setMessage(t("of", stem(focus)));
  const relOf = new Map(docs.map((d) => [d.path, d.rel]));
  const found = await gather(focus, doc);
  const at = (path, line, text) => ({ path: path, line: line, text: text.trim().slice(0, 60) });

  const linked = found.linked.map((b) => ({
    id: "in:" + b.path + ":" + b.line,
    label: short(b.text.trim()),
    detail: relOf.get(b.path),
    location: at(b.path, b.line, b.text),
  }));
  const unlinked = found.unlinked.map((m) => ({
    id: "named:" + m.path + ":" + m.line,
    label: short(m.text.trim()),
    detail: relOf.get(m.path),
    location: at(m.path, m.line, m.text),
    actions: [
      {
        label: t("link"),
        command: "catvinci.backlinks.link",
        args: [
          { path: m.path, line: m.line, text: m.text, name: m.name, to: focus },
        ],
      },
    ],
  }));
  const outgoing = found.outgoing.map((l) => ({
    id: "out:" + l.key,
    label: l.name,
    description: l.resolved ? relOf.get(l.resolved) : undefined,
    icon: "file",
    badge: l.resolved ? undefined : { text: t("missing"), tone: "muted" },
    location: l.resolved ? { path: l.resolved } : at(focus, l.line, l.text),
  }));

  const section = (key, entries) =>
    entries.map((item) =>
      Object.assign(item, { group: t(key) + " · " + entries.length }),
    );
  return section("linked", linked).concat(
    section("unlinked", unlinked),
    section("outgoing", outgoing),
  );
}

/** Textus AI's tool: a document's backlinks, unlinked mentions and links,
 *  by paths in the folder and lines from 1. */
async function listBacklinks(input) {
  const root = await textus.files.root();
  if (!root) return { error: "No folder is open." };
  const rel = input.path ? folderPaths.clean(root, input.path, true) : null;
  const focus = rel ? folderPaths.abs(root, rel) : await focusPath();
  const docs = await textus.metadata.all();
  const doc = focus && docs.find((d) => d.path === focus || d.rel === rel);
  if (!doc) return { error: rel ? "No document " + rel + " in the folder." : "No document is open." };
  const relOf = new Map(docs.map((d) => [d.path, d.rel]));
  const found = await gather(doc.path, doc);
  const place = (e) => ({ path: relOf.get(e.path) || e.path, line: e.line + 1, text: e.text.trim() });
  return {
    document: doc.rel,
    linked: found.linked.map(place),
    unlinked: found.unlinked.map(place),
    outgoing: found.outgoing.map((l) => ({ name: l.name, path: l.resolved ? relOf.get(l.resolved) || null : null })),
  };
}

/** Links the mention on `line` of `path`, if the line still says it. */
async function link(mention) {
  await textus.files.process(mention.path, function (text) {
    const rows = textLines.split(text);
    const row = rows[mention.line];
    // The file changed since it was listed: nothing is written; the list
    // is drawn again from what is there now.
    if (!row || row.text !== mention.text) return text;
    const linked = backlinkMentions.linkMention(row.text, mention.name, stem(mention.to));
    if (!linked) return text;
    row.text = linked;
    return textLines.join(rows);
  });
}

let list = null;

exports.activate = function (ctx) {
  list = textus.views.registerList("catvinci.backlinks.panel", {
    items: items,
    filterPlaceholder: t("filter"),
    emptyText: t("none"),
  });
  const refresh = () => list.refresh();
  ctx.subscriptions.push(
    list,
    textus.commands.register("catvinci.backlinks.link", (mention) =>
      link(mention).finally(refresh),
    ),
    textus.metadata.onDidChange(refresh),
    textus.files.onDidChangeRoot(refresh),
    textus.editor.onDidChangeActive(refresh),
    textus.layout.onDidChangeLayout(refresh),
    textus.ai.registerTool("list_backlinks", listBacklinks),
  );
};
