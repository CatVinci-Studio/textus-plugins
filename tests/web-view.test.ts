import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/** Web View's host (plugins/catvinci.web-view/host.js): what it takes for
 *  an address, and what for words to search for. The host is a script the
 *  sandbox runs with an `exports` object; so is it here. */
let asAddress: (text: string) => string | null;

beforeAll(() => {
  const source = readFileSync(
    new URL("../plugins/catvinci.web-view/host.js", import.meta.url),
    "utf8",
  );
  const exports: { asAddress?: typeof asAddress } = {};
  new Function("exports", source)(exports);
  asAddress = exports.asAddress!;
});

describe("what Web View opens", () => {
  it("takes URLs and hosts for addresses, made https", () => {
    expect(asAddress("http://example.com/a")).toBe("https://example.com/a");
    expect(asAddress("example.com")).toBe("https://example.com");
    expect(asAddress("docs.rs/serde")).toBe("https://docs.rs/serde");
    expect(asAddress("localhost.dev:8080")).toBe("https://localhost.dev:8080");
  });

  it("leaves words to be searched for", () => {
    expect(asAddress("markdown tables")).toBeNull();
    expect(asAddress("什么是 Markdown")).toBeNull();
    expect(asAddress("e.g. this")).toBeNull();
    expect(asAddress("  ")).toBeNull();
  });
});
