// Functions of x, one per line, graphed as SVG. The expressions are read
// by a small parser here - the page may not run text as code - which knows
// + - * / ^, brackets, x, pi and e, and the usual functions.
var SVG = "http://www.w3.org/2000/svg";
var FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
};
var CONSTANTS = { pi: Math.PI, e: Math.E };

/** `text` as a function of x; throws, naming the place, when it isn't one. */
function compile(text) {
  var tokens = text.match(/\d*\.?\d+(?:e[+-]?\d+)?|[a-z]+|\S/gi) || [];
  var at = 0;
  function peek() {
    return tokens[at];
  }
  function take(expected) {
    var token = tokens[at++];
    if (expected && token !== expected)
      throw new Error(
        "“" +
          text +
          "”: expected " +
          expected +
          (token ? " before " + token : " at the end"),
      );
    return token;
  }
  // sum := product (("+" | "-") product)*
  function sum() {
    var left = product();
    while (peek() === "+" || peek() === "-") {
      var op = take();
      var right = product();
      left = op === "+" ? add(left, right) : sub(left, right);
    }
    return left;
  }
  function add(a, b) {
    return function (x) {
      return a(x) + b(x);
    };
  }
  function sub(a, b) {
    return function (x) {
      return a(x) - b(x);
    };
  }
  // product := power (("*" | "/" | implicit) power)*
  function product() {
    var left = power();
    for (;;) {
      var next = peek();
      if (next === "*" || next === "/") {
        take();
        var right = power();
        left = next === "*" ? mul(left, right) : div(left, right);
      } else if (next && (next === "(" || /^[a-z0-9.]/i.test(next))) {
        left = mul(left, power()); // 2x, 3sin(x)
      } else return left;
    }
  }
  function mul(a, b) {
    return function (x) {
      return a(x) * b(x);
    };
  }
  function div(a, b) {
    return function (x) {
      return a(x) / b(x);
    };
  }
  // power := unary ("^" power)?
  function power() {
    var base = unary();
    if (peek() !== "^") return base;
    take();
    var exponent = power();
    return function (x) {
      return Math.pow(base(x), exponent(x));
    };
  }
  function unary() {
    if (peek() === "-") {
      take();
      var inner = unary();
      return function (x) {
        return -inner(x);
      };
    }
    if (peek() === "+") take();
    return atom();
  }
  function atom() {
    var token = take();
    if (token === undefined)
      throw new Error("“" + text + "”: it ends too soon");
    if (token === "(") {
      var inner = sum();
      take(")");
      return inner;
    }
    if (/^\d|^\./.test(token)) {
      var value = Number(token);
      return function () {
        return value;
      };
    }
    var name = token.toLowerCase();
    if (name === "x")
      return function (x) {
        return x;
      };
    if (name in CONSTANTS) {
      var constant = CONSTANTS[name];
      return function () {
        return constant;
      };
    }
    if (name in FUNCTIONS) {
      var fn = FUNCTIONS[name];
      take("(");
      var arg = sum();
      take(")");
      return function (x) {
        return fn(arg(x));
      };
    }
    throw new Error("“" + text + "”: " + token + " is not something it knows");
  }
  var expression = sum();
  if (at < tokens.length)
    throw new Error("“" + text + "”: " + tokens[at] + " is out of place");
  return expression;
}

var COLORS = ["#2f6fde", "#d9480f", "#2b8a3e", "#ae3ec9", "#e67700"];

function el(name, attrs) {
  var node = document.createElementNS(SVG, name);
  for (var key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

/** The graph of `source`'s functions over x from xmin to xmax (meta). */
function graph(source, meta, width, height, dark) {
  var fns = String(source)
    .split("\n")
    .map(function (line) {
      return line.replace(/^\s*y\s*=/, "").trim();
    })
    .filter(Boolean)
    .map(compile);
  var x0 = Number(meta.xmin) || -10;
  var x1 = Number(meta.xmax) || 10;
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
  var y0 =
    meta.ymin !== undefined
      ? Number(meta.ymin)
      : Math.min.apply(null, ys.concat([-1]));
  var y1 =
    meta.ymax !== undefined
      ? Number(meta.ymax)
      : Math.max.apply(null, ys.concat([1]));
  var pad = (y1 - y0) * 0.05 || 1;
  y0 -= pad;
  y1 += pad;
  var sx = function (x) {
    return ((x - x0) / (x1 - x0)) * width;
  };
  var sy = function (y) {
    return height - ((y - y0) / (y1 - y0)) * height;
  };
  var axis = dark ? "#8a8a8a" : "#888888";
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
        stroke: COLORS[n % COLORS.length],
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
