// Folders on a server, through the user's own ssh: picked from the hosts in
// ~/.ssh/config, opened in the sidebar, read and written over SFTP.
/* global sshPaths */
const t = (key, ...args) => textus.l10n.t(key, ...args);

/** Each host's link, made when first needed and again when it drops. */
const sessions = new Map();

async function session(host) {
  let open = sessions.get(host);
  if (!open) {
    open = textus.ssh.connect(host);
    sessions.set(host, open);
    open.catch(() => sessions.delete(host));
  }
  return open;
}

const DROPPED = /closed|broken pipe|eof|reset|not connected/i;

/** Runs `work` on the host's link; a link that dropped is made again once. */
async function onHost(url, work) {
  const at = sshPaths.parse(url);
  if (!at) throw new Error(t("notRemote", url));
  try {
    return await work(await session(at.host), at.path, at.host);
  } catch (error) {
    if (!DROPPED.test(String(error && error.message))) throw error;
    sessions.delete(at.host);
    return work(await session(at.host), at.path, at.host);
  }
}

const provider = {
  list: (url) => onHost(url, (s, path) => textus.ssh.list(s, path)),
  readText: (url) => onHost(url, (s, path) => textus.ssh.readText(s, path)),
  read: (url) => onHost(url, (s, path) => textus.ssh.read(s, path)),
  writeText: (url, text) =>
    onHost(url, (s, path) => textus.ssh.write(s, path, text)),
  create: (dir, name, folder) =>
    onHost(dir, (s, path) =>
      textus.ssh.create(s, sshPaths.join(path, name), folder),
    ),
  rename: (url, name) =>
    onHost(url, (s, path) =>
      textus.ssh.rename(s, path, sshPaths.join(sshPaths.parent(path), name)),
    ),
  move: (url, into) =>
    onHost(url, (s, path) => {
      const target = sshPaths.parse(into);
      if (!target) throw new Error(t("notRemote", into));
      return textus.ssh.rename(
        s,
        path,
        sshPaths.join(target.path, sshPaths.base(path)),
      );
    }),
  delete: (url) => onHost(url, (s, path) => textus.ssh.delete(s, path)),
};

/** The host to open: one from ~/.ssh/config, or one typed. */
async function pickHost() {
  const hosts = await textus.ssh.hosts();
  if (!hosts.length)
    return textus.ui.input({ prompt: t("hostPrompt"), placeholder: "me@server" });
  const other = { label: t("otherHost"), value: "" };
  const picked = await textus.ui.pick(
    [...hosts.map((host) => ({ label: host, value: host })), other],
    { placeholder: t("pickHost") },
  );
  if (picked !== "") return picked;
  return textus.ui.input({ prompt: t("hostPrompt"), placeholder: "me@server" });
}

async function openRemoteFolder() {
  const host = (await pickHost())?.trim();
  if (!host) return;
  try {
    const home = await textus.ssh.home(await session(host));
    const folder = (
      await textus.ui.input({ prompt: t("folderPrompt", host), value: home })
    )?.trim();
    if (!folder) return;
    if (folder.charAt(0) !== "/") {
      await textus.ui.message(t("notAbsolute"), { tone: "warning" });
      return;
    }
    const entries = await textus.ssh.list(await session(host), folder);
    if (!Array.isArray(entries)) return;
    await textus.files.openFolder(sshPaths.url(host, folder));
  } catch (error) {
    sessions.delete(host);
    await textus.ui.message(String((error && error.message) || error), {
      tone: "error",
    });
  }
}

exports.activate = function (context) {
  if (!textus.ssh || !textus.files.registerProvider) return;
  context.subscriptions.push(
    textus.files.registerProvider("ssh", provider),
    textus.commands.register("catvinci.ssh.open", openRemoteFolder),
  );
};

exports.deactivate = function () {
  sessions.clear();
};
