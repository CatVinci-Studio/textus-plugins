import { beforeAll, describe, expect, it } from "vitest";

/** Code Completion (plugins/catvinci.code-completion): its word lists and
 *  matching, plain scripts that put themselves on the global object. */
type Context = {
  language?: string;
  query: string;
  text: string;
  after?: string;
};
type Item = { label: string; insert: string; detail: string };
let complete: (context: Context) => Item[];

beforeAll(async () => {
  // Paths in variables: the scripts have no types to check against.
  for (const file of ["words.js", "complete.js"]) {
    const script = `../plugins/catvinci.code-completion/${file}`;
    await import(/* @vite-ignore */ script);
  }
  complete = (
    globalThis as unknown as { codeCompletion: { complete: typeof complete } }
  ).codeCompletion.complete;
});

const labels = (context: Context) => complete(context).map((i) => i.label);

describe("code completions", () => {
  it("offer the language's keywords that begin as typed, by its usual names", () => {
    for (const language of ["python", "py", "Python"])
      expect(labels({ language, query: "pri", text: "pri" })).toContain(
        "print",
      );
    expect(complete({ language: "rs", query: "imp", text: "imp" })[0]).toEqual({
      label: "impl",
      insert: "impl",
      detail: "Rust",
    });
  });

  it("put exact-case starts first and leave out the word typed whole", () => {
    expect(labels({ language: "python", query: "Tr", text: "Tr" })).toEqual([
      "True",
      "try",
    ]);
    expect(
      labels({ language: "go", query: "func", text: "func" }),
    ).not.toContain("func");
  });

  it("write SQL keywords in the case typed", () => {
    expect(labels({ language: "sql", query: "sel", text: "sel" })).toContain(
      "select",
    );
    expect(labels({ language: "sql", query: "SEL", text: "SEL" })).toContain(
      "SELECT",
    );
  });

  it("offer the words near the caret, in any language or none", () => {
    const text = "total_count = 1\nprint(tot";
    expect(labels({ language: "", query: "tot", text })).toEqual([
      "total_count",
    ]);
    expect(
      labels({ language: "python", query: "tot", text, after: ")" }),
    ).toContain("total_count");
  });
});
