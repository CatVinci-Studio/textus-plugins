import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Tags' tools for Textus AI (plugins/catvinci.tags/host.js). */
const metadata = {
  tags: async () => [{ tag: "idea", count: 1 }, { tag: "project", count: 3 }],
  all: async () => [
    { title: "Alpha", rel: "Alpha.md", tags: ["project/alpha"] },
    { title: "Beta", rel: "Work/Beta.md", tags: ["project", "idea"] },
    { title: "Home", rel: "Home.md", tags: ["projects"] },
  ],
};

describe("tags' tools", () => {
  const { tools } = loadPlugin("catvinci.tags", { files: { root: async () => "/root" }, metadata });

  it("list the tags, the most used first", async () => {
    expect(await tools.get("list_tags")!({})).toEqual({
      tags: [{ tag: "project", count: 3 }, { tag: "idea", count: 1 }],
    });
  });

  it("find the notes with a tag or one nested in it", async () => {
    const found = await tools.get("notes_with_tag")!({ tag: "#project" });
    expect(found.notes.map((n: { path: string }) => n.path)).toEqual(["Alpha.md", "Work/Beta.md"]);
  });
});
