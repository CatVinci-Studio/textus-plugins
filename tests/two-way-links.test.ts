import { describe, expect, it } from "vitest";
import { folder, loadPlugin, manifestOf } from "./plugin-host";

/** Two-way Links' [[ completion, embeds and mention links
 *  (plugins/catvinci.backlinks), against fakes of the 1.2 API. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type Item = {
  label: string;
  insert: string;
  detail?: string;
  icon?: string;
  replaceAfter?: number;
  command?: { id: string; args: unknown[] };
};
type Provide = (
  ctx: Record<string, unknown>,
) => Promise<{ items: Item[]; complete: true } | null>;

const stem = (path: string) => path.split("/").pop()!.replace(/\.md$/, "");

/** linkTo as Textus 1.3.9 writes a wiki link; this fake leaves the folder's
 *  link format to the core. */
function linkTo(to: string, _from: string, o: Any = {}) {
  const part =
    (o.heading ? "#" + o.heading : "") + (o.block ? "#^" + o.block : "");
  return `${o.embed ? "!" : ""}[[${stem(to)}${part}${o.alias ? "|" + o.alias : ""}]]`;
}

function plugin(files: Record<string, string>, docs: Any[]) {
  const completions = new Map<string, Provide>();
  const commands = new Map<string, (...args: Any[]) => Promise<unknown>>();
  let embed: Any = null;
  const inserted: string[] = [];
  const asked: Any[] = [];
  const fs = folder(files);
  const api = {
    files: {
      ...fs,
      // Textus adds an id where Obsidian reads it; the fake, at the line's end.
      blockId: async (path: string, line: number) => {
        await fs.process(path, (text: string) => {
          const lines = text.split("\n");
          lines[line] += " ^ab12cd";
          return lines.join("\n");
        });
        return "ab12cd";
      },
    },
    metadata: {
      all: async () => docs,
      get: async (path: string) => docs.find((d) => d.path === path) ?? null,
      linkTo: async (to: string, from: string, o: Any) => {
        asked.push([to, from, o]);
        return linkTo(to, from, o);
      },
      resolveNote: async (link: string) => {
        const name = /^\[\[([^\]|#]*)/.exec(link)![1].toLowerCase();
        const doc = docs.find((d) => stem(d.path).toLowerCase() === name);
        return {
          path: doc ? doc.path : `/root/${name}.md`,
          exists: !!doc,
          kind: "note",
          line: null,
        };
      },
    },
    editor: {
      registerCompletion: (id: string, p: { provideCompletions: Provide }) => {
        completions.set(id, p.provideCompletions);
        return { dispose() {} };
      },
      insertText: async (text: string) => void inserted.push(text),
    },
    views: {
      registerList: () => ({ setMessage() {}, refresh() {}, dispose() {} }),
      registerEmbed: (_id: string, p: Any) => {
        embed = p;
        return { refresh() {}, dispose() {} };
      },
    },
    commands: {
      register: (id: string, run: Any) => {
        commands.set(id, run);
        return { dispose() {} };
      },
    },
  };
  loadPlugin("catvinci.backlinks", api);
  return { completions, commands, embed: () => embed, inserted, asked, files };
}

const DOCS = [
  {
    path: "/root/Plan.md",
    rel: "Plan.md",
    title: "The plan",
    modifiedMs: 1,
    aliases: ["Roadmap"],
    links: [],
    headings: [
      { level: 1, text: "The plan", line: 0 },
      { level: 2, text: "Steps", line: 2 },
    ],
  },
  {
    path: "/root/Log.md",
    rel: "Log.md",
    title: "Log",
    modifiedMs: 5,
    aliases: [],
    links: [],
    headings: [],
  },
  {
    path: "/root/a/Idea.md",
    rel: "a/Idea.md",
    title: "Idea",
    modifiedMs: 3,
    aliases: [],
    links: [],
    headings: [],
  },
];
// An Obsidian vault: it writes [[wiki links]].
const VAULT_MARK = { ".obsidian/app.json": "{}" };
const FILES = {
  "Plan.md": "# The plan\n\n## Steps\n\nDo it first. ^step1\n\nThen this.\n",
  "Log.md": "Log\n",
  "a/Idea.md": "Idea\n",
};
const VAULT = { ...FILES, ...VAULT_MARK };
const ctx = (match: string, more: Any = {}) => ({
  text: "x " + match,
  match,
  query: "",
  after: "]] y",
  inMath: false,
  path: "/root/Log.md",
  signal: new AbortController().signal,
  ...more,
});

describe("Two-way Links' manifest", () => {
  const m = manifestOf("catvinci.backlinks");
  /** Each completion's pattern as Textus runs it, anchored at the caret. */
  const sources = m.contributes.completions.map((c: Any) => [
    c.id,
    new RegExp(`(?:${c.pattern})$`, "u"),
  ]);
  const which = (before: string) =>
    sources
      .map(([id, re]: [string, RegExp]) => {
        const hit = re.exec(before);
        return hit && [id.split(".").pop(), hit[hit.length - 1]];
      })
      .filter(Boolean);

  it("keeps its id, is renamed, and needs the 1.2 API", () => {
    expect(m.id).toBe("catvinci.backlinks");
    expect(m.l10n.en.name).toBe("Two-way Links");
    expect(m.l10n.zh.name).toBe("双向链接");
    expect(m.engines.textus).toBe(">=1.3.9");
    expect(m.contributes.suggestFor).toEqual(["wikilinks"]);
    expect(m.contributes.embeds).toEqual([
      { id: "catvinci.backlinks.embed", targets: ["note", "heading", "block"] },
    ]);
    for (const lang of Object.keys(m.l10n))
      for (const key of ["notes", "headings", "blocks"])
        expect(m.l10n[lang][key], lang + " " + key).toBeTruthy();
  });

  it("asks one completion at a time: notes, then a note's headings after #, its blocks after #^", () => {
    expect(which("See [[")).toEqual([["notes", ""]]);
    expect(which("See ![[Pla")).toEqual([["notes", "Pla"]]);
    expect(which("[[Plan#St")).toEqual([["headings", "St"]]);
    expect(which("[[#St")).toEqual([["headings", "St"]]);
    expect(which("[[Plan#The plan#St")).toEqual([["headings", "St"]]);
    expect(which("[[Plan#^do")).toEqual([["blocks", "do"]]);
    expect(which("[[#^")).toEqual([["blocks", ""]]);
    // An alias being typed, a closed link or a single bracket: none.
    expect(which("[[Plan|al")).toEqual([]);
    expect(which("[[Plan]] and")).toEqual([]);
    expect(which("[Pla")).toEqual([]);
  });
});

describe("[[ completion", () => {
  it("writes standard links in a folder that links no other way", async () => {
    const p = plugin(FILES, DOCS);
    const list = await p.completions.get("catvinci.backlinks.notes")!(
      ctx("[[Pl"),
    );
    expect(list!.items.map((i) => i.insert)).toContain("[Plan](Plan.md)");
  });

  it("lists every note, newest first, and its aliases, as links Textus writes over the paired ]]", async () => {
    const p = plugin(VAULT, DOCS);
    const list = await p.completions.get("catvinci.backlinks.notes")!(
      ctx("[[Pl"),
    );
    expect(list!.complete).toBe(true);
    expect(
      list!.items.map((i) => [
        i.label,
        i.detail,
        i.icon,
        i.insert,
        i.replaceAfter,
      ]),
    ).toEqual([
      ["Log", undefined, "file", "[[Log]]", 2],
      ["Idea", "a", "file", "[[Idea]]", 2],
      ["Plan", undefined, "file", "[[Plan]]", 2],
      ["Roadmap", "Plan.md", "link", "[[Plan|Roadmap]]", 2],
    ]);
    // As a wiki link, the way the folder says otherwise.
    expect(
      p.asked.every(
        ([, from, o]: Any) => from === "/root/Log.md" && o.style === "wiki",
      ),
    ).toBe(true);
    // Asked again, nothing is asked of Textus twice.
    const before = p.asked.length;
    await p.completions.get("catvinci.backlinks.notes")!(
      ctx("[[", { after: "" }),
    );
    expect(p.asked.length).toBe(before);
  });

  it("lists a note's headings, and the document's own for [[#", async () => {
    const p = plugin(VAULT, DOCS);
    const list = await p.completions.get("catvinci.backlinks.headings")!(
      ctx("[[plan#"),
    );
    expect(list!.items.map((i) => [i.label, i.detail, i.insert])).toEqual([
      ["The plan", "H1", "[[Plan#The plan]]"],
      ["Steps", "H2", "[[Plan#Steps]]"],
    ]);
    const own = await p.completions.get("catvinci.backlinks.headings")!(
      ctx("[[#", { path: "/root/Plan.md" }),
    );
    expect(own!.items.map((i) => i.label)).toEqual(["The plan", "Steps"]);
    expect(
      await p.completions.get("catvinci.backlinks.headings")!(ctx("[[Nope#")),
    ).toBeNull();
  });

  it("lists a note's blocks; one without an id gets one written into the note when picked", async () => {
    const p = plugin(VAULT, DOCS);
    const list = await p.completions.get("catvinci.backlinks.blocks")!(
      ctx("[[Plan#^"),
    );
    expect(
      list!.items.map((i) => [i.label, i.detail, i.icon, i.insert]),
    ).toEqual([
      ["The plan", undefined, "heading", "$0"],
      ["Steps", undefined, "heading", "$0"],
      ["Do it first.", "^step1", "block", "[[Plan#^step1]]"],
      ["Then this.", undefined, "block", "$0"],
    ]);
    const then = list!.items[3];
    expect(then.replaceAfter).toBe(2);
    await p.commands.get(then.command!.id)!(...then.command!.args);
    expect(p.files["Plan.md"]).toBe(
      "# The plan\n\n## Steps\n\nDo it first. ^step1\n\nThen this. ^ab12cd\n",
    );
    expect(p.inserted).toEqual(["[[Plan#^ab12cd]]"]);
  });

  it("writes links from an unsaved document as from the top of the folder", async () => {
    const p = plugin(VAULT, DOCS);
    await p.completions.get("catvinci.backlinks.notes")!(
      ctx("[[", { path: null }),
    );
    expect(p.asked[0][1]).toBe("/root/Untitled.md");
  });
});

describe("embeds", () => {
  it("gives a note without front matter or ids, a heading's section and a block", async () => {
    const p = plugin(
      { ...FILES, "Plan.md": "---\na: 1\n---\n" + FILES["Plan.md"] },
      DOCS,
    );
    const e = p.embed();
    const signal = new AbortController().signal;
    expect(await e.provideEmbed({ path: "/root/Plan.md" }, { signal })).toEqual(
      {
        markdown: "# The plan\n\n## Steps\n\nDo it first.\n\nThen this.",
      },
    );
    expect(
      await e.provideEmbed(
        { path: "/root/Plan.md", heading: "Steps" },
        { signal },
      ),
    ).toEqual({
      title: "Plan › Steps",
      markdown: "## Steps\n\nDo it first.\n\nThen this.",
    });
    expect(
      await e.provideEmbed(
        { path: "/root/Plan.md", block: "step1" },
        { signal },
      ),
    ).toEqual({
      title: "Plan",
      markdown: "Do it first.",
    });
    expect(
      await e.provideEmbed(
        { path: "/root/Plan.md", block: "gone" },
        { signal },
      ),
    ).toBeNull();
    expect(
      await e.provideEmbed({ path: "/root/Gone.md" }, { signal }),
    ).toBeNull();
  });
});
