// Canvas: Obsidian's whiteboards (.canvas, JSON Canvas) drawn read-only in
// a tab of their own, the notes and pictures on them read from the folder.
/* global folderPaths, jsonCanvas */
/** What activate was given: the plugin's storage and own files. */
let ctx;

// More than this and a file node shows its name alone.
const MAX_FILES = 300;
const MAX_IMAGE = 20 * 1024 * 1024;

/** The folder a canvas's paths start from: the open folder, else the
 *  canvas's own. */
async function baseOf(document) {
  return (await textus.files.root()) || folderPaths.dir(document.path);
}

/** What a file node shows: a note's title and opening, a picture's bytes,
 *  or that it isn't there. */
async function fileContent(base, file) {
  const path = folderPaths.abs(base, file);
  const kind = jsonCanvas.fileKind(file);
  try {
    if (kind === "note")
      return { kind: kind, title: jsonCanvas.titleOf(file), text: jsonCanvas.notePreview(await textus.files.readText(path), 12) };
    if (kind === "image") {
      const stat = await textus.files.stat(path);
      if (!stat) return { kind: "missing" };
      if (stat.size > MAX_IMAGE) return { kind: "other" };
      return { kind: kind, bytes: await textus.files.read(path), mime: jsonCanvas.mimeOf(file) };
    }
    return (await textus.files.stat(path)) ? { kind: "other" } : { kind: "missing" };
  } catch {
    return { kind: "missing" };
  }
}

async function sendCanvas(document, webview) {
  let canvas;
  try {
    canvas = jsonCanvas.parse(await document.readText());
  } catch (err) {
    return webview.postMessage({ type: "failed", message: String((err && err.message) || err) });
  }
  await webview.postMessage({ type: "canvas", name: document.fileName, canvas: canvas });
  const base = await baseOf(document);
  const files = [...new Set(canvas.nodes.filter((n) => n.type === "file" && n.file).map((n) => n.file))];
  for (const file of files.slice(0, MAX_FILES))
    await webview.postMessage(Object.assign({ type: "file", file: file }, await fileContent(base, file)));
}

/** A tab's page: `send` draws the file once the page is up; links and
 *  file nodes open from it. */
function editor(send) {
  return {
    resolve: async function (document, webview) {
      webview.onDidReceiveMessage(async function (message) {
        if (!message) return;
        if (message.type === "ready") await send(document, webview);
        if (message.type === "open" && message.file) {
          const path = folderPaths.abs(await baseOf(document), message.file);
          await textus.layout.open(Object.assign({ path: path }, jsonCanvas.subpathPlace(message.subpath)));
        }
        if (message.type === "link" && /^https?:\/\//i.test(String(message.url)))
          await textus.layout.openExternal(message.url);
        if (message.type === "text") await textus.layout.open(document.path, { asDocument: true });
      });
      webview.html = await ctx.plugin.readText("view.html");
    },
  };
}

exports.activate = function (context) {
  ctx = context;
  context.subscriptions.push(
    textus.views.registerFileEditor("catvinci.canvas.canvas", editor(sendCanvas)),
  );
};
