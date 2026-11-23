import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { normalizeConfig } from "./config";
import { Settings } from "./settings";
import { activate, deactivate } from "./host";

type Resolve = (view: unknown) => void | Promise<void>;
const manifest = JSON.parse(
  readFileSync(
    new URL(
      "../../../plugins/catvinci.cloud-sync/textus-plugin.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const disposable = () => ({ dispose() {} });

afterEach(() => deactivate());

it("shows the whole page in the tab and Settings, its status in the sidebar", async () => {
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
      registerSettingsPage: (p: { resolve: Resolve }) =>
        register("settings", p),
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
          new URL(
            `../../../plugins/catvinci.cloud-sync/${file}`,
            import.meta.url,
          ),
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
  const html = new Map<string, string>();
  for (const [id, resolve] of pages) {
    const view = {
      html: "",
      onDidReceiveMessage: disposable,
      onDidDispose: disposable,
      postMessage: async () => {},
    };
    await resolve(view);
    html.set(id, view.html);
  }
  // The tab and the plugin's page: the whole page (the page's marked, to
  // line up with the groups around it); the sidebar: the same page kept to
  // its status, the connection set up on the plugin's own page.
  expect(html.get("settings")).toBe(
    html
      .get("catvinci.cloud-sync.panel")!
      .replace("<body>", '<body data-place="settings">'),
  );
  expect(html.get("settings")).toContain('id="connection"');
  expect(html.get("catvinci.cloud-sync.sidebar")).toContain(
    '<body data-place="sidebar">',
  );
});

/** The plugin running over a folder of `names` connected to an S3 fake. */
async function connected(names: string[]) {
  const objects = new Map<string, Uint8Array>();
  const reply = (status: number, value: Uint8Array = new Uint8Array()) => ({
    status,
    ok: status < 300,
    headers: {},
    bytes: async () => value,
    text: async () => new TextDecoder().decode(value),
    json: async () => null,
  });
  const fetch = async (
    url: string,
    init: { method?: string; headers?: Record<string, string>; body?: unknown },
  ) => {
    const key = new URL(url).pathname,
      method = init.method ?? "GET";
    if (method === "PUT") {
      if (init.headers?.["if-none-match"] === "*" && objects.has(key))
        return reply(412);
      objects.set(key, new Uint8Array(init.body as Uint8Array));
      return reply(200);
    }
    if (method === "DELETE") {
      objects.delete(key);
      return reply(204);
    }
    const value = objects.get(key);
    return value ? reply(200, value) : reply(404);
  };
  const files = new Map(
    names.map((n) => [`/notes/${n}`, new TextEncoder().encode(n)]),
  );
  const commands = new Map<string, () => Promise<unknown>>();
  const shown = { tooltip: "" };
  const confirm = vi.fn(async (_text: string) => false);
  (globalThis as unknown as { textus: unknown }).textus = {
    l10n: { t: (key: string, ...args: unknown[]) => [key, ...args].join(" ") },
    env: { language: "en", platform: "macos" },
    net: { fetch },
    layout: { tabs: async () => [] },
    files: {
      root: async () => "/notes",
      list: async (dir: string) =>
        [...files.keys()]
          .filter((p) => p.startsWith(`${dir}/`))
          .map((p) => ({
            name: p.slice(dir.length + 1),
            isDir: false,
            size: files.get(p)!.length,
            modifiedMs: 1,
          })),
      stat: async (p: string) =>
        files.has(p) ? { isDir: false, size: files.get(p)!.length } : null,
      read: async (p: string) => files.get(p)!.slice(),
      create: async (p: string, t: string) => {
        files.set(p, new TextEncoder().encode(t));
      },
      trash: async (p: string) => {
        files.delete(p);
      },
      onDidSave: disposable,
      onDidDelete: disposable,
      onDidRename: disposable,
      onDidChangeRoot: disposable,
    },
    commands: {
      register: (id: string, run: () => Promise<unknown>) => {
        commands.set(id, run);
        return disposable();
      },
    },
    ui: {
      confirm,
      statusItem: (_id: string, item: { tooltip: string }) => {
        shown.tooltip = item.tooltip;
        return {
          ...disposable(),
          update: (next: { tooltip: string }) => {
            shown.tooltip = next.tooltip;
          },
        };
      },
    },
    views: { registerWebview: disposable, registerSettingsPage: disposable },
  };
  const global = new Map<string, unknown>(),
    secrets = new Map<string, string>();
  const ctx = {
    subscriptions: [],
    storage: {
      global: {
        get: async (k: string) => structuredClone(global.get(k)),
        set: async (k: string, v: unknown) => {
          global.set(k, structuredClone(v));
        },
      },
    },
    secrets: {
      get: async (k: string) => secrets.get(k),
      set: async (k: string, v: string) => {
        secrets.set(k, v);
      },
      delete: async (k: string) => {
        secrets.delete(k);
      },
    },
    log: { warn() {} },
    plugin: { readText: async () => "" },
  } as unknown as Textus.PluginContext;
  const config = normalizeConfig({
    endpoint: "https://s3.example",
    bucket: "bucket",
    prefix: "notes",
  });
  const settings = new Settings(ctx);
  await settings.save("/notes", config, {
    account: "TEST_ACCESS_KEY",
    secret: "test-only-secret",
  });
  await activate(ctx);
  return {
    objects,
    files,
    global,
    shown,
    confirm,
    sync: () => commands.get("catvinci.cloud-sync.sync")!(),
    baseKey: () => settings.baseKey("/notes", config),
  };
}
const HEAD_AT = "/bucket/notes/v1/head.json",
  LOCK_AT = "/bucket/notes/v1/lock.json";

it("asks before deleting many files from the cloud, and deletes them only on yes", async () => {
  const names = Array.from({ length: 12 }, (_, i) => `n${i}.md`);
  const f = await connected(names);
  expect(await f.sync()).toBeNull();
  const head = f.objects.get(HEAD_AT);
  for (const n of names.slice(1)) f.files.delete(`/notes/${n}`);
  expect(await f.sync()).toBe("manyDeletions");
  expect(f.confirm).toHaveBeenCalledWith(
    "confirmDeletions 11",
    expect.objectContaining({ danger: true, okLabel: "deleteInCloud" }),
  );
  expect(f.objects.get(HEAD_AT)).toEqual(head);
  expect(f.shown.tooltip).toBe("deletionsKept");
  f.confirm.mockResolvedValueOnce(true);
  expect(await f.sync()).toBeNull();
  const files = JSON.parse(
    new TextDecoder().decode(f.objects.get(HEAD_AT)),
  ).files;
  expect(Object.keys(files)).toEqual(["n0.md"]);
});

it("takes back the lock this device left when it was stopped mid-sync", async () => {
  const f = await connected(["a.md"]);
  expect(await f.sync()).toBeNull();
  const left = { id: "left", startedAt: "2026-11-23T00:00:00.000Z" };
  f.objects.set(LOCK_AT, new TextEncoder().encode(JSON.stringify(left)));
  f.global.set(`lock:${await f.baseKey()}`, { ...left, seen: 0 });
  f.files.set("/notes/a.md", new TextEncoder().encode("edited"));
  expect(await f.sync()).toBeNull();
  expect(f.objects.has(LOCK_AT)).toBe(false);
});
