// Backlinks: for the document in front, the notes linking to it, the ones
// naming it without a link (right-click one to link it), and where it
// links to - in a list in the sidebar that Textus draws. What Textus
// knows of the folder (textus.metadata) says where they are.

/* global backlinkMentions */
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
  const files = new Map();

  const linked = [];
  const linkedLines = new Set();
  for (const b of await textus.metadata.backlinks(focus)) {
    if (b.path === focus || linkedLines.has(b.path + ":" + b.line)) continue;
    linkedLines.add(b.path + ":" + b.line);
    const line = (await linesOf(b.path, files))[b.line] || b.text;
    linked.push({
      id: "in:" + b.path + ":" + b.line,
      label: short(line.trim()),
      detail: relOf.get(b.path),
      location: { path: b.path, line: b.line, text: line.trim().slice(0, 60) },
    });
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
      unlinked.push({
        id: "named:" + key,
        label: short(text.trim()),
        detail: hit.rel,
        location: { path: hit.path, line: line, text: text.trim().slice(0, 60) },
        actions: [
          {
            label: t("link"),
            command: "catvinci.backlinks.link",
            args: [
              { path: hit.path, line: line, text: text, name: name, to: focus },
            ],
          },
        ],
      });
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
    outgoing.push({
      id: "out:" + key,
      label: name,
      description: l.resolved ? relOf.get(l.resolved) : undefined,
      icon: "file",
      badge: l.resolved ? undefined : { text: t("missing"), tone: "muted" },
      location: l.resolved
        ? { path: l.resolved }
        : { path: focus, line: l.line, text: l.text.slice(0, 60) },
    });
  }

  const section = (key, entries) =>
    entries.map((item) =>
      Object.assign(item, { group: t(key) + " · " + entries.length }),
    );
  return section("linked", linked).concat(
    section("unlinked", unlinked),
    section("outgoing", outgoing),
  );
}

/** Links the mention on `line` of `path`, if the line still says it. */
async function link(mention) {
  await textus.files.process(mention.path, function (text) {
    const eol = text.includes("\r\n") ? "\r\n" : "\n";
    const lines = text.split(/\r?\n/);
    // The file changed since it was listed: nothing is written; the list
    // is drawn again from what is there now.
    if (lines[mention.line] !== mention.text) return text;
    const linked = backlinkMentions.linkMention(
      lines[mention.line],
      mention.name,
      stem(mention.to),
    );
    if (!linked) return text;
    lines[mention.line] = linked;
    return lines.join(eol);
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
  );
};
