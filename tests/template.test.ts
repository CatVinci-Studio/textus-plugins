import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

/**
 * The plugin template (template/): its manifest names what its code
 * registers, and its code runs against a stand-in for textus.
 */

const ROOT = new URL("../template/", import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(ROOT + "textus-plugin.json", "utf8"));

function fakeTextus(text: string) {
  const registered: Record<string, unknown> = {};
  const listeners: (() => void)[] = [];
  const disposable = { dispose() {} };
  const textus = {
    l10n: {
      t: (key: string, ...args: unknown[]) =>
        (manifest.l10n.en[key] as string).replace(/\{(\d+)\}/g, (_: string, n: string) => String(args[+n])),
    },
    commands: {
      register: (id: string, run: unknown) => ((registered[id] = run), disposable),
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

describe("the plugin template", () => {
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
        ...manifest.contributes.commands.map((c: { command: string }) => c.command),
        ...manifest.contributes.sidebarTabs.map((s: { id: string }) => s.id),
      ].sort(),
    );
    await (registered["your-name.hello.count"] as () => Promise<void>)();
    expect(textus.ui.message).toHaveBeenCalledWith("4 words");
    const items = await (registered["your-name.hello.headings"] as { items: () => Promise<{ label: string; location: unknown }[]> }).items();
    expect(items.map((i) => i.label)).toEqual(["Title", "  Part"]);
    expect(items[1].location).toEqual({ path: "/notes/a.md", line: 4 });
  });

  it("is English and Chinese, and asks only to read the editor", () => {
    expect(Object.keys(manifest.l10n).sort()).toEqual(["en", "zh"]);
    expect(Object.keys(manifest.l10n.zh).sort()).toEqual(Object.keys(manifest.l10n.en).sort());
    expect(manifest.permissions).toEqual(["editor.read"]);
  });
});
