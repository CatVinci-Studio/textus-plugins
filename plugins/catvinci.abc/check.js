// What check_abc finds wrong in an ```abc block, read line by line as ABC
// notation is: a header of fields ending in K:, then the music. Not
// abcjs's own parser, which the host doesn't load - the mistakes that stop
// a tune from engraving as meant.
/* exported checkBlock */
const FIELD = /^([A-Za-z]):\s*(.*)$/;
// A mode counts by its first three letters (Ddor, Ddorian); a key may be
// left out, or only clef= and other key=value words given.
const KEY = /^(?:$|[A-G][#b]?\s*(?:m|(?:maj|min|ion|mix|dor|phr|lyd|loc|aeo)[a-z]*)?(?:\s|$)|(?:HP|Hp|none)(?:\s|$)|[a-z-]+=)/i;
const METER = /^(?:C\|?|none|\d+(?:\+\d+)*\/\d+)$/;
const LENGTH = /^\d+\/\d+$/;
/** What a music line may hold besides notes: lengths, bars, ties, slurs,
 *  tuplets, broken rhythm, grace notes, decorations, chords, spaces, beam
 *  spacers and score line-breaks. */
const MUSIC = /[A-Ga-gzZxX^_=',0-9/|:[\]()\-<>{}.~HLMOPSTuvy&\s\\`$]/g;

function checkBlock(source) {
  const problems = [];
  const lines = source.split(/\r?\n/);
  const key = lines.findIndex((l) => /^K:/.test(l));
  if (key < 0) return ["No K: line: the header ends with the key, as K:C or K:Am, before the music."];
  lines.forEach((raw, i) => {
    const at = "Line " + (i + 1);
    const line = raw.replace(/%.*$/, "");
    if (line.startsWith("+:")) return;
    const field = FIELD.exec(line);
    if (field) {
      const value = field[2].trim();
      if (field[1] === "K" && !KEY.test(value)) problems.push(at + ": “" + value + "” is not a key (K:C, K:F#m, K:Bb, K:Ddor).");
      if (field[1] === "M" && !METER.test(value)) problems.push(at + ": “" + value + "” is not a meter (M:4/4, M:6/8, M:C).");
      if (field[1] === "L" && !LENGTH.test(value)) problems.push(at + ": “" + value + "” is not a note length (L:1/8).");
      return;
    }
    if (i < key || !line.trim()) return;
    // Chord symbols and annotations, decorations and inline fields aside.
    const music = line.replace(/"[^"]*"/g, "").replace(/![^!\s]*!|\+[^+\s]*\+/g, "").replace(/\[[A-Za-z]:[^\]]*\]/g, "");
    if ((line.match(/"/g) || []).length % 2) problems.push(at + ": a chord symbol or annotation's quote is never closed.");
    const odd = [...new Set(music.replace(MUSIC, ""))];
    if (odd.length) problems.push(at + ": " + odd.join(" ") + " isn't ABC notation.");
    let depth = 0;
    for (const c of music.replace(/\[\||\|\]|\[\d/g, "")) {
      if (c === "[") depth++;
      if (c === "]" && --depth < 0) break;
    }
    if (depth !== 0) problems.push(at + ": a chord's [ ] don't pair up.");
  });
  return problems;
}
