// ABC notation engraved as SVG by abcjs, its bars wrapped to the column
// (abcjs's screen padding is 15px a side).
function engrave(el, source, dark) {
  el.replaceChildren();
  el.style.height = "";
  ABCJS.renderAbc(el, source, {
    staffwidth: Math.max(160, el.clientWidth - 30),
    wrap: { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
    selectTypes: false,
    foregroundColor: chartColors(dark).ink,
  });
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    engrave(el, source, dark);
  },
  // At its own size, so the picture has a width and height.
  picture: function (el, source, meta, dark) {
    var box = document.createElement("div");
    box.style.cssText =
      "position:absolute;left:-10000px;width:" + el.clientWidth + "px";
    document.body.append(box);
    try {
      engrave(box, source, dark);
      var svg = box.querySelector("svg");
      if (!svg) return null;
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      return new XMLSerializer().serializeToString(svg);
    } finally {
      box.remove();
    }
  },
});
