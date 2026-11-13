import { beforeAll, describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Images Follow Document (plugins/catvinci.image-folder). */
let rules: {
  relink: (text: string, forms: string[], to: string) => string;
  rebase: (text: string, from: string, to: string) => string;
  srcForms: (doc: string, path: string) => string[];
  shouldMove: (doc: string | null, path: string) => boolean;
  appPlaces: (rule: unknown, app: unknown) => boolean;
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
    const text =
      'a\r\n![x](assets/my%20pic.png "t")\n<img src="assets/my pic.png"> assets/my pic.png\r\n';
    const forms = rules.srcForms("/r/Note.md", "/r/assets/my pic.png");
    expect(rules.relink(text, forms, "Note.assets/my pic.png")).toBe(
      'a\r\n![x](Note.assets/my%20pic.png "t")\n<img src="Note.assets/my pic.png"> assets/my pic.png\r\n',
    );
  });

  it("rebase a folder's links, every other byte kept", () => {
    const text =
      "![a](./Old.assets/a.png)\r\n![b](<Old.assets/b c.png>)\nOld.assets/ stays\n";
    expect(rules.rebase(text, "Old.assets", "New name.assets")).toBe(
      "![a](./New name.assets/a.png)\r\n![b](<New name.assets/b c.png>)\nOld.assets/ stays\n",
    );
  });
});

function setup(
  files: Record<string, string>,
  doc: string,
  blockText: string,
  others: string[] = [],
  attachments: { value: string; app: string; root: string } | null = null,
  opts: { truncated?: boolean; docRule?: { value: string; app: string; root: string } } = {},
) {
  const f = folder(files);
  const edits: unknown[] = [];
  let created: ((e: { path: string }) => Promise<void>) | null = null;
  let renamed: ((e: { from: string; to: string }) => Promise<void>) | null =
    null;
  const rel = (p: string) => p.slice("/root/".length);
  let changed: (() => void) | null = null;
  const text = { now: blockText, reads: 0 };
  loadPlugin("catvinci.image-folder", {
    files: {
      ...f,
      stat: async (p: string) =>
        rel(p) in files ||
        Object.keys(files).some((k) => k.startsWith(rel(p) + "/"))
          ? { path: p }
          : null,
      rename: async (from: string, to: string) => {
        for (const k of Object.keys(files))
          if (k === rel(from) || k.startsWith(rel(from) + "/")) {
            files[rel(to) + k.slice(rel(from).length)] = files[k];
            delete files[k];
          }
      },
      conventions: async (p: string) => ({
        ...(await f.conventions()),
        attachments: p === doc && opts.docRule ? opts.docRule : attachments,
      }),
      onDidCreate: (fn: typeof created) => ((created = fn), { dispose() {} }),
      onDidRename: (fn: typeof renamed) => ((renamed = fn), { dispose() {} }),
    },
    editor: {
      getPath: async () => doc,
      getBlocks: async () => (
        text.reads++, [{ id: "b1", kind: "paragraph", markdown: text.now }]
      ),
      edit: async (changes: unknown[]) => void edits.push(...changes),
      onDidChange: (fn: () => void) => ((changed = fn), { dispose() {} }),
      onDidChangeActive: () => ({ dispose() {} }),
    },
    metadata: {
      search: async () => ({
        hits: others.map((p) => ({ path: p })),
        truncated: !!opts.truncated,
      }),
    },
  });
  return {
    create: (p: string) => created!({ path: p }),
    rename: (from: string, to: string) => renamed!({ from, to }),
    edits,
    text,
    change: () => changed!(),
  };
}

describe("the plugin", () => {
  it("moves a pasted picture into Note.assets and changes its link", async () => {
    const files: Record<string, string> = {
      "Notes/Note.md": "x",
      "Notes/assets/p.png": "PNG",
      "Notes/Note.assets/p.png": "older",
    };
    const { create, edits } = setup(
      files,
      "/root/Notes/Note.md",
      "See ![](assets/p.png).",
    );
    await create("/root/Notes/assets/p.png");
    expect(files["Notes/assets/p.png"]).toBeUndefined();
    expect(files["Notes/Note.assets/p.png"]).toBe("older");
    expect(files["Notes/Note.assets/p-1.png"]).toBe("PNG");
    expect(edits).toEqual([
      { action: "replace", block: "b1", text: "See ![](Note.assets/p-1.png)." },
    ]);
  });

  it("waits for the link without polling, one read for every picture", async () => {
    const files: Record<string, string> = { "Notes/Note.md": "x" };
    const names = Array.from({ length: 20 }, (_, i) => `p${i}.png`);
    for (const n of names) files[`Notes/assets/${n}`] = "PNG";
    const { create, edits, text, change } = setup(
      files,
      "/root/Notes/Note.md",
      "Nothing yet.",
    );
    const moved = Promise.all(names.map((n) => create(`/root/Notes/assets/${n}`)));
    await new Promise((r) => setTimeout(r, 400));
    const before = text.reads;
    expect(before).toBeLessThanOrEqual(3);
    text.now = names.map((n) => `![](assets/${n})`).join(" ");
    change();
    await moved;
    expect(text.reads - before).toBeLessThanOrEqual(2);
    expect(edits).toHaveLength(20);
  });

  it("renames the picture folder with its document, links kept byte for byte otherwise", async () => {
    const files: Record<string, string> = {
      "New.md": "# T\r\n![](Old.assets/a.png)\nOld.assets/ in words\n",
      "Old.assets/a.png": "PNG",
    };
    const { rename } = setup(files, "/root/New.md", "");
    await rename("/root/Old.md", "/root/New.md");
    expect(files["New.assets/a.png"]).toBe("PNG");
    expect(files["New.md"]).toBe(
      "# T\r\n![](New.assets/a.png)\nOld.assets/ in words\n",
    );
  });

  it("leaves the folder when another document links into it", async () => {
    const files: Record<string, string> = {
      "New.md": "![](Old.assets/a.png)",
      "Old.assets/a.png": "PNG",
    };
    const { rename } = setup(files, "/root/New.md", "", ["/root/Other.md"]);
    await rename("/root/Old.md", "/root/New.md");
    expect(files["Old.assets/a.png"]).toBe("PNG");
    expect(files["New.md"]).toBe("![](Old.assets/a.png)");
  });

  it("leaves the folder when the link search was cut short", async () => {
    const files: Record<string, string> = {
      "New.md": "![](Old.assets/a.png)",
      "Old.assets/a.png": "PNG",
    };
    const self = Array(20).fill("/root/New.md");
    const { rename } = setup(files, "/root/New.md", "", self, null, { truncated: true });
    await rename("/root/Old.md", "/root/New.md");
    expect(files["Old.assets/a.png"]).toBe("PNG");
  });
});

describe("in a folder whose app places pictures", () => {
  it("knows an Obsidian attachment setting and a Logseq graph", () => {
    const obsidian = { value: "/", app: "obsidian", root: "/r" };
    expect(rules.appPlaces(obsidian, { attachmentFolderPath: "Attachments" })).toBe(true);
    expect(rules.appPlaces(obsidian, {})).toBe(false);
    expect(rules.appPlaces({ value: "assets", app: "logseq", root: "/r" }, null)).toBe(true);
    expect(rules.appPlaces({ value: "./img", app: "typora", root: "/r" }, null)).toBe(true);
    expect(rules.appPlaces({ value: "./img", app: "textus", root: "/r" }, null)).toBe(false);
    expect(rules.appPlaces(null, null)).toBe(false);
  });

  it("leaves a pasted picture where Textus saved it", async () => {
    const files: Record<string, string> = {
      ".obsidian/app.json": JSON.stringify({ attachmentFolderPath: "./" }),
      "Notes/Note.md": "x",
      "Notes/p.png": "PNG",
    };
    const { create, edits } = setup(files, "/root/Notes/Note.md", "See ![](p.png).", [], {
      value: "./",
      app: "obsidian",
      root: "/root",
    });
    await create("/root/Notes/p.png");
    expect(files["Notes/p.png"]).toBe("PNG");
    expect(edits).toEqual([]);
  });

  it("still moves it in a vault without the setting", async () => {
    const files: Record<string, string> = {
      ".obsidian/app.json": "{}",
      "Notes/Note.md": "x",
      "Notes/p.png": "PNG",
    };
    const { create } = setup(files, "/root/Notes/Note.md", "See ![](p.png).", [], {
      value: "/",
      app: "obsidian",
      root: "/root",
    });
    await create("/root/Notes/p.png");
    expect(files["Notes/Note.assets/p.png"]).toBe("PNG");
  });

  it("leaves a picture where the document's Typora front matter put it", async () => {
    const files: Record<string, string> = {
      "Notes/Note.md": "---\ntypora-copy-images-to: img\n---\nx",
      "Notes/img/p.png": "PNG",
    };
    const { create, edits } = setup(files, "/root/Notes/Note.md", "See ![](img/p.png).", [], null, {
      docRule: { value: "./img", app: "typora", root: "/root/Notes" },
    });
    await create("/root/Notes/img/p.png");
    expect(files["Notes/img/p.png"]).toBe("PNG");
    expect(edits).toEqual([]);
  });
});
