import { beforeAll, describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Names in natural order (shared/name-order.js) and where they are sorted. */
let compareNames: (a: unknown, b: unknown, locale?: string) => number;
let pages: { tree: (docs: { rel: string }[]) => { name: string }[] };
let bexpr: {
  compile: (s: string) => (ctx: unknown) => unknown;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/name-order.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.database/pages.js");
  await import(/* @vite-ignore */ "../shared/expr.js");
  const g = globalThis as unknown as {
    nameOrder: { compareNames: typeof compareNames };
    pages: typeof pages;
    bexpr: typeof bexpr;
  };
  compareNames = g.nameOrder.compareNames;
  pages = g.pages;
  bexpr = g.bexpr;
});

describe("compareNames", () => {
  it("puts numbers in order by value, case aside, and keeps one order", () => {
    const names = ["Week10", "week3", "Week2", "Week1", "a", "A", "Ä"];
    expect(names.slice().sort((a, b) => compareNames(a, b))).toEqual([
      "A",
      "a",
      "Ä",
      "Week1",
      "Week2",
      "week3",
      "Week10",
    ]);
    expect(compareNames("x", "x")).toBe(0);
    expect(compareNames(null, "a")).toBeLessThan(0);
    expect(compareNames("b", "a", "not a locale!")).toBeGreaterThan(0);
  });
});

describe("sorted for display", () => {
  it("Workspace's page tree", () => {
    const tree = pages.tree([
      { rel: "Week10.md" },
      { rel: "Week2.md" },
      { rel: "Week1.md" },
    ]);
    expect(tree.map((n) => n.name)).toEqual(["Week1", "Week2", "Week10"]);
  });

  it("Bases' sort() of strings", () => {
    const sorted = bexpr.compile('["Week10", "Week2", "Week1"].sort()')({
      file: {},
    });
    expect(sorted).toEqual(["Week1", "Week2", "Week10"]);
  });

  it("the templates list", async () => {
    const files = {
      "Templates/Week10.md": "",
      "Templates/Week2.md": "",
      "Note.md": "",
    };
    const storage = memoryStorage();
    await storage.set("movedToFolder", true);
    const { tools } = loadPlugin("catvinci.templates", { files: folder(files) }, storage);
    const listed = await tools.get("list_templates")!({});
    expect(JSON.stringify(listed).indexOf("Week2")).toBeLessThan(
      JSON.stringify(listed).indexOf("Week10"),
    );
  });

  it("tags with the same count, and the graph's neighbours", async () => {
    const { tools } = loadPlugin("catvinci.tags", {
      files: { root: async () => "/root" },
      metadata: {
        tags: async () => [
          { tag: "v10", count: 1 },
          { tag: "v2", count: 1 },
          { tag: "top", count: 5 },
        ],
      },
    });
    expect((await tools.get("list_tags")!({})).tags.map((t: { tag: string }) => t.tag)).toEqual([
      "top",
      "v2",
      "v10",
    ]);
    const doc = (rel: string, links: string[] = []) => ({
      path: "/root/" + rel,
      rel,
      title: rel,
      frontmatter: {},
      headings: [],
      tags: [],
      tasks: [],
      modifiedMs: 0,
      links: links.map((l) => ({ target: l, resolved: "/root/" + l, line: 0, text: "" })),
    });
    const graph = loadPlugin("catvinci.graph", {
      files: { root: async () => "/root" },
      metadata: {
        all: async () => [doc("Hub.md", ["Week10.md", "Week2.md"]), doc("Week10.md"), doc("Week2.md")],
      },
    });
    const near = await graph.tools.get("list_neighbours")!({ path: "Hub.md" });
    expect(near.notes.map((n: { name: string }) => n.name)).toEqual(["Week2", "Week10"]);
  });
});

it("Zotero's references, by author then year", async () => {
  const item = (key: string, name: string) => ({
    key,
    data: { title: key, date: "2020", creators: [{ name }], extra: "Citation Key: " + key },
  });
  const library = [item("ten", "Working Group 10"), item("nine", "Working Group 9")];
  const commands = new Map<string, () => Promise<void>>();
  const edits: { text: string }[] = [];
  loadPlugin("catvinci.zotero", {
    net: { fetch: async () => ({ ok: true, json: async () => library }) },
    settings: { get: async () => "pandoc" },
    commands: {
      register: (id: string, run: () => Promise<void>) => (commands.set(id, run), { dispose() {} }),
    },
    editor: {
      getText: async () => "[@ten] and [@nine]",
      getBlocks: async () => [],
      edit: async (change: { text: string }) => (edits.push(change), true),
    },
  });
  await commands.get("catvinci.zotero.bibliography")!();
  expect(edits[0].text.indexOf("Group 9")).toBeLessThan(edits[0].text.indexOf("Group 10"));
});
