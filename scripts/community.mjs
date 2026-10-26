// Plugins from other repositories (LISTING.md): community/<id>.json names
// the repository and the version listed; the zip is that repository's
// release for the tag v<version>, made by the release workflow Textus's
// Export for Publishing puts in it.

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** The file's entry, checked: its id (also its file name), repository
 *  and version, the libraries it bundles (path -> where from), and the
 *  reviewed zip's SHA-256 (the review prints it; the maintainer adds it
 *  before merging, so the zip can't change after it was looked at). */
export function communityEntry(json, path = "") {
  const where = path || "community entry";
  if (!json || typeof json !== "object") throw new Error(`${where}: not an object`);
  const { id, repo, version, libs, sha256 } = json;
  if (!ID.test(id ?? "")) throw new Error(`${where}: "${id}" isn't a plugin id`);
  if (path && !path.endsWith(`/${id}.json`) && path !== `${id}.json`)
    throw new Error(`${where}: the file should be named ${id}.json`);
  if (id.startsWith("catvinci.")) throw new Error(`${where}: catvinci. is CatVinci Studio's own`);
  if (!REPO.test(repo ?? "")) throw new Error(`${where}: "${repo}" isn't owner/repository`);
  if (!VERSION.test(version ?? "")) throw new Error(`${where}: "${version}" isn't x.y.z`);
  if (libs !== undefined && (typeof libs !== "object" || Array.isArray(libs)))
    throw new Error(`${where}: libs maps a file to where it comes from`);
  if (sha256 !== undefined && !/^[0-9a-f]{64}$/.test(sha256))
    throw new Error(`${where}: sha256 is the zip's SHA-256, in hex`);
  return { id, repo, version, libs: libs ?? {}, sha256 };
}

/** Where the version's zip is. */
export function releaseZipUrl({ id, repo, version }) {
  return `https://github.com/${repo}/releases/download/v${version}/${id}-${version}.zip`;
}
