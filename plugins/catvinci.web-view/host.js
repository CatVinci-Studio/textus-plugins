// Web View: web pages in a tab beside the notes. The tab itself is
// Textus's (window.openWebPage), so the page keeps its own cookies and
// storage; this plugin adds the ways to open one - an address or words to
// search for, a page opened before, the selected link, and a web link
// Ctrl/Cmd+clicked in a document (contributes.links).

/** The pages opened lately, newest first, kept in the plugin's storage. */
const RECENT = "recent";
const RECENT_KEPT = 20;

/** Where words that aren't an address are searched for. */
const SEARCH = {
  duckduckgo: "https://duckduckgo.com/?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  baidu: "https://www.baidu.com/s?wd=",
};

/** An address: a URL, a host ("example.com/page"), or null for words. */
function asAddress(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/^http:/i, "https:");
  // A host has a dot and no spaces: "example.com", "docs.rs/serde".
  if (!/\s/.test(trimmed) && /^[^/]+\.[a-z]{2,}(\/|$|:)/i.test(trimmed))
    return "https://" + trimmed;
  return null;
}

async function searchFor(words) {
  const engine = (await textus.settings.get("search")) || "duckduckgo";
  return (SEARCH[engine] || SEARCH.duckduckgo) + encodeURIComponent(words.trim());
}

async function remember(url) {
  const list = (await textus.storage.get(RECENT)) || [];
  const next = [url, ...list.filter((u) => u !== url)].slice(0, RECENT_KEPT);
  await textus.storage.set(RECENT, next);
}

/** Opens what was typed: the address, or a search for the words. */
async function openTyped(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return;
  const url = asAddress(trimmed) || (await searchFor(trimmed));
  await remember(url);
  return textus.window.openWebPage(url);
}

exports.activate = function () {
  const t = textus.l10n.t;
  textus.commands.registerCommand("catvinci.web-view.open", async function () {
    const recent = (await textus.storage.get(RECENT)) || [];
    let typed;
    if (recent.length) {
      // A page opened before, or a new one.
      const picked = await textus.window.showQuickPick(
        [
          { label: t("newPage"), value: "" },
          ...recent.map((url) => ({ label: url.replace(/^https:\/\//, ""), value: url })),
          { label: t("clearRecent"), value: "clear" },
        ],
        { placeholder: t("recentPlaceholder") },
      );
      if (picked === null || picked === undefined) return;
      if (picked === "clear") return textus.storage.set(RECENT, []);
      if (picked) return openTyped(picked);
    }
    typed = await textus.window.showInput({ prompt: t("prompt"), value: "" });
    if (typed) await openTyped(typed);
  });
  textus.commands.registerCommand(
    "catvinci.web-view.openSelection",
    async function () {
      const selection = await textus.document.getSelection();
      // As Markdown, a link's target is there; its plain text is only the
      // link's words.
      const text = selection && (selection.markdown || selection.text);
      // The link itself, a Markdown link's target - or the words, searched.
      const target =
        text && (/\((https?:\/\/[^)\s]+)\)/.exec(text) || [null, text])[1];
      if (target) await openTyped(target);
    },
  );
  textus.commands.registerCommand(
    "catvinci.web-view.openLink",
    async function (url) {
      await openTyped(url);
    },
  );
};

exports.asAddress = asAddress;
