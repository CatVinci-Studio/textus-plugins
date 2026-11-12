// A Chart.js configuration drawn on a canvas; an export draws it again
// in the page's colours, on white for paper.
var current = null;

// Chart.js routes ticks, grid and legend to its global defaults, so the
// appearance and the theme's font and text scale are set there.
function setDefaults(c) {
  var css = getComputedStyle(document.documentElement);
  var family = css.getPropertyValue("--font-sans").trim();
  var scale = parseFloat(css.getPropertyValue("--ui-text-scale")) || 1;
  Chart.defaults.color = c.muted;
  Chart.defaults.borderColor = c.grid;
  if (family) Chart.defaults.font.family = family;
  Chart.defaults.font.size = 12 * scale;
}

function make(canvas, config, dark) {
  var c = chartColors(dark);
  setDefaults(c);
  // Series without colours of their own take the theme's tones, in order.
  var pie = /^(pie|doughnut|polarArea)$/;
  ((config.data && config.data.datasets) || []).forEach(function (d, i) {
    var round = pie.test(d.type || config.type);
    var tone = c.tones[i % c.tones.length];
    if (d.backgroundColor === undefined) d.backgroundColor = round ? c.tones : tone;
    if (d.borderColor === undefined) d.borderColor = round ? c.bg : tone;
  });
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
    var chart;
    try {
      chart = make(canvas, parseLoose(source), dark);
    } finally {
      // The chart on screen keeps the page's own appearance.
      setDefaults(chartColors(document.documentElement.dataset.theme === "dark"));
    }
    var out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    var ctx = out.getContext("2d");
    ctx.fillStyle = chartColors(dark).bg;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0);
    chart.destroy();
    return out.toDataURL("image/png");
  },
});
