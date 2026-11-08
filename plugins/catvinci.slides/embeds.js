// Pictures in a deck: Obsidian's ![[a.png]] and ![[a.png|300]] as the
// Markdown images Marp reads, and the deck's pictures by their path from
// the document. Pure functions on "/"-separated paths; a plain script the
// host and the tests read.
(function (root) {
  "use strict";
  var PICTURE = /\.(png|jpe?g|gif|webp|avif|bmp|svg|ico)$/i;
  // Code first, so an embed inside it is left as written.
  var EMBED = /(^ {0,3}(`{3,}|~{3,})[^]*?^ {0,3}\2[^\n]*$|`[^`\n]*`)|!\[\[([^\]|#\n]+)(?:#[^\]|\n]*)?(?:\|([^\]\n]*))?\]\]/gm;

  /** The pictures `markdown` embeds, each once, as written. */
  function targets(markdown) {
    var out = [];
    String(markdown || "").replace(EMBED, function (all, code, fence, target) {
      target = target && target.trim();
      if (target && PICTURE.test(target) && out.indexOf(target) < 0) out.push(target);
      return all;
    });
    return out;
  }

  /** "300" as Marp's w:300, "300x200" as w:300 h:200; other words stay
   *  the picture's description. */
  function altOf(text) {
    var size = /^\s*(\d+)(?:\s*x\s*(\d+))?\s*$/.exec(text || "");
    if (!size) return (text || "").replace(/[[\]]/g, "");
    return "w:" + size[1] + (size[2] ? " h:" + size[2] : "");
  }

  /** `markdown` with each picture embed found in `hrefs` (target → path
   *  from the document) a Markdown image. */
  function rewrite(markdown, hrefs) {
    return String(markdown || "").replace(EMBED, function (all, code, fence, target, alias) {
      if (code) return all;
      var href = hrefs[target && target.trim()];
      return href ? "![" + altOf(alias) + "](<" + href + ">)" : all;
    });
  }

  /** `file` as a path from the folder of `doc`. */
  function relative(doc, file) {
    var from = doc.split("/").slice(0, -1);
    var to = file.split("/");
    var same = 0;
    while (same < from.length && same < to.length - 1 && from[same] === to[same]) same++;
    var up = [];
    for (var i = same; i < from.length; i++) up.push("..");
    return up.concat(to.slice(same)).join("/");
  }

  /** `rel` (a path from the folder `dir`) as a full path, ".." taken. */
  function join(dir, rel) {
    var parts = dir.split("/");
    rel.split("/").forEach(function (part) {
      if (part === "..") parts.pop();
      else if (part && part !== ".") parts.push(part);
    });
    return parts.join("/");
  }

  var SOURCE = /(src="|url\(&quot;)([^"&]+)(?="|&quot;)/g;
  var local = function (src) {
    return !/^[a-z][a-z0-9+.-]*:|^\/|^#/i.test(src);
  };

  /** The pictures Marp's `html` shows from files beside the document. */
  function localSources(html) {
    var out = [];
    String(html || "").replace(SOURCE, function (all, lead, src) {
      if (local(src) && out.indexOf(src) < 0) out.push(src);
      return all;
    });
    return out;
  }

  /** `html` with the pictures found in `urls` (source → URL) shown from
   *  there. */
  function inline(html, urls) {
    return String(html || "").replace(SOURCE, function (all, lead, src) {
      return urls[src] ? lead + urls[src] : all;
    });
  }

  root.slideEmbeds = {
    targets: targets,
    rewrite: rewrite,
    relative: relative,
    join: join,
    localSources: localSources,
    inline: inline,
    PICTURE: PICTURE,
  };
})(globalThis);
