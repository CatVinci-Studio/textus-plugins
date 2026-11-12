// An ECharts option drawn as SVG; an export draws it again for the page.
var chart = null;

/** The page's text scale (document zoom, Interface Text Size) and font. */
function text() {
  var css = getComputedStyle(document.documentElement);
  var scale = parseFloat(css.getPropertyValue("--ui-text-scale")) || 1;
  var font = css.getPropertyValue("--font-sans").trim() || "sans-serif";
  return { scale: scale, font: font, size: Math.round(12 * scale) };
}

/** ECharts' theme made of the window's: tones for the series, the text,
 *  muted and border colours for labels, axes and grid. */
function theme(dark) {
  var c = chartColors(dark);
  var t = text();
  var label = { fontFamily: t.font, fontSize: t.size };
  var axis = {
    axisLine: { lineStyle: { color: c.muted } },
    axisTick: { lineStyle: { color: c.muted } },
    axisLabel: Object.assign({ color: c.muted }, label),
    splitLine: { lineStyle: { color: [c.grid] } },
  };
  return {
    color: c.tones,
    backgroundColor: "transparent",
    textStyle: Object.assign({ color: c.ink }, label),
    title: { textStyle: { color: c.ink, fontFamily: t.font } },
    legend: { textStyle: Object.assign({ color: c.ink }, label) },
    categoryAxis: axis,
    valueAxis: axis,
    timeAxis: axis,
    logAxis: axis,
  };
}

function size(el, meta) {
  // An explicit height= is pixels; the default grows with the text.
  var height = Number(meta.height) || Math.round(320 * text().scale);
  return { width: el.clientWidth || 600, height: height };
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    var option = parseLoose(source);
    if (chart) chart.dispose();
    el.replaceChildren();
    var box = size(el, meta);
    chart = echarts.init(el, theme(dark), {
      renderer: "svg",
      width: box.width,
      height: box.height,
    });
    chart.setOption(Object.assign({ backgroundColor: "transparent" }, option));
  },
  picture: function (el, source, meta, dark) {
    var box = size(el, meta);
    var paper = echarts.init(null, theme(dark), {
      renderer: "svg",
      ssr: true,
      width: box.width,
      height: box.height,
    });
    paper.setOption(Object.assign({ animation: false }, parseLoose(source)));
    var svg = paper.renderToSVGString();
    paper.dispose();
    return svg;
  },
});
