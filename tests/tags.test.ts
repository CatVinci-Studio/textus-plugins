import { beforeAll, describe, expect, it } from "vitest";

/** Tags' renaming (plugins/catvinci.tags/tag-edit.js), a plain script that
 *  puts itself on the global object. */
let tagEdit: {
  validTag: (name: string) => boolean;
  renameTag: (text: string, from: string, to: string) => string;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/markdown-keep.js");
  const script = "../plugins/catvinci.tags/tag-edit.js";
  await import(/* @vite-ignore */ script);
  tagEdit = (globalThis as unknown as { tagEdit: typeof tagEdit }).tagEdit;
});

describe("renaming a tag", () => {
  it("renames it in the text and in front matter's tags, nowhere else", () => {
    const doc = [
      "---",
      "tags: [draft, ideas]",
      "aliases:",
      "  - draft",
      "---",
      "# Note #draft",
      "",
      "Some #draft, #drafts, `#draft` and #draft/sub.",
      "```",
      "#draft",
      "```",
    ].join("\n");
    expect(tagEdit.renameTag(doc, "draft", "wip")).toBe(
      [
        "---",
        "tags: [wip, ideas]",
        "aliases:",
        "  - draft",
        "---",
        "# Note #wip",
        "",
        "Some #wip, #drafts, `#draft` and #wip/sub.",
        "```",
        "#draft",
        "```",
      ].join("\n"),
    );
  });

  it("renames a tag listed under tags:", () => {
    expect(
      tagEdit.renameTag("---\ntags:\n  - draft\n  - b\n---\n", "draft", "写作"),
    ).toBe("---\ntags:\n  - 写作\n  - b\n---\n");
  });

  it("leaves heading links and a ``` line inside a ~~~ block", () => {
    const doc =
      "See [[#Ideas]] and [[#Ideas|list]].\n~~~\n```\n#ideas in code\n~~~\nafter #ideas\n";
    expect(tagEdit.renameTag(doc, "ideas", "thoughts")).toBe(
      doc.replace("after #ideas", "after #thoughts"),
    );
    const four = "````\n```\n#ideas in code\n````\n#ideas\n";
    expect(tagEdit.renameTag(four, "ideas", "thoughts")).toBe(
      four.replace(/#ideas$/m, "#thoughts"),
    );
  });

  it("renames any letter case, and leaves longer front-matter tags", () => {
    expect(
      tagEdit.renameTag("---\ntags: [project-x, X]\n---\n#X and #x/sub", "x", "y"),
    ).toBe("---\ntags: [project-x, y]\n---\n#y and #y/sub");
    expect(
      tagEdit.renameTag("---\ntags:\n  - project-x\n  - x\n---\n", "x", "y"),
    ).toBe("---\ntags:\n  - project-x\n  - y\n---\n");
    expect(tagEdit.renameTag("---\ntags:x\n---\n", "x", "y")).toBe(
      "---\ntags:y\n---\n",
    );
  });

  it("leaves a link's address", () => {
    expect(tagEdit.renameTag("See [top](#x) and #x.", "x", "y")).toBe(
      "See [top](#x) and #y.",
    );
  });

  it("takes letters of any script, and not digits alone", () => {
    expect(tagEdit.validTag("写作/草稿")).toBe(true);
    expect(tagEdit.validTag("a b")).toBe(false);
    expect(tagEdit.validTag("2026")).toBe(false);
    for (const bad of ["/", "a/", "/a", "a//b"])
      expect(tagEdit.validTag(bad)).toBe(false);
  });
});
