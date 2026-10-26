// A Chart.js configuration drawn on a canvas; an export draws it again
// in the page's colours, on white for paper.
var current = null;

function make(canvas, config, dark) {
  var ink = dark ? "#e6e6e6" : "#333333";
  var grid = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  Chart.defaults.color = ink;
  Chart.defaults.borderColor = grid;
  return new Chart(
    canvas,
    Object.assign({}, config, {
      options: Object.assign(
        { animation: false, responsive: false },
        config.options,
      ),
    }),
  );
}

function canvasFor(el, meta) {
  var canvas = document.createElement("canvas");
  canvas.width = el.clientWidth || 600;
  canvas.height = Number(meta.height) || 300;
  return canvas;
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    if (current) current.destroy();
    var canvas = canvasFor(el, meta);
    el.replaceChildren(canvas);
    current = make(canvas, parseLoose(source), dark);
  },
  picture: function (el, source, meta, dark) {
    var canvas = canvasFor(el, meta);
    var chart = make(canvas, parseLoose(source), dark);
    var out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    var ctx = out.getContext("2d");
    ctx.fillStyle = dark ? "#1e1e1e" : "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0);
    chart.destroy();
    return out.toDataURL("image/png");
  },
});
