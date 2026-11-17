import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Link Cards' tool for Textus AI (plugins/catvinci.link-cards/host.js). */
const PAGE =
  '<html><head><title>Fallback</title><meta property="og:title" content="Textus"><meta name="description" content="A Markdown editor"></head></html>';

describe("link cards' tool", () => {
  it("fetches a page's card and its block", async () => {
    const fetch = async () => ({ ok: true, text: async () => PAGE });
    const { tools } = loadPlugin("catvinci.link-cards", { net: { fetch } });
    expect(
      await tools.get("fetch_link_card")!({ url: "https://textus.md" }),
    ).toMatchObject({
      title: "Textus",
      description: "A Markdown editor",
      fetched: true,
      block:
        "```card\nurl: https://textus.md\ntitle: Textus\ndescription: A Markdown editor\n```\n",
    });
  });

  it("says when the page couldn't be read, and refuses what isn't an address", async () => {
    const fetch = async () => {
      throw new Error("offline");
    };
    const { tools } = loadPlugin("catvinci.link-cards", { net: { fetch } });
    expect(
      await tools.get("fetch_link_card")!({ url: "https://example.com" }),
    ).toMatchObject({
      url: "https://example.com",
      fetched: false,
    });
    expect(
      await tools.get("fetch_link_card")!({ url: "example" }),
    ).toHaveProperty("error");
  });
});

it("offers itself on a right-click only over a selected web address", async () => {
  type Provide = (t: { selectedText?: string }) => unknown[];
  let provide: Provide | undefined;
  loadPlugin("catvinci.link-cards", {
    ui: {
      registerContextMenu: (_w: string, p: Provide) => (
        (provide = p),
        { dispose() {} }
      ),
    },
  });
  expect(provide!({ selectedText: "just words" })).toEqual([]);
  expect(provide!({})).toEqual([]);
  expect(provide!({ selectedText: "https://example.com/a" })).toEqual([
    {
      label: "turnInto",
      command: "catvinci.link-cards.insert",
      args: ["https://example.com/a"],
    },
  ]);
});
