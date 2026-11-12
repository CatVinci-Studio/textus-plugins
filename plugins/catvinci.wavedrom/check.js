// What check_wavedrom finds wrong in a ```wavedrom block: WaveJSON, read as
// its page reads it (parseLoose) - lanes of signals, or a register's fields.
/* global parseLoose */
/* exported checkBlock */
const WAVE = /[pnPNlLhH01=2-9duzx.|<>]/g;

function checkBlock(source) {
  let json;
  try {
    json = parseLoose(source);
  } catch (err) {
    return ["Not JSON (" + err.message + ")."];
  }
  if (!json || typeof json !== "object" || Array.isArray(json))
    return ["The block is one object: { signal: [...] }, or { reg: [...] } for a register."];
  const problems = [];
  if (json.reg !== undefined) {
    if (!Array.isArray(json.reg)) return ["reg must be a list of fields: { bits, name }."];
    json.reg.forEach((f, i) => {
      if (!f || typeof f !== "object" || !(f.bits > 0)) problems.push("reg[" + i + "] needs bits, a number above 0.");
    });
    return problems;
  }
  if (!Array.isArray(json.signal))
    return ["signal must be a list of lanes: { name, wave }, groups [\"label\", lanes...], or {} for a gap."];
  const lanes = (list, at) =>
    list.forEach((lane, i) => {
      const here = at + "[" + i + "]";
      if (Array.isArray(lane)) return lanes(lane, here);
      // A group's first item is its label.
      if (typeof lane === "string" && i === 0 && at !== "signal") return;
      if (!lane || typeof lane !== "object") return problems.push(here + " must be a lane, { name, wave }.");
      if (lane.wave === undefined) return;
      if (typeof lane.wave !== "string") return problems.push(here + ".wave must be a string.");
      const odd = [...new Set(lane.wave.replace(WAVE, ""))];
      if (odd.length)
        problems.push(here + ".wave “" + lane.wave + "”: " + odd.join(" ") + " isn't a wave character (p n P N h l H L 0 1 = 2-9 x z u d . | < >).");
      const values = (lane.wave.match(/[=2-9]/g) || []).length;
      const data = typeof lane.data === "string" ? lane.data.split(/\s+/).filter(Boolean) : lane.data;
      if (Array.isArray(data) && data.length > values)
        problems.push(here + " has " + data.length + " data labels for " + values + " value bricks (= or 2-9) in its wave.");
    });
  lanes(json.signal, "signal");
  return problems;
}
