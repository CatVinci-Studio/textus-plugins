import { beforeAll, describe, expect, it } from "vitest";

/** Link Cards' logic (plugins/catvinci.link-cards/cards.js). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lc: any;

beforeAll(async () => {
  const script = "../plugins/catvinci.link-cards/cards.js";
  await import(/* @vite-ignore */ script);
  lc = (globalThis as unknown as { linkCards: unknown }).linkCards;
});

describe("link cards", () => {
  it("reads a page's Open Graph card, its relative picture made whole", () => {
    const html = `<html><head><title>Fallback</title>
      <meta property="og:title" content="Textus &amp; you">
      <meta name="description" content="Writes with you.">
      <meta property="og:image" content="/og.png">
      <meta property="og:site_name" content="CatVinci"></head></html>`;
    expect(lc.fromHtml(html, "https://textus.md/a")).toEqual({
      url: "https://textus.md/a",
      title: "Textus & you",
      description: "Writes with you.",
      image: "https://textus.md/og.png",
      site: "CatVinci",
    });
    expect(lc.fromHtml("<title> Plain </title>", "https://x.org").title).toBe(
      "Plain",
    );
  });

  it("keeps a card as one line per field, and reads it back", () => {
    const card = {
      url: "https://x.org",
      title: "Two\nlines",
      description: null,
    };
    const source = lc.write(card);
    expect(source).toBe("url: https://x.org\ntitle: Two lines");
    expect(lc.parse(source)).toEqual({
      url: "https://x.org",
      title: "Two lines",
    });
  });

  it("reads Auto Card Link's cardlink blocks, quotes off and host as the site", () => {
    const source = [
      "url: https://github.com/blacksmithgu/obsidian-dataview",
      'title: "GitHub - blacksmithgu/obsidian-dataview: A \\"data\\" index"',
      "description: 'It''s a query language'",
      "host: github.com",
      "favicon: https://github.githubassets.com/favicons/favicon.svg",
      "image: https://opengraph.githubassets.com/1/x",
    ].join("\n");
    expect(lc.parse(source)).toEqual({
      url: "https://github.com/blacksmithgu/obsidian-dataview",
      title: 'GitHub - blacksmithgu/obsidian-dataview: A "data" index',
      description: "It's a query language",
      site: "github.com",
      favicon: "https://github.githubassets.com/favicons/favicon.svg",
      image: "https://opengraph.githubassets.com/1/x",
    });
  });

  it("reads Link Embed's embed blocks, empty fields left out", () => {
    const source = 'title: "Obsidian"\nimage: "https://obsidian.md/og.png"\ndescription: "Sharpen your thinking."\nurl: "https://obsidian.md/"\nfavicon: ""\naspectRatio: "52.5"';
    expect(lc.parse(source)).toEqual({
      title: "Obsidian",
      image: "https://obsidian.md/og.png",
      description: "Sharpen your thinking.",
      url: "https://obsidian.md/",
    });
  });

  it("leaves our own card as it reads, a site named over a host", () => {
    expect(lc.parse("url: https://x.org\nsite: X\nhost: x.org")).toEqual({ url: "https://x.org", site: "X" });
    expect(lc.parse('title: "Hello" said "World"').title).toBe('"Hello" said "World"');
  });

  it("plays YouTube and Bilibili videos, and nothing else", () => {
    expect(lc.videoEmbed("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
    expect(lc.videoEmbed("https://youtu.be/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
    expect(
      lc.videoEmbed("https://www.bilibili.com/video/BV1xx411c7mD/"),
    ).toContain("bvid=BV1xx411c7mD");
    expect(lc.videoEmbed("https://example.com/video/1")).toBeNull();
  });
});
