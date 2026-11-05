// Text Tidy's rules: blank lines, trailing spaces, punctuation width,
// full-width letters and joined lines - in Markdown, so code, math, link
// targets, HTML and addresses are left as written. A plain script: the host
// and the tests read it.
(function (root) {
  "use strict";
  var CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ" + "㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
  var isCjk = new RegExp("[" + CJK + "]");
  var KEEP = new RegExp(
    "(" +
      [
        "`[^`\\n]*`",
        "\\$[^$\\n]*\\$",
        "\\]\\([^)\\n]*\\)", // ](target "title")
        "\\[\\[[^\\]\\n]*\\]\\]", // [[wiki link]]
        "\\[\\^[^\\]\\n]*\\]", // [^footnote]
        "^ {0,3}\\[[^\\]\\n]+\\]:.*$", // [ref]: target
        "<[^>\\n]*>",
        "[a-z][a-z0-9+.-]*:\\/\\/[^\\s)]+",
        "[\\w.+-]+@[\\w-]+\\.[\\w.-]+",
      ].join("|") +
      ")",
    "m",
  );

  /** `text` with `change` applied outside what KEEP protects. */
  function outsideKept(text, change) {
    return String(text)
      .split(KEEP)
      .map(function (part, i) {
        return i % 2 ? part : change(part);
      })
      .join("");
  }

  /** Each line of a document that is prose, through `change`: front
   *  matter, fenced code and $$ math are passed over. */
  function eachProseLine(text, change) {
    var lines = String(text).split("\n");
    var fence = null;
    var math = false;
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
        if (fence) return line;
        if (/^\s*\$\$/.test(line)) {
          if (!/^\s*\$\$.*\S.*\$\$\s*$/.test(line)) math = !math;
          return line;
        }
        return math ? line : change(line, i, lines);
      })
      .join("\n");
  }

  var HALF = ",.?!:;()";
  var FULL = "，。？！：；（）";
  var toFull = {};
  var toHalf = {};
  for (var k = 0; k < HALF.length; k++) {
    toFull[HALF[k]] = FULL[k];
    toHalf[FULL[k]] = HALF[k];
  }

  /** ASCII punctuation touching Chinese or Japanese text as full-width:
   *  "好,吗?" is "好，吗？". A dot between digits (1.5), "..." and
   *  "Mr." stay; a bracket turns when its text is CJK. */
  function fullPunctuation(line) {
    return outsideKept(line, function (s) {
      var out = "";
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        var prev = s[i - 1] || "";
        var next = s[i + 1] || "";
        if (!(c in toFull)) {
          out += c;
          continue;
        }
        var after = s.slice(i + 1).replace(/^ +/, "")[0] || "";
        var cjkBefore = isCjk.test(prev);
        var cjkAfter = isCjk.test(after);
        if (c === "." && (/\d/.test(prev) || next === "." || prev === "." || !cjkBefore)) {
          out += c;
          continue;
        }
        if (c === "(") {
          out += cjkAfter || cjkBefore ? "（" : c;
          continue;
        }
        if (c === ")") {
          out += cjkBefore ? "）" : c;
          continue;
        }
        if (cjkBefore || (cjkAfter && c !== ":")) {
          out += toFull[c];
          // The space after an ASCII mark goes with it.
          while (s[i + 1] === " " && isCjk.test(after)) i++;
          continue;
        }
        out += c;
      }
      return out;
    });
  }

  /** Full-width punctuation in Latin text as ASCII, with the space English
   *  puts after it: "Hello，world" is "Hello, world". */
  function halfPunctuation(line) {
    return outsideKept(line, function (s) {
      var out = "";
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (!(c in toHalf)) {
          out += c;
          continue;
        }
        var prev = s[i - 1] || "";
        var next = s[i + 1] || "";
        if (isCjk.test(prev) || isCjk.test(next)) {
          out += c;
          continue;
        }
        var half = toHalf[c];
        out += half;
        if (half !== "(" && next && next !== " " && /[A-Za-z0-9"']/.test(next)) out += " ";
      }
      return out;
    });
  }

  /** Full-width letters, digits and the ideographic space as ASCII:
   *  "ＡＢＣ１２３" is "ABC123". */
  function halfLetters(line) {
    return outsideKept(line, function (s) {
      return s
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (c) {
          return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
        })
        .replace(/(\S)　(?=\S)/g, "$1 ");
    });
  }

  /** Trailing spaces and tabs off; two or more spaces before the next line
   *  of the same paragraph are a line break and stay. */
  function trimTrailing(text) {
    return eachProseLine(text, function (line, i, lines) {
      var next = lines[i + 1];
      var breaks = / {2,}$/.test(line) && line.trim() !== "" && next !== undefined && next.trim() !== "";
      return breaks ? line.replace(/[ \t]+$/, "  ") : line.replace(/[ \t]+$/, "");
    });
  }

  /** Blank lines out, keeping one between paragraphs where Markdown needs
   *  it, and those inside fenced code. `all`: every blank line, for a
   *  selection of plain lines. */
  function removeBlankLines(text, all) {
    var lines = String(text).split("\n");
    var out = [];
    var fence = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var open = /^\s*(```+|~~~+)/.exec(line);
      if (open) {
        if (!fence) fence = open[1][0];
        else if (open[1][0] === fence) fence = null;
      }
      var blank = !fence && /^\s*(&nbsp;|<br\s*\/?>|\\)?\s*$/i.test(line);
      if (!blank) {
        out.push(line);
        continue;
      }
      if (all) continue;
      if (out.length && out[out.length - 1] !== "") out.push("");
    }
    while (out.length && out[out.length - 1] === "") out.pop();
    return out.join("\n") + (/\n$/.test(text) ? "\n" : "");
  }

  /** Lines as one: no space between Chinese or Japanese, one between
   *  words; list markers and quote marks of the lines after the first go. */
  function joinLines(text) {
    var lines = String(text)
      .split("\n")
      .map(function (l, i) {
        var t = l.trim();
        return i ? t.replace(/^(>\s*)+/, "").replace(/^([-*+]|\d+[.)])\s+/, "") : l.replace(/\s+$/, "");
      })
      .filter(function (l) {
        return l !== "";
      });
    return lines.reduce(function (acc, line) {
      if (!acc) return line;
      var a = acc[acc.length - 1];
      var b = line[0];
      return acc + (isCjk.test(a) || isCjk.test(b) ? "" : " ") + line;
    }, "");
  }

  var LINE_RULES = {
    fullPunctuation: fullPunctuation,
    halfPunctuation: halfPunctuation,
    halfLetters: halfLetters,
  };

  /** A document or selection tidied by one rule's name. */
  function tidy(text, rule, options) {
    if (rule === "removeBlankLines") return removeBlankLines(text, options && options.all);
    if (rule === "trimTrailing") return trimTrailing(text);
    if (rule === "joinLines") return joinLines(text);
    var change = LINE_RULES[rule];
    if (!change) throw new Error("no rule " + rule);
    return eachProseLine(text, change);
  }

  root.textTidy = {
    tidy: tidy,
    fullPunctuation: fullPunctuation,
    halfPunctuation: halfPunctuation,
    halfLetters: halfLetters,
    trimTrailing: trimTrailing,
    removeBlankLines: removeBlankLines,
    joinLines: joinLines,
  };
})(globalThis);
