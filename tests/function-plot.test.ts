import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Function Plot's page script, run with its page stubbed out. */
const source = readFileSync(
  new URL("../plugins/catvinci.function-plot/draw.js", import.meta.url),
  "utf8",
);
const { compile, bound } = new Function(
  "drawChartBlock",
  source + "\nreturn { compile, bound };",
)(() => {}) as {
  compile: (text: string) => (x: number) => number;
  bound: (value: string | undefined, fallback: number) => number;
};

describe("function plot", () => {
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
