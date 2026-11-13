// Tidy's text rules: blank lines, trailing spaces, punctuation width,
// full-width letters and joined lines - in Markdown, so what markdownKeep
// lists (code, math, links, tags, comments, Obsidian's fields and block
// ids) is left as written. A plain script: the host and the tests read it.
(function (root) {
  "use strict";
  var CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ" + "㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
  var isCjk = new RegExp("[" + CJK + "]");
  var keep = root.markdownKeep;
  var outsideKept = keep.outside;
  var eachProseLine = keep.eachProseLine;
  // Obsidian's: a Dataview key:: value line, and a ^block-id.
  var FIELD_LINE = /^\s*(?:>\s*)*(?:(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?)?[^\s:[\]()`>*#+\d.-][^:[\]()`]*::/;
  var BLOCK_ID_END = /(?:^|\s)\^[A-Za-z0-9-]+\s*$/;
  var BLOCK_ID_LINE = /^\s*\^[A-Za-z0-9-]+\s*$/;

  var HALF = ",.?!:;()";
  var FULL = "，。？！：；（）";
  var toFull = {};
  var toHalf = {};
  for (var k = 0; k < HALF.length; k++) {
    toFull[HALF[k]] = FULL[k];
    toHalf[FULL[k]] = HALF[k];
  }

  /** The "(" ")" pairs of a masked line to turn full-width: those with
   *  Chinese or Japanese just outside or just inside. An unpaired one
   *  stays. */
  function bracketsToTurn(s) {
    var turn = {};
    var open = [];
    for (var i = 0; i < s.length; i++) {
      if (s[i] === "(") open.push(i);
      else if (s[i] === ")" && open.length) {
        var o = open.pop();
        var inner = s.slice(o + 1, i).trim();
        if (isCjk.test(s[o - 1] || "") || isCjk.test(inner[0] || "") || isCjk.test(inner[inner.length - 1] || "")) {
          turn[o] = true;
          turn[i] = true;
        }
      }
    }
    return turn;
  }

  /** ASCII punctuation touching Chinese or Japanese text as full-width:
   *  "好,吗?" is "好，吗？". A dot between digits (1.5), "..." and
   *  "Mr." stay; brackets turn in pairs. */
  function fullPunctuation(line) {
    var s = keep.mask(line);
    var turn = bracketsToTurn(s);
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      var prev = s[i - 1] || "";
      var next = s[i + 1] || "";
      if (!(c in toFull)) {
        out += line[i];
        continue;
      }
      if (c === "(" || c === ")") {
        out += turn[i] ? toFull[c] : c;
        continue;
      }
      var after = s.slice(i + 1).replace(/^ +/, "")[0] || "";
      var cjkBefore = isCjk.test(prev);
      var cjkAfter = isCjk.test(after);
      if (c === "." && (/\d/.test(prev) || next === "." || prev === "." || !cjkBefore)) {
        out += c;
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
      var inside = fence;
      fence = keep.fenceStep(fence, line);
      var blank = !inside && !fence && /^\s*(&nbsp;|<br\s*\/?>|\\)?\s*$/i.test(line);
      if (!blank) {
        // A ^block-id line names the list or table above only after a blank line.
        if (BLOCK_ID_LINE.test(line) && out.length && out[out.length - 1] !== "" && /^\s*$/.test(lines[i - 1])) out.push("");
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
   *  words; list markers and quote marks of the lines after the first go.
   *  A key:: value line stays a line, and a ^block-id still ends one. */
  function joinLines(text) {
    var lines = String(text)
      .split("\n")
      .filter(function (l) {
        return l.trim() !== "";
      });
    var out = "";
    var alone = true; // the line before may take no other after it
    lines.forEach(function (l) {
      var field = FIELD_LINE.test(l);
      if (alone || field) {
        out += (out ? "\n" : "") + l.replace(/\s+$/, "");
      } else {
        var line = l.trim().replace(/^(>\s*)+/, "").replace(/^([-*+]|\d+[.)])\s+/, "");
        out += (isCjk.test(out[out.length - 1]) || isCjk.test(line[0]) ? "" : " ") + line;
      }
      alone = field || BLOCK_ID_END.test(l);
    });
    return out;
  }

  var LIST_LINE = /^(\s*)(?:(?:[-*+]|\d+[.)])\s+(\[[ xX]\]\s+)?)?(.*)$/;

  /** The lines as one kind of list - "bullet", "ordered" or "task" - each
   *  keeping its indent and its words; a plain line becomes an item, a
   *  numbered list counts from 1 at each level, a task keeps its tick.
   *  Blank lines and code stay as they are. */
  function listType(text, kind) {
    var counts = [];
    var fence = null;
    return String(text)
      .split("\n")
      .map(function (line) {
        var was = fence;
        fence = keep.fenceStep(fence, line);
        if (was || fence) return line;
        if (line.trim() === "") return line;
        var m = LIST_LINE.exec(line);
        var indent = m[1];
        var depth = indent.replace(/\t/g, "    ").length;
        counts = counts.filter(function (c) {
          return c.depth <= depth;
        });
        var level = counts[counts.length - 1];
        if (!level || level.depth !== depth) counts.push((level = { depth: depth, n: 0 }));
        level.n++;
        var box = m[2] ? m[2].trim() : "[ ]";
        var marker = kind === "ordered" ? level.n + ". " : kind === "task" ? "- " + box + " " : "- ";
        return indent + marker + m[3];
      })
      .join("\n");
  }

  var LIST_RULES = { toBulletList: "bullet", toOrderedList: "ordered", toTaskList: "task" };

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
    if (LIST_RULES[rule]) return listType(text, LIST_RULES[rule]);
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
    listType: listType,
  };
})(globalThis);
