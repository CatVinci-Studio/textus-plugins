// Functions of x, one per line, graphed as SVG; plot.js reads them.
/* global linesOf, compile, bound, noValue, chartColors, drawChartBlock */
var SVG = "http://www.w3.org/2000/svg";

function el(name, attrs) {
  var node = document.createElementNS(SVG, name);
  for (var key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

/** The y range the samples fill, leaving out an asymptote's far-out values
 *  (beyond four quartile spreads), so tan(x) keeps its shape. */
function fit(ys) {
  if (!ys.length) return [-1, 1];
  var sorted = ys.slice().sort(function (a, b) {
    return a - b;
  });
  var at = function (q) {
    return sorted[Math.floor(q * (sorted.length - 1))];
  };
  var spread = (at(0.75) - at(0.25)) * 4;
  return [
    Math.min(-1, Math.max(sorted[0], at(0.25) - spread)),
    Math.max(1, Math.min(sorted[sorted.length - 1], at(0.75) + spread)),
  ];
}

/** The graph of `source`'s functions over x from xmin to xmax (meta). */
function graph(source, meta, width, height, dark) {
  var lines = linesOf(source);
  var fns = lines.map(compile);
  var x0 = bound(meta.xmin, -10);
  var x1 = bound(meta.xmax, 10);
  var steps = Math.max(200, width);
  var ys = [];
  var samples = fns.map(function (fn, n) {
    var points = [];
    for (var i = 0; i <= steps; i++) {
      var x = x0 + ((x1 - x0) * i) / steps;
      var y = fn(x);
      if (isFinite(y)) ys.push(y);
      points.push([x, y]);
    }
    if (!points.some(function (p) { return isFinite(p[1]); }))
      throw new Error(noValue(lines[n], x0, x1));
    return points;
  });
  var auto = fit(ys);
  var y0 = bound(meta.ymin, auto[0]);
  var y1 = bound(meta.ymax, auto[1]);
  var pad = (y1 - y0) * 0.05 || 1;
  y0 -= pad;
  y1 += pad;
  var sx = function (x) {
    return ((x - x0) / (x1 - x0)) * width;
  };
  var sy = function (y) {
    return height - ((y - y0) / (y1 - y0)) * height;
  };
  var c = chartColors(dark);
  var axis = c.muted;
  var svg = el("svg", {
    xmlns: SVG,
    width: width,
    height: height,
    viewBox: "0 0 " + width + " " + height,
  });
  if (x0 < 0 && x1 > 0)
    svg.append(
      el("line", { x1: sx(0), y1: 0, x2: sx(0), y2: height, stroke: axis }),
    );
  if (y0 < 0 && y1 > 0)
    svg.append(
      el("line", { x1: 0, y1: sy(0), x2: width, y2: sy(0), stroke: axis }),
    );
  samples.forEach(function (points, n) {
    // A break where the function isn't defined, leaves the view, or jumps
    // more than the view's height (an asymptote).
    var span = y1 - y0;
    var d = "";
    var last = null;
    points.forEach(function (p) {
      var ok = isFinite(p[1]) && p[1] >= y0 - span && p[1] <= y1 + span;
      if (ok)
        d +=
          (last !== null && Math.abs(p[1] - last) <= span ? "L" : "M") +
          sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1);
      last = ok ? p[1] : null;
    });
    svg.append(
      el("path", {
        d: d,
        fill: "none",
        stroke: c.tones[n % c.tones.length],
        "stroke-width": 2,
      }),
    );
  });
  return svg;
}

function size(el, meta) {
  return { width: el.clientWidth || 600, height: Number(meta.height) || 320 };
}

drawChartBlock({
  draw: function (box, source, meta, dark) {
    var s = size(box, meta);
    box.replaceChildren(graph(source, meta, s.width, s.height, dark));
  },
  picture: function (box, source, meta, dark) {
    var s = size(box, meta);
    return new XMLSerializer().serializeToString(
      graph(source, meta, s.width, s.height, dark),
    );
  },
});
