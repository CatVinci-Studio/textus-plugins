import { beforeAll, describe, expect, it } from "vitest";

/** Two-way Links' Convert Links (plugins/catvinci.backlinks/convert.js):
 *  each link written the other way, still going where it went. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cl: any;

const NOTES = ["/v/Life/Week45/Nov 8.md", "/v/Life/Plans.md", "/v/pic.png"];

beforeAll(async () => {
  g.textus = {
    files: { conventions: async () => null, readText: async () => "" },
    metadata: {
      // As Textus resolves a link: by name for [[x]], by path for a target.
      resolveNote: async (link: string, from: string) => {
        const wiki = /^!?\[\[([^\]|#]+)(?:#\^?([^\]|]+))?/.exec(link);
        const raw = wiki ? wiki[1] : link.split("#")[0];
        const heading = wiki ? wiki[2] : link.split("#")[1];
        const dir = from.replace(/\/[^/]*$/, "");
        const path = wiki
          ? NOTES.find(
              (n) =>
                n.replace(/\.md$/, "").endsWith("/" + raw) ||
                n.endsWith("/" + raw),
            )
          : NOTES.find((n) => n === dir + "/" + raw || n === "/v/" + raw);
        if (!path) return null;
        return {
          path,
          exists: true,
          kind: path.endsWith(".md") ? "note" : "file",
          heading,
        };
      },
      linkTo: async (
        to: string,
        _from: string,
        o: { alias?: string; heading?: string; embed?: boolean },
      ) =>
        (o.embed ? "!" : "") +
        "[[" +
        to.replace(/^.*\//, "").replace(/\.md$/, "") +
        (o.heading ? "#" + o.heading : "") +
        (o.alias ? "|" + o.alias : "") +
        "]]",
    },
  };
  await import(/* @vite-ignore */ "../shared/link-style.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.backlinks/convert.js");
  cl = g.convertLinks;
});

const run = async (text: string, from: string, to: string) => {
  const plan = await cl.plan(text, from, to);
  return { text: cl.apply(text, plan.changes), left: plan.left };
};

describe("converting a note's links", () => {
  it("writes [[wiki links]] as standard, relative links, leaving code and the front matter", async () => {
    const text = [
      "---",
      'up: "[[Plans]]"',
      "---",
      "See [[Nov 8]], [[Plans#Goals|the goals]] and [[Missing]].",
      "`[[Nov 8]]` in code.",
      "```",
      "[[Nov 8]]",
      "second [[Plans]]",
      "```",
      "After [[Plans]].",
    ].join("\n");
    const out = await run(text, "/v/Life/Week45.md", "markdown");
    expect(out.text).toBe(
      [
        "---",
        'up: "[[Plans]]"',
        "---",
        "See [Nov 8](Week45/Nov%208.md), [the goals](Plans.md#Goals) and [[Missing]].",
        "`[[Nov 8]]` in code.",
        "```",
        "[[Nov 8]]",
        "second [[Plans]]",
        "```",
        "After [Plans](Plans.md).",
      ].join("\n"),
    );
    expect(out.left).toBe(1);
  });

  it("reads past an empty code block", async () => {
    const text = "```\n```\nSee [[Plans]]\n```\n[[Nov 8]]\n```\nAfter [[Plans]]\n";
    const out = await run(text, "/v/Life/Week45.md", "markdown");
    expect(out.text).toBe(
      "```\n```\nSee [Plans](Plans.md)\n```\n[[Nov 8]]\n```\nAfter [Plans](Plans.md)\n",
    );
    // A longer run closes it too.
    const longer = await run("```\nx\n````\n[[Plans]]\n", "/v/Life/Week45.md", "markdown");
    expect(longer.text).toBe("```\nx\n````\n[Plans](Plans.md)\n");
  });

  it("writes standard links to notes as [[wiki links]], pictures and web links kept", async () => {
    const text =
      "[Nov 8](Week45/Nov%208.md), [plans](Plans.md), ![p](../pic.png) and [site](https://x.org).";
    const out = await run(text, "/v/Life/Week45.md", "wiki");
    expect(out.text).toBe(
      "[[Nov 8]], [[Plans|plans]], ![p](../pic.png) and [site](https://x.org).",
    );
    expect(out.left).toBe(1);
  });
});
