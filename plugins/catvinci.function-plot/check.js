// What check_function_plot finds wrong in a ```function-plot block: a line
// plot.js can't read, or a function with nothing to draw over the block's x range.
/* global linesOf, compile, bound, noValue */
/* exported checkBlock, checkInput */
function checkBlock(source, meta) {
  const x0 = bound(meta && meta.xmin, -10);
  const x1 = bound(meta && meta.xmax, 10);
  const problems = [];
  for (const line of linesOf(source)) {
    let fn;
    try {
      fn = compile(line);
    } catch (err) {
      problems.push(err.message);
      continue;
    }
    let drawn = false;
    for (let i = 0; i <= 400 && !drawn; i++) drawn = isFinite(fn(x0 + ((x1 - x0) * i) / 400));
    if (!drawn) problems.push(noValue(line, x0, x1));
  }
  return problems;
}

// A fence line's words, key=value as Textus reads them.
function fenceMeta(text) {
  const out = {};
  const pair = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S*)))?/g;
  for (const m of String(text || "").matchAll(pair))
    out[m[1]] = m[2] ?? m[3] ?? m[4] ?? "true";
  return out;
}

/** The tool's answer for { source, meta? }: the fence's words count, whether
 *  they come as `meta` or on a fence the model kept around the source. */
function checkInput(input) {
  let source = String((input && input.source) || "");
  const fence = source.match(/^\s*(?:`{3,}|~{3,})\s*[\w-]*([^\n]*)\n/);
  source = source
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n/, "")
    .replace(/\n\s*(`{3,}|~{3,})\s*$/, "");
  const given = input && input.meta;
  const meta = Object.assign(
    fenceMeta(fence && fence[1]),
    typeof given === "string" ? fenceMeta(given) : given || {},
  );
  let problems;
  try {
    problems = source.trim() ? checkBlock(source, meta) : ["The block is empty."];
  } catch (err) {
    problems = [String((err && err.message) || err)];
  }
  return problems.length ? { ok: false, problems: problems } : { ok: true };
}
