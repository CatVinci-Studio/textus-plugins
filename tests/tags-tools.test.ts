import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Tags' tools for Textus AI (plugins/catvinci.tags/host.js). */
const metadata = {
  tags: async () => [
    { tag: "idea", count: 1 },
    { tag: "project", count: 3 },
  ],
  all: async () => [
    { title: "Alpha", rel: "Alpha.md", tags: ["project/alpha"] },
    { title: "Beta", rel: "Work/Beta.md", tags: ["project", "idea"] },
    { title: "Home", rel: "Home.md", tags: ["projects"] },
    { title: "Gamma", rel: "Gamma.md", tags: ["Project"] },
  ],
};

describe("tags' tools", () => {
  const { tools } = loadPlugin("catvinci.tags", {
    files: { root: async () => "/root" },
    metadata,
  });

  it("list the tags, the most used first", async () => {
    expect(await tools.get("list_tags")!({})).toEqual({
      tags: [
        { tag: "project", count: 3 },
        { tag: "idea", count: 1 },
      ],
    });
  });

  it("find the notes with a tag or one nested in it", async () => {
    const found = await tools.get("notes_with_tag")!({ tag: "#project" });
    expect(found.notes.map((n: { path: string }) => n.path)).toEqual([
      "Alpha.md",
      "Work/Beta.md",
      "Gamma.md",
    ]);
  });
});

describe("the Tags panel", () => {
  it("draws nested tags as a tree, each counting its sub-tags' notes", async () => {
    let provider: {
      items: (
        parent?: unknown,
      ) => Promise<{ label: string; description?: string; data?: unknown }[]>;
    } = {
      items: async () => [],
    };
    loadPlugin("catvinci.tags", {
      files: { root: async () => "/root" },
      metadata: {
        tags: async () => [
          { tag: "project", count: 1 },
          { tag: "project/alpha", count: 2 },
          { tag: "project/alpha/x", count: 1 },
          { tag: "idea", count: 3 },
          { tag: "Project/Alpha", count: 1 },
        ],
        all: async () => [
          {
            title: "Beta",
            rel: "Beta.md",
            path: "/root/Beta.md",
            tags: ["project"],
          },
          {
            title: "Gamma",
            rel: "Gamma.md",
            path: "/root/Gamma.md",
            tags: ["Project"],
          },
        ],
      },
      views: {
        registerList: (_: string, p: typeof provider) => (
          (provider = p),
          { refresh() {}, setMessage() {}, dispose() {} }
        ),
      },
    });
    const top = await provider.items();
    expect(top.map((n) => [n.label, n.description])).toEqual([
      ["#project", "5"],
      ["#idea", "3"],
    ]);
    const under = await provider.items(top[0]);
    expect(under.map((n) => [n.label, n.description])).toEqual([
      ["#alpha", "4"],
      ["Beta", undefined],
      ["Gamma", undefined],
    ]);
    expect((await provider.items(under[0])).map((n) => n.label)).toEqual([
      "#x",
    ]);
  });
});

describe("renaming a tag from the panel", () => {
  it("renames every letter case and the nested tags, in their notes", async () => {
    const texts: Record<string, string> = {
      "/root/A.md": "#Project/alpha",
      "/root/B.md": "#project",
      "/root/C.md": "#projects",
    };
    let rename: (tag: string) => Promise<unknown> = async () => {};
    const notices: string[] = [];
    loadPlugin("catvinci.tags", {
      files: {
        root: async () => "/root",
        process: async (path: string, edit: (t: string) => string) =>
          void (texts[path] = edit(texts[path])),
      },
      metadata: {
        all: async () => [
          { path: "/root/A.md", tags: ["Project/alpha"] },
          { path: "/root/B.md", tags: ["project"] },
          { path: "/root/C.md", tags: ["projects"] },
        ],
      },
      ui: { input: async () => "work", notice: (m: string) => void notices.push(m) },
      commands: {
        register: (id: string, run: typeof rename) => (
          id === "catvinci.tags.rename" && (rename = run),
          { dispose() {} }
        ),
      },
    });
    await rename("project");
    expect(texts).toEqual({
      "/root/A.md": "#work/alpha",
      "/root/B.md": "#work",
      "/root/C.md": "#projects",
    });
    expect(notices).toEqual(["renamed #project #work 2"]);
  });
});
