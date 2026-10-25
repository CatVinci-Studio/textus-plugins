// Image Viewer: a picture or an SVG file opened in a tab of its own. The
// page (view.html) asks for the file once it is up; this reads it and
// hands it over.
exports.activate = function () {
  textus.window.registerCustomEditorProvider("catvinci.image-viewer.image", {
    resolveCustomEditor: async function (document, webview) {
      webview.onDidReceiveMessage(async function (message) {
        if (message.type !== "ready") return;
        let bytes;
        try {
          bytes = await document.readBytes();
        } catch {
          // Moved, deleted or unreadable: the page says so.
          return webview.postMessage({ type: "failed" });
        }
        webview.postMessage({
          type: "file",
          name: document.fileName,
          bytes: bytes,
        });
      });
      const html = await textus.plugin.readText("view.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
    },
  });
};
