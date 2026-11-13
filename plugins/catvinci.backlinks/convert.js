// Two-way Links' Convert Links: a note's links between the two ways of
// writing them - standard, [Nov 8](Week45/Nov%208.md), and [[Nov 8]] - each
// pointing where it pointed before. Code, inline code and the front matter
// (where Obsidian's properties need [[links]]) are left as they are, and so
// is a link whose note can't be found.
/* global linkStyle */
(function (root) {
  "use strict";

  var FRONT = /^---\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[ \t]*(?=\r?\n|$)/;
  var FENCE = /^ {0,3}(`{3,}|~{3,})[^\n]*(?:\n[\s\S]*?)??(?:\n {0,3}\1(?:(?<=`)`*|(?<=~)~*)[ \t]*(?=\r?\n|$)|(?![\s\S]))/gm;
  var CODE = /(`+)[^`\n]*?\1/g;
  var WIKI = /(!?)\[\[([^\]\n|]+)(?:\|([^\]\n]*))?\]\]/g;
  var MARKDOWN = /(!?)\[((?:[^[\]\n]|\[[^[\]\n]*\])*)\]\((<[^>\n]+>|[^()\s]+(?:\([^()\s]*\)[^()\s]*)*)((?:\s+"[^"\n]*")?)\)/g;
  var SCHEME = /^[a-z][a-z0-9+.-]*:/i;

  /** The ranges of `text` that are never changed. */
  function kept(text) {
    var out = [];
    var front = FRONT.exec(text);
    if (front) out.push([0, front[0].length]);
    [FENCE, CODE].forEach(function (re) {
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(text))) out.push([m.index, m.index + m[0].length]);
    });
    return out;
  }

  /** The links in `text` written as `kind` ("wiki" or "markdown"), outside
   *  what is kept: where each is and what it says. */
  function linksIn(text, kind) {
    var keep = kept(text);
    var inside = function (at) {
      return keep.some(function (r) {
        return at >= r[0] && at < r[1];
      });
    };
    var re = kind === "wiki" ? WIKI : MARKDOWN;
    re.lastIndex = 0;
    var out = [];
    var m;
    while ((m = re.exec(text))) {
      if (inside(m.index)) continue;
      if (kind === "wiki")
        out.push({ start: m.index, end: m.index + m[0].length, source: m[0], embed: !!m[1], target: m[2], label: m[3] });
      else {
        var target = m[3].replace(/^<|>$/g, "");
        if (SCHEME.test(target) || target.charAt(0) === "#" || m[4]) continue;
        out.push({ start: m.index, end: m.index + m[0].length, source: m[0], embed: !!m[1], target: target, label: m[2] });
      }
    }
    return out;
  }

  /** `text` with each `{ start, end, text }` put in, from the end back. */
  function apply(text, changes) {
    return changes
      .slice()
      .sort(function (a, b) {
        return b.start - a.start;
      })
      .reduce(function (out, c) {
        return out.slice(0, c.start) + c.text + out.slice(c.end);
      }, text);
  }

  function stem(path) {
    return String(path).split(/[\\/]/).pop().replace(/\.(md|markdown)$/i, "");
  }

  function decode(target) {
    try {
      return decodeURIComponent(target);
    } catch (e) {
      return target;
    }
  }

  /** What `link` becomes written the other way (`to`), from the note
   *  `from`; null to leave it. */
  async function rewrite(link, from, to) {
    var written = to === "markdown" ? link.source : decode(link.target);
    var found = await textus.metadata.resolveNote(written, from).catch(function () {
      return null;
    });
    if (!found || !found.exists) return null;
    // A picture or another file stays a standard link: every app shows it.
    if (to === "wiki" && found.kind !== "note") return null;
    var alias = link.label && link.label !== stem(found.path) ? link.label : undefined;
    return linkStyle.linkTo(found.path, from, {
      style: to,
      heading: found.heading,
      block: found.block,
      alias: alias,
      embed: link.embed,
    });
  }

  /** The changes converting `text` (the note `from`) to `to`, and how many
   *  links had to stay as they were. */
  async function plan(text, from, to) {
    var links = linksIn(text, to === "markdown" ? "wiki" : "markdown");
    var changes = [];
    var left = 0;
    for (var i = 0; i < links.length; i++) {
      var next = await rewrite(links[i], from, to);
      if (next === null) left++;
      else if (next !== links[i].source) changes.push({ start: links[i].start, end: links[i].end, text: next });
    }
    return { changes: changes, left: left };
  }

  root.convertLinks = { linksIn: linksIn, apply: apply, plan: plan };
})(globalThis);
