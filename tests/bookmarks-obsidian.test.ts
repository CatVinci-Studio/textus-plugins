import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Bookmarks lists an Obsidian vault's own bookmarks beside its own, read
 *  through Textus (files.appSettings), and never writes .obsidian
 *  (plugins/catvinci.bookmarks). */
function setup(files: Record<string, string>) {
  const commands = new Map<string, (...args: unknown[]) => Promise<unknown>>();
  let provider: { items: () => Promise<{ label: string; group: string }[]> } | null = null;
  const editor = {
    getPath: async () => "/root/Plan.md",
    getSelection: async () => ({ text: "Goals", markdown: null }),
    getBlocks: async () => [],
    edit: async () => true,
  };
  loadPlugin(
    "catvinci.bookmarks",
    {
      files: {
        ...folder(files),
        appSettings: async (_app: string, name: string) => {
          const text = files[".obsidian/" + name];
          return text ? JSON.parse(text) : null;
        },
      },
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
  return { commands, items: () => provider!.items() };
}

describe("in a vault", () => {
  it("lists Obsidian's bookmarks beside its own and writes none of them back", async () => {
    const vault = JSON.stringify({ items: [{ type: "file", ctime: 1, path: "Old.md" }] });
    const files: Record<string, string> = { ".obsidian/bookmarks.json": vault };
    const { commands, items } = setup(files);
    await commands.get("catvinci.bookmarks.add")!();
    expect((await items()).map((i) => i.group)).toEqual(["Plan.md", "obsidian"]);
    expect(files[".obsidian/bookmarks.json"]).toBe(vault);
  });

  it("lists only its own outside a vault", async () => {
    const { commands, items } = setup({});
    await commands.get("catvinci.bookmarks.add")!();
    expect((await items()).map((i) => i.label)).toEqual(["Goals"]);
  });
});
