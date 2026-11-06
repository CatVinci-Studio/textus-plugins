// Openverse pictures for Textus AI: openly licensed photographs and
// drawings (Flickr, museums and more), searched without a key, each with
// the credit its licence asks for.

const API = "https://api.openverse.org/v1/images/";
/** Licences a picture may be used under with a credit line. */
const OPEN = ["by", "by-sa", "cc0", "pdm"];
const MAX = 10;

const LICENCE_NAMES = {
  by: "CC BY",
  "by-sa": "CC BY-SA",
  cc0: "CC0",
  pdm: "Public domain",
};

/** The licence as a credit names it: "CC BY 2.0", "CC0", "Public domain". */
function licenceName(result) {
  const name = LICENCE_NAMES[result.license] ?? result.license;
  return result.license_version && result.license !== "pdm"
    ? `${name} ${result.license_version}`
    : name;
}

/** A result Textus AI can show, or null when its licence isn't open. */
function picture(result) {
  // Openverse passes on each source's claim: checked again here.
  if (!OPEN.includes(result.license) || !result.url) return null;
  const where = result.foreign_landing_url || result.url;
  const by = result.creator ? `${result.creator} · ` : "";
  return {
    title: result.title || "",
    url: result.url,
    thumbnail: result.thumbnail || null,
    width: result.width || null,
    height: result.height || null,
    page: where,
    credit: `${by}${licenceName(result)} · [${result.source || result.provider || "Openverse"}](${where})`,
  };
}

async function findPictures(args) {
  const query = String(args?.query ?? "").trim();
  if (!query) return "Say what to look for.";
  const count = Math.min(MAX, Math.max(1, Number(args?.count) || 5));
  const url = `${API}?q=${encodeURIComponent(query)}&license=${OPEN.join(",")}&page_size=${count}`;
  const response = await textus.net
    .fetch(url, { headers: { Accept: "application/json" } })
    .catch(() => null);
  if (!response) return "Openverse couldn't be reached.";
  if (response.status === 429)
    return "Openverse is busy (too many searches today); try again later.";
  if (!response.ok) return `Openverse answered ${response.status}.`;
  const body = await response.json();
  const found = (body.results ?? []).map(picture).filter(Boolean);
  if (!found.length) return `Nothing on Openverse for "${query}".`;
  return JSON.stringify(found);
}

exports.activate = function () {
  textus.ai.registerTool("find_open_pictures", findPictures);
};

exports._test = { picture, licenceName };
