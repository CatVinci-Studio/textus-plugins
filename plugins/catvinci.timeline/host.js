// Draws ```timeline blocks with chart.html (draw.js), through the chart
// plugins' shared lib/chart-host.js; check.js checks one for Textus AI;
// database-view.js shows a database's rows on a timeline.
/* global checkBlock, timelineView */
exports.activate = function (context) {
  registerChartBlock(context, "timeline", "chart.html");
  registerChartCheck("timeline", checkBlock);
  var views = textus.views;
  if (views && views.registerDatabaseView)
    context.subscriptions.push(
      views.registerDatabaseView("timeline", {
        label: textus.l10n.t("name"),
        render: function (data) {
          return timelineView(data, textus.l10n.t("noDates"));
        },
      }),
    );
};
