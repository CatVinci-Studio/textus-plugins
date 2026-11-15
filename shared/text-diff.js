// A line diff of two texts: the longest common run of lines kept, the rest
// removed or added - enough to see what changed between two versions.
// Past ~4 million line pairs it gives up and says so (null).
(function (root) {
  "use strict";
  function lineDiff(before, after) {
    const a = before.split("\n");
    const b = after.split("\n");
    // Common head and tail first: most saves change a little in the middle.
    let start = 0;
    while (start < a.length && start < b.length && a[start] === b[start])
      start++;
    let endA = a.length;
    let endB = b.length;
    while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
      endA--;
      endB--;
    }
    const midA = a.slice(start, endA);
    const midB = b.slice(start, endB);
    if (midA.length * midB.length > 4e6) return null;
    const n = midA.length;
    const m = midB.length;
    const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        lcs[i][j] =
          midA[i] === midB[j]
            ? lcs[i + 1][j + 1] + 1
            : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    const out = a.slice(0, start).map((line) => ({ kind: "same", line: line }));
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && midA[i] === midB[j]) {
        out.push({ kind: "same", line: midA[i++] });
        j++;
      } else if (i < n && (j === m || lcs[i + 1][j] >= lcs[i][j + 1])) {
        // What went, then what came in its place.
        out.push({ kind: "removed", line: midA[i++] });
      } else {
        out.push({ kind: "added", line: midB[j++] });
      }
    }
    return out.concat(
      a.slice(endA).map((line) => ({ kind: "same", line: line })),
    );
  }
  /** The changed lines with `context` lines around each; one { kind: "gap" }
   *  stands for each run left out. */
  function lineHunks(parts, context) {
    const near = new Set();
    parts.forEach((p, i) => {
      if (p.kind !== "same")
        for (let j = i - context; j <= i + context; j++) near.add(j);
    });
    const out = [];
    parts.forEach((p, i) => {
      if (near.has(i)) out.push(p);
      else if (!out.length || out[out.length - 1].kind !== "gap")
        out.push({ kind: "gap" });
    });
    return out;
  }
  /** A diff as text: "+ " added, "- " removed, `context` lines around each
   *  change, "…" for what is left out. */
  const hunkText = (parts, context) =>
    lineHunks(parts, context)
      .map((p) => (p.kind === "gap" ? "…" : (p.kind === "added" ? "+ " : p.kind === "removed" ? "- " : "  ") + p.line))
      .join("\n");
  /** The runs of changed lines: `[start, end)` indexes into `parts`. */
  function changeGroups(parts) {
    const groups = [];
    parts.forEach((p, i) => {
      if (p.kind === "same") return;
      const last = groups[groups.length - 1];
      if (last && last[1] === i) last[1] = i + 1;
      else groups.push([i, i + 1]);
    });
    return groups;
  }
  /** The newer text with one run of changes taken back: in `group`, its
   *  removed lines instead of its added ones. */
  function revertGroup(parts, group) {
    const lines = [];
    parts.forEach((p, i) => {
      const inGroup = i >= group[0] && i < group[1];
      if (p.kind === "same" || (p.kind === (inGroup ? "removed" : "added")))
        lines.push(p.line);
    });
    return lines.join("\n");
  }
  // Words, each CJK character, runs of space, each mark.
  const TOKEN = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]|[\p{L}\p{N}_]+|\s+|./gu;
  /** What changed inside a run's lines, word by word: `before` and
   *  `after` as `{ text, changed }` pieces; null when too long to tell. */
  function wordDiff(before, after) {
    const a = before.match(TOKEN) || [];
    const b = after.match(TOKEN) || [];
    if (a.length * b.length > 1e6) return null;
    const n = a.length;
    const m = b.length;
    const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    const left = [];
    const right = [];
    const put = (list, text, changed) => {
      const last = list[list.length - 1];
      if (last && last.changed === changed) last.text += text;
      else list.push({ text: text, changed: changed });
    };
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[i] === b[j]) {
        put(left, a[i++], false);
        put(right, b[j++], false);
      } else if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) put(right, b[j++], true);
      else put(left, a[i++], true);
    }
    return { before: left, after: right };
  }
  root.lineDiff = lineDiff;
  root.lineHunks = lineHunks;
  root.hunkText = hunkText;
  root.changeGroups = changeGroups;
  root.revertGroup = revertGroup;
  root.wordDiff = wordDiff;
})(typeof window !== "undefined" ? window : globalThis);
