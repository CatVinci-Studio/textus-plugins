import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import { activate, deactivate } from "./host";

type Resolve = (view: unknown) => void | Promise<void>;
const manifest = JSON.parse(
  readFileSync(
    new URL("../../../plugins/catvinci.cloud-sync/textus-plugin.json", import.meta.url),
    "utf8",
  ),
);
const disposable = () => ({ dispose() {} });

afterEach(() => deactivate());

it("shows one page in the sidebar tab, the tab and Settings", async () => {
  const pages = new Map<string, Resolve>();
  const register = (id: string, provider: { resolve: Resolve }) => {
    pages.set(id, provider.resolve);
    return disposable();
  };
  (globalThis as unknown as { textus: unknown }).textus = {
    l10n: { t: (key: string) => key },
    env: { language: "en" },
    files: {
      root: async () => null,
      onDidSave: disposable,
      onDidDelete: disposable,
      onDidRename: disposable,
      onDidChangeRoot: disposable,
    },
    commands: { register: disposable },
    ui: { statusItem: () => ({ ...disposable(), update() {} }) },
    views: {
      registerWebview: register,
      registerSettingsPage: (p: { resolve: Resolve }) => register("settings", p),
    },
  };
  await activate({
    subscriptions: [],
    storage: { global: { get: async () => null, set: async () => {} } },
    secrets: { get: async () => null, set: async () => {} },
    log: { warn() {} },
    plugin: {
      readText: async (file: string) =>
        readFileSync(
          new URL(`../../../plugins/catvinci.cloud-sync/${file}`, import.meta.url),
          "utf8",
        ),
    },
  } as unknown as Textus.PluginContext);

  const declared = [
    ...manifest.contributes.sidebarTabs,
    ...manifest.contributes.views,
  ].map((v: { id: string }) => v.id);
  expect(declared).toContain("catvinci.cloud-sync.sidebar");
  expect([...pages.keys()].sort()).toEqual([...declared, "settings"].sort());
  const html = new Set<string>();
  for (const resolve of pages.values()) {
    const view = {
      html: "",
      onDidReceiveMessage: disposable,
      onDidDispose: disposable,
      postMessage: async () => {},
    };
    await resolve(view);
    html.add(view.html);
  }
  expect(html.size).toBe(1);
  expect([...html][0]).toContain('id="connection"');
});
