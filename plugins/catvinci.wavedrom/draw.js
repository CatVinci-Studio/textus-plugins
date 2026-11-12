// WaveJSON drawn by WaveDrom, in its dark skin on a dark page.
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

// On screen: the theme's text and lines, sized by `height=` or the document's zoom.
function onScreen(svg, meta) {
  var style = svg.querySelector("style");
  if (style)
    style.textContent = style.textContent
      .replace(/font-family:Helvetica/g, "font-family:var(--font-sans)")
      .replace(/stroke:#(?:000|fff|ffffff)(?=[;}])/g, "stroke:var(--doc-text)")
      .replace(/text\{fill:[^;}]*\}/g, "") + "text{fill:var(--doc-text)}";
  var width = parseFloat(svg.getAttribute("width"));
  if (!svg.getAttribute("viewBox") || !(width > 0)) return;
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  var height = parseFloat(meta.height);
  svg.style.height = height > 0 ? height + "px" : "auto";
  svg.style.width = height > 0 ? "auto" : "calc(" + width + "px * var(--ui-text-scale, 1))";
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    var svg = wave(el, source, dark, 0);
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
