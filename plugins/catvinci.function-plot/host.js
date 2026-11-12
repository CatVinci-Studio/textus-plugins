// Draws ```function-plot blocks with chart.html (draw.js), through the chart
// plugins' shared lib/chart-host.js; check.js checks one for Textus AI, over
// the x range its fence gives.
/* global checkInput */
exports.activate = function (context) {
  registerChartBlock(context, "function-plot", "chart.html");
  textus.ai.registerTool("check_function_plot", checkInput);
};
