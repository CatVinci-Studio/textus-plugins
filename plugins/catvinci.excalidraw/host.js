// Excalidraw: .excalidraw drawings, and Obsidian Excalidraw's
// .excalidraw.md notes, drawn and edited in a tab with Excalidraw itself.
// The page sends the scene back as it changes; it is written here, in the
// form the file had.
/* global excalidrawFile */
let ctx;

const MAX_PICTURE = 20 * 1024 * 1024;
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };

const dirname = (path) => path.replace(/[\\/][^\\/]*$/, "");
const join = (dir, name) => dir.replace(/[\\/]+$/, "") + "/" + name;

/** The pictures a note links by id, read for the page; one not found is
 *  left out (Excalidraw shows its frame). */
async function pictures(document, embedded) {
  const out = [];
  for (const e of embedded) {
    const name = e.link.split("|")[0];
    const mime = MIME[(name.split(".").pop() || "").toLowerCase()];
    if (!mime) continue;
    try {
      const found = await textus.metadata.resolveNote("[[" + name + "]]", document.path).catch(() => null);
      const path = found && found.exists ? found.path : join(dirname(document.path), name);
      const stat = await textus.files.stat(path);
      if (!stat || stat.size > MAX_PICTURE) continue;
      out.push({ id: e.id, mime: mime, bytes: await textus.files.read(path) });
    } catch {
      // Unreadable: the next one.
    }
  }
  return out;
}

function editor() {
  return {
    resolve: async function (document, webview) {
      // The text last shown or written: a change from elsewhere is sent to
      // the page, its own saves aren't.
      let known = null;
      let parsed = null;
      const send = async function () {
        const text = await document.readText();
        if (text === known) return;
        known = text;
        try {
          parsed = excalidrawFile.parse(document.path, text);
        } catch (err) {
          parsed = null;
          return webview.postMessage({ type: "failed", message: String((err && err.message) || err) });
        }
        await webview.postMessage({ type: "scene", scene: parsed.scene });
        const files = await pictures(document, parsed.embedded);
        if (files.length) await webview.postMessage({ type: "pictures", files: files });
      };
      const watching = [textus.files.onDidChange, textus.files.onDidSave].map((on) =>
        on(function (e) {
          if (e && e.path === document.path) send().catch(() => {});
        }),
      );
      webview.onDidDispose(() => watching.forEach((w) => w.dispose()));
      webview.onDidReceiveMessage(async function (message) {
        if (!message) return;
        if (message.type === "ready") {
          known = null;
          await send();
        }
        // Never over a file that couldn't be read, or changed meanwhile.
        if (message.type === "save" && parsed) {
          try {
            const now = await document.readText();
            if (now !== known) return send();
            const text = excalidrawFile.write(document.path, now, message.json, parsed);
            known = text;
            await document.writeText(text);
          } catch (err) {
            webview.postMessage({ type: "error", message: String((err && err.message) || err) });
          }
        }
        if (message.type === "link" && /^https?:\/\//i.test(String(message.url)))
          await textus.layout.openExternal(message.url);
      });
      webview.html = await ctx.plugin.readText("editor.html");
    },
  };
}

exports.activate = function (context) {
  ctx = context;
  context.subscriptions.push(
    textus.views.registerFileEditor("catvinci.excalidraw.drawing", editor()),
    textus.commands.register("catvinci.excalidraw.new", async function () {
      const root = await textus.files.root();
      if (!root) return textus.ui.message(textus.l10n.t("needsFolder"));
      const name = await textus.ui.input({ prompt: textus.l10n.t("drawingName"), value: textus.l10n.t("drawing") });
      if (!name || !name.trim()) return;
      const file = name.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\.excalidraw$/i, "");
      const path = await textus.files.create(join(root, file + ".excalidraw"), excalidrawFile.empty(), { unique: true });
      await textus.layout.open(path);
    }),
  );
};
