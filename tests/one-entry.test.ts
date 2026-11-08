import { readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { manifestOf } from "./plugin-host";

/** Commands, by their English title, that only one plugin may offer. */
const titles = (match: RegExp) =>
  readdirSync(new URL("../plugins/", import.meta.url)).flatMap((id) => {
    const m = manifestOf(id);
    const l10n = m.l10n?.en ?? {};
    return (m.contributes?.commands ?? [])
      .map((c: { title: string }) =>
        c.title.replace(/^%(.*)%$/, (_: string, k: string) => l10n[k] ?? k),
      )
      .filter((title: string) => match.test(title))
      .map((title: string) => `${id}: ${title}`);
  });

it("has one Notion import, its own plugin's", () => {
  expect(titles(/^import.*notion/i)).toEqual([
    "catvinci.notion-import: Import from Notion…",
  ]);
});

it("has one place to tidy text and fix Markdown: Tidy", () => {
  expect(titles(/^(remove blank lines|join selected lines|fix markdown)$/i)).toEqual([
    "catvinci.markdown-lint: Fix Markdown",
    "catvinci.markdown-lint: Remove Blank Lines",
    "catvinci.markdown-lint: Join Selected Lines",
  ]);
});

it("has one way to write today's date: Quick Insert's @today", () => {
  expect(titles(/today's date/i)).toEqual([]);
});
