// What a Logseq graph's logseq/config.edn says about the folder: where
// pages and journals go and how journals are named. Logseq links pages by
// name, keeps pictures in assets/ and shows a single newline as a break.
/* exported logseqConventions */

/** The value of a top-level `:key` written on one line, quotes dropped;
 *  `;` comments skipped. */
function ednKey(text, key) {
  var lines = String(text).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim().replace(/^\{\s*/, "");
    if (line.charAt(0) === ";" || line.indexOf(key) !== 0) continue;
    var rest = line.slice(key.length);
    if (rest && !/^\s/.test(rest)) continue;
    rest = rest.trim();
    var quoted = /^"([^"]*)"/.exec(rest);
    var value = quoted
      ? quoted[1]
      : rest.split(/\s;/)[0].trim().replace(/[,}]+$/, "");
    if (value.trim()) return value.trim();
  }
  return null;
}

/** A date-fns format (Logseq's) in moment.js tokens, as Textus names
 *  daily notes. */
function momentFormat(format) {
  var table = [
    ["yyyy", "YYYY"],
    ["yy", "YY"],
    ["y", "YYYY"],
    ["EEEE", "dddd"],
    ["EEE", "ddd"],
    ["do", "Do"],
    ["dd", "DD"],
    ["d", "D"],
  ];
  var out = "";
  var rest = String(format);
  outer: while (rest) {
    if (rest.charAt(0) === "'") {
      var end = rest.indexOf("'", 1);
      if (end < 0) end = rest.length;
      out += "[" + rest.slice(1, end) + "]";
      rest = rest.slice(end + 1);
      continue;
    }
    for (var i = 0; i < table.length; i++) {
      if (rest.indexOf(table[i][0]) === 0) {
        out += table[i][1];
        rest = rest.slice(table[i][0].length);
        continue outer;
      }
    }
    out += rest.charAt(0);
    rest = rest.slice(1);
  }
  return out;
}

function logseqConventions(text) {
  return {
    linkStyle: "wiki",
    linkPath: "shortest",
    attachments: "assets",
    softBreaks: true,
    newNotes: ednKey(text, ":pages-directory") || "pages",
    daily: {
      folder: ednKey(text, ":journals-directory") || "journals",
      format: momentFormat(
        ednKey(text, ":journal/file-name-format") || "yyyy_MM_dd",
      ),
    },
  };
}
