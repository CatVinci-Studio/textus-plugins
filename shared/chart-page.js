// The page side of a chart code block (chart-host.js): the block's source
// and meta come in, `draw` puts the chart in #chart, a mistake in the
// source shows as a line under it rather than an empty frame, and a change
// of theme draws it again. An export asks for a picture (onExport): the
// chart's SVG, or `picture` when the plugin has a better one (a canvas, a
// light version for paper). Shared by the chart plugins as lib/chart-page.js.
/* exported drawChartBlock, parseLoose */
(function () {
  "use strict";
  var api = acquireTextusApi();

  /** JSON, or what people write by hand for it - unquoted keys, single
   *  quotes, trailing commas, comments - read without running anything
   *  (the page may not: no eval). */
  window.parseLoose = function (source) {
    var text = String(source);
    var out = "";
    var i = 0;
    var word = /[A-Za-z_$][\w$]*/y;
    while (i < text.length) {
      var c = text[i];
      if (c === '"' || c === "'") {
        var j = i + 1;
        var body = "";
        while (j < text.length && text[j] !== c) {
          if (text[j] === "\\") body += text[j++];
          body += text[j++];
        }
        out += JSON.stringify(
          c === '"' ? JSON.parse('"' + body + '"') : body.replace(/\\'/g, "'"),
        );
        i = j + 1;
      } else if (c === "/" && text[i + 1] === "/") {
        while (i < text.length && text[i] !== "\n") i++;
      } else if (c === "/" && text[i + 1] === "*") {
        i = text.indexOf("*/", i + 2);
        i = i < 0 ? text.length : i + 2;
      } else if (c === ",") {
        // A comma with only a closing bracket after it goes.
        var rest = text
          .slice(i + 1)
          .match(/^(\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/)[0];
        var next = text[i + 1 + rest.length];
        if (next !== "}" && next !== "]") out += c;
        i++;
      } else {
        word.lastIndex = i;
        var m = word.exec(text);
        if (m) {
          var after = text.slice(i + m[0].length).match(/^\s*/)[0];
          var key = text[i + m[0].length + after.length] === ":";
          // A key is quoted; a word that is a value is left for JSON to
          // take (true, false, null) or refuse.
          out += key ? JSON.stringify(m[0]) : m[0];
          i += m[0].length;
        } else {
          out += c;
          i++;
        }
      }
    }
    return JSON.parse(out);
  };

  function dark() {
    return document.documentElement.dataset.theme === "dark";
  }

  /** An SVG element as markup a picture can be made of. */
  function svgMarkup(svg) {
    var copy = svg.cloneNode(true);
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var box = svg.getBoundingClientRect();
    if (!copy.getAttribute("width") && box.width)
      copy.setAttribute("width", String(Math.ceil(box.width)));
    if (!copy.getAttribute("height") && box.height)
      copy.setAttribute("height", String(Math.ceil(box.height)));
    return new XMLSerializer().serializeToString(copy);
  }

  /**
   * chart: { draw(el, source, meta, dark, extra) - may be async;
   *          picture?(el, source, meta, dark, extra) - SVG markup or an
   *          image's data: URL for an export }
   */
  window.drawChartBlock = function (chart) {
    var el = document.getElementById("chart");
    var problem = document.getElementById("chart-problem");
    var last = null;
    var drawing = Promise.resolve();

    function draw() {
      if (!last) return drawing;
      var now = last;
      drawing = drawing.then(async function () {
        problem.hidden = true;
        el.style.height = now.meta.height ? now.meta.height + "px" : "";
        try {
          await chart.draw(el, now.source, now.meta, dark(), now.extra);
        } catch (err) {
          el.replaceChildren();
          problem.textContent = String((err && err.message) || err);
          problem.hidden = false;
        }
      });
      return drawing;
    }

    api.onMessage(function (message) {
      if (!message || message.type !== "source") return;
      last = {
        source: message.source,
        meta: message.meta || {},
        extra: message.extra,
      };
      draw();
    });
    new MutationObserver(draw).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    api.onExport(async function (options) {
      await drawing;
      if (!last || !problem.hidden) return null;
      var paper = options.theme === "dark";
      if (chart.picture)
        return chart.picture(el, last.source, last.meta, paper, last.extra);
      var svg = el.querySelector("svg");
      if (svg) return svgMarkup(svg);
      var canvas = el.querySelector("canvas");
      return canvas ? canvas.toDataURL("image/png") : null;
    });
    api.postMessage({ type: "ready" });
  };
})();
