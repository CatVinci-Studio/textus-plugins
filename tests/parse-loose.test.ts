import { beforeAll, describe, expect, it } from "vitest";

/** The JSON reader the chart plugins share (shared/parse-loose.js), a plain
 *  script run in their pages and hosts. */
let parseLoose: (source: string) => unknown;

beforeAll(async () => {
  const script = "../shared/parse-loose.js";
  await import(/* @vite-ignore */ script);
  parseLoose = (globalThis as Record<string, unknown>).parseLoose as typeof parseLoose;
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
