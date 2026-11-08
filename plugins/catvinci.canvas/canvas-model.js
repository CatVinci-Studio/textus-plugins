// Canvas: what a JSON Canvas file (jsoncanvas.org) holds, where its parts
// sit, and what an Excalidraw note shows instead of its drawing. Pure, for
// the host, the page and the tests.

(function (root) {
  "use strict";

  const TYPES = ["text", "file", "link", "group"];
  const SIDES = ["top", "right", "bottom", "left"];
  // Obsidian's six preset colours, as the theme's tones.
  const PRESETS = { 1: "red", 2: "orange", 3: "yellow", 4: "green", 5: "teal", 6: "purple" };
  const IMAGES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", avif: "image/avif", bmp: "image/bmp", svg: "image/svg+xml" };
  const NOTES = ["md", "markdown", "txt"];

  const num = (v) => typeof v === "number" && isFinite(v);
  const str = (v) => (typeof v === "string" ? v : "");

  /** A canvas file's nodes and edges, in drawing order; nodes without an
   *  id or a place, and edges to nodes that aren't there, left out. Throws
   *  on text that isn't JSON. */
  function parse(text) {
    const data = String(text).trim() ? JSON.parse(text) : {};
    const nodes = [];
    const ids = new Set();
    for (const n of Array.isArray(data.nodes) ? data.nodes : []) {
      if (!n || typeof n !== "object" || !str(n.id) || ids.has(n.id)) continue;
      if (![n.x, n.y, n.width, n.height].every(num)) continue;
      ids.add(n.id);
      nodes.push({
        id: n.id,
        type: TYPES.includes(n.type) ? n.type : "text",
        x: n.x,
        y: n.y,
        width: Math.max(1, n.width),
        height: Math.max(1, n.height),
        color: str(n.color),
        text: str(n.text),
        file: str(n.file),
        subpath: str(n.subpath),
        url: str(n.url),
        label: str(n.label),
      });
    }
    const edges = [];
    for (const e of Array.isArray(data.edges) ? data.edges : []) {
      if (!e || !ids.has(e.fromNode) || !ids.has(e.toNode)) continue;
      edges.push({
        id: str(e.id),
        fromNode: e.fromNode,
        toNode: e.toNode,
        fromSide: SIDES.includes(e.fromSide) ? e.fromSide : "",
        toSide: SIDES.includes(e.toSide) ? e.toSide : "",
        fromEnd: e.fromEnd === "arrow" ? "arrow" : "none",
        toEnd: e.toEnd === "none" ? "none" : "arrow",
        color: str(e.color),
        label: str(e.label),
      });
    }
    // Groups under everything else, each kind in the file's order.
    nodes.sort((a, b) => (a.type === "group" ? 0 : 1) - (b.type === "group" ? 0 : 1));
    return { nodes: nodes, edges: edges };
  }

  /** A canvas colour as CSS: a preset ("1"-"6") as a tone, a hex as given;
   *  null for none. `fill` is a faint background in it. */
  function color(value) {
    const v = String(value || "").trim();
    const tone = PRESETS[v];
    if (tone)
      return { line: "var(--tone-" + tone + ")", fill: "var(--tone-" + tone + "-tint)", text: "var(--tone-" + tone + "-text)" };
    if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v))
      return { line: v, fill: "color-mix(in srgb, " + v + " 16%, transparent)", text: v };
    return null;
  }

  /** The box around every node; null for none. */
  function bounds(nodes) {
    if (!nodes.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  const MIN_SCALE = 0.05;
  const MAX_SCALE = 4;
  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  /** The view (a point at canvas `p` shows at `p * scale + x|y`) showing
   *  `box` whole and centred in a `width` x `height` stage, `pad` around
   *  it, never larger than its own size. */
  function fit(box, width, height, pad) {
    const p = pad == null ? 40 : pad;
    if (!box) return { x: width / 2, y: height / 2, scale: 1 };
    const scale = clampScale(
      Math.min(1, (width - 2 * p) / Math.max(1, box.width), (height - 2 * p) / Math.max(1, box.height)),
    );
    return {
      x: width / 2 - (box.x + box.width / 2) * scale,
      y: height / 2 - (box.y + box.height / 2) * scale,
      scale: scale,
    };
  }

  /** `view` zoomed by `factor`, the stage point (px, py) staying put. */
  function zoomAt(view, factor, px, py) {
    const scale = clampScale(view.scale * factor);
    const k = scale / view.scale;
    return { x: px - (px - view.x) * k, y: py - (py - view.y) * k, scale: scale };
  }

  /** What a wheel does: with Ctrl or ⌘ held - a trackpad's pinch comes so
   *  too - it zooms; otherwise it moves the canvas. */
  const wheelIntent = (event) => (event.ctrlKey || event.metaKey ? "zoom" : "pan");

  /** The middle of a node's side. */
  function anchor(n, side) {
    if (side === "top") return { x: n.x + n.width / 2, y: n.y };
    if (side === "bottom") return { x: n.x + n.width / 2, y: n.y + n.height };
    if (side === "left") return { x: n.x, y: n.y + n.height / 2 };
    return { x: n.x + n.width, y: n.y + n.height / 2 };
  }

  const NORMAL = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] };
  const OPPOSITE = { top: "bottom", bottom: "top", left: "right", right: "left" };

  /** The side of `from` facing `to`, for an edge that names none. */
  function facing(from, to) {
    const dx = to.x + to.width / 2 - (from.x + from.width / 2);
    const dy = to.y + to.height / 2 - (from.y + from.height / 2);
    // Measured against the box's shape, so a wide node leaves by its sides
    // only for a node well beside it.
    if (Math.abs(dx) * from.height >= Math.abs(dy) * from.width) return dx >= 0 ? "right" : "left";
    return dy >= 0 ? "bottom" : "top";
  }

  /** An arrowhead's three corners, its tip at `tip`, pointing along
   *  (dx, dy). */
  function arrowHead(tip, dx, dy, size) {
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const s = size || 12;
    const bx = tip.x - ux * s, by = tip.y - uy * s;
    const w = s * 0.5;
    return [
      [tip.x, tip.y],
      [bx - uy * w, by + ux * w],
      [bx + uy * w, by - ux * w],
    ];
  }

  const round = (v) => Math.round(v * 10) / 10;

  /** Where an edge runs: its curve as an SVG path, its arrowheads and the
   *  middle of the curve for its label; null when a node is missing. */
  function edgePath(edge, byId) {
    const a = byId[edge.fromNode];
    const b = byId[edge.toNode];
    if (!a || !b) return null;
    const fromSide = edge.fromSide || facing(a, b);
    const toSide = edge.toSide || (edge.fromSide ? facing(b, a) : OPPOSITE[fromSide]);
    const p0 = anchor(a, fromSide);
    const p3 = anchor(b, toSide);
    const reach = Math.min(150, Math.max(40, Math.hypot(p3.x - p0.x, p3.y - p0.y) / 2));
    const n0 = NORMAL[fromSide], n3 = NORMAL[toSide];
    const p1 = { x: p0.x + n0[0] * reach, y: p0.y + n0[1] * reach };
    const p2 = { x: p3.x + n3[0] * reach, y: p3.y + n3[1] * reach };
    const at = (t) => {
      const u = 1 - t;
      return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
      };
    };
    const arrows = [];
    // Each head points into the node it reaches, against that side's normal.
    if (edge.toEnd === "arrow") arrows.push(arrowHead(p3, -n3[0], -n3[1]));
    if (edge.fromEnd === "arrow") arrows.push(arrowHead(p0, -n0[0], -n0[1]));
    const pt = (p) => round(p.x) + " " + round(p.y);
    return {
      d: "M " + pt(p0) + " C " + pt(p1) + ", " + pt(p2) + ", " + pt(p3),
      arrows: arrows.map((corners) => corners.map((c) => round(c[0]) + "," + round(c[1])).join(" ")),
      middle: at(0.5),
    };
  }

  // A text node's Markdown, simply: headings, lists, quotes, code, and
  // bold, italic, struck, highlighted and code spans, links. Escaped first.

  const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function inline(text) {
    // Code spans and links kept aside, so emphasis never reaches inside them.
    const kept = [];
    const keep = (html) => "\u0000" + (kept.push(html) - 1) + "\u0000";
    const name = (label) => keep('<span class="wikilink">' + label + "</span>");
    const s = escape(text)
      .replace(/`([^`]+)`/g, (all, code) => keep("<code>" + code + "</code>"))
      .replace(/!?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (all, target, alias) => name(alias || target))
      .replace(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g, (all, alt, src) => name(alt || src))
      .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, (all, label, href) =>
        /^(https?:|mailto:)/i.test(href)
          ? keep('<a data-href="' + href + '">') + label + keep("</a>")
          : name(label),
      )
      .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (all, a, b) => "<strong>" + (a || b) + "</strong>")
      .replace(/(^|[^*\w])\*([^*\s][^*]*)\*|(^|[^_\w])_([^_\s][^_]*)_/g, (all, p1, a, p2, b) =>
        (p1 != null ? p1 : p2) + "<em>" + (a || b) + "</em>",
      )
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/==([^=]+)==/g, "<mark>$1</mark>");
    return s.replace(/\u0000(\d+)\u0000/g, (all, i) => kept[Number(i)]);
  }

  /** HTML for Markdown `text`, everything in it escaped. */
  function markdown(text) {
    const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let para = [];
    let list = null;
    const flush = () => {
      if (para.length) out.push("<p>" + para.map(inline).join("<br>") + "</p>");
      para = [];
      if (list) out.push("</" + list + ">");
      list = null;
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fence = /^\s*(```|~~~)/.exec(line);
      if (fence) {
        flush();
        const code = [];
        while (++i < lines.length && !lines[i].trim().startsWith(fence[1])) code.push(lines[i]);
        out.push("<pre><code>" + escape(code.join("\n")) + "</code></pre>");
        continue;
      }
      const heading = /^(#{1,6})\s+(.*)$/.exec(line);
      const item = /^\s*(?:([-*+])|(\d+)[.)])\s+(?:\[( |x|X)\]\s+)?(.*)$/.exec(line);
      const quote = /^\s*>\s?(.*)$/.exec(line);
      if (!line.trim()) flush();
      else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
        flush();
        out.push("<hr>");
      } else if (heading) {
        flush();
        out.push("<h" + heading[1].length + ">" + inline(heading[2]) + "</h" + heading[1].length + ">");
      } else if (item) {
        const kind = item[1] ? "ul" : "ol";
        if (para.length || list !== kind) flush();
        if (!list) out.push("<" + kind + ">");
        list = kind;
        const box = item[3] ? (item[3] === " " ? "☐ " : "☑ ") : "";
        out.push((box ? '<li class="task">' : "<li>") + box + inline(item[4]) + "</li>");
      } else if (quote) {
        flush();
        out.push("<blockquote>" + inline(quote[1]) + "</blockquote>");
      } else {
        if (list) flush();
        para.push(line.trim());
      }
    }
    flush();
    return out.join("");
  }

  /** What a file node shows of a note: its first `max` lines of text,
   *  front matter left out. */
  function notePreview(text, max) {
    const body = String(text)
      .replace(/^﻿?---\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)\s*(?:\r?\n|$)/, "")
      .replace(/^\s+/, "");
    return body.split(/\r?\n/).slice(0, max || 12).join("\n");
  }

  const extension = (path) => ((/\.([^./\\]+)$/.exec(String(path)) || [])[1] || "").toLowerCase();

  /** How a file node is drawn: a picture, a note's opening, or its name. */
  function fileKind(path) {
    const ext = extension(path);
    if (IMAGES[ext]) return "image";
    if (NOTES.includes(ext)) return "note";
    return "other";
  }

  const mimeOf = (path) => IMAGES[extension(path)] || "";

  /** A file's name without its folder and extension: a note's title. */
  const titleOf = (path) =>
    String(path)
      .split(/[\\/]/)
      .pop()
      .replace(/\.(md|markdown|txt)$/i, "");

  /** Where in a note a file node's subpath (`#Heading`, `#^block`) goes. */
  function subpathPlace(subpath) {
    const s = String(subpath || "").replace(/^#/, "");
    if (!s) return {};
    return s.startsWith("^") ? { block: s.slice(1) } : { heading: s };
  }

  /** The pictures an Excalidraw note embeds in its text (`![[x.svg]]`,
   *  `![](x.png)`), outside its code blocks and %% comments - where the
   *  drawing's data is kept. */
  function excalidrawEmbeds(text) {
    const lines = [];
    let fence = null;
    for (const line of String(text).split(/\r?\n/)) {
      const mark = /^\s*(```|~~~)/.exec(line);
      if (fence) {
        if (mark && mark[1] === fence) fence = null;
      } else if (mark) fence = mark[1];
      else lines.push(line);
    }
    const visible = lines.join("\n").replace(/%%[\s\S]*?(?:%%|$)/g, "");
    const found = [];
    const add = (target) => {
      const t = target.trim();
      if (IMAGES[extension(t)] && !found.includes(t)) found.push(t);
    };
    for (const m of visible.matchAll(/!\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) add(m[1]);
    for (const m of visible.matchAll(/!\[[^\]]*\]\(<?([^)>]+?)>?(?:\s+"[^"]*")?\)/g)) {
      let target = m[1];
      try {
        target = decodeURIComponent(target);
      } catch {
        // Not encoded: as written.
      }
      if (!/^[a-z]+:/i.test(target)) add(target);
    }
    return found;
  }

  /** The pictures Excalidraw's auto-export writes beside a drawing at
   *  `path`: Drawing.excalidraw.svg, or Drawing.svg with the "keep
   *  .excalidraw" setting off; SVG first. */
  function excalidrawExports(path) {
    const base = String(path).replace(/\.excalidraw(\.md)?$/i, "");
    if (base === String(path)) return [];
    return [".excalidraw.svg", ".excalidraw.png", ".svg", ".png"].map((ext) => base + ext);
  }

  root.jsonCanvas = {
    parse: parse,
    color: color,
    bounds: bounds,
    fit: fit,
    zoomAt: zoomAt,
    clampScale: clampScale,
    wheelIntent: wheelIntent,
    anchor: anchor,
    facing: facing,
    edgePath: edgePath,
    markdown: markdown,
    notePreview: notePreview,
    fileKind: fileKind,
    mimeOf: mimeOf,
    titleOf: titleOf,
    subpathPlace: subpathPlace,
    excalidrawEmbeds: excalidrawEmbeds,
    excalidrawExports: excalidrawExports,
  };
})(typeof window !== "undefined" ? window : globalThis);
