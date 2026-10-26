import { beforeAll, describe, expect, it } from "vitest";

/** The chart plugins' page code (shared/chart-page.js), a plain script
 *  run in the page; here with just enough of a page around it. */
let parseLoose: (source: string) => unknown;

beforeAll(async () => {
  const g = globalThis as Record<string, unknown>;
  g.window = g;
  g.acquireTextusApi = () => ({
    onMessage() {},
    onExport() {},
    postMessage() {},
  });
  const script = "../shared/chart-page.js";
  await import(/* @vite-ignore */ script);
  parseLoose = g.parseLoose as typeof parseLoose;
});

describe("parseLoose", () => {
  it("reads what people write for JSON: bare keys, single quotes, trailing commas, comments", () => {
    expect(
      parseLoose(`{
        // the clock
        signal: [{ name: 'clk', wave: "p..", }, ],
        /* a count */ n: 1.5, ok: true, none: null,
      }`),
    ).toEqual({
      signal: [{ name: "clk", wave: "p.." }],
      n: 1.5,
      ok: true,
      none: null,
    });
  });

  it("leaves strings as they are, quotes and commas inside them too", () => {
    expect(parseLoose(`{ "a": "x, } // y", b: 'it\\'s' }`)).toEqual({
      a: "x, } // y",
      b: "it's",
    });
  });

  it("runs nothing: a name that isn't JSON's is refused", () => {
    expect(() => parseLoose("{ a: alert }")).toThrow();
    expect(() => parseLoose("{ a: (() => 1)() }")).toThrow();
  });
});
