import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

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
