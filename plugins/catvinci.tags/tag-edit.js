// Renaming a #tag (and its nested tags) in a note's text, any letter case: in
// the body and front matter's tags, never in code, a link's target or a longer tag.

(function (root) {
  const TAG = "[\\p{L}\\p{N}_\\-/]";
  // What may follow the name: "/" goes on to a nested tag, which moves too.
  const MORE = "[\\p{L}\\p{N}_\\-]";

  function validTag(name) {
    return (
      new RegExp("^" + TAG + "+$", "u").test(name) &&
      !/^\d+$/.test(name) &&
      !/^\/|\/$|\/\//.test(name)
    );
  }

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /** The text with the tag renamed; code fences and inline code are left. */
  function renameTag(text, from, to) {
    const body = new RegExp(
      "(^|[\\s(\\[{,;:!?，。；：！？、])#" + escape(from) + "(?!" + MORE + ")",
      "giu",
    );
    // The fence's character: a ``` inside a ~~~ block doesn't close it.
    let fence = null;
    let inFront = false;
    let inTagList = false;
    const lines = text.split("\n");
    return lines
      .map((line, i) => {
        if (i === 0 && line.trim() === "---") {
          inFront = true;
          return line;
        }
        if (inFront) {
          if (line.trim() === "---" || line.trim() === "...") {
            inFront = false;
            return line;
          }
          // A "- item" belongs to the key above it: only tags' are renamed.
          if (!/^\s*-\s/.test(line)) inTagList = /^\s*tags?\s*:\s*$/.test(line);
          const isTags = /^\s*tags?\s*:/.test(line) || (inTagList && /^\s*-\s/.test(line));
          return isTags ? renameInFrontMatter(line, from, to) : line;
        }
        const open = /^\s*(```+|~~~+)/.exec(line);
        if (open) {
          if (!fence) fence = open[1];
          else if (open[1][0] === fence[0] && open[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line))
            fence = null;
          return line;
        }
        if (fence) return line;
        // Inline code, [[links]] and link addresses are kept as they are.
        return line
          .split(/(`[^`]*`|\[\[[^\]\n]*\]\]|\]\([^)]*\))/)
          .map((part, k) => (k % 2 ? part : part.replace(body, "$1#" + to)))
          .join("");
      })
      .join("\n");
  }

  /** tags: [a, b], tags: a, or a "- a" item under tags:. */
  function renameInFrontMatter(line, from, to) {
    const word = new RegExp(
      "(^|[\\s\\[,\"'#]|\\btags?:)" + escape(from) + "(?=$|[\\s\\],\"'/])",
      "giu",
    );
    return line.replace(word, "$1" + to);
  }

  root.tagEdit = { validTag: validTag, renameTag: renameTag };
})(typeof window !== "undefined" ? window : globalThis);
