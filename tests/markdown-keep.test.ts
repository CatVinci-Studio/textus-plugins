import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** What the rewriting plugins leave alone (shared/markdown-keep.js), and
 *  Text Tidy, CJK Spacing and Markdown Lint keeping to it. */
let keep: {
  mask: (line: string) => string;
  eachProseLine: (text: string, change: (line: string) => string) => string;
};
let spacing: { spaceDocument: (text: string) => string; spaceOut: (text: string) => string };
let tidy: { fullPunctuation: (line: string) => string; tidy: (text: string, rule: string) => string };

beforeAll(async () => {
  await import("../shared/markdown-keep.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.cjk-spacing/spacing.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.text-tidy/tidy.js");
  const g = globalThis as unknown as { markdownKeep: typeof keep; cjkSpacing: typeof spacing; textTidy: typeof tidy };
  keep = g.markdownKeep;
  spacing = g.cjkSpacing;
  tidy = g.textTidy;
});

const upper = (line: string) => line.toUpperCase();

describe("the shared list", () => {
  it("passes over indented code, HTML blocks and %% comment blocks", () => {
    const doc = "a\n\n    code a\n\n<div>\nhtml a\n</div>\n\n%%\nnote a\n%%\n\nb";
    expect(keep.eachProseLine(doc, upper)).toBe(
      "A\n\n    code a\n\n<div>\nhtml a\n</div>\n\n%%\nnote a\n%%\n\nB",
    );
  });

  it("reads a list's indented lines as the list's, not as code", () => {
    expect(keep.eachProseLine("- a\n\n    b", upper)).toBe("- A\n\n    B");
  });

  it("masks spans to the same length", () => {
    const line = "x (@2026-11-06) %%c%% #tag [[N]]";
    const masked = keep.mask(line);
    expect(masked).toHaveLength(line.length);
    expect(masked.startsWith("x ")).toBe(true);
    expect(masked.replace(/\0/g, "")).toBe("x    ");
  });
});

describe("CJK Spacing", () => {
  it("leaves indented code, HTML blocks and %% comments alone on save", () => {
    const doc = "用Textus\n\n    中文abc code\n\n<div>\n中文abc\n</div>\n\n%%私人批注abc%%";
    expect(spacing.spaceDocument(doc)).toBe(
      "用 Textus\n\n    中文abc code\n\n<div>\n中文abc\n</div>\n\n%%私人批注abc%%",
    );
  });

  it("changes only prose blocks when the save gives blocks", async () => {
    let willSave: (e: unknown) => Promise<unknown> = async () => undefined;
    loadPlugin("catvinci.cjk-spacing", {
      settings: { get: async () => true },
      files: { onWillSave: (fn: typeof willSave) => ((willSave = fn), { dispose() {} }) },
    });
    const text = "用Textus\r\n\r\n```\n用Textus\n```\n";
    const blocks = [
      { id: "b1", kind: "paragraph", markdown: "用Textus", from: 0, to: 7 },
      { id: "b2", kind: "code", markdown: "```\n用Textus\n```", from: 11, to: 26 },
    ];
    expect(await willSave({ path: "/a.md", text, trigger: "auto", blocks })).toEqual([
      { block: "b1", markdown: "用 Textus" },
    ]);
    expect(await willSave({ path: "/a.md", text: "用 Textus", blocks: [blocks[0]] })).toBeUndefined();
  });
});

describe("Text Tidy", () => {
  it("keeps a reminder's (@…) as written", () => {
    expect(tidy.fullPunctuation("- [ ] 交报告(@2026-11-06 09:00)")).toBe("- [ ] 交报告(@2026-11-06 09:00)");
  });

  it("turns brackets in pairs, and leaves an unpaired one", () => {
    expect(tidy.fullPunctuation("价格(USD)是100")).toBe("价格（USD）是100");
    expect(tidy.fullPunctuation("见(note)")).toBe("见（note）");
    expect(tidy.fullPunctuation("Use f(x) here")).toBe("Use f(x) here");
    expect(tidy.fullPunctuation("中文(未完")).toBe("中文(未完");
  });

  it("leaves %% comments and tags alone", () => {
    expect(tidy.fullPunctuation("好,%%a,b%% #标签,x")).toBe("好，%%a,b%% #标签,x");
  });
});

describe("Markdown Lint", () => {
  const lint = async (text: string, fix = false) =>
    loadPlugin("catvinci.markdown-lint").tools.get("lint_markdown")!({ text, fix });

  it("takes #tag for a tag, never a heading", async () => {
    const result = await lint("#project 下周 review\n", true);
    expect(result.issues).toEqual([]);
    expect(result.fixed).toBe("#project 下周 review\n");
  });

  it("keeps reference definitions and anchor links", async () => {
    expect((await lint("[d]: https://example.com/docs\n", true)).fixed).toBe("[d]: https://example.com/docs\n");
    expect((await lint("See [setup](#setup) below.\n")).issues).toEqual([]);
  });

  it("raises nothing inside a %% comment", async () => {
    expect((await lint("Text %%a  * b *%% end\n")).issues).toEqual([]);
  });
});
