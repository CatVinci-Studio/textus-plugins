// Git: the open folder's changed files marked in the sidebar, its branch
// in the status bar, a command that commits what the user picks with their
// own git, Push and Pull through the user's git and its saved credentials,
// and tools for Textus AI to read the history and draft a commit message.
// Nothing switches branches. Desktop only.
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
  states = new Map(((status && status.changes) || []).map((c) => [c.path, c.state]));
  changed.clear();
  remark();
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
  // What waits to go up or come down, as of the last fetch.
  const sync = (status.ahead ? " ↑" + status.ahead : "") + (status.behind ? " ↓" + status.behind : "");
  const tooltip = sync ? t("branchTip") + "\n" + t("syncTip", status.ahead, status.behind) : t("branchTip");
  const item = { text: "⎇ " + (status.branch || t("detached")) + sync, tooltip: tooltip, command: "catvinci.git.commit" };
  if (branchItem) branchItem.update(item);
  else branchItem = textus.ui.statusItem("catvinci.git.branch", item);
  return status;
}

// The blocks changed since the last commit, marked in the margin: the
// lines the saved file has that its last commit hadn't, found in the
// blocks. Lines are compared without their list, quote or heading marks
// and outer spaces, so a file Textus writes a little differently from how
// it was committed is not all marked.

/** The changed lines of each file asked about, by path; null for one Git
 *  doesn't follow, isn't changed, or is too large to compare. */
const changed = new Map();
/** The changed files' states, from the last refresh. */
let states = new Map();

const plainLine = (line) =>
  line
    .trim()
    .replace(/^(?:>\s*)+/, "")
    .replace(/^(?:[-*+]|\d+[.)])\s+(?:\[[ xX/-]\]\s+)?/, "")
    .replace(/^#{1,6}\s+/, "")
    .trim();

async function changedLines(path) {
  if (changed.has(path)) return changed.get(path);
  let lines = null;
  if (states.get(path) === "modified") {
    const last = (await textus.git.log(path, { limit: 1 }).catch(() => []))[0];
    const before = last ? await textus.git.show(last.hash, last.path).catch(() => null) : null;
    const now = before === null ? null : await textus.files.readText(path).catch(() => null);
    const parts = now === null ? null : lineDiff(before, now);
    if (parts)
      lines = new Set(
        parts
          .filter((p) => p.kind === "added")
          .map((p) => plainLine(p.line))
          // An empty line or a lone mark is in every document.
          .filter((line) => line.length > 1 && !/^[-*_=`~|:]+$/.test(line)),
      );
  }
  changed.set(path, lines);
  return lines;
}

/** A mark beside each block in sight holding a line the last commit hadn't. */
async function changedBlocks(inSight, doc) {
  const path = doc && doc.path;
  if (!path || !states.has(path)) return [];
  const lines = await changedLines(path);
  if (!lines || !lines.size) return [];
  return inSight
    .filter((block) => block.markdown.split("\n").some((line) => lines.has(plainLine(line))))
    .map((block) => ({
      block: block.id,
      style: "gutter",
      tone: "warning",
      tooltip: t("blockChanged"),
      command: { id: "catvinci.git.commit" },
    }));
}

let marks = null;
/** Asked again with what Git says now. Hosts before 1.8 send no path:
 *  no marks there. */
function remark() {
  if (marks) marks.dispose();
  marks = textus.editor.registerDecorations({ decorate: changedBlocks });
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
    const ok = await textus.ui.confirm(t("firstCommit", root), { okLabel: t("commitNow") });
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

/** Sends the branch's commits to its remote branch. */
async function push() {
  const status = await refresh();
  if (!status) return textus.ui.notice(t("noRepo"));
  try {
    await textus.git.push();
    const after = await refresh();
    await textus.ui.notice(t("pushed", status.branch || t("detached"), (after && after.upstream) || "origin"));
  } catch (e) {
    await textus.ui.message(t("pushFailed", errorText(e)), { tone: "error" });
  }
}

/** Takes the remote branch's commits in; a conflict is undone by Textus
 *  and said here. */
async function pull() {
  const status = await refresh();
  if (!status) return textus.ui.notice(t("noRepo"));
  if (!status.upstream) return textus.ui.notice(t("noUpstream"));
  try {
    await textus.git.fetch();
    const fetched = await refresh();
    if (!fetched || !fetched.behind) return textus.ui.notice(t("upToDate", status.upstream));
    await textus.git.pull();
    await refresh();
    await textus.ui.notice(t("pulled", fetched.behind, status.upstream));
  } catch (e) {
    await textus.ui.message(t("pullFailed", errorText(e)), { tone: "error" });
  }
}

// Textus AI's tools.

/** A path the AI gave, in the open folder; else an error. */
async function fileOf(input) {
  const root = await textus.files.root();
  const rel = root && input.path && folderPaths.clean(root, input.path, false);
  if (!rel) return { error: "path must be a file's path in the open folder." };
  return { path: folderPaths.abs(root, rel), rel: rel, root: root };
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
  textus.commands.register("catvinci.git.push", push);
  textus.commands.register("catvinci.git.pull", pull);
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
