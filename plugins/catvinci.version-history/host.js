// Version History: each save of a document kept as a version (store.js),
// and the text a change from outside replaced and brought. The sidebar
// lists the versions of the document in front; one is compared with the
// document or another version, comes back whole or one change at a time
// as a proposal, accepted or rejected like any edit, opens as a new
// document, or is named and pinned so it is always kept.
/* global versionStore, folderPaths, lineDiff, hunkText */
/** What activate was given: the plugin's storage and own files. */
let ctx;
let store;
let panel = null;
const MAX_TEXT = 2 * 1024 * 1024;
const t = (key, ...args) => textus.l10n.t(key, ...args);

/** A document with no versions yet, as it was on disk when it came to the
 *  front: its first save keeps that too (the last few opened). */
const opened = new Map();
async function rememberOpened() {
  const path = await textus.editor.getPath();
  if (!path || opened.has(path) || (await store.list(path)).length) return;
  const text = await textus.files.readText(path).catch(() => null);
  if (text === null || text.length > MAX_TEXT) return;
  opened.set(path, { at: Date.now(), text: text });
  if (opened.size > 20) opened.delete(opened.keys().next().value);
}

/** One thing to keep at a time: saves, changes and renames in order. */
let queue = Promise.resolve();
const inTurn = (work) => (queue = queue.then(work).catch(() => {}));

async function onSave(saved) {
  if (!saved.path || saved.text.length > MAX_TEXT) return;
  const before = opened.get(saved.path);
  opened.delete(saved.path);
  if (before && before.text !== saved.text)
    await store.record(saved.path, before.text, { now: before.at, source: "opened", merge: false });
  await store.record(saved.path, saved.text);
  // Also when nothing was kept: the storage may have just filled.
  await show();
}

/** Changed by another app, a sync, git: what it replaced, then what it
 *  brought, each a version of its own. */
async function onChangeOnDisk(change) {
  if (change.after.length > MAX_TEXT) return;
  await store.record(change.path, change.before, { source: "save" });
  await store.record(change.path, change.after, { source: "disk", merge: false });
  await show();
}

/** The document's Git commits when its folder is a repository (desktop),
 *  the last asked kept for their texts. */
let lastCommits = { path: null, commits: [] };
async function commitsOf(path) {
  const none = { branch: null, commits: [] };
  if (!path || !textus.git) return none;
  const status = await textus.git.status().catch(() => null);
  if (!status) return none;
  const log = await textus.git.log(path, { limit: 50 }).catch(() => []);
  const commits = log.map((c) => ({
    id: "git:" + c.hash,
    at: c.at,
    subject: c.subject,
    author: c.author,
    hash: c.hash,
    path: c.path,
  }));
  lastCommits = { path: path, commits: commits };
  return { branch: status.branch, commits: commits };
}

async function show() {
  if (!panel) return;
  const path = await textus.editor.getPath();
  const git = await commitsOf(path);
  panel.postMessage({
    type: "versions",
    path: path,
    versions: (await store.list(path)).map((v) => Object.assign({ id: store.idOf(v) }, v)),
    commits: git.commits,
    branch: git.branch,
    full: store.full,
  });
}

async function versionOf(path, id) {
  return (await store.list(path)).find((v) => store.idOf(v) === id) || null;
}

/** A version's text, or a commit's (`git:<hash>`); null when it is gone. */
async function textOf(path, id) {
  if (typeof id === "string" && id.startsWith("git:")) {
    const known = lastCommits.path === path ? lastCommits.commits : (await commitsOf(path)).commits;
    const commit = known.find((c) => c.id === id);
    return commit ? textus.git.show(commit.hash, commit.path).catch(() => null) : null;
  }
  const version = await versionOf(path, id);
  return version ? store.text(version.hash) : null;
}

/** The texts a panel compares: a version and the document, or another. */
async function texts(path, id, against) {
  const from = await textOf(path, id);
  if (from === null) return null;
  const to = against === "current" ? await textus.editor.getText() : await textOf(path, against);
  // The editor's text ends without the file's last newline.
  const ends = (text) => String(text || "").replace(/\n+$/, "");
  return { from: ends(from), to: ends(to) };
}

/** The whole document replaced by `text`, proposed as an edit. */
async function proposeText(text) {
  const blocks = await textus.editor.getBlocks();
  await textus.editor.propose(
    blocks && blocks.length
      ? { action: "replace", block: blocks[0].id, lastBlock: blocks[blocks.length - 1].id, text: text }
      : { action: "insert_at_cursor", text: text },
    { reason: t("restoreReason") },
  );
}

async function onMessage(message) {
  if (message.type === "ready") return inTurn(show);
  const path = await textus.editor.getPath();
  if (message.type === "restoreText") return proposeText(String(message.text));
  if (message.type === "load") {
    const both = await texts(path, message.id, message.against);
    if (both && panel) panel.postMessage(Object.assign({ type: "texts", id: message.id, against: message.against }, both));
    return;
  }
  if (message.type === "restore" || message.type === "open") {
    const text = await textOf(path, message.id);
    if (text === null) return;
    return message.type === "restore" ? proposeText(text) : textus.layout.openUntitled(text);
  }
  const version = await versionOf(path, message.id);
  if (!version) return;
  // Only a version's name or pin changes the list.
  if (message.type === "pin") {
    await inTurn(() => store.mark(path, message.id, { pinned: !version.pinned }));
    await show();
  }
  if (message.type === "name") {
    const name = await textus.ui.input({ prompt: t("namePrompt"), value: version.name || "" });
    if (name === null) return;
    await inTurn(() => store.mark(path, message.id, { name: name }));
    await show();
  }
}

// Textus AI's tools: versions numbered from 1, the newest.

const CONTEXT = 2;

/** The document a tool means: its path in the folder, or the one in front. */
async function documentOf(input) {
  const root = await textus.files.root();
  if (input.path) {
    const doc = folderPaths.resolve(root, input.path, true);
    return doc ? { path: doc.path, name: doc.rel } : { error: "path must be a document's path in the open folder." };
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
    versions: (await store.list(doc.path)).map((v, i) => ({
      version: i + 1,
      saved: new Date(v.at).toISOString(),
      characters: v.chars,
      words: v.words,
      name: v.name,
      pinned: v.pinned || undefined,
      changedOutside: v.source === "disk" || undefined,
    })),
  };
}

async function diffVersions(input) {
  const doc = await documentOf(input);
  if (doc.error) return doc;
  const versions = await store.list(doc.path);
  const pick = async (n) => {
    if (n === undefined || n === null || n === "current" || n === 0)
      return { label: "current", text: await textus.files.readText(doc.path) };
    const v = versions[Number(n) - 1];
    return v ? { label: "version " + n, text: await store.text(v.hash) } : null;
  };
  const from = await pick(input.from);
  const to = await pick(input.to);
  if (!from || !to)
    return { error: doc.name + " has " + versions.length + " versions; number them from 1, the newest." };
  const parts = lineDiff(from.text, to.text);
  if (!parts) return { error: "The two are too far apart to compare line by line." };
  const changed = parts.some((p) => p.kind !== "same");
  return { document: doc.name, from: from.label, to: to.label, diff: changed ? hunkText(parts, CONTEXT) : "(no changes)" };
}

exports.activate = function (context) {
  ctx = context;
  store = versionStore.createStore(ctx.storage.global);
  // 0.3's versions moved over first; then what age and deletions let go.
  inTurn(() => store.migrate());
  inTurn(() => store.clean());
  textus.ai.registerTool("list_versions", listVersions);
  textus.ai.registerTool("diff_versions", diffVersions);
  textus.files.onDidSave((saved) => inTurn(() => onSave(saved)));
  textus.files.onDidChangeOnDisk((change) => inTurn(() => onChangeOnDisk(change)));
  textus.files.onDidRename((change) => inTurn(() => store.move(change.from, change.to).then(show)));
  textus.files.onDidDelete((change) => inTurn(() => store.forget(change.path)));
  textus.editor.onDidChangeActive(() => {
    void inTurn(rememberOpened);
    return show();
  });
  void inTurn(rememberOpened);
  textus.views.registerWebview("catvinci.version-history.panel", {
    resolve: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      // Not in turn: naming a version waits for the user.
      webview.onDidReceiveMessage((message) => void onMessage(message).catch(() => {}));
      webview.html = await ctx.plugin.readText("panel.html");
    },
  });
};
