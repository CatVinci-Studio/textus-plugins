import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/** Zotero's host (plugins/catvinci.zotero/host.js): the citations a
 *  document holds, for Insert References List. Run as the sandbox runs
 *  it, with `exports` and a `textus` whose l10n is all it reads at load. */
type Cited = { type: string; key?: string; url?: string };
let citedIn: (text: string) => Cited[];

beforeAll(() => {
  const source = readFileSync(
    new URL("../plugins/catvinci.zotero/host.js", import.meta.url),
    "utf8",
  );
  const exports: { citedIn?: typeof citedIn } = {};
  const textus = { l10n: { t: (key: string) => key } };
  new Function("exports", "textus", source)(exports, textus);
  citedIn = exports.citedIn!;
});

describe("the citations in a document", () => {
  it("are its Pandoc keys and zotero:// links, each once", () => {
    const text = [
      "As shown [@smith2020; see @lee2019, p. 3], and @smith2020 again.",
      "Ask me at someone@example.com.",
      "[Lee (2019)](zotero://select/library/items/ABCD1234)",
    ].join("\n");
    expect(citedIn(text)).toEqual([
      { type: "citation", key: "smith2020" },
      { type: "citation", key: "lee2019" },
      { type: "link", url: "zotero://select/library/items/ABCD1234" },
    ]);
  });

  it("are none in a document without any", () => {
    expect(citedIn("Plain text, an e-mail: a@b.com.")).toEqual([]);
  });
});
