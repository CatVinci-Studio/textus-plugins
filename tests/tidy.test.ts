import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin, manifestOf, memoryStorage } from "./plugin-host";

/** Tidy's text rules (plugins/catvinci.markdown-lint/tidy.js), a plain script
 *  that puts itself on the global object. */
let tidy: {
  tidy: (text: string, rule: string, options?: { all?: boolean }) => string;
  fullPunctuation: (line: string) => string;
  halfPunctuation: (line: string) => string;
  halfLetters: (line: string) => string;
  trimTrailing: (text: string) => string;
  removeBlankLines: (text: string, all?: boolean) => string;
  joinLines: (text: string) => string;
  listType: (text: string, kind: string) => string;
};

beforeAll(async () => {
  await import("../shared/markdown-keep.js");
  const script = "../plugins/catvinci.markdown-lint/tidy.js";
  await import(/* @vite-ignore */ script);
  tidy = (globalThis as unknown as { textTidy: typeof tidy }).textTidy;
});

describe("punctuation in Chinese text", () => {
  it("turns ASCII marks touching Chinese full-width", () => {
    expect(tidy.fullPunctuation("你好,今天怎么样?不错!")).toBe(
      "你好，今天怎么样？不错！",
    );
    expect(tidy.fullPunctuation("注意:这里;那里.")).toBe("注意：这里；那里。");
    expect(tidy.fullPunctuation("写作(草稿)完成")).toBe("写作（草稿）完成");
  });

  it("leaves decimals, English, ellipses, links and code alone", () => {
    expect(tidy.fullPunctuation("版本1.3.8发布")).toBe("版本1.3.8发布");
    expect(tidy.fullPunctuation("Hello, world. OK?")).toBe("Hello, world. OK?");
    expect(tidy.fullPunctuation("等等...好")).toBe("等等...好");
    expect(tidy.fullPunctuation("见[文档](https://a.com/x,y)和`a,b`")).toBe(
      "见[文档](https://a.com/x,y)和`a,b`",
    );
  });
});

describe("punctuation in English text", () => {
  it("turns full-width marks between Latin words into ASCII with a space", () => {
    expect(tidy.halfPunctuation("Hello，world！")).toBe("Hello, world!");
    expect(tidy.halfPunctuation("（note）")).toBe("(note)");
  });

  it("keeps full-width marks next to Chinese", () => {
    expect(tidy.halfPunctuation("你好，world")).toBe("你好，world");
  });
});

describe("full-width letters and digits", () => {
  it("become ASCII, outside code", () => {
    expect(tidy.halfLetters("ＡＢＣ１２３ｘｙｚ")).toBe("ABC123xyz");
    expect(tidy.halfLetters("`ＡＢ`")).toBe("`ＡＢ`");
  });
});

describe("trailing spaces", () => {
  it("go, except a line break's two spaces and code", () => {
    expect(tidy.trimTrailing("a  \nb \t\n\n```\nx  \n```\n")).toBe(
      "a  \nb\n\n```\nx  \n```\n",
    );
  });
});

describe("blank lines", () => {
  it("keep one between paragraphs and none at the end", () => {
    expect(tidy.removeBlankLines("a\n\n\n\nb\n&nbsp;\n\nc\n\n")).toBe(
      "a\n\nb\n\nc\n",
    );
  });

  it("all go in a selection of plain lines, but not inside code", () => {
    expect(tidy.removeBlankLines("a\n\nb\n\n\nc", true)).toBe("a\nb\nc");
    expect(tidy.removeBlankLines("```\nx\n\ny\n```", true)).toBe(
      "```\nx\n\ny\n```",
    );
  });
});

describe("joining lines", () => {
  it("adds no space between Chinese and one between words", () => {
    expect(tidy.joinLines("这是\n一句话\nand some\nwords")).toBe(
      "这是一句话and some words",
    );
  });

  it("drops the list and quote marks of the lines after the first", () => {
    expect(tidy.joinLines("- first\n- second\n> third")).toBe(
      "- first second third",
    );
  });
});

describe("switching a list's type", () => {
  it("numbers each level from 1 and keeps the indents", () => {
    expect(tidy.listType("- a\n  * b\n  * c\n- d", "ordered")).toBe(
      "1. a\n  1. b\n  2. c\n2. d",
    );
  });

  it("makes items of plain lines and keeps a task's tick", () => {
    expect(tidy.listType("plain\n- [x] done\n3. three", "task")).toBe(
      "- [ ] plain\n- [x] done\n- [ ] three",
    );
    expect(tidy.listType("- [x] done", "bullet")).toBe("- done");
  });

  it("leaves blank lines and fenced code as they are", () => {
    expect(tidy.listType("a\n\n```\ncode\n```", "bullet")).toBe(
      "- a\n\n```\ncode\n```",
    );
  });
});

describe("a whole document", () => {
  it("leaves front matter, fenced code and display math alone", () => {
    const doc =
      "---\ntitle: a,b\n---\n\n你好,世界\n\n```\n你好,code\n```\n\n$$\na,b\n$$\n";
    expect(tidy.tidy(doc, "fullPunctuation")).toBe(
      "---\ntitle: a,b\n---\n\n你好，世界\n\n```\n你好,code\n```\n\n$$\na,b\n$$\n",
    );
  });
});

describe("the command on a whole document", () => {
  it("leaves link definitions untouched", async () => {
    const commands = new Map<string, (editor: unknown) => Promise<void>>();
    let edits: unknown[] = [];
    loadPlugin("catvinci.markdown-lint", {
      commands: {
        registerEditorCommand: (
          id: string,
          run: (editor: unknown) => Promise<void>,
        ) => void commands.set(id, run),
      },
      ui: { confirm: async () => true, notice: async () => {} },
    });
    // The title on a line of its own: the rules alone would change it.
    const definition = '[文档]: https://a.com/x,y\n"标题,副题"';
    await commands.get("catvinci.markdown-lint.fullPunctuation")!({
      getSelection: async () => null,
      getBlocks: async () => [
        { id: "a", kind: "definition", markdown: definition },
        { id: "b", kind: "paragraph", markdown: "你好,世界" },
      ],
      edit: async (changes: unknown[]) => void (edits = changes),
    });
    expect(edits).toEqual([
      { action: "replace", block: "b", text: "你好，世界" },
    ]);
  });
});

describe("joining lines around Obsidian's syntax", () => {
  it("keeps a key:: value line a line of its own", () => {
    expect(tidy.joinLines("开会\n地点:: 三楼\n- 状态:: 进行中\n下午")).toBe(
      "开会\n地点:: 三楼\n- 状态:: 进行中\n下午",
    );
  });

  it("joins nothing after a ^block-id", () => {
    expect(tidy.joinLines("第一句 ^intro\n第二句\n第三句")).toBe(
      "第一句 ^intro\n第二句第三句",
    );
  });
});

describe("blank lines before a ^block-id", () => {
  it("keep the one that ties the id to the list above", () => {
    expect(tidy.removeBlankLines("- a\n- b\n\n^list-id\n\nc", true)).toBe(
      "- a\n- b\n\n^list-id\nc",
    );
  });
});

/** Tidy as the sandbox runs it, with its settings and commands. */
function host(settings: Record<string, unknown> = {}) {
  const commands = new Map<string, (editor: unknown) => Promise<void>>();
  let provider: { decorate: (blocks: unknown[]) => Promise<unknown[]> } | null =
    null;
  const { tools } = loadPlugin("catvinci.markdown-lint", {
    settings: { get: async (key: string) => settings[key] },
    commands: {
      registerEditorCommand: (
        id: string,
        run: (editor: unknown) => Promise<void>,
      ) => void commands.set(id, run),
    },
    editor: {
      registerDecorations: (p: typeof provider) => (
        (provider = p),
        { dispose() {} }
      ),
    },
    ui: { confirm: async () => true, notice: async () => {} },
  });
  return {
    commands,
    tools,
    decorate: (blocks: unknown[]) => provider!.decorate(blocks),
  };
}

describe("Tidy: Markdown Lint and Text Tidy in one", () => {
  it("offers every command of both, under one id", () => {
    const names = [
      "fix",
      "fullPunctuation",
      "halfLetters",
      "halfPunctuation",
      "joinLines",
      "removeBlankLines",
      "toBulletList",
      "toOrderedList",
      "toTaskList",
      "trimTrailing",
    ];
    expect([...host().commands.keys()].sort()).toEqual(
      names.map((c) => "catvinci.markdown-lint." + c),
    );
  });

  it("leaves out the rules turned off, from underlines, fixes and the AI tool", async () => {
    const rules = async (settings: Record<string, unknown>) => {
      const result = await host(settings).tools.get("lint_markdown")!({
        text: "*  one\n\nTrailing   ",
      });
      return result.issues.map((i: { rule: string }) => i.rule.split("/")[0]);
    };
    expect(await rules({})).toEqual(["MD030", "MD009"]);
    expect(await rules({ off: ["no-trailing-spaces", " md030 "] })).toEqual([]);
    const block = { id: "a", kind: "paragraph", markdown: "Trailing   " };
    expect(await host({ off: ["MD009"] }).decorate([block])).toEqual([]);
  });

  it("underlines nothing with underlining off", async () => {
    const block = { id: "a", kind: "list", markdown: "*  one" };
    expect(await host().decorate([block])).toHaveLength(1);
    expect(await host({ underline: false }).decorate([block])).toEqual([]);
  });
});

describe("Text Tidy, now part of Tidy", () => {
  it("offers Tidy once, and does nothing else", async () => {
    const offers: unknown[] = [];
    const storage = memoryStorage();
    const api = {
      commands: {
        execute: async (id: string, args: unknown) =>
          void offers.push([id, args]),
      },
      ui: { notice: async () => {} },
    };
    for (let i = 0; i < 2; i++) {
      loadPlugin("catvinci.text-tidy", api, storage);
      await new Promise((r) => setTimeout(r, 0));
    }
    expect(offers).toEqual([
      [
        "textus.offerPlugin",
        { id: "catvinci.markdown-lint", reason: "merged" },
      ],
    ]);
    expect(manifestOf("catvinci.text-tidy").contributes).toEqual({});
  });
});
