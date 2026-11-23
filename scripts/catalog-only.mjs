// Manifest keys only the catalog reads: Textus takes them from the catalog's
// copy of the manifest (built from this repository), never from an installed
// package's. Changing one needs no new version, and the release keeps the
// package already out.
export const CATALOG_ONLY = ["category", "needsTextusAi"];

/** `value` with object keys in order, so key order makes no difference. */
const sorted = (value) =>
  Array.isArray(value)
    ? value.map(sorted)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((k) => [k, sorted(value[k])]),
        )
      : value;

/** Whether two manifests (their text) differ in catalog-only keys at most. */
export function sameButCatalogOnly(before, now) {
  let a, b;
  try {
    [a, b] = [JSON.parse(before), JSON.parse(now)];
  } catch {
    return false;
  }
  for (const key of CATALOG_ONLY) {
    delete a[key];
    delete b[key];
  }
  return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
}
