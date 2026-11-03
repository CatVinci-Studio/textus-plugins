import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Link Cards' tool for Textus AI (plugins/catvinci.link-cards/host.js). */
const PAGE = '<html><head><title>Fallback</title><meta property="og:title" content="Textus"><meta name="description" content="A Markdown editor"></head></html>';

describe("link cards' tool", () => {
  it("fetches a page's card and its block", async () => {
    const fetch = async () => ({ ok: true, text: async () => PAGE });
    const { tools } = loadPlugin("catvinci.link-cards", { net: { fetch } });
    expect(await tools.get("fetch_link_card")!({ url: "https://textus.catvinci.com" })).toMatchObject({
      title: "Textus",
      description: "A Markdown editor",
      fetched: true,
      block: "```card\nurl: https://textus.catvinci.com\ntitle: Textus\ndescription: A Markdown editor\n```\n",
    });
  });

  it("says when the page couldn't be read, and refuses what isn't an address", async () => {
    const fetch = async () => {
      throw new Error("offline");
    };
    const { tools } = loadPlugin("catvinci.link-cards", { net: { fetch } });
    expect(await tools.get("fetch_link_card")!({ url: "https://example.com" })).toMatchObject({
      url: "https://example.com",
      fetched: false,
    });
    expect(await tools.get("fetch_link_card")!({ url: "example" })).toHaveProperty("error");
  });
});
