// Clipboard History: what the user copied or cut in a document (env.onDidCopy),
// the newest first, kept with the plugin's global data. A click puts an
// entry in at the caret; right-click copies it again or takes it away.
let ctx;
let list;
const t = (key, ...args) => textus.l10n.t(key, ...args);
const KEY = "entries";
const MAX_ENTRIES = 30;
const MAX_LENGTH = 50000;
const PREVIEW = 120;

async function all() {
  return (await ctx.storage.global.get(KEY)) || [];
}

async function keep(entries) {
  await ctx.storage.global.set(KEY, entries);
  if (list) list.refresh();
}

const preview = (text) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > PREVIEW ? flat.slice(0, PREVIEW) + "…" : flat;
};

exports.activate = function (context) {
  ctx = context;
  list = textus.views.registerList("catvinci.clipboard-history.panel", {
    emptyText: t("empty"),
    items: async function () {
      return (await all()).map((entry) => ({
        id: String(entry.at),
        label: preview(entry.text),
        command: { id: "catvinci.clipboard-history.insert", args: [entry.at] },
        actions: [
          { label: t("copy"), command: "catvinci.clipboard-history.copy", args: [entry.at] },
          { label: t("remove"), command: "catvinci.clipboard-history.remove", args: [entry.at] },
          { label: t("clear"), command: "catvinci.clipboard-history.clear" },
        ],
      }));
    },
  });
  textus.env.onDidCopy(async function ({ text }) {
    if (!text.trim() || text.length > MAX_LENGTH) return;
    const rest = (await all()).filter((entry) => entry.text !== text);
    await keep([{ text, at: Date.now() }, ...rest].slice(0, MAX_ENTRIES));
  });
  const find = async (at) => (await all()).find((entry) => entry.at === at);
  textus.commands.registerEditorCommand(
    "catvinci.clipboard-history.insert",
    async function (editor, at) {
      const entry = await find(at);
      if (entry) await editor.insertText(entry.text);
    },
  );
  textus.commands.register("catvinci.clipboard-history.copy", async function (at) {
    const entry = await find(at);
    if (entry) await textus.env.writeClipboard(entry.text);
  });
  textus.commands.register("catvinci.clipboard-history.remove", async function (at) {
    await keep((await all()).filter((entry) => entry.at !== at));
  });
  textus.commands.register("catvinci.clipboard-history.clear", async function () {
    await keep([]);
  });
};
