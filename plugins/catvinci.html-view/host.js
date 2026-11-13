// HTML View: a .html file opened in a tab as the page it is, drawn in a
// sandboxed frame with no network (view.html). "Edit source" opens it as
// text in Textus, as it opened before this plugin.
/** What activate was given: the plugin's own files. */
let ctx;

exports.activate = function (context) {
  ctx = context;
  textus.views.registerFileEditor("catvinci.html-view.page", {
    resolve: async function (document, webview) {
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready") {
          try {
            webview.postMessage({ type: "file", bytes: await document.readFile() });
          } catch (err) {
            webview.postMessage({ type: "failed", message: String((err && err.message) || err) });
          }
        }
        if (message.type === "edit") await textus.layout.open(document.path, { asDocument: true });
      });
      const html = await ctx.plugin.readText("view.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
      const relabel = textus.env.onDidChangeLanguage(() => {
        webview.html = html.replace("{{lang}}", textus.env.language);
      });
      webview.onDidDispose(() => relabel.dispose());
    },
  });
};
