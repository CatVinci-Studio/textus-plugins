// The functions of a ```function-plot block, one per line ("y =" may lead),
// read by a small parser - a page may not run text as code - which knows
// + - * / ^, brackets, x, pi (π) and e, and the usual functions. Shared by
// the page (draw.js) and the host (its check for Textus AI).
/* exported compile, bound, linesOf, functionsOf, noValue */
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
var CONSTANTS = { pi: Math.PI, "π": Math.PI, e: Math.E };
// Longest first, so "exp" stays one word and "xsin" is x then sin.
var NAMES = Object.keys(FUNCTIONS)
  .concat(["pi", "e", "x"])
  .sort(function (a, b) {
    return b.length - a.length;
  });

/** A run of letters as the known names it is made of, or itself. */
function words(run) {
  var out = [];
  var rest = run;
  while (rest) {
    var lower = rest.toLowerCase();
    var name = NAMES.find(function (n) {
      return lower.indexOf(n) === 0;
    });
    if (!name) return [run];
    out.push(rest.slice(0, name.length));
    rest = rest.slice(name.length);
  }
  return out;
}

/** `text` as a function of x; throws, naming the place, when it isn't one. */
function compile(text) {
  var tokens = (text.match(/\d*\.?\d+(?:e[+-]?\d+)?|[a-z]+|\S/gi) || [])
    .map(function (token) {
      return /^[a-z]{2,}$/i.test(token) ? words(token) : [token];
    })
    .flat();
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
  // product := unary (("*" | "/") unary | implicit power)*
  function product() {
    var left = unary();
    for (;;) {
      var next = peek();
      if (next === "*" || next === "/") {
        take();
        var right = unary();
        left = next === "*" ? mul(left, right) : div(left, right);
      } else if (next && (next === "(" || /^[a-z0-9.π]/i.test(next))) {
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
  // power := atom ("^" unary)?  -x^2 is -(x^2), 2^-1 is a half
  function power() {
    var base = atom();
    if (peek() !== "^") return base;
    take();
    var exponent = unary();
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
    return power();
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

/** A range's end from the fence, 0 included; `fallback` if it isn't a number. */
function bound(value, fallback) {
  var number = value === undefined || value === "" ? NaN : Number(value);
  return isFinite(number) ? number : fallback;
}

/** The lines of `source` that hold a function, "y =" taken off. */
function linesOf(source) {
  return String(source)
    .split("\n")
    .map(function (line) {
      return line.replace(/^\s*y\s*=/, "").trim();
    })
    .filter(Boolean);
}

/** Each line of `source` as a function of x. */
function functionsOf(source) {
  return linesOf(source).map(compile);
}

/** What to say of a line with no value anywhere from x0 to x1. */
function noValue(line, x0, x1) {
  return (
    "“" + line + "” has no value from x = " + x0 + " to " + x1 +
    ": set xmin and xmax on the fence (```function-plot xmin=0 xmax=100)."
  );
}
