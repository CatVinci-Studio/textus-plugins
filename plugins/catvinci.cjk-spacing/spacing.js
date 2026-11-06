// Spaces between CJK (Chinese, Japanese) text and Latin letters or digits,
// as pangu.js puts them - in Markdown, so what markdownKeep lists is left
// as written. Korean is not touched: it spaces its words itself. A plain
// script: the host and the tests read it.
(function (root) {
  "use strict";
  var CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ" + "㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
  var LATIN = "A-Za-z0-9";
  var cjkThenLatin = new RegExp("([" + CJK + "])([" + LATIN + "])", "g");
  var latinThenCjk = new RegExp("([" + LATIN + "%])([" + CJK + "])", "g");
  var keep = root.markdownKeep;

  /** One line or block of Markdown, spaced. */
  function spaceOut(text) {
    return keep.outside(text, function (part) {
      return part.replace(cjkThenLatin, "$1 $2").replace(latinThenCjk, "$1 $2");
    });
  }

  /** A whole document: only its prose lines (markdownKeep.eachProseLine). */
  function spaceDocument(text) {
    return keep.eachProseLine(text, spaceOut);
  }

  root.cjkSpacing = { spaceOut: spaceOut, spaceDocument: spaceDocument };
})(globalThis);
