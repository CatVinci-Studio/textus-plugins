// Keenable web search for Textus AI: works without a key (its public
// search); with a key set, its full search.

const API = "https://api.keenable.ai/v1";
const MAX = 10;
/** The most of one result's text the model is shown. */
const TEXT_CHARS = 600;

const t = (key, ...args) => textus.l10n.t(key, ...args);
let ctx;

/** A result as the model reads it: its description, else its snippet, cut. */
function result(item) {
  const text = String(item.description || item.snippet || "").trim();
  return {
    title: item.title || "",
    url: item.url || "",
    text: text.length > TEXT_CHARS ? `${text.slice(0, TEXT_CHARS)}…` : text,
    date: item.published_at || null,
  };
}

/** The saved key; a stored "null" is what removing it used to leave. */
async function savedKey() {
  const key = await ctx.secrets.get("apiKey");
  return key && key !== "null" ? key : "";
}

async function search(args) {
  const query = String(args?.query ?? "").trim();
  if (!query) return "Say what to search for.";
  const count = Math.min(MAX, Math.max(1, Number(args?.count) || 5));
  const key = await savedKey();
  const response = await textus.net
    .fetch(key ? `${API}/search` : `${API}/search/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Keenable-Title": "Textus",
        ...(key ? { "X-API-Key": key } : {}),
      },
      body: JSON.stringify({ query, max_results: count }),
    })
    .catch(() => null);
  if (!response) return "Keenable couldn't be reached.";
  if (response.status === 401 || response.status === 403)
    return "Keenable refused the API key; set it again or remove it.";
  if (!response.ok) return `Keenable answered ${response.status}.`;
  const body = await response.json().catch(() => null);
  if (!body) return "Keenable sent an unreadable answer.";
  const found = (body.results ?? []).map(result).filter((r) => r.url);
  if (!found.length) return `Nothing found for "${query}".`;
  return JSON.stringify(found);
}

async function setKey() {
  const key = await textus.ui.input({
    prompt: t("keyPrompt"),
    value: await savedKey(),
  });
  if (key === undefined || key === null) return;
  const value = key.trim();
  if (value) await ctx.secrets.set("apiKey", value);
  else await ctx.secrets.delete("apiKey");
  textus.ui.notice(value ? t("keySaved") : t("keyRemoved"));
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("keenable_search", search);
  ctx.subscriptions.push(
    textus.commands.register("catvinci.keenable.setKey", setKey),
  );
};

exports._test = { result };
