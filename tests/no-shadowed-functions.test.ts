import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// A second top-level `function name` replaces the first without a word:
// Database's AI tool once took over the view's addRow and "+ New" did nothing.
const plugins = join(__dirname, "..", "plugins");

describe("plugin scripts", () => {
  for (const id of readdirSync(plugins)) {
    for (const file of readdirSync(join(plugins, id)).filter((f) =>
      f.endsWith(".js"),
    )) {
      it(`${id}/${file} declares each top-level function once`, () => {
        const names = [
          ...readFileSync(join(plugins, id, file), "utf8").matchAll(
            /^(?:async\s+)?function\s+([\w$]+)/gm,
          ),
        ].map((m) => m[1]);
        expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
      });
    }
  }
});
