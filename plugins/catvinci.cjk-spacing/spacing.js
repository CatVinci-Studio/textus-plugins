// Spaces between CJK (Chinese, Japanese) text and Latin letters or digits,
// as pangu.js puts them - in Markdown, so code, math, link targets, HTML
// and addresses are left as written. Korean is not touched: it spaces
// its words itself. A plain script: the host and the tests read it.
(function (root) {
  "use strict";
  var CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ" + "㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
  var LATIN = "A-Za-z0-9";
  var cjkThenLatin = new RegExp("([" + CJK + "])([" + LATIN + "])", "g");
  var latinThenCjk = new RegExp("([" + LATIN + "%])([" + CJK + "])", "g");
  var KEEP =
    /(`[^`\n]*`|\$[^$\n]*\$|\]\([^)\s]*\)|<[^>\n]*>|https?:\/\/[^\s)]+)/;

  /** One line or block of Markdown, spaced. */
  function spaceOut(text) {
    return String(text)
      .split(KEEP)
      .map(function (part, i) {
        // The kept parts are the split's odd pieces.
        return i % 2
          ? part
          : part.replace(cjkThenLatin, "$1 $2").replace(latinThenCjk, "$1 $2");
      })
      .join("");
  }

  /** A whole document: its front matter and fenced code left alone. */
  function spaceDocument(text) {
    var lines = String(text).split("\n");
    var fence = null;
    var front = lines[0] === "---";
    return lines
      .map(function (line, i) {
        if (front) {
          if (i > 0 && line === "---") front = false;
          return line;
        }
        var open = /^\s*(```+|~~~+)/.exec(line);
        if (open) {
          if (!fence) fence = open[1][0];
          else if (open[1][0] === fence) fence = null;
          return line;
        }
        return fence ? line : spaceOut(line);
      })
      .join("\n");
  }

  root.cjkSpacing = { spaceOut: spaceOut, spaceDocument: spaceDocument };
})(globalThis);
