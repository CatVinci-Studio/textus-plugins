// Parts of a note a link can name: the whole note without its front
// matter, a heading's section, a block by its ^id - read as Obsidian
// reads them. Shared by the plugins that show or embed them: each lists
// this as lib/note-parts.js in libs.json and runs it before its host.js.
(function (root) {
  "use strict";
  var FENCE = /^\s{0,3}(`{3,}|~{3,})/;
  var HEADING = /^\s{0,3}(#{1,6})(?:\s+(.*?))?\s*#*\s*$/;
  var ITEM = /^\s*(?:[-*+]|\d{1,9}[.)])(?:\s|$)/;
  var QUOTE = /^\s{0,3}>/;
  var DELIMITER = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;
  var ID = /(?:^|\s)\^([A-Za-z0-9-]+)\s*$/;
  var ALONE = /^\s*\^([A-Za-z0-9-]+)\s*$/;
  var blank = (line) => !line.trim();

  /** Where the text starts after its front matter, in lines. */
  function bodyStart(lines) {
    if (lines[0] !== "---") return 0;
    for (var i = 1; i < lines.length; i++)
      if (lines[i] === "---" || lines[i] === "...") return i + 1;
    return 0;
  }

  /** How far a block starting at `i` goes (exclusive), and its kind. */
  function extent(lines, i) {
    var line = lines[i];
    var fence = FENCE.exec(line);
    if (fence) {
      var close = new RegExp("^\\s{0,3}" + fence[1][0] + "{" + fence[1].length + ",}\\s*$");
      for (var f = i + 1; f < lines.length; f++)
        if (close.test(lines[f])) return { end: f + 1, kind: "code" };
      return { end: lines.length, kind: "code" };
    }
    if (line.trim() === "$$") {
      for (var m = i + 1; m < lines.length; m++)
        if (lines[m].trim() === "$$") return { end: m + 1, kind: "math" };
      return { end: lines.length, kind: "math" };
    }
    if (HEADING.test(line)) return { end: i + 1, kind: "heading" };
    var kind = ITEM.test(line)
      ? "item"
      : QUOTE.test(line)
        ? "quote"
        : line.includes("|") && DELIMITER.test(lines[i + 1] || "")
          ? "table"
          : "paragraph";
    var end = i + 1;
    while (
      end < lines.length &&
      !blank(lines[end]) &&
      !HEADING.test(lines[end]) &&
      !FENCE.test(lines[end]) &&
      !(ITEM.test(lines[end]) && kind !== "table")
    )
      end++;
    return { end: end, kind: kind };
  }

  /** The list the last item of `blocks` ends, made one block in their place. */
  function wholeList(blocks, lines) {
    var k = blocks.length - 1;
    while (k > 0 && blocks[k - 1].kind === "item" && blocks[k].line - blocks[k - 1].end <= 1) k--;
    var first = blocks[k];
    var end = blocks[blocks.length - 1].end;
    var list = {
      line: first.line,
      end: end,
      kind: "list",
      markdown: lines.slice(first.line, end).join("\n").replace(/\s+$/, ""),
      id: null,
      idLine: null,
    };
    blocks.splice(k, blocks.length - k, list);
    return list;
  }

  /**
   * The note's blocks in order: `line` (from 0) to `end`, `kind`, `markdown`
   * without its id, and `id` - a "^id" at the end of its last line, or on a
   * line of its own after it (a list's, a table's, a quote's). Each list
   * item is a block, as Obsidian has it.
   */
  function blocksOf(text) {
    var lines = text.split(/\r?\n/);
    var blocks = [];
    for (var i = bodyStart(lines); i < lines.length; ) {
      if (blank(lines[i])) {
        i++;
        continue;
      }
      var alone = ALONE.exec(lines[i]);
      var prev = blocks[blocks.length - 1];
      if (alone && prev && !prev.id) {
        // After a blank line, the id is the whole list's, not its last item's.
        if (prev.kind === "item") prev = wholeList(blocks, lines);
        prev.id = alone[1];
        prev.idLine = i;
        i++;
        continue;
      }
      var span = extent(lines, i);
      var own = lines.slice(i, span.end);
      var last = own[own.length - 1];
      var id = span.kind === "code" || span.kind === "math" ? null : ID.exec(last);
      if (id) own[own.length - 1] = last.slice(0, id.index).replace(/\s+$/, "");
      blocks.push({
        line: i,
        end: span.end,
        kind: span.kind,
        markdown: own.join("\n").replace(/\s+$/, ""),
        id: id ? id[1] : null,
        idLine: id ? span.end - 1 : null,
      });
      i = span.end;
    }
    return blocks.filter((b) => b.markdown || b.id);
  }

  /** The block `id` names, or null. */
  function block(text, id) {
    var want = String(id).replace(/^\^/, "").toLowerCase();
    var found = blocksOf(text).filter((b) => b.id && b.id.toLowerCase() === want)[0];
    return found || null;
  }

  /** Lines `from` to `to` of the text with the ids of `blocks` taken out:
   *  they are Obsidian's markers, shown nowhere. */
  function shown(text, blocks, from, to) {
    var lines = text.split(/\r?\n/);
    for (var k = 0; k < blocks.length; k++) {
      var at = blocks[k].idLine;
      if (at !== null) lines[at] = ALONE.test(lines[at]) ? null : lines[at].replace(ID, "");
    }
    return lines
      .slice(from, to)
      .filter((l) => l !== null)
      .join("\n")
      .replace(/\s+$/, "");
  }

  /** The text without its front matter at the top, nor ids. */
  function body(text) {
    return shown(text, blocksOf(text), bodyStart(text.split(/\r?\n/)), Infinity);
  }

  /** A heading's words as a link names them: `#My Heading`, `#my-heading`.
   *  The app's rule (headingSlug), so a plugin finds the heading a click does. */
  function slug(words) {
    return String(words)
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
      .replace(/ /g, "-");
  }

  /** The section under heading `name`, its heading line included, to the
   *  next heading of its level or above; null when there is none. */
  function section(text, name) {
    var want = slug(name);
    var blocks = blocksOf(text);
    for (var i = 0; i < blocks.length; i++) {
      var m = blocks[i].kind === "heading" && HEADING.exec(blocks[i].markdown);
      if (!m || slug(m[2] || "") !== want) continue;
      var level = m[1].length;
      var j = i + 1;
      while (j < blocks.length) {
        var n = blocks[j].kind === "heading" && HEADING.exec(blocks[j].markdown);
        if (n && n[1].length <= level) break;
        j++;
      }
      var stop = j < blocks.length ? blocks[j].line : Infinity;
      return { heading: m[2] || "", markdown: shown(text, blocks.slice(i, j), blocks[i].line, stop) };
    }
    return null;
  }

  root.noteParts = { body: body, blocksOf: blocksOf, block: block, section: section, slug: slug };
})(typeof window !== "undefined" ? window : globalThis);
