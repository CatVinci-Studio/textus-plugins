// [[Wiki links]] in a plugin page's words: the page draws them as links
// (wikiLinks.draw), and its host opens the note one names (wikiLinks.open).
// Each plugin using it lists this as lib/wiki-links.js, in its page and in
// its main after lib/folder-paths.js.
/* global textus, folderPaths */
(function (root) {
  "use strict";

  const WIKI = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;

  /** `value` into `node`, its [[links]] as links that call `open(name)`;
   *  a click on one goes no further. */
  function draw(node, value, open) {
    node.textContent = "";
    let at = 0;
    for (const m of value.matchAll(WIKI)) {
      node.append(value.slice(at, m.index));
      const link = document.createElement("a");
      link.className = "note-link";
      link.href = "#";
      link.textContent = m[2] || m[1];
      link.title = m[1];
      link.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(m[1].trim());
      };
      node.append(link);
      at = m.index + m[0].length;
    }
    node.append(value.slice(at));
  }

  /** Opens the note `name` links to from the document at `from`, as Textus
   *  resolves a wiki link - or, with none, the one of that name beside it.
   *  Says `missing` when neither opens. */
  async function open(name, from, missing) {
    let note = null;
    try {
      note = await textus.metadata.resolveLink("[[" + name + "]]", from);
    } catch {
      // No folder open.
    }
    const beside = folderPaths.abs(from.replace(/[\\/][^\\/]*$/, ""), name.replace(/\.(md|markdown)$/i, "") + ".md");
    try {
      await textus.layout.open(note || beside);
    } catch {
      await textus.ui.message(missing);
    }
  }

  root.wikiLinks = { draw: draw, open: open };
})(globalThis);
