// Bookmarks kept in an Obsidian vault's own .obsidian/bookmarks.json, as
// Obsidian writes them: a heading's or a block's (^id), each with when it
// was made (ctime). Everything else in the file is kept as it is. Pure
// functions; a plain script the host and the tests read.
(function (root) {
  "use strict";
  var ID_AT_END = /(?:^|\s)\^([A-Za-z0-9-]+)\s*$/;
  var ID_LINE = /^\^([A-Za-z0-9-]+)\s*$/;

  /** An id as Obsidian makes one: six letters and digits. */
  function newId(random) {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var out = "";
    for (var i = 0; i < 6; i++) out += chars[Math.floor((random || Math.random)() * chars.length)];
    return out;
  }

  /** A heading's words as Obsidian links to them. */
  function headingOf(markdown) {
    return markdown
      .split("\n")[0]
      .replace(/^\s{0,3}#{1,6}\s+/, "")
      .replace(/\s+#+\s*$/, "")
      .replace(/[#^|[\]]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** The block of `blocks` the selection (`needle`, its first line) is in. */
  function blockOf(blocks, needle) {
    var plain = function (s) {
      return s.replace(/[*_~`[\]()<>\\]/g, "").replace(/\s+/g, " ").trim();
    };
    var words = plain(needle);
    if (!words) return -1;
    var at = blocks.findIndex(function (b) {
      return b.markdown.includes(needle);
    });
    return at >= 0
      ? at
      : blocks.findIndex(function (b) {
          return plain(b.markdown).includes(words);
        });
  }

  /**
   * What to bookmark for a selection in `blocks`: `entry` (type and
   * subpath), and `markdown`, the block's with a new ^id, when it needs
   * one. Null when the selection is in no block.
   */
  function markFor(blocks, selection, random) {
    var text = String(selection || "").trim();
    var needle = text.split("\n")[0].trim();
    var at = blockOf(blocks, needle);
    if (at < 0) return null;
    var block = blocks[at];
    if (block.kind === "heading") {
      var heading = headingOf(block.markdown);
      return heading ? { block: block, entry: { type: "heading", subpath: "#" + heading } } : null;
    }
    var mark = function (id, markdown) {
      return { block: block, entry: { type: "block", subpath: "#^" + id }, markdown: markdown };
    };
    var next = blocks[at + 1] && ID_LINE.exec(blocks[at + 1].markdown.trim());
    var source = block.markdown.replace(/\s+$/, "");
    var lines = source.split("\n");
    var id = newId(random);
    if (block.kind === "list") {
      var line = lines.findIndex(function (l) {
        return l.includes(needle);
      });
      if (line >= 0) {
        var own = ID_AT_END.exec(lines[line]);
        if (own) return mark(own[1]);
        lines[line] = lines[line].replace(/\s+$/, "") + " ^" + id;
        return mark(id, lines.join("\n"));
      }
    }
    if (next) return mark(next[1]);
    var inline = block.kind === "paragraph" || block.kind === "picture";
    var last = ID_AT_END.exec(lines[lines.length - 1]);
    if (inline && last) return mark(last[1]);
    // Lists, quotes, tables and code take the id on a line of its own.
    return mark(id, source + (inline ? " ^" : "\n\n^") + id);
  }

  /** bookmarks.json's text with `entry` added at the end; null when the
   *  file is not one Obsidian could have written. */
  function withEntry(text, entry) {
    var data;
    try {
      data = text && text.trim() ? JSON.parse(text) : {};
    } catch {
      return null;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    if (data.items === undefined) data.items = [];
    if (!Array.isArray(data.items)) return null;
    data.items.push(entry);
    return JSON.stringify(data, null, 2);
  }

  /** Each of the file's entries (in groups too) `change` gives a value
   *  for: dropped for null, else replaced. The text unchanged when none. */
  function changeEntries(text, change) {
    var data;
    try {
      data = JSON.parse(text);
    } catch {
      return text;
    }
    var changed = false;
    var walk = function (items) {
      if (!Array.isArray(items)) return items;
      var out = [];
      items.forEach(function (item) {
        if (item && item.type === "group") item.items = walk(item.items);
        var next = item && typeof item === "object" && item.type !== "group" ? change(item) : item;
        if (next !== item) changed = true;
        if (next) out.push(next);
      });
      return out;
    };
    if (!data || typeof data !== "object") return text;
    data.items = walk(data.items);
    return changed ? JSON.stringify(data, null, 2) : text;
  }

  /** bookmarks.json's text without the entry made at `ctime` for `path`. */
  function withoutEntry(text, ctime, path) {
    return changeEntries(text, function (item) {
      return item.ctime === ctime && item.path === path ? null : item;
    });
  }

  /** bookmarks.json's text with the entries made at `ctimes` following a
   *  file or folder renamed from `from` to `to` (paths in the vault). */
  function movedEntries(text, ctimes, from, to) {
    return changeEntries(text, function (item) {
      if (ctimes.indexOf(item.ctime) < 0 || typeof item.path !== "string") return item;
      var path = item.path === from ? to : item.path.startsWith(from + "/") ? to + item.path.slice(from.length) : null;
      return path === null ? item : Object.assign({}, item, { path: path });
    });
  }

  root.obsidianBookmarks = {
    newId: newId,
    headingOf: headingOf,
    markFor: markFor,
    withEntry: withEntry,
    withoutEntry: withoutEntry,
    movedEntries: movedEntries,
  };
})(globalThis);
