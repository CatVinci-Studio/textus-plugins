// [[ completion in the / panel: the folder's notes and their aliases, a
// note's headings after #, its blocks after #^. Each answers a whole list
// that Textus filters as you type; the links are written as Textus would
// write them (metadata.linkTo), so a vault's link format holds.

/* global noteParts, folderPaths, linkStyle */
const completeLinks = (function () {
  /** What linkTo said, for the last few documents written in; dropped
   *  when notes come or go. */
  const written = new Map();
  const KEEP = 8;
  let known = "";

  function linkTo(to, from, options) {
    if (!written.has(from)) {
      written.set(from, new Map());
      if (written.size > KEEP) written.delete(written.keys().next().value);
    }
    const links = written.get(from);
    const key = JSON.stringify([to, options]);
    if (!links.has(key)) {
      const link = linkStyle.linkTo(to, from, options);
      links.set(key, link);
      link.catch(() => links.delete(key));
    }
    return links.get(key);
  }

  const stem = (path) =>
    path
      .split(/[\\/]/)
      .pop()
      .replace(/\.(md|markdown)$/i, "");
  const folderOf = (rel) => rel.split("/").slice(0, -1).join("/");
  /** The "]]" Textus paired with "[[", replaced with the link. */
  const closing = (ctx) => (ctx.after.startsWith("]]") ? 2 : 0);

  /** The document the link is written in; an unsaved one counts as at the top. */
  async function fromOf(ctx) {
    if (ctx.path) return ctx.path;
    const root = await textus.files.root();
    return root ? folderPaths.abs(root, "Untitled.md") : null;
  }

  /** The note `name` names from `from`; the document itself for "". */
  async function noteOf(name, from) {
    if (!name.trim()) return from;
    const found = await textus.metadata.resolveNote("[[" + name + "]]", from);
    return found && found.exists && found.kind === "note" ? found.path : null;
  }

  /** The way links are written here, without the [[ being typed: in the
   *  editor's text it reads as a wiki link the note already has. */
  async function styleOf(ctx, from) {
    return (await linkStyle.options(from, ctx.match + ctx.after.slice(0, closing(ctx)))).style;
  }

  async function notes(ctx) {
    const from = await fromOf(ctx);
    if (!from) return null;
    const style = await styleOf(ctx, from);
    const docs = (await textus.metadata.all())
      .slice()
      .sort((a, b) => (b.modifiedMs || 0) - (a.modifiedMs || 0));
    const paths = docs.map((d) => d.path).sort().join("\n");
    if (paths !== known) written.clear();
    known = paths;
    if (ctx.signal.aborted) return null;
    const entries = [];
    for (const doc of docs) {
      entries.push({ doc: doc, alias: null });
      for (const alias of doc.aliases || []) entries.push({ doc: doc, alias: alias });
    }
    const links = await Promise.all(
      entries.map((e) => linkTo(e.doc.path, from, e.alias ? { alias: e.alias, style } : { style })),
    );
    const after = closing(ctx);
    return {
      complete: true,
      items: entries.map((e, i) => ({
        label: e.alias || stem(e.doc.path),
        detail: e.alias ? e.doc.rel : folderOf(e.doc.rel) || undefined,
        icon: e.alias ? "link" : "file",
        keywords: [e.doc.title, e.doc.rel].join(" "),
        insert: links[i],
        replaceAfter: after,
      })),
    };
  }

  async function headings(ctx) {
    const from = await fromOf(ctx);
    const path = from && (await noteOf(ctx.match.slice(2).split("#")[0], from));
    const doc = path && (await textus.metadata.get(path));
    if (!doc) return null;
    const after = closing(ctx);
    const style = await styleOf(ctx, from);
    const links = await Promise.all(doc.headings.map((h) => linkTo(path, from, { heading: h.text, style })));
    return {
      complete: true,
      items: doc.headings.map((h, i) => ({
        label: h.text,
        detail: "H" + h.level,
        icon: "heading",
        insert: links[i],
        replaceAfter: after,
      })),
    };
  }

  const ICON = { heading: "heading", quote: "quote" };
  /** A block's first line, without its Markdown marks. */
  const firstLine = (markdown) =>
    markdown
      .split("\n")[0]
      .replace(/^\s*(?:#{1,6}\s+|>\s?|(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?)/, "")
      .slice(0, 80);

  async function blocks(ctx) {
    const from = await fromOf(ctx);
    const path = from && (await noteOf(ctx.match.slice(2).split("#")[0], from));
    if (!path) return null;
    const found = noteParts.blocksOf(await textus.files.readText(path));
    const after = closing(ctx);
    const style = await styleOf(ctx, from);
    const links = await Promise.all(
      found.map((b) => (b.id ? linkTo(path, from, { block: b.id, style }) : null)),
    );
    return {
      complete: true,
      items: found.map((b, i) => ({
        label: firstLine(b.markdown) || "^" + b.id,
        detail: b.id ? "^" + b.id : undefined,
        icon: ICON[b.kind] || "block",
        keywords: b.markdown.slice(0, 200),
        // A block without an id gets one in its note once it is picked.
        insert: links[i] || "$0",
        replaceAfter: after,
        command: links[i]
          ? undefined
          : { id: "catvinci.backlinks.linkBlock", args: [{ path: path, line: b.line, from: from }] },
      })),
    };
  }

  /** Gives the block at `line` of `path` an id and writes the link to it. */
  async function linkBlock(target) {
    const id = await textus.files.blockId(target.path, target.line);
    const link = await linkTo(target.path, target.from, id ? { block: id } : {});
    await textus.editor.insertText(link);
  }

  return { notes: notes, headings: headings, blocks: blocks, linkBlock: linkBlock };
})();
