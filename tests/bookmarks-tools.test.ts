import { expect, it } from "vitest";
import { loadPlugin, memoryStorage } from "./plugin-host";

/** Bookmarks' tool for Textus AI (plugins/catvinci.bookmarks/host.js). */
it("lists the bookmarks, documents by their path in the folder", async () => {
  const storage = memoryStorage();
  await storage.set("bookmarks", [
    { id: 1, path: "/root/Work/Plan.md", text: "the deadline" },
    { id: 2, path: "/elsewhere/Notes.md", text: "a quote" },
  ]);
  const { tools } = loadPlugin("catvinci.bookmarks", { files: { root: async () => "/root" } }, storage);
  expect(await tools.get("list_bookmarks")!({})).toEqual({
    bookmarks: [
      { text: "the deadline", path: "Work/Plan.md" },
      { text: "a quote", path: "/elsewhere/Notes.md" },
    ],
  });
});
