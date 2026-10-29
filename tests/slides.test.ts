import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

/** Slides runs Marp Core in the plugin host, which has no DOM: the bundled
 *  copy (vendor/marp-core.js) has to render without one. */
describe("the bundled Marp", () => {
  it("renders a deck, slide by slide, with no page around it", () => {
    const sandbox: Record<string, unknown> = {};
    sandbox.globalThis = sandbox;
    runInNewContext(readFileSync(new URL("../vendor/marp-core.js", import.meta.url), "utf8"), sandbox);
    const { html, css } = runInNewContext(
      `new Marp({ html: false, math: "katex", script: false }).render("# One\\n\\n---\\n\\n## Two $x^2$")`,
      sandbox,
    ) as { html: string; css: string };
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(css.length).toBeGreaterThan(1000);
  });
});
