import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Function Plot's parser (plugins/catvinci.function-plot/plot.js), a plain
 *  script its page and host both run. */
const source = readFileSync(
  new URL("../plugins/catvinci.function-plot/plot.js", import.meta.url),
  "utf8",
);
const { compile, bound } = new Function(
  source + "\nreturn { compile, bound };",
)() as {
  compile: (text: string) => (x: number) => number;
  bound: (value: string | undefined, fallback: number) => number;
};

/** draw.js's graph over plot.js, on a stand-in DOM that keeps attributes. */
const draw = readFileSync(
  new URL("../plugins/catvinci.function-plot/draw.js", import.meta.url),
  "utf8",
);
type Node = { attrs: Record<string, string>; children: Node[] };
const document = {
  createElementNS: (_ns: string, name: string) => {
    const node = {
      name,
      attrs: {} as Record<string, string>,
      children: [] as Node[],
      setAttribute: (k: string, v: unknown) => void (node.attrs[k] = String(v)),
      append: (child: Node) => void node.children.push(child),
    };
    return node;
  },
};
const chartColors = () => ({ muted: "#888", tones: ["#00f"] });
const { graph } = new Function(
  "document",
  "chartColors",
  "drawChartBlock",
  source + "\n" + draw + "\nreturn { graph };",
)(document, chartColors, () => {}) as {
  graph: (s: string, meta: object, w: number, h: number) => Node;
};
const path = (svg: Node) =>
  svg.children.find((n) => "d" in n.attrs)!.attrs.d;

describe("function plot", () => {
  it("reads π, and names run together (2xsin(x), pix)", () => {
    expect(compile("π")(0)).toBe(Math.PI);
    expect(compile("2xsin(x)")(1)).toBeCloseTo(2 * Math.sin(1));
    expect(compile("pix")(2)).toBeCloseTo(2 * Math.PI);
    expect(compile("exp(x)")(1)).toBeCloseTo(Math.E);
    expect(() => compile("xfoo")).toThrow("xfoo is not something it knows");
  });

  it("fits y to tan(x)'s shape and lifts the pen at its asymptotes", () => {
    const svg = graph("tan(x)", {}, 600, 320);
    const ys = path(svg)
      .split(/[ML]/)
      .filter(Boolean)
      .map((p) => Number(p.split(" ")[1]));
    // A good part of the curve stands well off the x axis, not squashed onto it.
    expect(ys.filter((y) => Math.abs(y - 160) > 40).length).toBeGreaterThan(100);
    // Six asymptotes in -10..10: seven pieces, no vertical joins.
    expect(path(svg).match(/M/g)!.length).toBe(7);
  });

  it("says so when a function has no value over the range", () => {
    expect(() => graph("sqrt(x - 100)", {}, 600, 320)).toThrow(
      "“sqrt(x - 100)” has no value from x = -10 to 10",
    );
    expect(() => graph("sqrt(x - 100)", { xmin: "100", xmax: "200" }, 600, 320))
      .not.toThrow();
  });

  it("raises before it negates, as in mathematics", () => {
    expect(compile("-x^2")(3)).toBe(-9);
    expect(compile("2^-1")(0)).toBe(0.5);
    expect(compile("2^3^2")(0)).toBe(512);
    expect(compile("-2x")(3)).toBe(-6);
  });

  it("takes 0 as a range's end, and a default for what isn't a number", () => {
    expect(bound("0", -10)).toBe(0);
    expect(bound(undefined, -10)).toBe(-10);
    expect(bound("wide", 10)).toBe(10);
  });
});
