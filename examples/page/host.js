// Plan: a sidebar page (a webview) of steps kept in the plugin's own
// storage. The page draws them with Textus's controls and styles; host.js
// keeps the data and answers the page's messages.

exports.activate = function (ctx) {
  const store = ctx.storage.global;
  ctx.subscriptions.push(
    textus.views.registerWebview("your-name.plan.page", {
      async resolve(webview) {
        webview.html = await ctx.plugin.readText("page.html");
        const send = async () =>
          webview.postMessage({ steps: (await store.get("steps")) ?? [] });
        webview.onDidReceiveMessage(async (message) => {
          if (message.steps) await store.set("steps", message.steps);
          await send();
        });
        await send();
      },
    }),
  );
};
