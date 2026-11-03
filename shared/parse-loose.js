// JSON, or what people write by hand for it - unquoted keys, single
// quotes, trailing commas, comments - read without running anything (a
// page may not: no eval). Shared by the chart plugins whose blocks are
// JSON: their pages and hosts load it as lib/parse-loose.js.
(function (root) {
  "use strict";
  root.parseLoose = function (source) {
    var text = String(source);
    var out = "";
    var i = 0;
    var word = /[A-Za-z_$][\w$]*/y;
    while (i < text.length) {
      var c = text[i];
      if (c === '"' || c === "'") {
        var j = i + 1;
        var body = "";
        while (j < text.length && text[j] !== c) {
          if (text[j] === "\\") body += text[j++];
          body += text[j++];
        }
        out += JSON.stringify(
          c === '"' ? JSON.parse('"' + body + '"') : body.replace(/\\'/g, "'"),
        );
        i = j + 1;
      } else if (c === "/" && text[i + 1] === "/") {
        while (i < text.length && text[i] !== "\n") i++;
      } else if (c === "/" && text[i + 1] === "*") {
        i = text.indexOf("*/", i + 2);
        i = i < 0 ? text.length : i + 2;
      } else if (c === ",") {
        // A comma with only a closing bracket after it goes.
        var rest = text
          .slice(i + 1)
          .match(/^(\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/)[0];
        var next = text[i + 1 + rest.length];
        if (next !== "}" && next !== "]") out += c;
        i++;
      } else {
        word.lastIndex = i;
        var m = word.exec(text);
        if (m) {
          var after = text.slice(i + m[0].length).match(/^\s*/)[0];
          var key = text[i + m[0].length + after.length] === ":";
          // A key is quoted; a word that is a value is left for JSON to
          // take (true, false, null) or refuse.
          out += key ? JSON.stringify(m[0]) : m[0];
          i += m[0].length;
        } else {
          out += c;
          i++;
        }
      }
    }
    return JSON.parse(out);
  };
})(typeof window !== "undefined" ? window : globalThis);
