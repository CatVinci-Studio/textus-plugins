import { beforeAll, describe, expect, it } from "vitest";

/** Writing Stats' counting (plugins/catvinci.writing-stats/count.js). */
let wc: {
  count: (markdown: string) => { words: number; characters: number; cjk: number };
  readingMinutes: (c: { words: number; cjk: number }) => number;
};

beforeAll(async () => {
  const script = "../plugins/catvinci.writing-stats/count.js";
  await import(/* @vite-ignore */ script);
  wc = (globalThis as unknown as { writingCount: typeof wc }).writingCount;
});

describe("counting", () => {
  it("counts words in Latin scripts and characters in CJK, without Markdown's marks", () => {
    const c = wc.count("---\ntitle: x\n---\n# Hello, world\n\n- [x] It's **done** [here](https://a.b/c)\n\n你好世界");
    // Hello, world, It's, done, here + 4 CJK characters.
    expect(c.words).toBe(9);
    expect(c.cjk).toBe(4);
  });

  it("gives at least a minute to read", () => {
    expect(wc.readingMinutes(wc.count("A few words."))).toBe(1);
    expect(wc.readingMinutes({ words: 2300, cjk: 0 })).toBe(10);
  });
});
