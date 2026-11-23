import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { beforeAll, describe, expect, it } from "vitest";

/** Slides runs Marp Core in the plugin host, which has no DOM: the bundled
 *  copy (vendor/marp-core.js) has to render without one. */
describe("the bundled Marp", () => {
  it("renders a deck, slide by slide, with no page around it", () => {
    const sandbox: Record<string, unknown> = {};
    sandbox.globalThis = sandbox;
    runInNewContext(
      readFileSync(new URL("../vendor/marp-core.js", import.meta.url), "utf8"),
      sandbox,
    );
    const { html, css } = runInNewContext(
      `new Marp({ html: false, math: "katex", script: false }).render("# One\\n\\n---\\n\\n## Two $x^2$")`,
      sandbox,
    ) as { html: string; css: string };
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(css.length).toBeGreaterThan(1000);
    // How host.js knows a deck has formulas, to add KaTeX's fonts.
    expect(html).toContain('class="katex"');
  });
});

/** Presenting with no keyboard (present.js): a phone pages by tap and swipe. */
describe("presenting by touch", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nav: any;
  beforeAll(async () => {
    const script = "../plugins/catvinci.slides/present.js";
    await import(/* @vite-ignore */ script);
    nav = (globalThis as unknown as { slidesPresent: unknown }).slidesPresent;
  });

  it("goes back from the left third, on from the rest, as a saved deck does", () => {
    expect(nav.tap(10, 390)).toBe(-1);
    expect(nav.tap(129, 390)).toBe(-1);
    expect(nav.tap(131, 390)).toBe(1);
    expect(nav.tap(380, 390)).toBe(1);
  });

  it("takes a sideways swipe as a page, a short or upward one as none", () => {
    expect(nav.swipe(-80, 5)).toBe(1);
    expect(nav.swipe(80, -10)).toBe(-1);
    expect(nav.swipe(-20, 0)).toBe(0);
    expect(nav.swipe(-60, 90)).toBe(0);
  });
});
