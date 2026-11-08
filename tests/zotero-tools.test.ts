import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Zotero's tool for Textus AI (plugins/catvinci.zotero/host.js). */
const ITEM = {
  key: "ABCD1234",
  data: {
    title: "Attention",
    itemType: "journalArticle",
    date: "2017-06-12",
    publicationTitle: "NeurIPS",
    creators: [{ creatorType: "author", lastName: "Vaswani" }],
    extra: "Citation Key: vaswani2017",
  },
};

function setup(fetch: (url: string) => Promise<unknown>) {
  const settings = { get: async () => "pandoc" };
  return loadPlugin("catvinci.zotero", { net: { fetch }, settings }).tools.get(
    "search_library",
  )!;
}

describe("zotero's tool", () => {
  it("searches the library and gives each item's citation", async () => {
    let asked = "";
    const search = setup(async (url) => {
      asked = url;
      return { ok: true, json: async () => [ITEM] };
    });
    expect(await search({ query: "attention" })).toEqual({
      items: [
        {
          key: "ABCD1234",
          title: "Attention",
          authors: "Vaswani",
          year: "2017",
          type: "journalArticle",
          publication: "NeurIPS",
          citation_key: "vaswani2017",
          citation: "[@vaswani2017]",
        },
      ],
    });
    expect(asked).toContain("localhost:23119");
    expect(asked).toContain("q=attention");
  });

  it("says what to do when Zotero isn't running", async () => {
    const search = setup(async () => {
      throw new Error("connection refused");
    });
    expect(await search({ query: "x" })).toEqual({ error: "unreachable" });
  });
});
