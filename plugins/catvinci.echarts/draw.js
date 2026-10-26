// An ECharts option drawn as SVG; an export draws it again for the page.
var chart = null;

function size(el, meta) {
  return { width: el.clientWidth || 600, height: Number(meta.height) || 320 };
}

drawChartBlock({
  draw: function (el, source, meta, dark) {
    var option = parseLoose(source);
    if (chart) chart.dispose();
    el.replaceChildren();
    var box = size(el, meta);
    chart = echarts.init(el, dark ? "dark" : null, {
      renderer: "svg",
      width: box.width,
      height: box.height,
    });
    chart.setOption(Object.assign({ backgroundColor: "transparent" }, option));
  },
  picture: function (el, source, meta, dark) {
    var box = size(el, meta);
    var paper = echarts.init(null, dark ? "dark" : null, {
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
