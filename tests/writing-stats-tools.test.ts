import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Writing Stats' tool for Textus AI (plugins/catvinci.writing-stats/host.js). */
const files = {
  "Book/One.md": "# One\n\nHello there world.\n",
  "Book/Two.md": "你好世界\n",
  "Notes.md": "Just two.\n",
};
const metadata = {
  all: async () =>
    Object.keys(files).map((rel) => ({ path: "/root/" + rel, rel })),
};

describe("writing stats' tool", () => {
  const { tools } = loadPlugin("catvinci.writing-stats", {
    files: folder(files),
    metadata,
    editor: {
      getText: async () => "Three words here",
      getPath: async () => "/root/Draft.md",
    },
  });
  const count = (args: Record<string, unknown>) =>
    tools.get("count_words")!(args);

  it("counts a document, a folder, or the whole folder", async () => {
    expect(await count({ path: "Notes" })).toEqual({
      path: "Notes.md",
      documents: 1,
      words: 2,
      characters: 8,
      reading_minutes: 1,
    });
    expect(await count({ path: "Book" })).toMatchObject({
      path: "Book",
      documents: 2,
      words: 8,
    });
    expect(await count({ path: "" })).toMatchObject({
      path: "/",
      documents: 3,
      words: 10,
    });
    expect(await count({ path: "Nowhere" })).toHaveProperty("error");
  });

  it("counts the document in front when no path is given", async () => {
    expect(await count({})).toMatchObject({ path: "Draft.md", words: 3 });
  });
});

describe("writing stats' panel", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
  function panel(goal: unknown) {
    let text = "one two";
    let reads = 0;
    const on: Record<string, (e: Any) => void> = {};
    let view: Any = null;
    const storage = memoryStorage();
    const docs = folder(files);
    loadPlugin(
      "catvinci.writing-stats",
      {
        files: {
          ...docs,
          root: async () => "/root",
          readText: async (path: string) => (reads++, docs.readText(path)),
        },
        metadata: { ...metadata, onDidChange: (f: Any) => (on.meta = f) },
        settings: { get: async () => goal },
        editor: {
          getText: async () => text,
          getPath: async () => "/root/Draft.md",
          onDidChange: (f: Any) => (on.change = f),
        },
        views: {
          registerList: (_id: string, o: Any) =>
            (view = { ...o, refresh() {}, dispose() {} }),
        },
      },
      storage,
    );
    const settle = () => new Promise((r) => setTimeout(r, 10));
    return {
      type: async (next: string, source: string) => {
        text = next;
        on.change({ path: "/root/Draft.md", source });
        await settle();
      },
      written: async () => ((await storage.get("day")) as Any)?.words ?? 0,
      items: (parent?: Any) => view.items(parent),
      changed: (paths: string[]) => on.meta({ paths }),
      reads: () => reads,
      settle,
    };
  }

  it("adds only the user's own typing to today", async () => {
    const p = panel(500);
    await p.settle();
    await p.type("one two three four", "ai");
    await p.type("one two three four five six", "disk");
    expect(await p.written()).toBe(0);
    await p.type("one two three four five six seven", "user");
    expect(await p.written()).toBe(1);
  });

  it("takes a goal below zero as none", async () => {
    const rows = await panel(-5).items();
    const day = rows.find((r: Any) => r.id === "day:words");
    expect(day.badge).toBeUndefined();
    expect(rows.some((r: Any) => r.id === "day:streak")).toBe(false);
  });

  it("reads the folder's documents again only when they change", async () => {
    const p = panel(0);
    const words = async () =>
      (await p.items({ id: "folder" })).find(
        (r: Any) => r.id === "folder:words",
      ).description;
    expect(await words()).toBe("10");
    await words();
    expect(p.reads()).toBe(3);
    p.changed(["/root/Notes.md"]);
    expect(await words()).toBe("10");
    expect(p.reads()).toBe(4);
  });
});
