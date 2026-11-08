import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Heading Numbers draws no numbers over a document's own
 *  (plugins/catvinci.heading-numbers/host.js). */
type Block = { id: string; kind: string; markdown: string };

async function badges(text: string) {
  const blocks: Block[] = text
    .split(/\n\n/)
    .filter((part) => !part.startsWith("---"))
    .map((markdown, i) => ({
      id: "b" + i,
      kind: /^#/.test(markdown) ? "heading" : "paragraph",
      markdown,
    }));
  let provider: { decorate: (b: Block[]) => Promise<{ text: string }[]> } | null = null;
  loadPlugin("catvinci.heading-numbers", {
    editor: {
      getText: async () => text,
      getBlocks: async () => blocks,
      registerDecorations: (p: typeof provider) => ((provider = p), { dispose() {} }),
    },
  });
  return (await provider!.decorate(blocks)).map((d) => d.text);
}

it("numbers the headings of a plain document", async () => {
  expect(await badges("# Title\n\n## Intro\n\n### Data\n\n## Methods")).toEqual(["1", "1.1", "2"]);
});

it("draws none with number headings: off in the front matter", async () => {
  expect(await badges("---\nnumber headings: off\n---\n\n## Intro\n\n## Methods")).toEqual([]);
  expect(await badges('---\nnumber headings: "auto, off"\n---\n\n## Intro')).toEqual([]);
  expect(await badges("---\nnumber headings: auto, first-level 2\n---\n\n## Intro")).toEqual(["1"]);
});

it("draws none over headings already numbered", async () => {
  expect(await badges("## 1. Intro\n\n### Background\n\n## 2. Methods")).toEqual([]);
  expect(await badges("## 1.1 Intro\n\n## 1.2 Methods")).toEqual([]);
  expect(await badges("## 一、背景\n\n## 二、方法")).toEqual([]);
  expect(await badges("## 1 Intro\n\n## 2 Methods")).toEqual([]);
  // The heading's own words.
  expect(await badges("## 2026 plans\n\n## 7 Methods\n\n## Notes")).toEqual(["1", "2", "3"]);
});
