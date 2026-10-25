// Version History: each save of a document kept as a version, in the
// plugin's own storage (under a key made from its path, newest first), up
// to the number set in Settings. The sidebar lists the versions of the document in front; one
// comes back as a proposal replacing the document, accepted or rejected
// like any edit, or opens as a new document.
let panel = null;
const MAX_TEXT = 2 * 1024 * 1024;

/** The storage key of a document's versions: its path hashed (FNV-1a,
 *  twice, 64 bits), since a key is at most 200 bytes and a deep or CJK
 *  path is longer. */
function keyOf(path) {
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < path.length; i++) {
    const c = path.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ c, 0x811c9dc5) >>> 0;
  }
  return "v:" + a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

async function versionsOf(path) {
  if (!path) return [];
  const kept = await textus.storage.get(keyOf(path));
  // Two paths with one hash: not this document's.
  return kept && kept.path === path ? kept.versions : [];
}

async function record(saved) {
  if (!saved.path || saved.text.length > MAX_TEXT) return;
  const list = await versionsOf(saved.path);
  if (list[0] && list[0].text === saved.text) return;
  const keep = Math.max(1, Number(await textus.settings.get("keep")) || 50);
  list.unshift({ at: Date.now(), text: saved.text });
  let versions = list.slice(0, keep);
  // The storage full: the oldest half goes, until the newest fits.
  for (;;) {
    try {
      await textus.storage.set(keyOf(saved.path), {
        path: saved.path,
        versions: versions,
      });
      break;
    } catch {
      if (versions.length <= 1) return;
      versions = versions.slice(0, Math.ceil(versions.length / 2));
    }
  }
  await show();
}

async function show() {
  if (!panel) return;
  const path = await textus.document.getPath();
  panel.postMessage({
    type: "versions",
    path: path,
    current: path ? await textus.document.getText() : null,
    versions: await versionsOf(path),
  });
}

exports.activate = function () {
  textus.workspace.onDidSaveDocument(record);
  textus.document.onDidChangeActive(show);
  textus.window.registerWebviewViewProvider("catvinci.version-history.panel", {
    resolveWebviewView: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready" || message.type === "refresh")
          await show();
        const path = await textus.document.getPath();
        const version = (await versionsOf(path)).find(
          (v) => v.at === message.at,
        );
        if (!version) return;
        if (message.type === "restore") {
          // The whole document: its first block to its last - or, empty,
          // the version written where the caret is.
          const blocks = await textus.document.getBlocks();
          const reason = textus.l10n.t("restoreReason");
          await textus.document.proposeEdit(
            blocks && blocks.length
              ? {
                  action: "replace",
                  block: blocks[0].id,
                  lastBlock: blocks[blocks.length - 1].id,
                  text: version.text,
                  reason: reason,
                }
              : { action: "insert_at_cursor", text: version.text, reason: reason },
          );
        }
        if (message.type === "open")
          await textus.window.openUntitled(version.text);
      });
      const html = await textus.plugin.readText("panel.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
    },
  });
};
