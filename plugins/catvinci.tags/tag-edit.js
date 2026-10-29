// Renaming a #tag in a note's text: in the body and in front matter's tags,
// never inside code, a link's address or a longer tag that starts the same.

(function (root) {
  const TAG = "[\\p{L}\\p{N}_\\-/]";

  function validTag(name) {
    return new RegExp("^" + TAG + "+$", "u").test(name) && !/^\d+$/.test(name);
  }

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /** The text with the tag renamed; code fences and inline code are left. */
  function renameTag(text, from, to) {
    const body = new RegExp(
      "(^|[\\s(\\[{,;:!?，。；：！？、])#" + escape(from) + "(?!" + TAG + ")",
      "gu",
    );
    let inFence = false;
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
        if (/^\s*(```|~~~)/.test(line)) {
          inFence = !inFence;
          return line;
        }
        if (inFence) return line;
        // Inline code is kept as it is: split on backticks.
        return line
          .split(/(`[^`]*`)/)
          .map((part) => (part.startsWith("`") ? part : part.replace(body, "$1#" + to)))
          .join("");
      })
      .join("\n");
  }

  /** tags: [a, b], tags: a, or a "- a" item under tags:. */
  function renameInFrontMatter(line, from, to) {
    const word = new RegExp("(^|[\\s\\[,\"'#:-])" + escape(from) + "(?=$|[\\s\\],\"'])", "gu");
    return line.replace(word, "$1" + to);
  }

  root.tagEdit = { validTag: validTag, renameTag: renameTag };
})(typeof window !== "undefined" ? window : globalThis);
