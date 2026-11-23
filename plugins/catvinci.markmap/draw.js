// A Markdown outline drawn as a mind map (markmap).
var SVG = "http://www.w3.org/2000/svg";
var transformer = new window.markmap.Transformer();
// Code, link and highlight colours for a picture in the other appearance.
var FIXED = {
  light: { code: "#f2f3f5", accent: "#4081d2", mark: "#fff3b0" },
  dark: { code: "#2a2d33", accent: "#7aaeef", mark: "#5c4f1f" },
};

// markmap's own CSS as literal values from the theme, so an export keeps them.
function themeVars(svg, c, dark) {
  var fixed = FIXED[dark ? "dark" : "light"];
  var own = dark === (document.documentElement.dataset.theme === "dark");
  var css = getComputedStyle(document.documentElement);
  var v = function (name, fallback) {
    return (own && css.getPropertyValue(name).trim()) || fallback;
  };
  var probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;visibility:hidden;font-family:var(--doc-font,var(--font-sans,sans-serif));font-size:var(--text-body,1em)";
  document.body.append(probe);
  var font = getComputedStyle(probe);
  var size = parseFloat(font.fontSize) || 16;
  var family = font.fontFamily;
  probe.remove();
  var set = {
    "--markmap-font": "400 " + size + "px/" + Math.round(size * 1.25) + "px " + family,
    "--markmap-text-color": c.ink,
    "--markmap-circle-open-bg": c.bg,
    "--markmap-code-bg": v("--doc-code-bg", fixed.code),
    "--markmap-code-color": c.ink,
    "--markmap-a-color": v("--doc-accent", fixed.accent),
    "--markmap-a-hover-color": v("--doc-accent", fixed.accent),
    "--markmap-highlight-bg": v("--doc-highlight-bg", fixed.mark),
  };
  for (var name in set) svg.style.setProperty(name, set[name]);
}

// Fitted up to twice its natural size: a small outline fills a wide block
// or a tall height= without its text growing past a heading's.
var MOST_SCALE = 2;
var FIT_RATIO = 0.95;

// markmap's rect holds the nodes' boxes; a node's circle and line sit on
// its box's bottom edge and reach this far past it.
var EDGE = 8;

/** The scale and offset that fit content `rect` ({ x1, y1, x2, y2 }) in a
 *  box w x h, centred, at most `most` times its size. */
function fitBox(w, h, rect, most) {
  var x1 = rect.x1 - EDGE;
  var y1 = rect.y1 - EDGE;
  var dw = Math.max(rect.x2 + EDGE - x1, 1);
  var dh = Math.max(rect.y2 + EDGE - y1, 1);
  var k = Math.min((w / dw) * FIT_RATIO, (h / dh) * FIT_RATIO, most);
  return {
    k: k,
    x: (w - dw * k) / 2 - x1 * k,
    y: (h - dh * k) / 2 - y1 * k,
  };
}

/** The map drawn in each box: let go before the next, or each redraw
 *  would keep its observer, hooks and tree. */
var maps = new WeakMap();

function forget(el) {
  var map = maps.get(el);
  if (map) map.destroy();
  maps.delete(el);
}

function mindMap(el, source, meta, dark) {
  forget(el);
  var svg = document.createElementNS(SVG, "svg");
  svg.style.width = "100%";
  svg.style.height = (Number(meta.height) || 360) + "px";
  var c = chartColors(dark);
  var seen = new Map();
  svg.style.color = c.ink;
  themeVars(svg, c, dark);
  el.replaceChildren(svg);
  var root = transformer.transform(source).root;
  var map = window.markmap.Markmap.create(svg, {
    autoFit: true,
    duration: 0,
    // Plain wheel scrolls the note; ctrl or pinch zooms, drag pans.
    pan: false,
    scrollForPan: true,
    // Branches in the theme's tones, in the order they are met, as
    // markmap's own ordinal colours are.
    color: function (node) {
      var key = String((node.state && node.state.path) || "");
      if (!seen.has(key)) seen.set(key, seen.size);
      return c.tones[seen.get(key) % c.tones.length];
    },
  });
  // d3-zoom's own extent reads the svg's width attribute, which "100%"
  // can't give while the svg has no layout yet: the real box instead.
  if (map.zoom && map.zoom.extent)
    map.zoom.extent(function () {
      var w = svg.clientWidth || el.clientWidth || 1;
      var h = svg.clientHeight || Number(meta.height) || 360;
      return [
        [0, 0],
        [w, h],
      ];
    });
  // markmap's own fit measures the svg with getBoundingClientRect, which in
  // a page at the document's zoom is the zoomed size: the map came out that
  // much too big and was cut off on the right. The svg's layout size, in
  // the units the map is drawn in, instead.
  map.fit = function () {
    var w = svg.clientWidth || el.clientWidth || 1;
    var h = svg.clientHeight || Number(meta.height) || 360;
    var fit = fitBox(w, h, map.state.rect, MOST_SCALE);
    map.svg.call(
      map.zoom.transform,
      window.d3.zoomIdentity.translate(fit.x, fit.y).scale(fit.k),
    );
    return Promise.resolve();
  };
  maps.set(el, map);
  return map.setData(root).then(function () {
    return map.fit();
  });
}

drawChartBlock({
  draw: mindMap,
  // Drawn again in the export's colours, at a fixed size.
  picture: async function (el, source, meta, dark) {
    var box = document.createElement("div");
    box.style.cssText =
      "position:absolute;left:-10000px;width:" + el.clientWidth + "px";
    document.body.append(box);
    try {
      await mindMap(box, source, meta, dark);
      var svg = box.querySelector("svg");
      svg.setAttribute("xmlns", SVG);
      svg.setAttribute("width", String(el.clientWidth));
      svg.setAttribute("height", String(Number(meta.height) || 360));
      return new XMLSerializer().serializeToString(svg);
    } finally {
      forget(box);
      box.remove();
    }
  },
});
