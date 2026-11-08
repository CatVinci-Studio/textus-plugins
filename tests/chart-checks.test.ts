import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** The chart plugins' check_<kind> tools for Textus AI (each plugin's
 *  check.js, through shared/chart-host.js's registerChartCheck). */
function checker(kind: string) {
  const tool = loadPlugin("catvinci." + kind).tools.get(
    "check_" + kind.replace(/-/g, "_"),
  )!;
  return async (source: string) => {
    const result = await tool({ source });
    return result.ok ? [] : (result.problems as string[]);
  };
}

describe("chart checks", () => {
  it("take the source with or without its fence, and refuse an empty one", async () => {
    const check = checker("timeline");
    expect(await check("```timeline\n2024 | Founded\n```")).toEqual([]);
    expect(await check("  ")).toEqual(["The block is empty."]);
  });

  it("chartjs: a Chart.js 4 configuration", async () => {
    const check = checker("chartjs");
    expect(
      await check(
        "{ type: 'bar', data: { labels: ['a'], datasets: [{ data: [1] }] } }",
      ),
    ).toEqual([]);
    expect(await check("{ type: 'bars', data: { datasets: [] } }")).toEqual([
      "data.datasets must be a list of at least one dataset.",
      "“bars” is not a chart type: one of line, bar, pie, doughnut, polarArea, radar, scatter, bubble.",
    ]);
    expect(
      (
        await check(
          "{ type: 'scatter', data: { datasets: [{ data: [1, 2] }] }, options: { scales: { xAxes: [] } } }",
        )
      ).length,
    ).toBe(2);
    expect(
      (
        await check("{ type: 'line', options: { onClick: function () {} } }")
      )[0],
    ).toMatch(/^Not JSON/);
  });

  it("echarts: series with known types, and their axes", async () => {
    const check = checker("echarts");
    expect(
      await check(
        "{ xAxis: { type: 'category', data: ['a'] }, yAxis: {}, series: [{ type: 'bar', data: [1] }] }",
      ),
    ).toEqual([]);
    expect(await check("{ series: [{ type: 'pie', data: [] }] }")).toEqual([]);
    expect(
      await check(
        "{ series: [{ type: 'line', data: [1] }, { type: 'donut' }] }",
      ),
    ).toEqual([
      "series[0] (line) is drawn on axes: give xAxis and yAxis.",
      expect.stringMatching(/^series\[1\]\.type “donut” is not a series type/),
    ]);
    expect(await check("{ series: [{ type: 'radar', data: [] }] }")).toEqual([
      "series[0]: a radar series needs radar: { indicator: [...] }.",
    ]);
  });

  it("wavedrom: wave characters and data labels", async () => {
    const check = checker("wavedrom");
    expect(
      await check(
        "{ signal: [{ name: 'clk', wave: 'p...' }, ['bus', { name: 'd', wave: 'x=.=x', data: 'a b' }], {}] }",
      ),
    ).toEqual([]);
    expect(
      await check(
        "{ signal: [{ name: 'clk', wave: 'p.k.' }, { name: 'd', wave: 'x=x', data: ['a', 'b'] }] }",
      ),
    ).toEqual([
      "signal[0].wave “p.k.”: k isn't a wave character (p n P N h l H L 0 1 = 2-9 x z u d . |).",
      "signal[1] has 2 data labels for 1 value bricks (= or 2-9) in its wave.",
    ]);
    expect(await check("{ reg: [{ bits: 8, name: 'IPO' }] }")).toEqual([]);
    expect(await check("{ lanes: [] }")).toHaveLength(1);
  });

  it("markmap: headings or list items to branch from", async () => {
    const check = checker("markmap");
    expect(
      await check(
        "---\nmarkmap:\n  colorFreezeLevel: 2\n---\n# Root\n## Branch\n- leaf",
      ),
    ).toEqual([]);
    expect(await check("Just a paragraph.")).toEqual([
      "No headings (#, ##) or list items: they are the mind map's branches.",
    ]);
    expect(await check("# Root\n```js\nx")).toEqual([
      "A code fence is never closed: everything after it is one node.",
    ]);
  });

  it("function-plot: lines the parser reads, with something to draw", async () => {
    const check = checker("function-plot");
    expect(await check("y = sin(x)\nx^2/10")).toEqual([]);
    expect(await check("sin(x\nsqrt(x - 100)\nfoo(x)")).toEqual([
      "“sin(x”: expected ) at the end",
      "“sqrt(x - 100)” has no value from x = -10 to 10: set xmin and xmax on the fence (```function-plot xmin=0 xmax=100).",
      "“foo(x)”: foo is not something it knows",
    ]);
  });

  it("abc: a header ending in K:, and notes", async () => {
    const check = checker("abc");
    expect(
      await check(
        'X:1\nT:Scale\nM:6/8\nL:1/8\nK:Dm\n|:"Dm"DEF [DFA]2 !trill!G | (3ABc d2>e :|]\nw: la la la',
      ),
    ).toEqual([]);
    expect(await check("X:1\nT:No key\nabc")).toEqual([
      "No K: line: the header ends with the key, as K:C or K:Am, before the music.",
    ]);
    expect(await check("X:1\nM:4\nK:Hmaj\nab[c|d]]e $|")).toEqual([
      "Line 2: “4” is not a meter (M:4/4, M:6/8, M:C).",
      "Line 3: “Hmaj” is not a key (K:C, K:F#m, K:Bb, K:Ddor).",
      "Line 4: $ isn't ABC notation.",
      "Line 4: a chord's [ ] don't pair up.",
    ]);
  });

  it("timeline: when | what | more on each line", async () => {
    const check = checker("timeline");
    expect(
      await check("2024 | Founded | in a garage\n2025 | First release"),
    ).toEqual([]);
    expect(await check("2024 Founded\n| Lost\n2026 |\n1 | 2 | 3 | 4")).toEqual([
      "Line 1 (“2024 Founded”) has no |: write when | what | more.",
      "Line 2 (“| Lost”) has nothing before its first |, so it isn't drawn.",
      "Line 3 (“2026 |”) says when but not what.",
      "Line 4 (“1 | 2 | 3 | 4”) has more than three parts; what follows the third | isn't shown.",
    ]);
  });
});
