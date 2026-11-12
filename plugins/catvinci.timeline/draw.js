// A timeline drawn as SVG: a line down the left, a dot and a label for
// each "when | what | more" line of the source, wrapped to the frame.
var SVG = "http://www.w3.org/2000/svg";
var GAP = 16;
var NARROW = 320;
// CJK characters break anywhere; other text breaks at spaces.
var WORDS = /[　-鿿가-힯＀-￯]|[^\s　-鿿가-힯＀-￯]+\s*|\s+/g;

function say(key, english) {
  return typeof acquireTextusApi === "function" ? acquireTextusApi().t(key) : english;
}

function node(name, attrs, text) {
  var el = document.createElementNS(SVG, name);
  for (var key in attrs) el.setAttribute(key, attrs[key]);
  if (text) el.textContent = text;
  return el;
}

function readEvents(source) {
  return String(source)
    .split("\n")
    .map(function (line) {
      return line.split("|").map(function (s) {
        return s.trim();
      });
    })
    .filter(function (parts) {
      return parts[0];
    });
}

// The document's font and sizes, and a ruler for text in them.
function pageLook() {
  var probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;visibility:hidden;font-family:var(--doc-font,var(--font-sans,sans-serif));font-size:var(--text-body,1em)";
  document.body.append(probe);
  var body = getComputedStyle(probe);
  var family = body.fontFamily || "sans-serif";
  var size = parseFloat(body.fontSize) || 15;
  probe.style.fontSize = "var(--text-secondary,0.875em)";
  var small = parseFloat(getComputedStyle(probe).fontSize) || 13;
  probe.remove();
  var ctx = document.createElement("canvas").getContext("2d");
  return {
    family: family,
    size: size,
    small: small,
    measure: function (text, px, weight) {
      if (!ctx) return text.length * px * 0.6;
      ctx.font = (weight || 400) + " " + px + "px " + family;
      return ctx.measureText(text).width;
    },
  };
}

// Greedy lines no wider than `max`; a word wider than that breaks by letter.
function wrap(text, px, weight, max, look) {
  var lines = [];
  var line = "";
  (String(text).match(WORDS) || []).forEach(function (word) {
    if (look.measure((line + word).trimEnd(), px, weight) <= max) {
      line += word;
      return;
    }
    if (line.trim()) lines.push(line.trimEnd());
    line = "";
    Array.from(word.trimStart()).forEach(function (ch) {
      if (line && look.measure(line + ch, px, weight) > max) {
        lines.push(line);
        line = "";
      }
      line += ch;
    });
  });
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

function timeline(source, width, dark, look) {
  var events = readEvents(source);
  if (!events.length) throw new Error(say("noEvents", "No events yet: write one per line, when | what | more."));
  var c = chartColors(dark);
  var big = { px: look.size, weight: 600, lh: Math.round(look.size * 1.35) };
  var small = { px: look.small, weight: 400, lh: Math.round(look.small * 1.4) };
  var narrow = width < NARROW;
  var widest = Math.max.apply(
    null,
    events.map(function (e) {
      return look.measure(e[0], small.px);
    }),
  );
  var axis = narrow ? 10 : Math.round(Math.min(Math.max(widest, 24) + GAP + 4, width * 0.35));
  var x = axis + GAP;
  var room = Math.max(width - x - 4, 40);
  var parts = [];
  var y = 4;
  var dots = [];
  events.forEach(function (event) {
    var top = y;
    var when = wrap(event[0], small.px, 400, narrow ? room : axis - GAP - 4, look);
    var rows = (narrow ? when.map(row(small, c.muted)) : [])
      .concat(wrap(event[1] || "", big.px, big.weight, room, look).map(row(big, c.ink)))
      .concat(wrap(event[2] || "", small.px, 400, room, look).map(row(small, c.muted)));
    var first = rows.length ? rows[0].lh : big.lh;
    dots.push(top + first / 2);
    rows.forEach(function (r) {
      parts.push(text(x, y, r));
      y += r.lh;
    });
    if (!narrow)
      when.forEach(function (line, i) {
        parts.push(
          text(axis - GAP, top + i * small.lh + (first - small.lh) / 2, {
            line: line, px: small.px, weight: 400, lh: small.lh, fill: c.muted, end: true,
          }),
        );
      });
    y = Math.max(y, top + when.length * small.lh) + 18;
  });
  var height = Math.ceil(y - 10);
  var svg = node("svg", {
    xmlns: SVG,
    width: width,
    height: height,
    viewBox: "0 0 " + width + " " + height,
    "font-family": look.family,
  });
  svg.append(
    node("line", {
      x1: axis, y1: dots[0], x2: axis, y2: dots[dots.length - 1],
      stroke: c.muted, "stroke-width": 2,
    }),
  );
  dots.forEach(function (cy) {
    svg.append(node("circle", { cx: axis, cy: cy, r: 6, fill: c.tones[0] }));
  });
  parts.forEach(function (p) {
    svg.append(p);
  });
  return svg;
}

function row(style, fill) {
  return function (line) {
    return { line: line, px: style.px, weight: style.weight, lh: style.lh, fill: fill };
  };
}

function text(x, top, r) {
  var attrs = { x: x, y: Math.round(top + r.lh / 2 + r.px * 0.35), "font-size": r.px, fill: r.fill };
  if (r.weight !== 400) attrs["font-weight"] = r.weight;
  if (r.end) attrs["text-anchor"] = "end";
  return node("text", attrs, r.line);
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    el.replaceChildren(timeline(source, el.clientWidth || 600, dark, pageLook()));
  },
  picture: function (el, source, meta, dark) {
    return new XMLSerializer().serializeToString(
      timeline(source, el.clientWidth || 600, dark, pageLook()),
    );
  },
});
