// What check_echarts finds wrong in an ```echarts block: an ECharts option,
// read as its page reads it (parseLoose).
/* global parseLoose */
/* exported checkBlock */
const SERIES = [
  "line", "bar", "pie", "scatter", "effectScatter", "radar", "tree", "treemap",
  "sunburst", "boxplot", "candlestick", "heatmap", "map", "parallel", "lines",
  "graph", "sankey", "funnel", "gauge", "pictorialBar", "themeRiver", "custom",
];
/** The series drawn on x and y axes unless they say otherwise. */
const ON_AXES = ["line", "bar", "scatter", "effectScatter", "boxplot", "candlestick", "heatmap", "pictorialBar"];
/** The component each other coordinate system needs. */
const SYSTEMS = { polar: "polar", geo: "geo", calendar: "calendar", parallel: "parallelAxis", singleAxis: "singleAxis" };

function checkBlock(source) {
  let option;
  try {
    option = parseLoose(source);
  } catch (err) {
    return ["Not JSON (" + err.message + "): write the option as JSON, without functions."];
  }
  if (!option || typeof option !== "object" || Array.isArray(option))
    return ["The block is one object, an ECharts option: { xAxis, yAxis, series, ... }."];
  const problems = [];
  const series = [].concat(option.series || []);
  if (!series.length) problems.push("series is missing: a list of series, each with a type.");
  series.forEach((s, i) => {
    const at = "series[" + i + "]";
    if (!s || typeof s !== "object") return problems.push(at + " must be an object.");
    if (!SERIES.includes(s.type))
      return problems.push(at + ".type “" + s.type + "” is not a series type: one of " + SERIES.join(", ") + ".");
    const system = s.coordinateSystem || (ON_AXES.includes(s.type) ? "cartesian2d" : null);
    if (system === "cartesian2d" && (!option.xAxis || !option.yAxis))
      problems.push(at + " (" + s.type + ") is drawn on axes: give xAxis and yAxis.");
    if (SYSTEMS[system] && !option[SYSTEMS[system]])
      problems.push(at + " is on " + system + ": give the " + SYSTEMS[system] + " component.");
    if (s.type === "radar" && !option.radar) problems.push(at + ": a radar series needs radar: { indicator: [...] }.");
    if (s.type === "map") problems.push(at + ": a map series needs map data registered by name, which a block can't load.");
  });
  return [...new Set(problems)];
}
