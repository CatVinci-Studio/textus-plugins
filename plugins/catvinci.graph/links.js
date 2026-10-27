// The folder's documents as a graph, from what Textus knows of them
// (textus.metadata.all): a node per document, an edge per link between
// two. A [[wiki link]] to no document is a node marked missing, and with
// tags shown, each #tag is a node too - as Obsidian draws them. The
// filters, search and groups of the graph's settings panel work here, on
// that graph. Plain JavaScript, shared by the host (host.js) and the unit
// test (graph-links.test.ts).
(function (root) {
  "use strict";

  const stem = (path) =>
    path
      .split(/[\\/]/)
      .pop()
      .replace(/\.(md|markdown)$/i, "");

  /**
   * `docs`: what textus.metadata.all gives. Edges keep their direction:
   * `source` links to `target`, and `both` when it links back - one line
   * between two notes, whichever links to which.
   */
  function graphFromMetadata(docs, options) {
    const withTags = !!(options && options.tags);
    const nodes = docs.map((doc) => ({
      id: doc.path,
      name: stem(doc.path),
      rel: doc.rel,
      tags: doc.tags || [],
      kind: "note",
    }));
    const extra = new Map();
    const edges = [];
    const pairs = new Map();
    const link = (from, to) => {
      if (from === to) return;
      const key = from < to ? from + "\n" + to : to + "\n" + from;
      const edge = pairs.get(key);
      if (!edge) {
        const made = { source: from, target: to, both: false };
        pairs.set(key, made);
        edges.push(made);
      } else if (edge.source !== from) edge.both = true;
    };
    const node = (id, name, kind) => {
      if (!extra.has(id))
        extra.set(id, { id: id, name: name, rel: null, tags: [], kind: kind });
    };
    for (const doc of docs) {
      for (const l of doc.links) {
        if (l.resolved) {
          link(doc.path, l.resolved);
          continue;
        }
        // A link that leads nowhere is a node when written as a name - a
        // [[wiki link]] - not a web address or a path.
        const name = l.target.split("#")[0].trim();
        if (!name || /^[a-z][a-z0-9+.-]*:/i.test(name) || /[\\/.]/.test(name))
          continue;
        const id = "missing:" + name.toLowerCase();
        node(id, name, "missing");
        link(doc.path, id);
      }
      if (withTags)
        for (const tag of doc.tags || []) {
          const name = "#" + tag.replace(/^#/, "");
          const id = "tag:" + name.toLowerCase();
          node(id, name, "tag");
          link(doc.path, id);
        }
    }
    return { nodes: nodes.concat([...extra.values()]), edges: edges };
  }

  /**
   * Does `node` answer the search? Words all must match, each in the
   * name or path; `path:`, `file:` and `tag:` narrow a word to one of
   * them, a leading `-` turns it around - Obsidian's search, in short.
   */
  function compile(query) {
    const words = String(query || "")
      .toLowerCase()
      .match(/-?(?:\w+:)?(?:"[^"]*"|\S+)/gu);
    if (!words) return () => true;
    const tests = words.map((word) => {
      const not = word.startsWith("-") && word.length > 1;
      if (not) word = word.slice(1);
      const m = /^(path|file|tag):(.*)$/.exec(word);
      const field = m ? m[1] : "";
      const text = (m ? m[2] : word).replace(/^"|"$/g, "");
      const test = (n) => {
        if (!text) return true;
        if (field === "tag") {
          const tag = text.replace(/^#/, "");
          return (
            n.tags.some((t) => t.toLowerCase().replace(/^#/, "") === tag) ||
            (n.kind === "tag" && n.name.toLowerCase() === "#" + tag)
          );
        }
        const name = n.name.toLowerCase();
        const rel = (n.rel || "").toLowerCase();
        if (field === "file") return name.includes(text);
        if (field === "path") return rel.includes(text);
        return name.includes(text) || rel.includes(text);
      };
      return not ? (n) => !test(n) : test;
    });
    return (n) => tests.every((test) => test(n));
  }

  /** The graph as the panel's filters leave it; groups give colours. */
  function filterGraph(graph, settings) {
    const match = compile(settings.search);
    let nodes = graph.nodes.filter(
      (n) =>
        (n.kind !== "missing" || !settings.existingOnly) &&
        (n.kind !== "tag" || settings.tags) &&
        (n.kind === "tag" || match(n)),
    );
    let ids = new Set(nodes.map((n) => n.id));
    const edges = graph.edges.filter(
      (e) => ids.has(e.source) && ids.has(e.target),
    );
    // A tag no note left links to goes too; so do notes without links,
    // if they are not wanted.
    const linked = new Set();
    for (const e of edges) linked.add(e.source).add(e.target);
    nodes = nodes.filter(
      (n) =>
        linked.has(n.id) ||
        (n.kind === "note" && settings.orphans !== false) ||
        n.id === settings.keep,
    );
    const groups = (settings.groups || [])
      .filter((g) => g.query && g.query.trim())
      .map((g) => ({ match: compile(g.query), color: g.color }));
    nodes = nodes.map((n) => {
      const group = n.kind === "note" && groups.find((g) => g.match(n));
      return group ? Object.assign({}, n, { color: group.color }) : n;
    });
    ids = new Set(nodes.map((n) => n.id));
    return {
      nodes: nodes,
      edges: edges.filter((e) => ids.has(e.source) && ids.has(e.target)),
    };
  }

  /**
   * The part of `graph` within `depth` links of `focus`. `incoming` and
   * `outgoing` say which way a link may be followed; `neighbours`, whether
   * links among the notes reached show too, or only the ones that reached
   * them - the local graph's three switches in Obsidian.
   */
  function neighbourhood(graph, focus, depth, options) {
    const opts = Object.assign(
      { incoming: true, outgoing: true, neighbours: true },
      options,
    );
    const level = new Map([[focus, 0]]);
    let frontier = [focus];
    const follows = (e, from) =>
      (e.source === from && (opts.outgoing || (e.both && opts.incoming))) ||
      (e.target === from && (opts.incoming || (e.both && opts.outgoing)));
    for (let d = 1; d <= depth && frontier.length; d++) {
      const next = [];
      for (const from of frontier)
        for (const e of graph.edges) {
          if (e.source !== from && e.target !== from) continue;
          const to = e.source === from ? e.target : e.source;
          if (level.has(to) || !follows(e, from)) continue;
          level.set(to, d);
          next.push(to);
        }
      frontier = next;
    }
    return {
      nodes: graph.nodes.filter((n) => level.has(n.id)),
      edges: graph.edges.filter((e) => {
        if (!level.has(e.source) || !level.has(e.target)) return false;
        const a = level.get(e.source);
        const b = level.get(e.target);
        if (a === b) return opts.neighbours;
        // The link that reached a note, or one alongside it.
        return follows(e, a < b ? e.source : e.target);
      }),
    };
  }

  root.graphLinks = {
    graphFromMetadata: graphFromMetadata,
    compile: compile,
    filterGraph: filterGraph,
    neighbourhood: neighbourhood,
  };
})(typeof window !== "undefined" ? window : globalThis);
