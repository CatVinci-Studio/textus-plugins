// Functions of x, one per line, graphed as SVG; plot.js reads them.
var SVG = "http://www.w3.org/2000/svg";

function el(name, attrs) {
  var node = document.createElementNS(SVG, name);
  for (var key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

/** The graph of `source`'s functions over x from xmin to xmax (meta). */
function graph(source, meta, width, height, dark) {
  var fns = functionsOf(source);
  var x0 = bound(meta.xmin, -10);
  var x1 = bound(meta.xmax, 10);
  var steps = Math.max(200, width);
  var samples = fns.map(function (fn) {
    var points = [];
    for (var i = 0; i <= steps; i++) {
      var x = x0 + ((x1 - x0) * i) / steps;
      points.push([x, fn(x)]);
    }
    return points;
  });
  var ys = samples
    .flat()
    .map(function (p) {
      return p[1];
    })
    .filter(isFinite);
  var y0 = bound(meta.ymin, Math.min.apply(null, ys.concat([-1])));
  var y1 = bound(meta.ymax, Math.max.apply(null, ys.concat([1])));
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
    // A break where the function isn't defined or leaves the view.
    var d = "";
    var pen = false;
    points.forEach(function (p) {
      var ok =
        isFinite(p[1]) && p[1] >= y0 - (y1 - y0) && p[1] <= y1 + (y1 - y0);
      if (ok)
        d +=
          (pen ? "L" : "M") + sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1);
      pen = ok;
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
