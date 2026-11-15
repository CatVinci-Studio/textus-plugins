// Git: the open folder's changed files marked in the sidebar, its branch
// in the status bar, a command that commits what the user picks with their
// own git, and tools for Textus AI to read the history and draft a commit
// message. Nothing pushes, pulls or switches branches. Desktop only.
/* global folderPaths, lineDiff, hunkText */
let ctx;
let branchItem = null;
/** The paths badged now, to take off the ones no longer changed. */
let badged = new Set();
const t = (key, ...args) => textus.l10n.t(key, ...args);
const errorText = (e) => String((e && e.message) || e);

const BADGES = {
  modified: { text: "M", tone: "warning" },
  added: { text: "A", tone: "success" },
  untracked: { text: "U", tone: "success" },
  renamed: { text: "R", tone: "accent" },
  conflicted: { text: "!", tone: "danger" },
};

/** Badges and the branch as Git sees the folder now. */
async function refresh() {
  const status = await textus.git.status().catch(() => null);
  const next = new Set();
  for (const change of (status && status.changes) || []) {
    const badge = BADGES[change.state];
    if (!badge) continue;
    next.add(change.path);
    await textus.files.setBadge(change.path, Object.assign({ tooltip: t("state." + change.state) }, badge));
  }
  for (const path of badged) if (!next.has(path)) await textus.files.setBadge(path, null);
  badged = next;
  if (!status) {
    if (branchItem) branchItem.dispose();
    branchItem = null;
    return null;
  }
  const item = { text: "⎇ " + (status.branch || t("detached")), tooltip: t("branchTip"), command: "catvinci.git.commit" };
  if (branchItem) branchItem.update(item);
  else branchItem = textus.ui.statusItem("catvinci.git.branch", item);
  return status;
}

let timer = null;
/** One refresh for a burst of saves and renames. */
function soon() {
  clearTimeout(timer);
  timer = setTimeout(() => void refresh().catch(() => {}), 400);
}

/** Commits what the user picks of the changes, with their message; the
 *  first commit in a folder asks first. */
async function commit() {
  const status = await refresh();
  if (!status) return textus.ui.notice(t("noRepo"));
  if (!status.changes.length) return textus.ui.notice(t("nothing"));
  const root = await textus.files.root();
  const front = await textus.editor.getPath().catch(() => null);
  const picked = await textus.ui.pick(
    status.changes.map((c) => ({
      label: folderPaths.rel(root, c.path) || c.path,
      description: t("state." + c.state),
      value: c.path,
      picked: !front || c.path === front || !status.changes.some((x) => x.path === front),
    })),
    { multiple: true, placeholder: t("pickFiles") },
  );
  if (!picked || !picked.length) return;
  const message = await textus.ui.input({ prompt: t("messagePrompt"), placeholder: t("messageHint") });
  if (!message || !message.trim()) return;
  const allowed = (await ctx.storage.global.get("allowed")) || [];
  if (!allowed.includes(root)) {
    const ok = await textus.ui.confirm(t("firstCommit", root), { okLabel: t("commit") });
    if (!ok) return;
    await ctx.storage.global.set("allowed", allowed.concat(root));
  }
  try {
    const hash = await textus.git.commit(message.trim(), picked);
    await textus.ui.notice(t("committed", hash.slice(0, 7), status.branch || t("detached")));
  } catch (e) {
    await textus.ui.message(t("failed", errorText(e)), { tone: "error" });
  }
  await refresh();
}

// Textus AI's tools.

/** A path the AI gave, in the open folder; else an error. */
async function fileOf(input) {
  const root = await textus.files.root();
  const file = folderPaths.resolve(root, input.path, false);
  return file ? Object.assign({ root: root }, file) : { error: "path must be a file's path in the open folder." };
}

async function gitChanges() {
  const status = await textus.git.status();
  if (!status) return { error: "The open folder isn't in a Git repository, or Git isn't installed." };
  const root = await textus.files.root();
  const files = [];
  let room = 40000;
  for (const change of status.changes) {
    const entry = { path: folderPaths.rel(root, change.path) || change.path, state: change.state };
    if (room > 0 && (change.state === "modified" || change.state === "renamed")) {
      const last = (await textus.git.log(change.path, { limit: 1 }))[0];
      const before = last ? await textus.git.show(last.hash, last.path) : null;
      const now = await textus.files.readText(change.path).catch(() => null);
      const parts = before !== null && now !== null ? lineDiff(before, now) : null;
      if (parts) {
        entry.diff = hunkText(parts, 2).slice(0, room);
        room -= entry.diff.length;
      }
    }
    files.push(entry);
  }
  return { branch: status.branch, changes: files };
}

async function gitHistory(input) {
  const file = await fileOf(input);
  if (file.error) return file;
  const commits = await textus.git.log(file.path, { limit: Math.min(Number(input.limit) || 20, 100) });
  return {
    file: file.rel,
    commits: commits.map((c) => ({
      hash: c.hash.slice(0, 12),
      date: new Date(c.at).toISOString(),
      author: c.author,
      subject: c.subject,
      path: folderPaths.rel(file.root, c.path) || c.path,
    })),
  };
}

async function gitFileAt(input) {
  const file = await fileOf(input);
  if (file.error) return file;
  const commit = (await textus.git.log(file.path, { limit: 100 })).find((c) => c.hash.startsWith(String(input.hash || "")));
  if (!input.hash || !commit) return { error: "No commit of " + file.rel + " starts with that hash; list them with git_history." };
  const text = await textus.git.show(commit.hash, commit.path);
  return text === null ? { error: "That commit has no text for this file." } : { file: file.rel, hash: commit.hash.slice(0, 12), text: text };
}

exports.activate = function (context) {
  ctx = context;
  textus.commands.register("catvinci.git.commit", commit);
  textus.ai.registerTool("git_changes", gitChanges);
  textus.ai.registerTool("git_history", gitHistory);
  textus.ai.registerTool("git_file_at", gitFileAt);
  for (const event of [
    textus.files.onDidSave,
    textus.files.onDidCreate,
    textus.files.onDidRename,
    textus.files.onDidDelete,
    textus.files.onDidChangeRoot,
    textus.files.onDidChangeOnDisk,
  ])
    ctx.subscriptions.push(event(soon));
  // Back from the terminal or another app: what it committed shows.
  ctx.subscriptions.push(textus.app.onDidChangeState((state) => state === "active" && soon()));
  void refresh().catch(() => {});
};
