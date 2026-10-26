// A code block drawn as a chart (textus.views.registerCodeBlock): the
// block's page is the plugin's `page` file, given the block's source and
// meta (` ```lang height=300`) once it says it is ready, and again when
// they change. Shared by the chart plugins: each lists this as
// lib/chart-host.js in libs.json and runs it before its host.js.
/* exported registerChartBlock */
function registerChartBlock(context, language, page, extra) {
  return textus.views.registerCodeBlock(language, {
    render: async function (block, webview) {
      webview.html = await context.plugin.readText(page);
      const send = async function () {
        webview.postMessage({
          type: "source",
          source: block.source,
          meta: block.meta,
          extra: extra ? await extra(block) : null,
        });
      };
      webview.onDidReceiveMessage(function (message) {
        if (message && message.type === "ready") send();
      });
      block.onDidChange(send);
    },
  });
}
