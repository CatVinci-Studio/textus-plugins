import { beforeAll, describe, expect, it } from "vitest";

/** Tags' renaming (plugins/catvinci.tags/tag-edit.js), a plain script that
 *  puts itself on the global object. */
let tagEdit: {
  validTag: (name: string) => boolean;
  renameTag: (text: string, from: string, to: string) => string;
};

beforeAll(async () => {
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
        "Some #wip, #drafts, `#draft` and #draft/sub.",
        "```",
        "#draft",
        "```",
      ].join("\n"),
    );
  });

  it("renames a tag listed under tags:", () => {
    expect(tagEdit.renameTag("---\ntags:\n  - draft\n  - b\n---\n", "draft", "写作")).toBe(
      "---\ntags:\n  - 写作\n  - b\n---\n",
    );
  });

  it("takes letters of any script, and not digits alone", () => {
    expect(tagEdit.validTag("写作/草稿")).toBe(true);
    expect(tagEdit.validTag("a b")).toBe(false);
    expect(tagEdit.validTag("2026")).toBe(false);
  });
});
