// What check_function_plot finds wrong in a ```function-plot block: a line
// plot.js can't read, or a function with nothing to draw from x = -10 to 10.
/* global functionsOf */
/* exported checkBlock */
function checkBlock(source) {
  const problems = [];
  const lines = source.split("\n").filter((line) => line.trim());
  for (const line of lines) {
    let fn;
    try {
      fn = functionsOf(line)[0];
    } catch (err) {
      problems.push(err.message);
      continue;
    }
    let drawn = false;
    for (let x = -10; x <= 10 && !drawn; x += 0.05) drawn = isFinite(fn(x));
    if (!drawn)
      problems.push("“" + line.trim() + "” has no value from x = -10 to 10: set xmin and xmax on the fence (```function-plot xmin=0 xmax=100).");
  }
  return problems;
}
