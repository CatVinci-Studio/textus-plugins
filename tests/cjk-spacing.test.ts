import { beforeAll, describe, expect, it } from "vitest";

/** CJK Spacing's rules (plugins/catvinci.cjk-spacing/spacing.js), a plain
 *  script that puts itself on the global object. */
let spacing: {
  spaceOut: (text: string) => string;
  spaceDocument: (text: string) => string;
};

beforeAll(async () => {
  const script = "../plugins/catvinci.cjk-spacing/spacing.js";
  await import(/* @vite-ignore */ script);
  spacing = (globalThis as unknown as { cjkSpacing: typeof spacing })
    .cjkSpacing;
});

describe("CJK spacing", () => {
  it("spaces Chinese and Japanese from Latin letters and digits", () => {
    expect(spacing.spaceOut("用Textus写作")).toBe("用 Textus 写作");
    expect(spacing.spaceOut("共3个，涨了50%的")).toBe("共 3 个，涨了 50% 的");
    expect(spacing.spaceOut("Textusで書く")).toBe("Textus で書く");
  });

  it("leaves what is spaced, Korean, and emphasis marks as they are", () => {
    expect(spacing.spaceOut("用 Textus 写作")).toBe("用 Textus 写作");
    expect(spacing.spaceOut("한국어English")).toBe("한국어English");
    expect(spacing.spaceOut("**中文**English")).toBe("**中文**English");
  });

  it("keeps code, math, link targets, HTML and addresses as written", () => {
    expect(spacing.spaceOut("见`a中b`和$x中y$")).toBe("见`a中b`和$x中y$");
    expect(spacing.spaceOut("[链接](https://例子.com/a中)")).toBe(
      "[链接](https://例子.com/a中)",
    );
    expect(spacing.spaceOut("<span title='a中'>x</span>")).toBe(
      "<span title='a中'>x</span>",
    );
  });

  it("leaves a document's front matter and fenced code alone", () => {
    const doc = "---\ntitle: 中文Title\n---\n\n用Textus\n\n```js\nconst a中 = 1\n```\n";
    expect(spacing.spaceDocument(doc)).toBe(
      "---\ntitle: 中文Title\n---\n\n用 Textus\n\n```js\nconst a中 = 1\n```\n",
    );
  });
});
