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
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    wave(el, source, dark, 0);
  },
  // Drawn again in the export's colours, not the window's.
  picture: function (el, source, meta, dark) {
    var box = document.createElement("div");
    box.style.cssText = "position:absolute;left:-10000px";
    document.body.append(box);
    try {
      wave(box, source, dark, 1);
      var svg = box.querySelector("svg");
      if (!svg) return null;
      svg.setAttribute("xmlns", SVG);
      return new XMLSerializer().serializeToString(svg);
    } finally {
      box.remove();
    }
  },
});
