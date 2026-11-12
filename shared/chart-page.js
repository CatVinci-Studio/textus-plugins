// The page side of a chart code block (chart-host.js): the block's source
// and meta come in, `draw` puts the chart in #chart, a mistake in the
// source shows as a line under it rather than an empty frame, and a change
// of theme, or of the block's width (an island giving way), draws it
// again. An export asks for a picture (onExport): the
// chart's SVG, or `picture` when the plugin has a better one (a canvas, a
// light version for paper). Shared by the chart plugins as lib/chart-page.js.
/* exported drawChartBlock, chartColors */
(function () {
  "use strict";
  var api = acquireTextusApi();

  function dark() {
    return document.documentElement.dataset.theme === "dark";
  }

  // A chart's colours (design-language.md 15.6): the theme's text, muted,
  // border and tones on screen; for a picture in the other appearance (a
  // light export from a dark window), Textus's default ones.
  var TONES = ["blue", "green", "orange", "purple", "red", "teal", "yellow", "pink", "gray"];
  var DEFAULTS = {
    light: {
      bg: "#ffffff", ink: "#24272e", muted: "#646b77", grid: "#e1e4ea",
      tones: ["#4081d2", "#319751", "#be6517", "#8e6ac7", "#c65954", "#00989a", "#a17a00", "#bc598c", "#77818c"],
    },
    dark: {
      bg: "#1b1e24", ink: "#e4e7ed", muted: "#989da6", grid: "#33363c",
      tones: ["#7aaeef", "#76be86", "#e09865", "#b59be6", "#e88f87", "#3fc0c0", "#c6a853", "#df8db5", "#a2acb7"],
    },
  };
  window.chartColors = function (isDark) {
    var fixed = DEFAULTS[isDark ? "dark" : "light"];
    if (!!isDark !== dark()) return fixed;
    var css = getComputedStyle(document.documentElement);
    var v = function (name, fallback) {
      return css.getPropertyValue(name).trim() || fallback;
    };
    return {
      bg: v("--doc-bg", fixed.bg),
      ink: v("--doc-text", fixed.ink),
      muted: v("--ui-muted", fixed.muted),
      grid: v("--ui-border", fixed.grid),
      tones: TONES.map(function (name, i) {
        return v("--tone-" + name, fixed.tones[i]);
      }),
    };
  };

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
          if (now.error) throw new Error(now.error);
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
        error: message.error,
      };
      draw();
    });
    new MutationObserver(draw).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // Another theme in the same appearance: its colours, drawn again.
    var themeStyle = document.getElementById("textus-theme");
    if (themeStyle)
      new MutationObserver(draw).observe(themeStyle, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    // Another width: drawn again to fit it, once it has settled.
    var width = 0;
    var resizing = 0;
    new ResizeObserver(function () {
      var now = Math.round(el.clientWidth);
      if (!now || now === width) return;
      var first = width === 0;
      width = now;
      if (first) return;
      clearTimeout(resizing);
      resizing = setTimeout(draw, 120);
    }).observe(el);
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
