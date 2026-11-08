import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Zotero's literature notes and [[@citekey]] citations
 *  (plugins/catvinci.zotero/host.js). */
const ITEM = {
  key: "ABCD1234",
  data: {
    title: "Attention: Is All You Need",
    itemType: "journalArticle",
    date: "2017-06-12",
    abstractNote: "The dominant sequence models...",
    url: "https://arxiv.org/abs/1706.03762",
    creators: [
      { creatorType: "author", firstName: "Ashish", lastName: "Vaswani" },
      { creatorType: "author", firstName: "Noam", lastName: "Shazeer" },
    ],
    extra: "Citation Key: vaswani2017",
  },
};

const CHILDREN: Record<string, unknown[]> = {
  ABCD1234: [
    { key: "N1", data: { itemType: "note", note: "<p>Read <b>twice</b> &amp; cite.</p>" } },
    { key: "PDF1", data: { itemType: "attachment", contentType: "application/pdf" } },
  ],
  PDF1: [
    {
      key: "A1",
      data: {
        itemType: "annotation",
        annotationType: "highlight",
        annotationText: "Attention is all you need.",
        annotationComment: "The main claim",
        annotationPageLabel: "1",
      },
    },
  ],
};

function setup(files: Record<string, string>, settings: Record<string, string> = {}) {
  const commands = new Map<string, () => Promise<unknown>>();
  const opened: unknown[][] = [];
  const inserted: string[] = [];
  const asked: string[] = [];
  const fs = folder(files);
  loadPlugin("catvinci.zotero", {
    files: fs,
    settings: { get: async (key: string) => settings[key] },
    net: {
      fetch: async (url: string) => {
        const child = /items\/(\w+)\/children/.exec(url);
        return { ok: true, json: async () => (child ? CHILDREN[child[1]] || [] : [ITEM]) };
      },
    },
    editor: {
      getSelection: async () => null,
      insertText: async (text: string) => void inserted.push(text),
    },
    ui: {
      input: async () => "attention",
      pick: async () => "ABCD1234",
      message: async () => {},
      confirm: async (text: string) => (asked.push(text), true),
    },
    layout: { open: async (...args: unknown[]) => void opened.push(args) },
    commands: {
      register: (id: string, run: () => Promise<unknown>) => (
        commands.set(id, run),
        { dispose() {} }
      ),
    },
  });
  return { run: (id: string) => commands.get(id)!(), opened, inserted, asked, files };
}

describe("a literature note", () => {
  it("is made as References/@citekey.md from the item, its highlights and notes, and opened in a tab", async () => {
    const z = setup({ "Paper.md": "" });
    await z.run("catvinci.zotero.note");
    expect(z.files["References/@vaswani2017.md"]).toBe(
      [
        "---",
        'title: "Attention: Is All You Need"',
        'authors: ["Ashish Vaswani","Noam Shazeer"]',
        "year: 2017",
        'citekey: "vaswani2017"',
        'url: "https://arxiv.org/abs/1706.03762"',
        'zotero: "zotero://select/library/items/ABCD1234"',
        "---",
        "",
        "# Attention: Is All You Need",
        "",
        "Ashish Vaswani, Noam Shazeer · 2017",
        "",
        "## abstract",
        "",
        "The dominant sequence models...",
        "",
        "## highlights",
        "",
        "- Attention is all you need. (p. 1)",
        "  - The main claim",
        "",
        "## notes",
        "",
        "Read twice & cite.",
        "",
      ].join("\n"),
    );
    expect(z.opened).toEqual([["/root/References/@vaswani2017.md"]]);
  });

  it("that is there already is opened, not written over", async () => {
    const z = setup({ "References/@vaswani2017.md": "mine" });
    await z.run("catvinci.zotero.note");
    expect(z.files["References/@vaswani2017.md"]).toBe("mine");
    expect(z.opened).toEqual([["/root/References/@vaswani2017.md"]]);
  });

  it("follows the template file the settings name, with dates in their format", async () => {
    const z = setup(
      { "Templates/Lit.md": "# {{title}}\n{{citekey}} {{date:YYYY}} {{year:YY}}\n{{highlights}}" },
      { notesFolder: "Reading", noteTemplate: "Templates/Lit" },
    );
    await z.run("catvinci.zotero.note");
    expect(z.files["Reading/@vaswani2017.md"]).toBe(
      "# Attention: Is All You Need\nvaswani2017 " +
        new Date().getFullYear() +
        " 17\n- Attention is all you need. (p. 1)\n  - The main claim",
    );
  });

  it("follows an Obsidian vault's Citations settings", async () => {
    const citations = {
      literatureNoteFolder: "Lit notes",
      literatureNoteContentTemplate: "---\ntitle: {{title}}\n---\n{{authorString}}, {{year}}",
    };
    const z = setup({
      ".obsidian/app.json": "{}",
      ".obsidian/plugins/obsidian-citation-plugin/data.json": JSON.stringify(citations),
    });
    await z.run("catvinci.zotero.note");
    expect(z.files["Lit notes/@vaswani2017.md"]).toBe(
      '---\ntitle: "Attention: Is All You Need"\n---\nAshish Vaswani, Noam Shazeer, 2017',
    );
  });

  it("follows Zotero Integration's folder and template", async () => {
    const integration = {
      exportFormats: [
        { outputPathTemplate: "Sources/{{citekey}}.md", templatePath: "Templates/Zotero.md" },
      ],
    };
    const z = setup({
      ".obsidian/plugins/obsidian-zotero-desktop-connector/data.json": JSON.stringify(integration),
      "Templates/Zotero.md": "{{title}} [{{DOI}}]",
    });
    await z.run("catvinci.zotero.note");
    expect(z.files["Sources/@vaswani2017.md"]).toBe("Attention: Is All You Need []");
  });
});

describe("a [[@citekey]] citation", () => {
  it("is written in the Obsidian style and offers the note it links to", async () => {
    const z = setup({}, { style: "wiki" });
    await z.run("catvinci.zotero.cite");
    expect(z.inserted).toEqual(["[[@vaswani2017]]"]);
    expect(z.asked).toEqual(["offerNote @vaswani2017"]);
    expect(z.files["References/@vaswani2017.md"]).toContain("# Attention: Is All You Need");
    expect(z.opened).toEqual([["/root/References/@vaswani2017.md"]]);
  });

  it("offers no note that is there already", async () => {
    const z = setup({ "References/@vaswani2017.md": "mine" }, { style: "wiki" });
    await z.run("catvinci.zotero.cite");
    expect(z.inserted).toEqual(["[[@vaswani2017]]"]);
    expect(z.asked).toEqual([]);
    expect(z.opened).toEqual([]);
  });
});
