// Canvas: Obsidian's whiteboards (.canvas, JSON Canvas) drawn read-only in
// a tab of their own, the notes and pictures on them read from the folder;
// and Excalidraw drawings, shown by the picture exported from them.
/* global folderPaths, jsonCanvas */
/** What activate was given: the plugin's storage and own files. */
let ctx;

// More than this and a file node shows its name alone.
const MAX_FILES = 300;
const MAX_IMAGE = 20 * 1024 * 1024;

const dirname = (path) => path.replace(/[\\/][^\\/]*$/, "");

/** The folder a canvas's paths start from: the open folder, else the
 *  canvas's own. */
async function baseOf(document) {
  return (await textus.files.root()) || dirname(document.path);
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

/** The picture an Excalidraw drawing shows here: one its note embeds, else
 *  one its auto-export wrote beside it; null for none. */
async function excalidrawPicture(document, text) {
  const tries = [];
  for (const link of jsonCanvas.excalidrawEmbeds(text)) {
    const resolved = await textus.metadata.resolveNote("[[" + link + "]]", document.path).catch(() => null);
    tries.push(resolved ? resolved.path : folderPaths.abs(dirname(document.path), link));
  }
  tries.push(...jsonCanvas.excalidrawExports(document.path));
  for (const path of tries) {
    const stat = await textus.files.stat(path).catch(() => null);
    if (!stat || stat.size > MAX_IMAGE) continue;
    try {
      return { name: path.split(/[\\/]/).pop(), bytes: await textus.files.read(path), mime: jsonCanvas.mimeOf(path) };
    } catch {
      // Unreadable: the next one.
    }
  }
  return null;
}

async function sendExcalidraw(document, webview) {
  let text = "";
  try {
    text = await document.readText();
  } catch {
    // Unreadable as text: a picture beside it may still be there.
  }
  webview.postMessage({ type: "excalidraw", name: document.fileName, picture: await excalidrawPicture(document, text) });
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
      const html = await ctx.plugin.readText("view.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
      // Drawn again in the interface's language when that changes.
      const relabel = textus.env.onDidChangeLanguage(() => {
        webview.html = html.replace("{{lang}}", textus.env.language);
      });
      webview.onDidDispose(() => relabel.dispose());
    },
  };
}

exports.activate = function (context) {
  ctx = context;
  context.subscriptions.push(
    textus.views.registerFileEditor("catvinci.canvas.canvas", editor(sendCanvas)),
    textus.views.registerFileEditor("catvinci.canvas.excalidraw", editor(sendExcalidraw)),
  );
};
