// WaveJSON drawn by WaveDrom: on screen in the theme's colours, in a
// picture in its own skin for the export's.
var SVG = "http://www.w3.org/2000/svg";

// WaveDrom draws into the element whose id ends in `index`.
function wave(el, source, dark, index) {
  var json = parseLoose(source);
  json.config = Object.assign({}, json.config, {
    skin: dark ? "dark" : "default",
  });
  el.replaceChildren();
  var target = document.createElement("div");
  target.id = "wavedrom-" + index;
  el.append(target);
  WaveDrom.RenderWaveForm(index, json, "wavedrom-");
  return target.querySelector("svg");
}

// The skin's colours in the theme's: ink for black and the blue labels,
// the page for white, pastel slots tinted into the page.
function themed(css) {
  return css
    .replace(/font-family:Helvetica/g, "font-family:var(--font-sans)")
    .replace(/(stroke|fill):#(?:000|0041c4)(?=[;}'"]|$)/g, "$1:var(--doc-text)")
    .replace(/stroke:#(?:fff|ffffff)(?=[;}'"]|$)/g, "stroke:var(--doc-text)")
    .replace(
      /fill:(?:#(?:fff|ffffff)|[w]hite)(cc)?(?=[;}'"]|$)/g,
      "fill:var(--doc-bg, var(--ui-bg))",
    )
    .replace(
      /fill:(#(?:ffffb4|ffe0b9|b9e0ff|ccfdfe|cdfdc5|f0c1fb|f5c2c0))(?=[;}'"]|$)/g,
      "fill:color-mix(in srgb, $1 40%, var(--doc-bg, var(--ui-bg)))",
    )
    .replace(/text\{fill:[^;}]*\}/g, "");
}

/** How far a long diagram shrinks before it scrolls instead. */
var READABLE = 0.6;

// On screen: the theme's text and lines, sized by `height=` or the document's zoom.
function onScreen(svg, meta) {
  var style = svg.querySelector("style");
  if (style)
    style.textContent =
      themed(style.textContent) + "text{fill:var(--doc-text)}";
  svg.querySelectorAll("[style]").forEach(function (node) {
    // The whole-picture white backdrop goes; the block's own background shows.
    if (/^stroke:none;fill:[w]hite$/.test(node.getAttribute("style")))
      node.remove();
    else node.setAttribute("style", themed(node.getAttribute("style")));
  });
  var width = parseFloat(svg.getAttribute("width"));
  if (!svg.getAttribute("viewBox") || !(width > 0)) return;
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  var height = parseFloat(meta.height);
  svg.style.height = height > 0 ? height + "px" : "auto";
  var natural = "calc(" + width + "px * var(--ui-text-scale, 1))";
  // A long one shrinks to the column, but only so far that its labels stay
  // readable; past that the block scrolls sideways (a phone).
  svg.style.width =
    height > 0
      ? "auto"
      : "max(" + natural + " * " + READABLE + ", min(100%, " + natural + "))";
  svg.style.maxWidth = height > 0 ? "100%" : "none";
}

drawChartBlock({
  // The default skin, recoloured: the dark one keeps white fills under
  // white lines.
  draw: function (el, source, meta) {
    var svg = wave(el, source, false, 0);
    if (svg) onScreen(svg, meta);
  },
  // Drawn again in the export's colours, not the window's.
  picture: function (el, source, meta, dark) {
    var box = document.createElement("div");
    box.style.cssText = "position:absolute;left:-10000px";
    document.body.append(box);
    try {
      var svg = wave(box, source, dark, 1);
      if (!svg) return null;
      svg.setAttribute("xmlns", SVG);
      return new XMLSerializer().serializeToString(svg);
    } finally {
      box.remove();
    }
  },
});
