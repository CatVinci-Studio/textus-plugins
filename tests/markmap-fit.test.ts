import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** draw.js's fit (plugins/catvinci.markmap), run with markmap stubbed. */
const draw = readFileSync(
  new URL("../plugins/catvinci.markmap/draw.js", import.meta.url),
  "utf8",
);
const window = { markmap: { Transformer: class {} } };
const { fitBox, MOST_SCALE } = new Function(
  "window",
  "drawChartBlock",
  draw + "\nreturn { fitBox, MOST_SCALE };",
)(window, () => {}) as {
  fitBox: (
    w: number,
    h: number,
    rect: { x1: number; y1: number; x2: number; y2: number },
    most: number,
  ) => { k: number; x: number; y: number };
  MOST_SCALE: number;
};

describe("a mind map's fit", () => {
  const small = { x1: 0, y1: -50, x2: 300, y2: 50 };

  it("grows a small map to the block's width, up to its cap", () => {
    const fit = fitBox(500, 400, small, MOST_SCALE);
    expect(fit.k).toBeGreaterThan(1.4);
    expect(fit.k * 300).toBeLessThan(500);
    expect(fitBox(2000, 2000, small, MOST_SCALE).k).toBe(MOST_SCALE);
  });

  it("uses a taller height when the width allows it", () => {
    const tall = { x1: 0, y1: -200, x2: 300, y2: 200 };
    expect(fitBox(900, 300, tall, MOST_SCALE).k).toBeLessThan(
      fitBox(900, 600, tall, MOST_SCALE).k,
    );
  });

  it("leaves room below the last node for its circle and line", () => {
    const deep = { x1: 0, y1: -100, x2: 300, y2: 100 };
    const fit = fitBox(900, 260, deep, MOST_SCALE);
    expect(deep.y2 * fit.k + fit.y).toBeLessThanOrEqual(260 - 8 * fit.k);
  });

  it("shrinks a wide map, and keeps it inside the box, centred", () => {
    const wide = { x1: 10, y1: -100, x2: 1210, y2: 100 };
    const fit = fitBox(400, 360, wide, MOST_SCALE);
    const left = wide.x1 * fit.k + fit.x;
    const right = wide.x2 * fit.k + fit.x;
    expect(left).toBeGreaterThanOrEqual(0);
    expect(right).toBeLessThanOrEqual(400);
    expect(left).toBeCloseTo(400 - right);
  });
});
