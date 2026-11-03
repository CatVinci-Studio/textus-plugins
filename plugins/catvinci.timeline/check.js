// What check_timeline finds wrong in a ```timeline block: each line is an
// event, "when | what | more", as draw.js reads it.
/* exported checkBlock */
function checkBlock(source) {
  const problems = [];
  source.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const parts = line.split("|").map((s) => s.trim());
    const at = "Line " + (i + 1) + " (“" + line.trim() + "”)";
    if (parts.length === 1) problems.push(at + " has no |: write when | what | more.");
    else if (!parts[0]) problems.push(at + " has nothing before its first |, so it isn't drawn.");
    else if (!parts[1]) problems.push(at + " says when but not what.");
    else if (parts.length > 3) problems.push(at + " has more than three parts; what follows the third | isn't shown.");
  });
  return problems;
}
