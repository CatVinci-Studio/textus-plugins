import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Tidy's tool for Textus AI (plugins/catvinci.markdown-lint/host.js),
 *  with the bundled markdownlint. */
it("lists the issues in some Markdown, and fixes them when asked", async () => {
  const { tools } = loadPlugin("catvinci.markdown-lint");
  const text = "# Title\n\n*  one\n*  two\n\nTrailing   \n";
  const result = await tools.get("lint_markdown")!({ text, fix: true });
  expect(
    result.issues.map((i: { line: number; rule: string }) => [
      i.line,
      i.rule.split("/")[0],
    ]),
  ).toEqual([
    [3, "MD030"],
    [4, "MD030"],
    [6, "MD009"],
  ]);
  expect(result.issues.every((i: { fixable: boolean }) => i.fixable)).toBe(
    true,
  );
  expect(result.fixed).toBe("# Title\n\n* one\n* two\n\nTrailing\n");
  expect(await tools.get("lint_markdown")!({ text: "# Clean\n" })).toEqual({
    issues: [],
  });
});
