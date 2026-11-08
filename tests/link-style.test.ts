import { beforeAll, describe, expect, it } from "vitest";

/** shared/link-style.js: how plugins write a link where the folder says
 *  nothing - standard and relative - and where it does. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ls: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
let conventions: unknown = null;
let text = "";

beforeAll(async () => {
  g.textus = {
    files: {
      conventions: async () => conventions,
      readText: async () => text,
    },
    metadata: {
      // Textus's wiki link: the path from the root where the name is shared.
      linkTo: async (to: string) =>
        "[[" + to.replace(/^\/v\//, "").replace(/\.md$/, "") + "]]",
    },
  };
  await import(/* @vite-ignore */ "../shared/link-style.js");
  ls = g.linkStyle;
});

describe("a link a plugin writes", () => {
  it("is standard and relative, a space as %20, where nothing says otherwise", async () => {
    conventions = null;
    text = "# Week45\n";
    expect(
      await ls.linkTo(
        "/v/Life/2026 Calendar/Week45/Nov 8.md",
        "/v/Life/2026 Calendar/Week45.md",
      ),
    ).toBe("[Nov 8](Week45/Nov%208.md)");
    expect(
      await ls.linkTo("/v/Life/Plans.md", "/v/Life/2026/Nov 8.md", {
        heading: "Goals",
      }),
    ).toBe("[Plans > Goals](../Plans.md#Goals)");
  });

  it("follows the links the document already has, so a page never mixes them", async () => {
    conventions = null;
    text = "See [[Nov 5]] and [[Nov 6]].";
    expect(await ls.linkTo("/v/Nov 7.md", "/v/Week.md")).toBe("[[Nov 7]]");
    expect(ls.usedIn("[a](a.md) and [b](https://x.org)")).toBe("markdown");
    expect(ls.usedIn("no links")).toBeNull();
  });

  it("is a [[wiki link]] where the folder chose it, its path shown as the note's name", async () => {
    conventions = { linkStyle: { value: "wiki" } };
    text = "";
    expect(await ls.linkTo("/v/Life/Week45/Nov 8.md", "/v/Home.md")).toBe(
      "[[Life/Week45/Nov 8|Nov 8]]",
    );
    expect(
      await ls.linkTo("/v/Life/Week45/Nov 8.md", "/v/Home.md", {
        alias: "the 8th",
      }),
    ).toBe("[[Life/Week45/Nov 8]]");
  });
});
