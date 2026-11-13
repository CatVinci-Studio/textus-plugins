import { descend, inScope, isObsidianSetting } from "./config";
import type { Config } from "./model";

/**
 * What this device syncs: Textus's own rules (config.ts), less the paths
 * the user's rules leave out - written as a .gitignore writes them, the
 * folder's own .gitignore first when asked - and Obsidian's settings only
 * when asked for.
 */

interface Rule {
  test: { test(path: string): boolean };
  negate: boolean;
  /** Ends in "/": a folder only. */
  dirOnly: boolean;
}

/** A glob's pieces: `**` at the start, middle or end, `*`, `?`, a `[...]`
 *  class, an escaped character; plain text between. Any other `**` is a `*`. */
const PIECE = /(^\*\*\/|\/\*\*\/|\/\*\*$|\*+|\?|\[!?\]?[^\]]*\]|\\.)/;

/** One step of a pattern: a character, any one but "/", a run of them,
 *  any folders ("dir/" any times, or none), anything at all, a class. */
type Step =
  | { k: "char"; c: string }
  | { k: "one" | "run" | "dirs" | "all" }
  | { k: "class"; test: RegExp };

function stepsOf(part: string): Step[] {
  if (part === "**/") return [{ k: "dirs" }];
  if (part === "/**/") return [{ k: "char", c: "/" }, { k: "dirs" }];
  if (part === "/**") return [{ k: "char", c: "/" }, { k: "all" }];
  if (/^\*+$/.test(part)) return [{ k: "run" }];
  if (part === "?") return [{ k: "one" }];
  if (part.startsWith("\\"))
    return [{ k: "char", c: [...part.slice(1)][0].toLowerCase() }];
  if (part.length > 2 && part.startsWith("[") && part.endsWith("]")) {
    const inner = part.slice(1, -1);
    const not = inner.startsWith("!");
    // A "]" first is one of the class, as in Git.
    const body = (not ? inner.slice(1) : inner)
      .replace(/\\/g, "\\\\")
      .replace(/^\]/, "\\]");
    return [
      { k: "class", test: new RegExp(`^[${not ? "^" : ""}${body}]$`, "iu") },
    ];
  }
  return [...part.toLowerCase()].map((c) => ({ k: "char", c }));
}

/** Whether `path` matches `steps`, in time path × pattern: no backtracking,
 *  however many stars. */
function matches(steps: Step[], path: string): boolean {
  // By whole characters, as the steps are: an emoji is one.
  const s = [...path.toLowerCase()];
  const n = s.length;
  // Each row: from character i on, whether steps j.. match.
  let next = new Uint8Array(n + 1);
  next[n] = 1;
  for (let j = steps.length - 1; j >= 0; j--) {
    const step = steps[j];
    const row = new Uint8Array(n + 1);
    let after = 0;
    for (let i = n; i >= 0; i--) {
      const ch = s[i];
      const one = i < n && ch !== "/";
      switch (step.k) {
        case "char":
          row[i] = i < n && ch === step.c ? next[i + 1] : 0;
          break;
        case "one":
          row[i] = one ? next[i + 1] : 0;
          break;
        case "class":
          row[i] = one && step.test.test(ch) ? next[i + 1] : 0;
          break;
        case "run":
          row[i] = next[i] || (one ? row[i + 1] : 0);
          break;
        case "all":
          row[i] = next[i] || (i < n ? row[i + 1] : 0);
          break;
        case "dirs":
          // Ends just past some "/" from here on, or takes nothing.
          after = i < n && ((ch === "/" && next[i + 1]) || after) ? 1 : 0;
          row[i] = next[i] || after;
          break;
      }
    }
    next = row;
  }
  return next[0] === 1;
}

/** One pattern as a test of a path from the folder's top, letter case
 *  ignored as Git does on macOS and Windows. */
function patternTest(pattern: string): { test(path: string): boolean } {
  // With a slash before its end it is anchored to the top; else any level.
  const anchored = pattern.replace(/\/$/, "").includes("/");
  const steps = pattern
    // "**/**/" is one "**/", where a "**" stands alone between slashes.
    .replace(/(^|\/)(?:\*\*\/){2,}/g, "$1**/")
    .replace(/(?:\/\*\*)+(?=\/|$)/g, "/**")
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .split(PIECE)
    .filter(Boolean)
    .flatMap(stepsOf);
  const all: Step[] = anchored ? steps : [{ k: "dirs" }, ...steps];
  // A few open-ended steps: a regular expression, fast and with little to
  // try again. More: the linear matcher, which never blows up.
  const open = all.filter(
    (st) => st.k === "run" || st.k === "all" || st.k === "dirs",
  );
  if (open.length > 3) return { test: (path) => matches(all, path) };
  const re = new RegExp(`^${all.map(stepSource).join("")}$`, "iu");
  return { test: (path) => re.test(path) };
}

function stepSource(step: Step): string {
  switch (step.k) {
    case "char":
      return step.c.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    case "one":
      return "[^/]";
    case "run":
      return "[^/]*";
    case "all":
      return ".*";
    case "dirs":
      return "(?:.*/)?";
    case "class":
      return `(?=[^/])${step.test.source.slice(1, -1)}`;
  }
}

/** Rules past this many characters are not read: a .gitignore is small. */
const RULES_CAP = 40_000;
/** A longer line is left out: no real rule is, and each costs a path. */
const LINE_CAP = 256;

export function readRules(text: string): Rule[] {
  return text
    .slice(0, RULES_CAP)
    .split(/\r?\n/)
    .flatMap((raw) => {
      // Trailing spaces go unless escaped, as in Git; leading ones stay.
      const line = raw.replace(/(?<!\\)\s+$/, "").replace(/\\ $/, " ");
      if (!line || line.startsWith("#")) return [];
      const negate = line.startsWith("!");
      const pattern = negate ? line.slice(1) : line;
      if (!pattern || pattern === "/" || pattern.length > LINE_CAP) return [];
      try {
        const test = patternTest(pattern);
        return [{ test, negate, dirOnly: pattern.endsWith("/") }];
      } catch {
        return [];
      }
    });
}

/** Whether `rules` leave out `path` (a folder when `dir`), or a folder
 *  it is in: the last rule that matches decides, as in Git. */
export function ruledOut(rules: Rule[], path: string, dir: boolean): boolean {
  const parts = path.split("/");
  for (let i = 1; i <= parts.length; i++) {
    const at = parts.slice(0, i).join("/");
    const isDir = i < parts.length || dir;
    let out = false;
    for (const rule of rules)
      if ((!rule.dirOnly || isDir) && rule.test.test(at)) out = !rule.negate;
    // Git's rule: nothing comes back from inside a folder left out.
    if (out) return true;
  }
  return false;
}

export interface Scope {
  wants(path: string): boolean;
  enters(dir: string): boolean;
  /** Obsidian's settings are carried. */
  obsidian: boolean;
}

export function scopeOf(
  config: Pick<Config, "exclude" | "gitignore" | "obsidian">,
  gitignore = "",
): Scope {
  // Each capped on its own: a big .gitignore never pushes out the user's.
  const rules = [
    ...(config.gitignore ? readRules(gitignore) : []),
    ...readRules(config.exclude),
  ];
  return {
    wants: (path) =>
      inScope(path) &&
      (config.obsidian || !isObsidianSetting(path)) &&
      !ruledOut(rules, path, false),
    enters: (dir) => descend(dir) && !ruledOut(rules, dir, true),
    obsidian: config.obsidian,
  };
}
