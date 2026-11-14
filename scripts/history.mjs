// Each plugin's earlier versions, kept in index.json beside the newest, so
// a Textus too old for the newest installs the newest it can run. The
// history is carried over from the catalog published now: the version it
// lists becomes an earlier one when a new one replaces it. Their zips stay
// up on their own releases (`<id>-v<version>`).

const CATALOG =
  "https://github.com/CatVinci-Studio/textus-plugins/releases/download/catalog/index.json";
/** Earlier versions kept per plugin, newest first. */
const KEPT = 12;

/** The catalog published now; null before the first. A failed read stops
 *  the build: a catalog without the history would lose it for good. */
export async function publishedCatalog(url = CATALOG) {
  const response = await fetch(url, { redirect: "follow" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

/** What Textus needs of an earlier version to choose and install it. */
function earlier(entry) {
  return {
    version: entry.version,
    textus: entry.manifest?.engines?.textus ?? entry.textus,
    permissions: entry.manifest?.permissions ?? entry.permissions ?? [],
    url: entry.url,
    sha256: entry.sha256,
    size: entry.size,
  };
}

/** `entry`'s earlier versions, from `published`'s entry for it. */
export function versionsOf(published, entry) {
  const before = published?.plugins?.find((p) => p.id === entry.id);
  if (!before) return [];
  const all = [
    ...(before.version === entry.version ? [] : [earlier(before)]),
    ...(before.versions ?? []),
  ];
  const seen = new Set([entry.version]);
  return all
    .filter(
      (v) => v.url && v.sha256 && !seen.has(v.version) && seen.add(v.version),
    )
    .slice(0, KEPT);
}
