// WakaTime: tells your WakaTime account when you write in Textus, so your
// writing time shows on its dashboard beside your coding. Nothing is sent
// until you set your API key.

/* global wakaBeat */
const t = (key, ...args) => textus.l10n.t(key, ...args);
const API = "https://api.wakatime.com/api/v1/users/current/heartbeats";

let secrets = null;
let version = "";
let last = null;
let warned = false;

async function send(isWrite, path) {
  path = path || (await textus.editor.getPath());
  if (!path) return; // an unsaved document has no file to name
  const now = Date.now();
  if (!wakaBeat.due(last, path, now, isWrite)) return;
  const key = await secrets.get("apiKey");
  if (!key) return;
  last = { path: path, at: now };
  const folder = await textus.files.root().catch(() => null);
  const response = await textus.net
    .fetch(API, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(key),
        "Content-Type": "application/json",
        "User-Agent": "textus textus-wakatime/" + version,
      },
      body: JSON.stringify(wakaBeat.heartbeat(path, now, isWrite, folder)),
    })
    .catch(() => null); // offline: the next change tries again
  if (response && (response.status === 401 || response.status === 403) && !warned) {
    warned = true;
    textus.ui.notice(t("badKey"));
  }
}

async function setKey() {
  const key = await textus.ui.input({
    prompt: t("keyPrompt"),
    placeholder: "waka_…",
    value: (await secrets.get("apiKey")) || "",
  });
  if (key === undefined || key === null) return;
  await secrets.set("apiKey", key.trim() || null);
  warned = false;
  textus.ui.notice(key.trim() ? t("keySaved") : t("keyRemoved"));
}

exports.activate = function (ctx) {
  secrets = ctx.secrets;
  version = ctx.plugin.version;
  ctx.subscriptions.push(
    textus.commands.register("catvinci.wakatime.setKey", setKey),
    textus.commands.register("catvinci.wakatime.dashboard", () =>
      textus.layout.openExternal("https://wakatime.com/dashboard"),
    ),
    textus.editor.onDidChange(() => void send(false)),
    textus.files.onDidSave((e) => void send(true, e && e.path)),
  );
};
