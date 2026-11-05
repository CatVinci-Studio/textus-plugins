import { beforeAll, describe, expect, it } from "vitest";

/** Text Tidy's rules (plugins/catvinci.text-tidy/tidy.js), a plain script
 *  that puts itself on the global object. */
let tidy: {
  tidy: (text: string, rule: string, options?: { all?: boolean }) => string;
  fullPunctuation: (line: string) => string;
  halfPunctuation: (line: string) => string;
  halfLetters: (line: string) => string;
  trimTrailing: (text: string) => string;
  removeBlankLines: (text: string, all?: boolean) => string;
  joinLines: (text: string) => string;
};

beforeAll(async () => {
  const script = "../plugins/catvinci.text-tidy/tidy.js";
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
    expect(tidy.fullPunctuation("Hello, world. OK?")).toBe(
      "Hello, world. OK?",
    );
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

describe("a whole document", () => {
  it("leaves front matter, fenced code and display math alone", () => {
    const doc = "---\ntitle: a,b\n---\n\n你好,世界\n\n```\n你好,code\n```\n\n$$\na,b\n$$\n";
    expect(tidy.tidy(doc, "fullPunctuation")).toBe(
      "---\ntitle: a,b\n---\n\n你好，世界\n\n```\n你好,code\n```\n\n$$\na,b\n$$\n",
    );
  });
});
