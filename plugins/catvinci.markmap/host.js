// Draws ```markmap blocks with chart.html (draw.js), through the chart
// plugins' shared lib/chart-host.js; check.js checks one for Textus AI.
/* global checkBlock */
exports.activate = function (context) {
  registerChartBlock(context, "markmap", "chart.html");
  registerChartCheck("markmap", checkBlock);
};
