// A code block drawn as a chart (textus.views.registerCodeBlock): the
// block's page is the plugin's `page` file, given the block's source and
// meta (` ```lang height=300`) once it says it is ready, and again when
// they change. Shared by the chart plugins: each lists this as
// lib/chart-host.js in libs.json and runs it before its host.js.
/* exported registerChartBlock */
function registerChartBlock(context, language, page, extra, watch) {
  return textus.views.registerCodeBlock(language, {
    render: async function (block, webview) {
      webview.html = await context.plugin.readText(page);
      let sent = 0;
      const send = async function () {
        const mine = ++sent;
        const message = {
          type: "source",
          source: block.source,
          meta: block.meta,
          extra: null,
        };
        try {
          if (extra) message.extra = await extra(block);
        } catch (err) {
          message.error = String((err && err.message) || err);
        }
        // A slower answer for older text: the newer one is on its way.
        if (mine === sent) webview.postMessage(message);
      };
      webview.onDidReceiveMessage(function (message) {
        if (message && message.type === "ready") send();
      });
      block.onDidChange(send);
      if (watch) {
        const watching = watch(send);
        webview.onDidDispose(() => watching.dispose());
      }
    },
  });
}
