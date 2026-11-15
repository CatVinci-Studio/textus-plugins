import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { review } from "../scripts/review-lib.mjs";

/**
 * The first example (examples/hello/): its manifest names what its code
 * registers, and its code runs against a stand-in for textus.
 */

const ROOT = new URL("../examples/hello/", import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(ROOT + "textus-plugin.json", "utf8"));

function fakeTextus(text: string) {
  const registered: Record<string, unknown> = {};
  const listeners: (() => void)[] = [];
  const disposable = { dispose() {} };
  const textus = {
    l10n: {
      t: (key: string, ...args: unknown[]) =>
        (manifest.l10n.en[key] as string).replace(
          /\{(\d+)\}/g,
          (_: string, n: string) => String(args[+n]),
        ),
    },
    commands: {
      register: (id: string, run: unknown) => (
        (registered[id] = run),
        disposable
      ),
    },
    views: {
      registerList: (id: string, provider: unknown) => {
        registered[id] = provider;
        return { ...disposable, refresh: vi.fn(), setMessage: vi.fn() };
      },
    },
    editor: {
      getText: async () => text,
      getPath: async () => "/notes/a.md",
      getOutline: async () => [
        { level: 1, text: "Title", line: 0 },
        { level: 2, text: "Part", line: 4 },
      ],
      onDidChangeActive: (fn: () => void) => (listeners.push(fn), disposable),
      onDidChange: (fn: () => void) => (listeners.push(fn), disposable),
    },
    ui: { message: vi.fn(async () => {}) },
  };
  return { textus, registered };
}

describe("the hello example", () => {
  it("passes the catalog's own package checks as it is", () => {
    const pkg = new Map(
      readdirSync(ROOT).map((f) => [f, readFileSync(ROOT + f)] as const),
    );
    const failed = review({
      entry: { id: "your-name.hello", version: manifest.version },
      pkg,
      source: new Map([...pkg, ["LICENSE", Buffer.from("MIT License\n")]]),
    }).filter(
      (r: { level: string; check: string }) =>
        r.level === "fail" && r.check === "package",
    );
    expect(failed).toEqual([]);
  });

  it("registers what its manifest names, and counts and lists", async () => {
    const { textus, registered } = fakeTextus("Hello there 你好");
    // Run as the sandbox runs it: `exports` and `textus` given.
    const plugin = {} as { activate: (ctx: unknown) => void };
    new Function("exports", "textus", readFileSync(ROOT + "host.js", "utf8"))(
      plugin,
      textus,
    );
    const ctx = { subscriptions: [] as unknown[] };
    plugin.activate(ctx);
    expect(Object.keys(registered).sort()).toEqual(
      [
        ...manifest.contributes.commands.map(
          (c: { command: string }) => c.command,
        ),
        ...manifest.contributes.sidebarTabs.map((s: { id: string }) => s.id),
      ].sort(),
    );
    await (registered["your-name.hello.count"] as () => Promise<void>)();
    expect(textus.ui.message).toHaveBeenCalledWith("4 words");
    const items = await (
      registered["your-name.hello.headings"] as {
        items: () => Promise<{ label: string; location: unknown }[]>;
      }
    ).items();
    expect(items.map((i) => i.label)).toEqual(["Title", "  Part"]);
    expect(items[1].location).toEqual({ path: "/notes/a.md", line: 4 });
  });

  it("is English and Chinese, and asks only to read the editor", () => {
    expect(Object.keys(manifest.l10n).sort()).toEqual(["en", "zh"]);
    expect(Object.keys(manifest.l10n.zh).sort()).toEqual(
      Object.keys(manifest.l10n.en).sort(),
    );
    expect(manifest.permissions).toEqual(["editor.read"]);
  });
});

describe("every example", () => {
  const EXAMPLES = new URL("../examples/", import.meta.url).pathname;
  const kinds = readdirSync(EXAMPLES).filter((f) => !f.includes("."));

  it("passes textus-plugin check and registers what its manifest names", async () => {
    const { checkPlugin } = await import("../packages/textus-plugin/check.mjs");
    const { loadPlugin } = await import("../packages/textus-plugin/test.mjs");
    expect(kinds.sort()).toEqual([
      "ai-tool",
      "code-block",
      "document-type",
      "hello",
      "page",
    ]);
    for (const kind of kinds) {
      const dir = EXAMPLES + kind;
      const files = new Map(
        readdirSync(dir).map(
          (f) => [f, readFileSync(`${dir}/${f}`, "utf8")] as const,
        ),
      );
      expect(checkPlugin(files), kind).toEqual([]);
      const plugin = loadPlugin(dir, {
        editor: { getText: async () => "a b", getOutline: async () => [] },
        settings: { get: async () => "TOC = table of contents" },
        appearance: { colors: async () => ({ "--doc-accent": "red" }) },
      });
      await plugin.activate();
      const c = plugin.manifest.contributes;
      const ids = (key: string) => [...(plugin.registered[key]?.keys() ?? [])];
      if (c.commands)
        expect(ids("register")).toEqual(
          c.commands.map((x: { command: string }) => x.command),
        );
      if (c.aiTools)
        expect(ids("registerTool")).toEqual(
          c.aiTools.map((x: { name: string }) => x.name),
        );
      if (c.codeBlocks)
        expect(ids("registerCodeBlock")).toEqual(
          c.codeBlocks.map((x: { language: string }) => x.language),
        );
    }
  });

  it("answers as it says: the glossary's tool", async () => {
    const { loadPlugin } = await import("../packages/textus-plugin/test.mjs");
    const plugin = loadPlugin(EXAMPLES + "ai-tool", {
      settings: { get: async () => "TOC = table of contents" },
    });
    await plugin.activate();
    expect(await plugin.callTool("look_up_term", { term: "toc" })).toBe(
      "toc: table of contents",
    );
  });

  it("is what create-textus-plugin makes, with the id changed", async () => {
    const { mkdtempSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { create } =
      await import("../packages/create-textus-plugin/index.mjs");
    const target = mkdtempSync(`${tmpdir()}/textus-plugin-`) + "/mine";
    create(target, "code-block", "jane.bars");
    const made = JSON.parse(
      readFileSync(`${target}/textus-plugin.json`, "utf8"),
    );
    expect([made.id, made.publisher]).toEqual(["jane.bars", "jane"]);
  });
});

describe("the stand-in textus", () => {
  it("throws on a call the plugin API doesn't have, as Textus would", async () => {
    const { mkdtempSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { loadPlugin } = await import("../packages/textus-plugin/test.mjs");
    const dir = mkdtempSync(`${tmpdir()}/textus-plugin-`);
    writeFileSync(
      `${dir}/textus-plugin.json`,
      JSON.stringify({ main: "host.js" }),
    );
    writeFileSync(
      `${dir}/host.js`,
      "exports.activate = async () => { await textus.files.readText('a'); await textus.files.readTxt('a'); };",
    );
    await expect(loadPlugin(dir).activate()).rejects.toThrow(
      "textus.files.readTxt is not in the plugin API.",
    );
  });
});
