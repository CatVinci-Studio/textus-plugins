import { readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";

/** Each plugin's store page (its README, in every language) begins its
 *  changes with the version the manifest ships. */
const plugins = new URL("../plugins/", import.meta.url);
const unlisted = new Set<string>(
  JSON.parse(readFileSync(new URL("../unlisted.json", import.meta.url), "utf8")),
);

it("every README's newest change is the manifest's version", () => {
  const late: string[] = [];
  for (const id of readdirSync(plugins)) {
    if (unlisted.has(id)) continue;
    const version = JSON.parse(readFileSync(new URL(`${id}/textus-plugin.json`, plugins), "utf8")).version;
    for (const file of readdirSync(new URL(`${id}/`, plugins)).filter((f) => /^README(\.[\w-]+)?\.md$/.test(f))) {
      const top = /^- \*\*(\d+\.\d+\.\d+)\*\*/m.exec(readFileSync(new URL(`${id}/${file}`, plugins), "utf8"))?.[1];
      if (top !== version) late.push(`${id}/${file}: ${top ?? "no changes"} (manifest ${version})`);
    }
  }
  expect(late).toEqual([]);
});
