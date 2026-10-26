// Each plugin's installs and dates for the market (build.mjs reads them):
// the downloads of every release of it (`<id>-v<version>`, its zip), the
// first release's date and the latest's. GitHub counts each download;
// Textus itself sends nothing. Run by the release workflow, with GH_TOKEN,
// before the build: `node scripts/stats.mjs > dist/stats.json`.

const REPO = "CatVinci-Studio/textus-plugins";

/** The stats of `releases` (GitHub's release objects), by plugin id. */
export function statsOf(releases) {
  const out = {};
  for (const release of releases) {
    const m = /^(.+)-v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.exec(release.tag_name);
    if (!m || release.draft) continue;
    const id = m[1];
    const zips = (release.assets ?? []).filter((a) => a.name.endsWith(".zip"));
    const downloads = zips.reduce((n, a) => n + (a.download_count ?? 0), 0);
    const date = (release.published_at ?? release.created_at ?? "").slice(0, 10);
    const s = (out[id] ??= { installs: 0, published: date, updated: date });
    s.installs += downloads;
    if (date && date < s.published) s.published = date;
    if (date && date > s.updated) s.updated = date;
  }
  return out;
}

async function releases() {
  const all = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`,
      {
        headers: {
          accept: "application/vnd.github+json",
          ...(process.env.GH_TOKEN
            ? { authorization: `Bearer ${process.env.GH_TOKEN}` }
            : {}),
        },
      },
    );
    if (!response.ok) throw new Error(`releases: ${response.status}`);
    const batch = await response.json();
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

if (import.meta.url === `file://${process.argv[1]}`)
  console.log(JSON.stringify(statsOf(await releases()), null, 2));
