import { descend, inScope, isObsidianSetting } from "./config";
import type { Config } from "./model";

/**
 * What this device syncs: Textus's own rules (config.ts), less the paths
 * the user's rules leave out - written as a .gitignore writes them, the
 * folder's own .gitignore first when asked - and Obsidian's settings only
 * when asked for.
 */

interface Rule {
  test: RegExp;
  negate: boolean;
  /** Ends in "/": a folder only. */
  dirOnly: boolean;
}

/** One pattern as a test of a path from the folder's top. */
function patternTest(pattern: string): RegExp {
  // With a slash before its end it is anchored to the top; else any level.
  const anchored = pattern.replace(/\/$/, "").includes("/");
  const body = pattern
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .split(/(\*\*\/|\/\*\*|\*\*|\*|\?)/)
    .map((part) =>
      part === "**/"
        ? "(?:.*/)?"
        : part === "/**"
          ? "(?:/.*)?"
          : part === "**"
            ? ".*"
            : part === "*"
              ? "[^/]*"
              : part === "?"
                ? "[^/]"
                : part.replace(/[.+^${}()|[\]\\]/g, "\\$&"),
    )
    .join("");
  return new RegExp(`^${anchored ? "" : "(?:.*/)?"}${body}$`);
}

export function readRules(text: string): Rule[] {
  return text.split(/\r?\n/).flatMap((raw) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return [];
    const negate = line.startsWith("!");
    const pattern = negate ? line.slice(1) : line;
    if (!pattern || pattern === "/") return [];
    return [
      { test: patternTest(pattern), negate, dirOnly: pattern.endsWith("/") },
    ];
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
  const rules = readRules(
    (config.gitignore ? gitignore + "\n" : "") + config.exclude,
  );
  return {
    wants: (path) =>
      inScope(path) &&
      (config.obsidian || !isObsidianSetting(path)) &&
      !ruledOut(rules, path, false),
    enters: (dir) => descend(dir) && !ruledOut(rules, dir, true),
    obsidian: config.obsidian,
  };
}
