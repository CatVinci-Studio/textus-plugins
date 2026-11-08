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
        ],
        all: async () => [
          {
            title: "Beta",
            rel: "Beta.md",
            path: "/root/Beta.md",
            tags: ["project"],
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
      ["#project", "4"],
      ["#idea", "3"],
    ]);
    const under = await provider.items(top[0]);
    expect(under.map((n) => n.label)).toEqual(["#alpha", "Beta"]);
    expect((await provider.items(under[0])).map((n) => n.label)).toEqual([
      "#x",
    ]);
  });
});
