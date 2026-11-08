// Pages: how documents nest. A page is a Markdown file. A page with
// sub-pages is a folder unit: Plans/Plans.md, its sub-pages beside it in
// Plans/ (Obsidian's folder notes, inside the folder). The older layout -
// Plans.md with its sub-pages in the Plans/ folder next to it - still
// reads the same. Paths here are `/`-separated and relative to the open
// folder.

(function (root) {
  const stem = (rel) => rel.replace(/\.md$/i, "");
  const dirOf = (rel) => (rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "");
  const nameOf = (rel) => stem(rel).slice(stem(rel).lastIndexOf("/") + 1);
  /** Whether `rel` is a folder unit's own page: Plans/Plans.md. */
  const isUnit = (rel) => dirOf(rel) !== "" && nameOf(rel) === nameOf(dirOf(rel));
  /** The folder a page's sub-pages are in: its own (a unit's), else the one beside it named as it. */
  const childDir = (rel) => (isUnit(rel) ? dirOf(rel) : stem(rel));

  /**
   * The folder's pages as a tree: `{ name, rel, dir, icon, children }`.
   * A page (`rel`) takes the folder named as it (`dir`) as its children;
   * a folder no page names is a node of its own (`rel` null). Pages come
   * before folders, each by name.
   */
  function tree(docs) {
    const pages = new Map(docs.map((d) => [d.rel, d]));
    const nodes = new Map();
    const node = (dir) => {
      if (!nodes.has(dir))
        nodes.set(dir, { name: nameOf(dir), rel: null, dir: dir, icon: null, children: [] });
      return nodes.get(dir);
    };
    const top = { children: [] };
    const parentOf = (dir) => {
      if (dir === "") return top;
      return node(dir);
    };
    // Every folder holding a document, and the folders above it.
    for (const d of docs) {
      let dir = dirOf(d.rel);
      while (dir !== "") {
        const parent = dirOf(dir);
        const n = node(dir);
        const up = parentOf(parent);
        if (!up.children.includes(n)) up.children.push(n);
        dir = parent;
      }
    }
    for (const d of docs) {
      const icon = typeof d.icon === "string" && d.icon ? d.icon : null;
      // A unit's own page is its folder's node, not one of its children.
      if (isUnit(d.rel)) {
        const n = node(dirOf(d.rel));
        if (n.rel && !isUnit(n.rel)) continue;
        n.rel = d.rel;
        n.icon = icon;
        continue;
      }
      const own = nodes.get(stem(d.rel));
      if (own && own.rel) continue;
      const n = own || { name: nameOf(d.rel), dir: null, children: [] };
      n.rel = d.rel;
      n.icon = icon;
      if (own) n.dir = stem(d.rel);
      const up = parentOf(dirOf(d.rel));
      if (!up.children.includes(n)) up.children.push(n);
    }
    // A folder named as a page sits under that page, not beside it.
    const settle = (n) => {
      n.children = n.children.filter((c) => !(c.rel === null && pages.has(c.dir + ".md")));
      n.children.sort(
        (a, b) => (a.rel ? 0 : 1) - (b.rel ? 0 : 1) || nameOrder.compareNames(a.name, b.name),
      );
      n.children.forEach(settle);
    };
    settle(top);
    return top.children;
  }

  /** The pages above `rel`, the outermost first: each page whose folder
   *  holds it. */
  function ancestors(rel, rels) {
    const have = new Set(rels);
    const out = [];
    let dir = dirOf(rel);
    while (dir !== "") {
      const unit = dir + "/" + nameOf(dir) + ".md";
      if (unit !== rel && have.has(unit)) out.unshift(unit);
      else if (have.has(dir + ".md")) out.unshift(dir + ".md");
      dir = dirOf(dir);
    }
    return out;
  }

  /** A title as a file name: no characters a file system refuses. */
  const fileName = (title) => title.trim().replace(/[\\/:*?"<>|#^[\]]/g, "-");

  /** Where a sub-page of `parent` called `title` goes: in its unit's folder. */
  function subpage(parent, title) {
    return childDir(parent) + "/" + fileName(title) + ".md";
  }

  /** Where `rel` goes as a folder unit (Plans.md → Plans/Plans.md), or null when it is one. */
  function unitOf(rel) {
    return isUnit(rel) ? null : stem(rel) + "/" + nameOf(rel) + ".md";
  }

  /** The older pages with sub-pages (Plans.md beside Plans/), and where each goes as a unit. */
  function oldUnits(rels) {
    const have = new Set(rels);
    const dirs = new Set(rels.map(dirOf));
    return rels
      .filter((rel) => !isUnit(rel) && dirs.has(stem(rel)) && !have.has(unitOf(rel)))
      .map((rel) => ({ from: rel, to: unitOf(rel) }));
  }

  /** A wiki link to `rel`: its name alone when no other document has it,
   *  else its path. */
  function link(rel, rels) {
    const name = nameOf(rel);
    const same = rels.filter((r) => nameOf(r).toLowerCase() === name.toLowerCase());
    return same.length > 1 ? "[[" + stem(rel) + "|" + name + "]]" : "[[" + name + "]]";
  }

  root.pages = { tree, ancestors, subpage, link, nameOf, fileName, isUnit, unitOf, oldUnits };
})(typeof window !== "undefined" ? window : globalThis);
