import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** What the rewriting plugins leave alone (shared/markdown-keep.js), and
 *  Tidy and CJK Spacing keeping to it. */
let keep: {
  mask: (line: string) => string;
  eachProseLine: (text: string, change: (line: string) => string) => string;
};
let spacing: { spaceDocument: (text: string) => string; spaceOut: (text: string) => string };
let tidy: { fullPunctuation: (line: string) => string; tidy: (text: string, rule: string) => string };

beforeAll(async () => {
  await import("../shared/markdown-keep.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.cjk-spacing/spacing.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.markdown-lint/tidy.js");
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

describe("Tidy's text rules", () => {
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

describe("Tidy's Markdown checks", () => {
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
    expect((await lint("%%\n*  draft\n%%\n")).issues).toEqual([]);
  });

  it("raises nothing inside a highlight, a field or front matter", async () => {
    expect((await lint("Text ==a  * b *== end\n")).issues).toEqual([]);
    expect((await lint("note:: a  * b *\n")).issues).toEqual([]);
    expect((await lint("Met [when:: a  * b *] today\n")).issues).toEqual([]);
  });
});

describe("Obsidian's syntax", () => {
  // Each would change under some rule if it weren't kept.
  const kept = [
    "---\ntags: a,b\n中文: abc,ＡＢ\n---",
    "^a1b2c3",
    "状态:: 进行中,好abc",
    "优先级:: 高,急ＡＢ",
    "[时间:: 10:00,周一]",
    "(地点:: 三楼,A座)",
    "==注意,这里ABC==",
    "📅 2026-11-07",
    "🔁 every week on Monday",
    "✅ 2026-11-08",
    "🆔 abc123",
    "⛔ def456,ghi789",
    "%%私人,批注abc%%",
    "`中文abc,`",
    "$中文x,y$",
    "$$\n中文abc,\n$$",
    "```\n中文abc,  \n```",
  ];
  const doc = [
    kept[0],
    "",
    "段落,文字abc " + kept[1],
    "",
    kept[2],
    "",
    "- [ ] " + kept[3],
    "",
    "会议" + kept[4] + "结束,好" + kept[5] + "完",
    "",
    "重点" + kept[6] + "完",
    "",
    "- [ ] 交报告 " + kept.slice(7, 12).join(" ") + " ⏫",
    "",
    "前面" + kept[12] + "后面" + kept[13] + "和" + kept[14],
    "",
    kept[15],
    "",
    kept[16],
    "",
  ].join("\n");

  const rewrites: [string, (text: string) => Promise<string> | string][] = [
    ...["fullPunctuation", "halfPunctuation", "halfLetters", "trimTrailing", "removeBlankLines"].map(
      (rule) => [rule, (text: string) => tidy.tidy(text, rule)] as [string, (text: string) => string],
    ),
    ["CJK Spacing", (text) => spacing.spaceDocument(text)],
    [
      "Fix Markdown",
      async (text) => (await loadPlugin("catvinci.markdown-lint").tools.get("lint_markdown")!({ text, fix: true })).fixed,
    ],
  ];

  for (const [name, rewrite] of rewrites)
    it(`${name} changes none of it`, async () => {
      const out = await rewrite(doc);
      for (const span of kept) expect(out).toContain(span);
    });

  it("is masked where it sits in a line", () => {
    expect(keep.mask("a ^id-1")).toBe("a " + "\0".repeat(5));
    expect(keep.mask("- k:: v")).toBe("- " + "\0".repeat(5));
    expect(keep.mask("a ==b== c")).toBe("a " + "\0".repeat(5) + " c");
    // Not a field, an id or a highlight.
    expect(keep.mask("a^b, x == y")).toBe("a^b, x == y");
    expect(keep.mask("Note: std::vector")).toBe("Note: std::vector");
  });
});
