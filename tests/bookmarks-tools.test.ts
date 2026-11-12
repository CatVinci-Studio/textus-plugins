import { expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Bookmarks' tool for Textus AI (plugins/catvinci.bookmarks/host.js). */
it("lists the bookmarks, documents by their path in the folder", async () => {
  const storage = memoryStorage();
  await storage.set("bookmarks", [
    { id: 1, path: "/root/Work/Plan.md", text: "the deadline" },
    { id: 2, path: "/elsewhere/Notes.md", text: "a quote" },
  ]);
  const { tools } = loadPlugin(
    "catvinci.bookmarks",
    { files: { root: async () => "/root" } },
    storage,
  );
  expect(await tools.get("list_bookmarks")!({})).toEqual({
    bookmarks: [
      { text: "the deadline", path: "Work/Plan.md" },
      { text: "a quote", path: "/elsewhere/Notes.md" },
    ],
  });
});

it("lists Obsidian's own bookmarks of notes, headings and blocks in a vault", async () => {
  let provider: {
    items: () => Promise<{ label: string; group: string; location: unknown }[]>;
  } = { items: async () => [] };
  const files: Record<string, string> = {
    ".obsidian/bookmarks.json": JSON.stringify({
      items: [
        { type: "file", path: "Plans.md" },
        {
          type: "group",
          title: "Work",
          items: [
            { type: "heading", path: "Work/Q1.md", subpath: "#Goals" },
            { type: "search", query: "x" },
          ],
        },
        { type: "block", path: "Log.md", subpath: "#^abc", title: "That line" },
      ],
    }),
  };
  loadPlugin(
    "catvinci.bookmarks",
    {
      files: { ...folder(files) },
      views: {
        registerList: (_: string, p: typeof provider) => (
          (provider = p),
          { refresh() {}, dispose() {} }
        ),
      },
      l10n: { t: (k: string) => k },
    },
    memoryStorage(),
  );
  const marks = await provider.items();
  expect(marks.map((m) => [m.label, m.group, m.location])).toEqual([
    ["Plans", "obsidian", { path: "/root/Plans.md" }],
    [
      "Q1 › Goals",
      "obsidian › Work",
      { path: "/root/Work/Q1.md", heading: "Goals" },
    ],
    ["That line", "obsidian", { path: "/root/Log.md", block: "abc" }],
  ]);
});

type Row = { label: string; group: string; detail?: string };
function listOf(storage: ReturnType<typeof memoryStorage>, api: Record<string, unknown> = {}) {
  let provider = { items: async (): Promise<Row[]> => [] };
  const commands = new Map<string, (...a: unknown[]) => Promise<unknown>>();
  loadPlugin(
    "catvinci.bookmarks",
    {
      files: { root: async () => "/root" },
      views: {
        registerList: (_: string, p: typeof provider) => ((provider = p), { refresh() {}, dispose() {} }),
      },
      commands: {
        register: (id: string, run: never) => (commands.set(id, run), { dispose() {} }),
        registerEditorCommand: (id: string, run: never) => (commands.set(id, run), { dispose() {} }),
      },
      ...api,
    },
    storage,
  );
  return { items: () => provider.items(), commands };
}

it("lists one group per document, by its path in the folder, words cut at a word", async () => {
  const storage = memoryStorage();
  const long = "word ".repeat(30).trim();
  await storage.set("bookmarks", [
    { id: 1, path: "/root/b/A.md", text: "one" },
    { id: 2, path: "/root/a/A.md", text: "two" },
    { id: 3, path: "/root/b/A.md", text: long.slice(0, 120), cut: true },
  ]);
  const rows = await listOf(storage).items();
  expect(rows.map((r) => [r.group, r.label, r.detail])).toEqual([
    ["a/A.md", "two", undefined],
    ["b/A.md", "one", undefined],
    ["b/A.md", long.slice(0, 119) + "…", undefined],
  ]);
});
