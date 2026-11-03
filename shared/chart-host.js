// A code block drawn as a chart (textus.views.registerCodeBlock): the
// block's page is the plugin's `page` file, given the block's source and
// meta (` ```lang height=300`) once it says it is ready, and again when
// they change; and Textus AI's tool to check such a block before it is
// written. Shared by the chart plugins: each lists this as
// lib/chart-host.js in libs.json and runs it before its host.js.
/* exported registerChartBlock, registerChartCheck */
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

/** Textus AI's check_<language> tool: what `check(source)` finds wrong in a
 *  block's source - a list of problems, empty when it draws. */
function registerChartCheck(language, check) {
  return textus.ai.registerTool(
    "check_" + language.replace(/-/g, "_"),
    function (input) {
      // A fence the model wrote around it is not the source.
      const source = String((input && input.source) || "")
        .replace(/^\s*(`{3,}|~{3,})[^\n]*\n/, "")
        .replace(/\n\s*(`{3,}|~{3,})\s*$/, "");
      let problems;
      try {
        problems = source.trim() ? check(source) : ["The block is empty."];
      } catch (err) {
        problems = [String((err && err.message) || err)];
      }
      return problems.length ? { ok: false, problems: problems } : { ok: true };
    },
  );
}
