// What the plugins that rewrite prose (Tidy, CJK Spacing) never change, so
// both leave the same things alone - Obsidian's own syntax too. Each lists
// this as lib/markdown-keep.js in libs.json and runs it before its own code.
(function (root) {
  "use strict";
  // Obsidian Tasks' field marks: dates, recurrence, ids, priorities.
  var TASK_MARKS = "📅|⏳|🛫|✅|❌|➕|🔁|🆔|⛔|🏁|⏫|🔼|🔽|⏬|🔺";
  // Spans inside a line.
  var SPANS = [
    "`[^`\\n]*`",
    "\\$[^$\\n]*\\$",
    "%%.*?%%", // %%comment%%
    "\\]\\([^)\\n]*\\)", // ](target "title")
    "\\[\\[[^\\]\\n]*\\]\\]", // [[wiki link]]
    "\\[\\^[^\\]\\n]*\\]", // [^footnote]
    "^ {0,3}\\[[^\\]\\n]+\\]:.*$", // [ref]: target
    "(?:^|(?<=\\s))#[^\\s#]+", // #tag
    "\\(@[^)\\n]*\\)", // (@2026-11-06 09:00), a reminder
    "<[^>\\n]*>",
    "[a-z][a-z0-9+.-]*:\\/\\/[^\\s)]+",
    "[\\w.+-]+@[\\w-]+\\.[\\w.-]+",
    "\\[[^[\\]\\n]*?::[^\\]\\n]*\\]", // [key:: value]
    "\\([^()\\n]*?::[^)\\n]*\\)", // (key:: value)
    // key:: value on a line of its own, or as a list item.
    "(?<=^[ \\t]*(?:>[ \\t]*)*(?:(?:[-*+]|\\d+[.)])[ \\t]+(?:\\[.\\][ \\t]+)?)?)[^\\s:[\\]()`>*#+\\d.-][^:\\n[\\]()`]*::.*$",
    "(?:^|(?<=\\s))\\^[A-Za-z0-9-]+(?=[ \\t]*$)", // ^block-id
    "==[^\\s=](?:[^=\\n]*[^\\s=])?==", // ==highlight==
    "(?:📅|⏳|🛫|✅|❌|➕)\\uFE0F? ?\\d{4}-\\d{2}-\\d{2}",
    "(?:🆔|⛔)\\uFE0F? ?[\\w,-]+",
    "🏁\\uFE0F? ?\\w+",
    "🔁\\uFE0F?[^\\n]*?(?=[ \\t]*(?:" + TASK_MARKS + "|\\^[A-Za-z0-9-]+[ \\t]*$|$))",
  ];
  var KEEP = new RegExp("(" + SPANS.join("|") + ")", "m");
  var KEEP_ALL = new RegExp(SPANS.join("|"), "gm");
  // Editor block kinds that are never prose; "other" is the front matter.
  var SKIP_KINDS = ["code", "math", "html", "definition", "other"];

  /** `text` with `change` applied outside the kept spans. */
  function outside(text, change) {
    return String(text)
      .split(KEEP)
      .map(function (part, i) {
        return i % 2 ? part : change(part);
      })
      .join("");
  }

  /** `line` with each kept span blanked to NULs of the same length, so
   *  offsets still match the line. */
  function mask(line) {
    return String(line).replace(KEEP_ALL, function (m) {
      return new Array(m.length + 1).join("\0");
    });
  }

  var BLANK = /^\s*$/;
  var LIST = /^ {0,3}(?:[-*+]|\d+[.)])(?:\s|$)/;
  var HTML_OPEN = /^ {0,3}<(?:!--|[A-Za-z][\w-]*|\/[A-Za-z][\w-]*)(?:[\s>/]|$)/;
  var RAW = /^ {0,3}<(pre|script|style|textarea)\b/i;

  /** Each prose line of a document through `change(line, i, lines)`.
   *  Front matter, fenced code, indented code, $$ math, HTML blocks and
   *  %% comment blocks are passed over. */
  function eachProseLine(text, change) {
    var lines = String(text).split("\n");
    var fence = null;
    var math = false;
    var comment = false;
    var html = null; // what ends the HTML block: "" a blank line, else its closing text
    var front = /^---\s*$/.test(lines[0]);
    var prevBlank = true;
    var inList = false;
    var indented = false;
    return lines
      .map(function (line, i) {
        var blank = BLANK.test(line);
        var keep = (function () {
          if (front) {
            if (i > 0 && /^(---|\.\.\.)\s*$/.test(line)) front = false;
            return true;
          }
          var open = /^\s*(```+|~~~+)/.exec(line);
          if (open && !html && !comment) {
            if (!fence) fence = open[1][0];
            else if (open[1][0] === fence) fence = null;
            return true;
          }
          if (fence) return true;
          if (html !== null) {
            if (html === "" ? blank : line.indexOf(html) >= 0) html = null;
            return true;
          }
          if (comment) {
            if (/%%/.test(line)) comment = false;
            return true;
          }
          if (/^\s*%%/.test(line) && (line.match(/%%/g) || []).length % 2) {
            comment = true;
            return true;
          }
          if (/^\s*\$\$/.test(line)) {
            // A one-line $$ x $$ opens and closes; anything else toggles.
            if (!/^\s*\$\$.*\S.*\$\$\s*$/.test(line)) math = !math;
            return true;
          }
          if (math) return true;
          if (!blank && /^( {4}|\t)/.test(line) && !inList && (prevBlank || indented)) {
            indented = true;
            return true;
          }
          if (prevBlank && HTML_OPEN.test(line)) {
            var raw = RAW.exec(line);
            var end = raw ? "</" + raw[1].toLowerCase() : /^ {0,3}<!--/.test(line) ? "-->" : "";
            var closesHere = end && line.toLowerCase().indexOf(end) > line.search(/</) + 1;
            if (!closesHere) html = end;
            if (!end && blank) html = null;
            return true;
          }
          return false;
        })();
        if (!blank && !/^( {4}|\t)/.test(line)) {
          indented = false;
          if (LIST.test(line)) inList = true;
          else if (prevBlank) inList = false;
        }
        prevBlank = blank;
        return keep ? line : change(line, i, lines);
      })
      .join("\n");
  }

  /** Whether each line of `text` is prose that may change. */
  function proseLines(text) {
    var prose = String(text)
      .split("\n")
      .map(function () {
        return false;
      });
    eachProseLine(text, function (line, i) {
      prose[i] = true;
      return line;
    });
    return prose;
  }

  root.markdownKeep = {
    SPANS: SPANS,
    proseLines: proseLines,
    SKIP_KINDS: SKIP_KINDS,
    outside: outside,
    mask: mask,
    eachProseLine: eachProseLine,
  };
})(globalThis);
