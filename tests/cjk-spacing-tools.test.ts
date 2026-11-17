import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** CJK Spacing's tool for Textus AI (plugins/catvinci.cjk-spacing/host.js). */
it("spaces CJK and Latin text, leaving code as it is", async () => {
  const { tools } = loadPlugin("catvinci.cjk-spacing");
  const fix = tools.get("fix_cjk_spacing")!;
  expect(
    await fix({ text: "用Textus写3篇文章\n\n```\n用Textus\n```" }),
  ).toEqual({
    text: "用 Textus 写 3 篇文章\n\n```\n用Textus\n```",
    changed: true,
  });
  expect(await fix({ text: "Plain English." })).toEqual({
    text: "Plain English.",
    changed: false,
  });
});

it("marks a paragraph missing a space, with its spaced Markdown as the fix", async () => {
  type Check = { check(blocks: unknown[]): Promise<unknown[]> };
  let checker: Check | undefined;
  let underline: boolean | undefined;
  loadPlugin("catvinci.cjk-spacing", {
    settings: {
      get: async (key: string) => (key === "underline" ? underline : undefined),
    },
    editor: {
      registerDiagnostics: (_id: string, c: Check) => (
        (checker = c),
        { dispose() {} }
      ),
    },
  });
  const blocks = [
    { id: "a", kind: "paragraph", markdown: "用Textus写作" },
    { id: "b", kind: "paragraph", markdown: "已经 OK 了" },
    { id: "c", kind: "code", markdown: "```\n用Textus\n```" },
  ];
  expect(await checker!.check(blocks)).toEqual([
    {
      block: "a",
      anchor: "用T",
      severity: "info",
      message: "missing",
      fix: { markdown: "用 Textus 写作", label: "addSpaces" },
    },
  ]);
  underline = false;
  expect(await checker!.check(blocks)).toEqual([]);
});
