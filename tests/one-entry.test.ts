import { readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { manifestOf } from "./plugin-host";

/** Commands, by their English title, that only one plugin may offer. */
const titles = (match: RegExp) =>
  readdirSync(new URL("../plugins/", import.meta.url)).flatMap((id) => {
    const m = manifestOf(id);
    const l10n = m.l10n?.en ?? {};
    return (m.contributes?.commands ?? [])
      .map((c: { title: string }) => c.title.replace(/^%(.*)%$/, (_: string, k: string) => l10n[k] ?? k))
      .filter((title: string) => match.test(title))
      .map((title: string) => `${id}: ${title}`);
  });

it("has one Notion import, in Notion Import", () => {
  expect(titles(/^import.*notion/i)).toEqual(["catvinci.notion-import: Import from Notion…"]);
});
