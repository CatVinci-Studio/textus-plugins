// Draws ```timeline blocks with chart.html (draw.js), through the chart
// plugins' shared lib/chart-host.js.
exports.activate = function (context) {
  registerChartBlock(context, "timeline", "chart.html");
};
