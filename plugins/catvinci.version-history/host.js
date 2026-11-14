// Version History: each save of a document kept as a version, in the
// plugin's own storage (under a key made from its path, newest first), the
// last KEEP of them. The sidebar lists the versions of the document in front; one
// comes back as a proposal replacing the document, accepted or rejected
// like any edit, or opens as a new document.
/** What activate was given: the plugin's storage and own files. */
let ctx;

let panel = null;
const MAX_TEXT = 2 * 1024 * 1024;
/** Versions kept per document, and the time saves count as one. */
const KEEP = 50;
const EVERY = 15 * 60000;

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
  return (
    "v:" + a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0")
  );
}

/** The key of a document's newest version, kept apart from the rest so
 *  autosaves that bring it up to date write it alone. */
const NOW = ":now";

/** A version's id: when it was first kept, which later merged saves keep. */
const idOf = (v) => v.since || v.at;

async function versionsOf(path) {
  if (!path) return [];
  const store = ctx.storage.global;
  const kept = await store.get(keyOf(path));
  const now = await store.get(keyOf(path) + NOW);
  // Two paths with one hash: not this document's.
  const list = kept && kept.path === path ? kept.versions : [];
  const head = now && now.path === path ? now.version : null;
  if (!head) return list;
  return [head].concat(list.filter((v) => idOf(v) !== idOf(head)));
}
/** Set when the last save couldn't be kept even alone. */
let full = false;

/** A document with no versions yet, as it was on disk when it came to the
 *  front: its first save keeps that too (the last few opened). */
const opened = new Map();
async function rememberOpened() {
  const path = await textus.editor.getPath();
  if (!path || opened.has(path) || (await versionsOf(path)).length) return;
  const text = await textus.files.readText(path).catch(() => null);
  if (text === null || text.length > MAX_TEXT) return;
  opened.set(path, { at: Date.now(), text: text });
  if (opened.size > 20) opened.delete(opened.keys().next().value);
}

async function record(saved) {
  if (!saved.path || saved.text.length > MAX_TEXT) return;
  const list = await versionsOf(saved.path);
  const before = opened.get(saved.path);
  opened.delete(saved.path);
  if (list[0] && list[0].text === saved.text) return;
  const key = keyOf(saved.path);
  full = false;
  if (!list.length && before && before.text !== saved.text) {
    await keepVersions(key, saved.path, [before]);
    // A version's time is its id: a save in the same millisecond as the
    // opening must not pass for the text from before it.
    await keep(key + NOW, key, {
      path: saved.path,
      version: { at: Math.max(Date.now(), before.at + 1), text: saved.text },
    });
    return show();
  }
  // Saves close together - autosave's every few seconds - are one
  // version: the newest is brought up to date until EVERY has passed
  // since it was first kept, and only it is written.
  const now = Date.now();
  const newest = list[0];
  if (newest && now - idOf(newest) < EVERY) {
    await keep(key + NOW, key, {
      path: saved.path,
      version: { at: now, since: idOf(newest), text: saved.text },
    });
  } else {
    // A new version: the ones before it are kept as they were.
    if (newest) await keepVersions(key, saved.path, list.slice(0, KEEP - 1));
    await keep(key + NOW, key, {
      path: saved.path,
      version: { at: now, text: saved.text },
    });
  }
  await show();
}

/** Writes `value` at `at`, making room from other documents' versions
 *  when the storage is full. */
async function keep(at, key, value) {
  for (;;) {
    try {
      await ctx.storage.global.set(at, value);
      return;
    } catch (e) {
      const isFull = /full/i.test(String((e && e.message) || e));
      if (isFull && (await freeOther(key, value.version.at))) continue;
      full = true;
      return;
    }
  }
}

/** Writes the versions before the newest, fewer when they don't fit. */
async function keepVersions(key, path, versions) {
  // The storage full: older versions of any document go, until this fits.
  for (;;) {
    try {
      await ctx.storage.global.set(key, { path: path, versions: versions });
      return;
    } catch (e) {
      // Only a full storage makes room from other documents' versions.
      const isFull = /full/i.test(String((e && e.message) || e));
      if (isFull && (await freeOther(key, versions[versions.length - 1].at)))
        continue;
      if (versions.length <= 1) {
        full = true;
        return;
      }
      versions = versions.slice(0, Math.ceil(versions.length / 2));
    }
  }
}

/** Halves the versions of the other document whose oldest one is oldest,
 *  if older than `before`; false when there is none. */
async function freeOther(key, before) {
  const store = ctx.storage.global;
  let pick = null;
  for (const k of await store.keys()) {
    if (k === key || !k.startsWith("v:") || k.endsWith(NOW)) continue;
    const kept = await store.get(k);
    const list = (kept && kept.versions) || [];
    const oldest = list.length ? list[list.length - 1].at : -Infinity;
    if (oldest < before && (!pick || oldest < pick.oldest))
      pick = { k, kept, oldest };
  }
  if (!pick) return false;
  const list = (pick.kept && pick.kept.versions) || [];
  if (list.length > 1) {
    const half = list.slice(0, Math.ceil(list.length / 2));
    try {
      await store.set(pick.k, { path: pick.kept.path, versions: half });
      return true;
    } catch {
      // Even half doesn't fit: the whole entry goes.
    }
  }
  await store.delete(pick.k);
  return true;
}

async function show() {
  if (!panel) return;
  const path = await textus.editor.getPath();
  panel.postMessage({
    type: "versions",
    path: path,
    current: path ? await textus.editor.getText() : null,
    versions: (await versionsOf(path)).map((v) => ({ ...v, id: idOf(v) })),
    full: full,
  });
}

// Textus AI's tools: versions numbered from 1, the newest.

/* global folderPaths, lineDiff, lineHunks */
const CONTEXT = 2;

/** The document a tool means: its path in the folder, or the one in front. */
async function documentOf(input) {
  const root = await textus.files.root();
  if (input.path) {
    const rel = root && folderPaths.clean(root, input.path, true);
    if (!rel)
      return { error: "path must be a document's path in the open folder." };
    return { path: folderPaths.abs(root, rel), name: rel };
  }
  const path = await textus.editor.getPath();
  if (!path) return { error: "No document is open." };
  return { path: path, name: folderPaths.rel(root, path) || path };
}

async function listVersions(input) {
  const doc = await documentOf(input);
  if (doc.error) return doc;
  return {
    document: doc.name,
    versions: (await versionsOf(doc.path)).map((v, i) => ({
      version: i + 1,
      saved: new Date(v.at).toISOString(),
      lines: v.text.split("\n").length,
      characters: v.text.length,
    })),
  };
}

/** A diff as text: "+ " added, "- " removed, CONTEXT lines around each
 *  change, "…" for what is left out. */
const diffText = (parts) =>
  lineHunks(parts, CONTEXT)
    .map((p) =>
      p.kind === "gap"
        ? "…"
        : (p.kind === "added" ? "+ " : p.kind === "removed" ? "- " : "  ") +
          p.line,
    )
    .join("\n");

async function diffVersions(input) {
  const doc = await documentOf(input);
  if (doc.error) return doc;
  const versions = await versionsOf(doc.path);
  const pick = async (n) => {
    if (n === undefined || n === null || n === "current" || n === 0)
      return { label: "current", text: await textus.files.readText(doc.path) };
    const v = versions[Number(n) - 1];
    return v ? { label: "version " + n, text: v.text } : null;
  };
  const from = await pick(input.from);
  const to = await pick(input.to);
  if (!from || !to)
    return {
      error:
        doc.name +
        " has " +
        versions.length +
        " versions; number them from 1, the newest.",
    };
  const parts = lineDiff(from.text, to.text);
  if (!parts)
    return { error: "The two are too far apart to compare line by line." };
  const changed = parts.some((p) => p.kind !== "same");
  return {
    document: doc.name,
    from: from.label,
    to: to.label,
    diff: changed ? diffText(parts) : "(no changes)",
  };
}

/** A document or folder renamed or moved: its documents' versions follow. */
async function follow(change) {
  const store = ctx.storage.global;
  const moved = (path) =>
    path === change.from
      ? change.to
      : path.startsWith(change.from + "/") || path.startsWith(change.from + "\\")
        ? change.to + path.slice(change.from.length)
        : null;
  // A document's two keys move together, or not at all.
  const paths = new Set();
  for (const k of await store.keys()) {
    if (!k.startsWith("v:")) continue;
    const value = await store.get(k);
    if (value && typeof value.path === "string" && moved(value.path)) paths.add(value.path);
  }
  for (const from of paths) {
    const to = moved(from);
    const keys = [keyOf(from), keyOf(from) + NOW];
    const targets = [keyOf(to), keyOf(to) + NOW];
    // Never over the versions a document already has there.
    if ((await Promise.all(targets.map((k) => store.get(k)))).some(Boolean)) continue;
    for (let i = 0; i < 2; i++) {
      const value = await store.get(keys[i]);
      if (!value || value.path !== from) continue;
      await store.set(targets[i], Object.assign({}, value, { path: to }));
      await store.delete(keys[i]);
    }
  }
  await show();
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_versions", listVersions);
  textus.ai.registerTool("diff_versions", diffVersions);
  textus.files.onDidSave(record);
  // One rename after another: a unit's folder, then its page.
  let following = Promise.resolve();
  textus.files.onDidRename((change) => {
    following = following.then(() => follow(change)).catch(() => {});
  });
  textus.editor.onDidChangeActive(() => {
    void rememberOpened();
    return show();
  });
  void rememberOpened();
  textus.views.registerWebview("catvinci.version-history.panel", {
    resolve: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready") return show();
        const path = await textus.editor.getPath();
        const version = (await versionsOf(path)).find(
          (v) => idOf(v) === message.id,
        );
        if (!version) return;
        if (message.type === "restore") {
          // The whole document: its first block to its last - or, empty,
          // the version written where the caret is.
          const blocks = await textus.editor.getBlocks();
          const reason = textus.l10n.t("restoreReason");
          await textus.editor.propose(
            blocks && blocks.length
              ? {
                  action: "replace",
                  block: blocks[0].id,
                  lastBlock: blocks[blocks.length - 1].id,
                  text: version.text,
                }
              : { action: "insert_at_cursor", text: version.text },
            { reason: reason },
          );
        }
        if (message.type === "open")
          await textus.layout.openUntitled(version.text);
      });
      const html = await ctx.plugin.readText("panel.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
      // Drawn again in the interface's language when that changes.
      const relabel = textus.env.onDidChangeLanguage(() => {
        webview.html = html.replace("{{lang}}", textus.env.language);
      });
      webview.onDidDispose(() => relabel.dispose());
    },
  });
};
