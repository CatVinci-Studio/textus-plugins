import { beforeAll, describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Bookmarks writes its bookmarks into an Obsidian vault's
 *  .obsidian/bookmarks.json too (plugins/catvinci.bookmarks). */
type Block = { id: string; kind: string; markdown: string };
let ob: {
  newId: (random?: () => number) => string;
  markFor: (
    blocks: Block[],
    selection: string,
    random?: () => number,
  ) => { block: Block; entry: { type: string; subpath: string }; markdown?: string } | null;
  withEntry: (text: string, entry: unknown) => string | null;
  withoutEntry: (text: string, ctime: number, path: string) => string;
  movedEntries: (text: string, ctimes: number[], from: string, to: string) => string;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../plugins/catvinci.bookmarks/obsidian.js");
  ob = (globalThis as unknown as { obsidianBookmarks: typeof ob }).obsidianBookmarks;
});

const zero = () => 0;

describe("an Obsidian bookmark for a selection", () => {
  const blocks: Block[] = [
    { id: "h", kind: "heading", markdown: "## Goals for [[Q1]] ##" },
    { id: "p", kind: "paragraph", markdown: "Ship the **first** draft." },
    { id: "q", kind: "paragraph", markdown: "Kept already ^abc123" },
    { id: "l", kind: "list", markdown: "- one\n- two ^x1\n- three" },
    { id: "t", kind: "table", markdown: "| a |\n| - |\n| b |" },
    { id: "c", kind: "code", markdown: "```\ncode\n```" },
    { id: "cid", kind: "paragraph", markdown: "^codeid" },
  ];

  it("is a heading's in a heading", () => {
    expect(ob.markFor(blocks, "Goals for Q1")!.entry).toEqual({ type: "heading", subpath: "#Goals for Q1" });
  });

  it("is a block's, a new id added at the paragraph's end", () => {
    expect(ob.markFor(blocks, "first draft", zero)).toMatchObject({
      entry: { type: "block", subpath: "#^aaaaaa" },
      markdown: "Ship the **first** draft. ^aaaaaa",
    });
    expect(ob.markFor(blocks, "Ship the **first**", zero)!.block.id).toBe("p");
  });

  it("keeps an id the block has", () => {
    const kept = ob.markFor(blocks, "Kept already");
    expect(kept!.entry.subpath).toBe("#^abc123");
    expect(kept!.markdown).toBeUndefined();
    expect(ob.markFor(blocks, "code")!.entry.subpath).toBe("#^codeid");
  });

  it("marks a list's item, or a table on a line of its own", () => {
    expect(ob.markFor(blocks, "three", zero)!.markdown).toBe("- one\n- two ^x1\n- three ^aaaaaa");
    expect(ob.markFor(blocks, "two")!.entry.subpath).toBe("#^x1");
    expect(ob.markFor(blocks, "| b |", zero)!.markdown).toBe("| a |\n| - |\n| b |\n\n^aaaaaa");
  });

  it("makes ids of six letters and digits", () => {
    expect(ob.newId()).toMatch(/^[a-z0-9]{6}$/);
    expect(ob.markFor(blocks, "not there")).toBeNull();
  });
});

describe("bookmarks.json", () => {
  const theirs = {
    items: [
      { type: "group", ctime: 1, title: "Work", items: [{ type: "file", ctime: 2, path: "A.md", extra: true }] },
      { type: "search", ctime: 3, query: "x" },
    ],
    other: { kept: 1 },
  };

  it("takes a new entry at the end, Obsidian's own kept as they were", () => {
    const text = ob.withEntry(JSON.stringify(theirs), { type: "block", ctime: 9, path: "B.md", subpath: "#^aaaaaa" });
    expect(JSON.parse(text!)).toEqual({
      items: [...theirs.items, { type: "block", ctime: 9, path: "B.md", subpath: "#^aaaaaa" }],
      other: { kept: 1 },
    });
    expect(JSON.parse(ob.withEntry("", { type: "file" })!)).toEqual({ items: [{ type: "file" }] });
    expect(ob.withEntry("{oops", {})).toBeNull();
  });

  it("loses an entry removed, wherever it is, and follows a rename of ours", () => {
    const text = JSON.stringify(theirs);
    expect(JSON.parse(ob.withoutEntry(text, 2, "A.md")).items[0].items).toEqual([]);
    expect(ob.withoutEntry(text, 7, "A.md")).toBe(text);
    expect(JSON.parse(ob.movedEntries(text, [2], "A.md", "Z/A.md")).items[0].items[0]).toEqual({
      type: "file",
      ctime: 2,
      path: "Z/A.md",
      extra: true,
    });
    expect(ob.movedEntries(text, [5], "A.md", "Z/A.md")).toBe(text);
  });
});

describe("in a vault", () => {
  function setup(files: Record<string, string>, blocks: Block[], selection: string) {
    const commands = new Map<string, (...args: unknown[]) => Promise<unknown>>();
    const edits: unknown[] = [];
    let provider: { items: () => Promise<{ label: string; group: string }[]> } | null = null;
    const editor = {
      getPath: async () => "/root/Plan.md",
      getSelection: async () => ({ text: selection, markdown: null }),
      getBlocks: async () => blocks,
      edit: async (change: unknown) => (edits.push(change), true),
    };
    loadPlugin(
      "catvinci.bookmarks",
      {
        files: folder(files),
        commands: {
          register: (id: string, run: () => Promise<unknown>) => (commands.set(id, run), { dispose() {} }),
          registerEditorCommand: (id: string, run: (e: unknown) => Promise<unknown>) => (
            commands.set(id, () => run(editor)),
            { dispose() {} }
          ),
        },
        views: {
          registerList: (_: string, p: typeof provider) => ((provider = p), { refresh() {}, dispose() {} }),
        },
        l10n: { t: (k: string) => k },
      },
      memoryStorage(),
    );
    return { commands, edits, items: () => provider!.items() };
  }

  it("writes a block bookmark with its new ^id, and removes it again", async () => {
    const files: Record<string, string> = {
      ".obsidian/bookmarks.json": JSON.stringify({ items: [{ type: "file", ctime: 1, path: "Old.md" }] }),
    };
    const { commands, edits, items } = setup(
      files,
      [{ id: "b1", kind: "paragraph", markdown: "The deadline is Friday." }],
      "deadline",
    );
    await commands.get("catvinci.bookmarks.add")!();
    expect(edits).toEqual([
      { action: "replace", block: "b1", text: expect.stringMatching(/^The deadline is Friday\. \^[a-z0-9]{6}$/) },
    ]);
    const id = (edits[0] as { text: string }).text.slice(-6);
    const saved = JSON.parse(files[".obsidian/bookmarks.json"]);
    expect(saved.items).toEqual([
      { type: "file", ctime: 1, path: "Old.md" },
      { type: "block", ctime: expect.any(Number), path: "Plan.md", subpath: "#^" + id },
    ]);
    // Listed once, as Textus's own.
    expect((await items()).map((i) => i.group)).toEqual(["Plan.md", "obsidian"]);
    const mark = (await items())[0] as unknown as { actions: { args: unknown[] }[] };
    await commands.get("catvinci.bookmarks.remove")!(...mark.actions[0].args);
    expect(JSON.parse(files[".obsidian/bookmarks.json"])).toEqual({ items: [{ type: "file", ctime: 1, path: "Old.md" }] });
  });

  it("writes a heading bookmark, making the file when there is none", async () => {
    const files: Record<string, string> = { ".obsidian/app.json": "{}" };
    const { commands, edits } = setup(files, [{ id: "h", kind: "heading", markdown: "# Goals" }], "Goals");
    await commands.get("catvinci.bookmarks.add")!();
    expect(edits).toEqual([]);
    expect(JSON.parse(files[".obsidian/bookmarks.json"]).items).toEqual([
      { type: "heading", ctime: expect.any(Number), path: "Plan.md", subpath: "#Goals" },
    ]);
  });

  it("writes nothing outside a vault", async () => {
    const files: Record<string, string> = {};
    const { commands, edits, items } = setup(files, [{ id: "h", kind: "heading", markdown: "# Goals" }], "Goals");
    await commands.get("catvinci.bookmarks.add")!();
    expect(Object.keys(files)).toEqual([]);
    expect(edits).toEqual([]);
    expect((await items()).map((i) => i.label)).toEqual(["Goals"]);
  });
});
