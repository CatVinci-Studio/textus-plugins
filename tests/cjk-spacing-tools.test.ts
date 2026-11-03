import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** CJK Spacing's tool for Textus AI (plugins/catvinci.cjk-spacing/host.js). */
it("spaces CJK and Latin text, leaving code as it is", async () => {
  const { tools } = loadPlugin("catvinci.cjk-spacing");
  const fix = tools.get("fix_cjk_spacing")!;
  expect(await fix({ text: "用Textus写3篇文章\n\n```\n用Textus\n```" })).toEqual({
    text: "用 Textus 写 3 篇文章\n\n```\n用Textus\n```",
    changed: true,
  });
  expect(await fix({ text: "Plain English." })).toEqual({ text: "Plain English.", changed: false });
});
