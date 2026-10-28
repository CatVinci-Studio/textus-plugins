import { beforeAll, describe, expect, it } from "vitest";

/** Backlinks' unlinked mentions (plugins/catvinci.backlinks/mentions.js),
 *  a plain script that puts itself on the global object. */
let mentions: {
  namesOf: (stem: string, title: string, frontmatter: Record<string, unknown> | null) => string[];
  findMention: (line: string, name: string) => number;
  linkMention: (line: string, name: string, stem: string) => string | null;
};

beforeAll(async () => {
  const script = "../plugins/catvinci.backlinks/mentions.js";
  await import(/* @vite-ignore */ script);
  mentions = (globalThis as unknown as { backlinkMentions: typeof mentions }).backlinkMentions;
});

describe("unlinked mentions", () => {
  it("names a note by its file name, title and aliases, once each", () => {
    expect(mentions.namesOf("Zettel", "zettel", { aliases: ["Slip box", "x"] })).toEqual([
      "Zettel",
      "Slip box",
    ]);
    expect(mentions.namesOf("Ideas", "Ideas", { aliases: "Thoughts" })).toEqual(["Ideas", "Thoughts"]);
  });

  it("finds a whole word outside links and code, ignoring case", () => {
    expect(mentions.findMention("See the zettel method.", "Zettel")).toBe(8);
    expect(mentions.findMention("Zettelkasten is not it", "Zettel")).toBe(-1);
    expect(mentions.findMention("Already [[Zettel]] here", "Zettel")).toBe(-1);
    expect(mentions.findMention("[Zettel](zettel.md) and `Zettel`", "Zettel")).toBe(-1);
    expect(mentions.findMention("[[Zettel]] and Zettel again", "Zettel")).toBe(15);
  });

  it("finds a CJK name inside a sentence, which has no spaces", () => {
    expect(mentions.findMention("我今天读了卡片盒笔记法的书", "卡片盒笔记法")).toBe(5);
  });

  it("links the first mention, keeping the words as written", () => {
    expect(mentions.linkMention("About Zettel.", "Zettel", "Zettel")).toBe("About [[Zettel]].");
    expect(mentions.linkMention("about zettel.", "Zettel", "Zettel")).toBe("about [[Zettel|zettel]].");
    expect(mentions.linkMention("My slip box", "Slip box", "Zettel")).toBe("My [[Zettel|slip box]]");
    expect(mentions.linkMention("Nothing here", "Zettel", "Zettel")).toBeNull();
  });
});
