import { beforeAll, describe, expect, it } from "vitest";

/** LaTeX Completion's command list (plugins/
 *  catvinci.latex-completion/commands.js), a plain script that puts
 *  itself on the global object. */
type Item = { label: string; insert: string; detail: string };
let latex: {
  COMMANDS: [string, string | null, string][];
  complete: (typed: string, limit?: number) => Item[];
};

beforeAll(async () => {
  // A path in a variable: the script has no types to check against.
  const script = "../plugins/catvinci.latex-completion/commands.js";
  await import(/* @vite-ignore */ script);
  latex = (globalThis as unknown as { latexCommands: typeof latex })
    .latexCommands;
});

describe("LaTeX completions", () => {
  it("offer the commands starting with what was typed, braces and caret in place", () => {
    const [frac] = latex.complete("fr");
    expect(frac).toEqual({ label: "\\frac", insert: "\\frac{$0}{}", detail: "a⁄b" });
    expect(latex.complete("alp")[0]).toMatchObject({ insert: "\\alpha", detail: "α" });
  });

  it("put those starting so before those only holding it, ignoring case", () => {
    const labels = latex.complete("arrow").map((i) => i.label);
    expect(labels).toContain("\\Rightarrow");
    expect(labels.indexOf("\\rightarrow")).toBeGreaterThan(-1);
    expect(latex.complete("in").map((i) => i.label).slice(0, 2)).toEqual([
      "\\int",
      "\\in",
    ]);
  });

  it("list the common commands for a lone backslash, and each command once", () => {
    expect(latex.complete("")[0].label).toBe("\\frac");
    expect(latex.complete("", 500)).toHaveLength(latex.COMMANDS.length);
    const names = latex.COMMANDS.map((c) => c[0]);
    expect(new Set(names).size).toBe(names.length);
  });
});
