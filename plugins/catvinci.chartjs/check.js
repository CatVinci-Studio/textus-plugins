// What check_chartjs finds wrong in a ```chartjs block: a Chart.js 4
// configuration, read as its page reads it (parseLoose).
/* global parseLoose */
/* exported checkBlock */
const TYPES = ["line", "bar", "pie", "doughnut", "polarArea", "radar", "scatter", "bubble"];

function checkBlock(source) {
  let config;
  try {
    config = parseLoose(source);
  } catch (err) {
    return ["Not JSON (" + err.message + "): write the configuration as JSON, without functions."];
  }
  if (!config || typeof config !== "object" || Array.isArray(config))
    return ["The block is one object: { type, data: { labels, datasets }, options }."];
  const problems = [];
  const datasets = config.data && config.data.datasets;
  if (!Array.isArray(datasets) || !datasets.length)
    problems.push("data.datasets must be a list of at least one dataset.");
  const list = Array.isArray(datasets) ? datasets : [];
  if (!config.type && !list.every((d) => d && d.type))
    problems.push("type is missing: one of " + TYPES.join(", ") + ".");
  if (config.type && !TYPES.includes(config.type))
    problems.push("“" + config.type + "” is not a chart type: one of " + TYPES.join(", ") + ".");
  list.forEach((d, i) => {
    const at = "data.datasets[" + i + "]";
    if (!d || typeof d !== "object") return problems.push(at + " must be an object.");
    if (!Array.isArray(d.data)) problems.push(at + ".data must be a list.");
    const type = d.type || config.type;
    if (type && !TYPES.includes(type))
      problems.push("“" + type + "” is not a chart type: one of " + TYPES.join(", ") + ".");
    if ((type === "scatter" || type === "bubble") && Array.isArray(d.data) && d.data.some((p) => !p || typeof p !== "object"))
      problems.push(at + ": a " + type + " chart's points are objects, {x, y" + (type === "bubble" ? ", r" : "") + "}.");
  });
  const scales = config.options && config.options.scales;
  if (scales && (scales.xAxes || scales.yAxes))
    problems.push("options.scales.xAxes and yAxes are Chart.js 2's; Chart.js 4 names the scales x and y.");
  return [...new Set(problems)];
}
