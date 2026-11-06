// A text's lines, each with its own ending (CRLF or LF), so a plugin that
// changes one line leaves every other byte of a mixed file as it was.
// Each plugin using it lists this as lib/text-lines.js in libs.json.
(function (root) {
  "use strict";

  /** `text` as rows `{ text, eol }`; the last row's `eol` is "". */
  function split(text) {
    var parts = String(text).split(/(\r?\n)/);
    var rows = [];
    for (var i = 0; i < parts.length; i += 2) rows.push({ text: parts[i], eol: parts[i + 1] || "" });
    return rows;
  }

  function join(rows) {
    return rows
      .map(function (r) {
        return r.text + r.eol;
      })
      .join("");
  }

  /** `texts` put in as rows before row `at`, ending as their neighbours do. */
  function insert(rows, at, texts) {
    var eol = "";
    for (var i = at - 1; i >= 0 && !eol; i--) eol = rows[i].eol;
    for (var j = at; j < rows.length && !eol; j++) eol = rows[j].eol;
    eol = eol || "\n";
    var added = texts.map(function (t) {
      return { text: t, eol: eol };
    });
    if (at > 0 && at === rows.length && !rows[at - 1].eol) {
      // After a last line without an ending: it gets one, the new last none.
      rows[at - 1].eol = eol;
      added[added.length - 1].eol = "";
    }
    rows.splice.apply(rows, [at, 0].concat(added));
    return rows;
  }

  root.textLines = { split: split, join: join, insert: insert };
})(globalThis);
