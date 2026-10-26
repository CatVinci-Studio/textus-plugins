// WaveJSON drawn by WaveDrom, in its dark skin on a dark page.
function wave(el, source, dark) {
  var json = parseLoose(source);
  json.config = Object.assign({}, json.config, {
    skin: dark ? "dark" : "default",
  });
  el.replaceChildren();
  var target = document.createElement("div");
  target.id = "wavedrom-0";
  el.append(target);
  WaveDrom.RenderWaveForm(0, json, "wavedrom-");
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    wave(el, source, dark);
  },
});
