import { beforeAll, describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Images Follow Document (plugins/catvinci.image-folder). */
let rules: {
  relink: (text: string, forms: string[], to: string) => string;
  rebase: (text: string, from: string, to: string) => string;
  srcForms: (doc: string, path: string) => string[];
  shouldMove: (doc: string | null, path: string) => boolean;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../plugins/catvinci.image-folder/folder.js");
  rules = (globalThis as unknown as { imageFolder: typeof rules }).imageFolder;
});

describe("the rules", () => {
  it("move a new picture under the document's folder, not one already in Note.assets", () => {
    expect(rules.shouldMove("/r/Note.md", "/r/assets/a.png")).toBe(true);
    expect(rules.shouldMove("/r/Note.md", "/r/Note.assets/a.png")).toBe(false);
    expect(rules.shouldMove("/r/Note.md", "/other/a.png")).toBe(false);
    expect(rules.shouldMove("/r/Note.md", "/r/assets/a.txt")).toBe(false);
    expect(rules.shouldMove(null, "/r/assets/a.png")).toBe(false);
  });

  it("change only the link targets, every other byte kept", () => {
    const text = "a\r\n![x](assets/my%20pic.png \"t\")\n<img src=\"assets/my pic.png\"> assets/my pic.png\r\n";
    const forms = rules.srcForms("/r/Note.md", "/r/assets/my pic.png");
    expect(rules.relink(text, forms, "Note.assets/my pic.png")).toBe(
      "a\r\n![x](Note.assets/my%20pic.png \"t\")\n<img src=\"Note.assets/my pic.png\"> assets/my pic.png\r\n",
    );
  });

  it("rebase a folder's links, every other byte kept", () => {
    const text = "![a](./Old.assets/a.png)\r\n![b](<Old.assets/b c.png>)\nOld.assets/ stays\n";
    expect(rules.rebase(text, "Old.assets", "New name.assets")).toBe(
      "![a](./New name.assets/a.png)\r\n![b](<New name.assets/b c.png>)\nOld.assets/ stays\n",
    );
  });
});

function setup(files: Record<string, string>, doc: string, blockText: string, others: string[] = []) {
  const f = folder(files);
  const edits: unknown[] = [];
  let created: ((e: { path: string }) => Promise<void>) | null = null;
  let renamed: ((e: { from: string; to: string }) => Promise<void>) | null = null;
  const rel = (p: string) => p.slice("/root/".length);
  loadPlugin("catvinci.image-folder", {
    files: {
      ...f,
      stat: async (p: string) =>
        rel(p) in files || Object.keys(files).some((k) => k.startsWith(rel(p) + "/")) ? { path: p } : null,
      rename: async (from: string, to: string) => {
        for (const k of Object.keys(files))
          if (k === rel(from) || k.startsWith(rel(from) + "/")) {
            files[rel(to) + k.slice(rel(from).length)] = files[k];
            delete files[k];
          }
      },
      onDidCreate: (fn: typeof created) => ((created = fn), { dispose() {} }),
      onDidRename: (fn: typeof renamed) => ((renamed = fn), { dispose() {} }),
    },
    editor: {
      getPath: async () => doc,
      getBlocks: async () => [{ id: "b1", kind: "paragraph", markdown: blockText }],
      edit: async (changes: unknown[]) => void edits.push(...changes),
    },
    metadata: { search: async () => ({ hits: others.map((p) => ({ path: p })) }) },
  });
  return { create: (p: string) => created!({ path: p }), rename: (from: string, to: string) => renamed!({ from, to }), edits };
}

describe("the plugin", () => {
  it("moves a pasted picture into Note.assets and changes its link", async () => {
    const files: Record<string, string> = { "Notes/Note.md": "x", "Notes/assets/p.png": "PNG", "Notes/Note.assets/p.png": "older" };
    const { create, edits } = setup(files, "/root/Notes/Note.md", "See ![](assets/p.png).");
    await create("/root/Notes/assets/p.png");
    expect(files["Notes/assets/p.png"]).toBeUndefined();
    expect(files["Notes/Note.assets/p.png"]).toBe("older");
    expect(files["Notes/Note.assets/p-1.png"]).toBe("PNG");
    expect(edits).toEqual([{ action: "replace", block: "b1", text: "See ![](Note.assets/p-1.png)." }]);
  });

  it("renames the picture folder with its document, links kept byte for byte otherwise", async () => {
    const files: Record<string, string> = {
      "New.md": "# T\r\n![](Old.assets/a.png)\nOld.assets/ in words\n",
      "Old.assets/a.png": "PNG",
    };
    const { rename } = setup(files, "/root/New.md", "");
    await rename("/root/Old.md", "/root/New.md");
    expect(files["New.assets/a.png"]).toBe("PNG");
    expect(files["New.md"]).toBe("# T\r\n![](New.assets/a.png)\nOld.assets/ in words\n");
  });

  it("leaves the folder when another document links into it", async () => {
    const files: Record<string, string> = { "New.md": "![](Old.assets/a.png)", "Old.assets/a.png": "PNG" };
    const { rename } = setup(files, "/root/New.md", "", ["/root/Other.md"]);
    await rename("/root/Old.md", "/root/New.md");
    expect(files["Old.assets/a.png"]).toBe("PNG");
    expect(files["New.md"]).toBe("![](Old.assets/a.png)");
  });
});
