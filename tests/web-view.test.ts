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

describe("Ctrl/Cmd+clicked web links", () => {
  it("go to the browser unless the setting says a tab", async () => {
    const { loadPlugin } = await import("./plugin-host");
    for (const [setting, where] of [[undefined, "browser"], [true, "tab"]] as const) {
      const opened: string[] = [];
      let openLink: ((url: string) => Promise<void>) | null = null;
      loadPlugin("catvinci.web-view", {
        settings: { get: async (key: string) => (key === "clickLinks" ? setting : undefined) },
        commands: {
          register: (id: string, fn: typeof openLink) => (id.endsWith("openLink") && (openLink = fn), { dispose() {} }),
        },
        layout: {
          openExternal: async () => void opened.push("browser"),
          openWebPage: async () => void opened.push("tab"),
        },
      });
      await openLink!("https://example.com");
      expect(opened[0]).toBe(where);
    }
  });
});
