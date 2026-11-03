// What check_markmap finds wrong in a ```markmap block: Markdown whose
// headings and list items are the mind map's branches.
/* exported checkBlock */
function checkBlock(source) {
  const problems = [];
  const lines = source.split("\n");
  let start = 0;
  if (lines[0].trim() === "---") {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (end < 0) problems.push("The front matter's opening --- is never closed.");
    start = end < 0 ? lines.length : end + 1;
  }
  let fence = null;
  let branches = 0;
  for (const line of lines.slice(start)) {
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (f && (!fence || f[1][0] === fence[0])) fence = fence ? null : f[1];
    else if (!fence && /^\s*(#{1,6}|[-*+]|\d+[.)])\s+\S/.test(line)) branches++;
  }
  if (fence) problems.push("A code fence is never closed: everything after it is one node.");
  if (!branches) problems.push("No headings (#, ##) or list items: they are the mind map's branches.");
  return problems;
}
