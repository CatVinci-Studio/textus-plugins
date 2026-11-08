import { beforeAll, describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Slides shows Obsidian's picture embeds (plugins/catvinci.slides). */
let embeds: {
  targets: (markdown: string) => string[];
  rewrite: (markdown: string, hrefs: Record<string, string>) => string;
  relative: (doc: string, file: string) => string;
  join: (dir: string, rel: string) => string;
  localSources: (html: string) => string[];
  inline: (html: string, urls: Record<string, string>) => string;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../plugins/catvinci.slides/embeds.js");
  embeds = (globalThis as unknown as { slideEmbeds: typeof embeds }).slideEmbeds;
});

describe("picture embeds", () => {
  it("are found once each, notes and code left out", () => {
    const text = "![[a.png]] ![[a.png|300]] ![[Note]] `![[b.png]]`\n\n```\n![[c.png]]\n```\n![[d e.JPG#x|10x20]]";
    expect(embeds.targets(text)).toEqual(["a.png", "d e.JPG"]);
  });

  it("become Markdown images with Marp's sizes", () => {
    const text = "![[a.png]] ![[a.png|300]] ![[b c.png|300x200]] ![[a.png|A cat]] `![[a.png]]` ![[gone.png]]";
    expect(embeds.rewrite(text, { "a.png": "img/a.png", "b c.png": "../b c.png" })).toBe(
      "![](<img/a.png>) ![w:300](<img/a.png>) ![w:300 h:200](<../b c.png>) ![A cat](<img/a.png>) `![[a.png]]` ![[gone.png]]",
    );
  });

  it("are given paths from the document", () => {
    expect(embeds.relative("/r/Talks/Talk.md", "/r/Talks/a.png")).toBe("a.png");
    expect(embeds.relative("/r/Talks/Talk.md", "/r/Attachments/a.png")).toBe("../Attachments/a.png");
    expect(embeds.join("/r/Talks", "../Attachments/a.png")).toBe("/r/Attachments/a.png");
  });

  it("show in the tab from data", () => {
    const html = '<img src="a%20b.png"><img src="https://x/y.png"><figure style="background-image:url(&quot;bg.png&quot;)">';
    expect(embeds.localSources(html)).toEqual(["a%20b.png", "bg.png"]);
    expect(embeds.inline(html, { "a%20b.png": "data:1", "bg.png": "data:2" })).toBe(
      '<img src="data:1"><img src="https://x/y.png"><figure style="background-image:url(&quot;data:2&quot;)">',
    );
  });
});

it("exports a deck whose embedded pictures are found in the vault", async () => {
  const files: Record<string, string> = {
    "Talks/Talk.md": "",
    "Talks/here.png": "PNG",
    "Attachments/far.png": "PNG",
  };
  const written: Record<string, string> = {};
  const { tools } = loadPlugin("catvinci.slides", {
    editor: {
      getPath: async () => "/root/Talks/Talk.md",
      getText: async () => "![[here.png]]\n\n---\n\n![[far.png|300]]\n\n---\n\n![[nowhere.png]]",
    },
    files: {
      ...folder(files),
      find: async (glob: string) =>
        Object.keys(files)
          .filter((r) => r.endsWith("/" + glob.slice(3)))
          .map((r) => ({ path: "/root/" + r, rel: r })),
      writeText: async (path: string, text: string) => void (written[path] = text),
    },
    metadata: { resolveLink: async () => null },
  });
  await tools.get("export_slides")!({});
  const deck = written["/root/Talks/Talk.slides.html"];
  expect(deck).toContain('src="here.png"');
  expect(deck).toContain('src="../Attachments/far.png" alt="" style="width:300px;"');
  expect(deck).toContain('src="nowhere.png"');
  expect(deck).not.toContain("![[");
});
