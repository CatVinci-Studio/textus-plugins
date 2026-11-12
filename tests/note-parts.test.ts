import { beforeAll, describe, expect, it } from "vitest";

/** The parts of a note a link names (shared/note-parts.js), a plain script
 *  run before the hosts of Two-way Links and Quick Preview. */
type Block = {
  line: number;
  end: number;
  kind: string;
  markdown: string;
  id: string | null;
};
let parts: {
  body: (text: string) => string;
  blocksOf: (text: string) => Block[];
  block: (text: string, id: string) => Block | null;
  section: (
    text: string,
    name: string,
  ) => { heading: string; markdown: string } | null;
};

beforeAll(async () => {
  const script = "../shared/note-parts.js";
  await import(/* @vite-ignore */ script);
  parts = (globalThis as unknown as { noteParts: typeof parts }).noteParts;
});

const NOTE = [
  "---",
  "aliases: [N]",
  "---",
  "# Top ^top1",
  "",
  "First paragraph",
  "goes on here. ^para1",
  "",
  "- one",
  "- two ^item2",
  "  more of two",
  "- three",
  "",
  "| a | b |",
  "| - | - |",
  "| 1 | 2 |",
  "",
  "^tbl123",
  "",
  "> quoted",
  "> still",
  "",
  "^quote1",
  "",
  "```",
  "not ^code1",
  "```",
  "",
  "## Sub",
  "under sub",
  "# Next",
  "",
].join("\r\n");

describe("the parts of a note", () => {
  it("splits blocks as Obsidian reads them, with ids at a line's end or on a line after", () => {
    expect(parts.blocksOf(NOTE).map((b) => [b.line, b.kind, b.id])).toEqual([
      [3, "heading", "top1"],
      [5, "paragraph", "para1"],
      [8, "item", null],
      [9, "item", null],
      [11, "item", null],
      [13, "table", "tbl123"],
      [19, "quote", "quote1"],
      [24, "code", null],
      [28, "heading", null],
      [29, "paragraph", null],
      [30, "heading", null],
    ]);
  });

  it("finds a block by its id, without the id, ignoring case and a leading ^", () => {
    expect(parts.block(NOTE, "para1")!.markdown).toBe(
      "First paragraph\ngoes on here.",
    );
    expect(parts.block(NOTE, "^TBL123")!.markdown).toBe(
      "| a | b |\n| - | - |\n| 1 | 2 |",
    );
    expect(parts.block(NOTE, "quote1")!.markdown).toBe("> quoted\n> still");
    // "^code1" is code, not an id; an id nobody has finds nothing.
    expect(parts.block(NOTE, "code1")).toBeNull();
    expect(parts.block(NOTE, "nope")).toBeNull();
  });

  it("gives a list item its id from the end of its last line", () => {
    const text = "- one\n- two\n  more ^item2\n- three\n";
    expect(parts.block(text, "item2")).toMatchObject({
      line: 1,
      markdown: "- two\n  more",
    });
    // On the line right after an item, the id is that item's.
    expect(parts.block("- a\n- b\n^b1\n", "b1")).toMatchObject({
      line: 1,
      markdown: "- b",
    });
  });

  it("takes a heading's section to the next heading of its level or above", () => {
    expect(parts.section(NOTE, "sub")).toEqual({
      heading: "Sub",
      markdown: "## Sub\nunder sub",
    });
    expect(parts.section(NOTE, "Next")).toEqual({
      heading: "Next",
      markdown: "# Next",
    });
    expect(parts.section(NOTE, "Missing")).toBeNull();
    // Nested: the B under A, not the first B.
    const nested = "# X\n## B\nx's\n# A\n## B\na's";
    expect(parts.section(nested, "A#B")?.markdown).toBe("## B\na's");
    expect(parts.section(nested, "X#Missing")).toBeNull();
    // Ids are neither part of a heading's name nor shown; code keeps its text, and
    // "^item2" in the middle of an item is no id.
    const top = parts.section(NOTE, "Top")!.markdown;
    expect(
      top.startsWith(
        "# Top\n\nFirst paragraph\ngoes on here.\n\n- one\n- two ^item2\n",
      ),
    ).toBe(true);
    expect(top).not.toMatch(/\^(?:top1|para1|tbl123|quote1)/);
    expect(top).toContain("> still\n\n\n```\nnot ^code1\n```");
  });

  it("leaves the front matter out of the body", () => {
    expect(parts.body("---\na: 1\n---\nHello ^h1\n")).toBe("Hello");
    expect(parts.body("No front matter")).toBe("No front matter");
  });
});
