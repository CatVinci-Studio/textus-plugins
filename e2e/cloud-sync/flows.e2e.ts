import {
  expect,
  test,
  type Browser,
  type FrameLocator,
  type Page,
} from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import JSZip from "jszip";

const plugin = resolve("plugins/catvinci.cloud-sync");
const syncPassword = "test-only encrypted workspace passphrase";
const current = JSON.parse(
  readFileSync(`${plugin}/textus-plugin.json`, "utf8"),
);
const zip = await JSZip.loadAsync(
  readFileSync(`dist/${current.id}-${current.version}.zip`),
);
const manifest = JSON.parse(
  await zip.file("textus-plugin.json")!.async("string"),
);
const files = Object.fromEntries(
  await Promise.all(
    Object.values(zip.files)
      .filter((file) => !file.dir)
      .map(async (file) => [file.name, await file.async("string")]),
  ),
);

async function evidence(page: Page, name: string, focus = "header") {
  if (process.env.CAPTURE_EVIDENCE !== "1") return;
  const browser = test.info().project.name;
  const directory = resolve("docs/cloud-sync/screenshots");
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    resolve(directory, `${browser}-version.txt`),
    `${page.context().browser()!.version()}\n`,
  );
  if (browser !== "webkit") return;
  await page
    .frameLocator(".plugin-webview-frame")
    .locator(focus)
    .evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: resolve(directory, `${name}-${browser}.png`) });
}

interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  bodyBase64?: boolean;
}
class Remote {
  files = new Map<string, Buffer>();
  failure: number | null = null;
  /** Each request waits for it while set. */
  held: Promise<void> | null = null;
  methods: string[] = [];
  paths: string[] = [];
  async request(req: Request) {
    const path = new URL(req.url).pathname,
      method = req.method;
    await this.held;
    this.methods.push(method);
    this.paths.push(path);
    const headers = Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), v]),
    );
    const body = Buffer.from(
      req.body ?? "",
      req.bodyBase64 ? "base64" : "utf8",
    );
    const response = (status: number, data: Buffer = Buffer.alloc(0)) => ({
      status,
      headers: {},
      body: data.toString("base64"),
    });
    if (this.failure) return response(this.failure);
    const url = new URL(req.url);
    if (method === "POST" && url.hostname.startsWith("up-")) {
      const form = body.toString("utf8");
      const crlf = String.fromCharCode(13, 10);
      const key = form.split(`name="key"${crlf}${crlf}`)[1]?.split(crlf)[0];
      const fileAt = form.indexOf('name="file"; filename="blob"');
      const fileStart =
        fileAt < 0 ? -1 : form.indexOf(`${crlf}${crlf}`, fileAt);
      const file =
        fileStart < 0 ? Buffer.alloc(0) : body.subarray(fileStart + 4);
      const end = file.indexOf(`${crlf}--`);
      const bytes = end < 0 ? file : file.subarray(0, end);
      if (!key) return response(400);
      // Kodo's S3 address, by path: /bucket/key.
      const stored = `/test-bucket/${key}`;
      if (this.files.has(stored)) {
        return this.files.get(stored)!.equals(bytes)
          ? response(200)
          : response(614);
      }
      this.files.set(stored, bytes);
      return response(200);
    }
    // Every folder already exists, as MKCOL's 405 says.
    if (method === "MKCOL") return response(405);
    if (method === "PROPFIND") return response(207);
    if (method === "GET" || method === "HEAD")
      return response(
        this.files.has(path) ? 200 : 404,
        method === "GET" ? this.files.get(path) : undefined,
      );
    if (method === "PUT") {
      if (headers["if-none-match"] === "*" && this.files.has(path))
        return response(412);
      this.files.set(path, body);
      return response(201);
    }
    if (method === "MOVE") {
      const destination = new URL(headers.destination).pathname;
      if (headers.overwrite === "F" && this.files.has(destination))
        return response(409);
      this.files.set(destination, this.files.get(path)!);
      this.files.delete(path);
      return response(201);
    }
    if (method === "DELETE") {
      this.files.delete(path);
      return response(204);
    }
    return response(405);
  }
}
async function emit(page: Page, name: string, payload?: string) {
  await page.evaluate(
    ({ name, payload }) => {
      const w = window as unknown as {
        __devEmitTauriEvent: (name: string, payload?: string) => void;
      };
      w.__devEmitTauriEvent(name, payload);
    },
    { name, payload },
  );
}
async function open(
  page: Page,
  remote: Remote,
  initial: Record<string, string>,
  language = "en",
  plugin = manifest,
) {
  await page.addInitScript(
    ({ manifest, files, initial, language }) => {
      if (window.top !== window) return;
      const w = window as unknown as Record<string, unknown>;
      w.__devPlugins = [
        {
          id: manifest.id,
          dir: `/plugins/${manifest.id}`,
          manifest: JSON.stringify(manifest),
          dev: false,
          files,
        },
      ];
      w.__devPluginState = {
        allOn: true,
        plugins: {
          [manifest.id]: { enabled: true, granted: manifest.permissions },
        },
      };
      w.__devFs = initial;
      w.__devPickFolder = "/work/notes";
      localStorage.setItem(
        "catvinci-settings",
        JSON.stringify({
          language,
          languageChosen: true,
          onboardingShown: true,
        }),
      );
    },
    { manifest: plugin, files, initial, language },
  );
  await page.exposeFunction("fixtureCloudRequest", (request: Request) =>
    remote.request(request),
  );
  await page.goto("/");
  await page.locator('[data-active-tab="true"] .ProseMirror').waitFor();
  await page.evaluate(() => {
    const w = window as unknown as {
      __TAURI_INTERNALS__: {
        invoke: (
          name: string,
          args?: Record<string, unknown>,
        ) => Promise<unknown>;
      };
      fixtureCloudRequest: (request: unknown) => Promise<unknown>;
    };
    const original = w.__TAURI_INTERNALS__.invoke;
    w.__TAURI_INTERNALS__.invoke = (name, args) =>
      name === "plugin_http"
        ? w.fixtureCloudRequest(args?.request)
        : original(name, args);
  });
  // A phone opens folders by the system's picker, not the app's menu.
  if (plugin === manifest) await emit(page, "menu-open-folder");
  else await emit(page, "menu-open-recent-folder", "/work/notes");
  await expect(page.locator(".sidebar .tree-root-label")).toHaveText("notes");
  await emit(page, "menu-plugin-command", `${manifest.id}.open`);
  const panel = page.frameLocator(".plugin-webview-frame");
  await expect(panel.locator("#provider-pick")).toBeEnabled();
  return panel;
}

/** The service picked from the page's menu, drawn by Textus over it. */
async function pickProvider(
  page: Page,
  provider: "s3" | "kodo" | "webdav" | "nutstore",
  language = "en",
) {
  const strings = (manifest as { l10n: Record<string, Record<string, string>> })
    .l10n[language];
  const label = { [provider]: strings[provider] };
  await page
    .frameLocator(".plugin-webview-frame")
    .locator("#provider-pick")
    .click();
  await page
    .getByRole("menuitemradio", { name: label[provider] })
    .or(page.getByRole("menuitem", { name: label[provider] }))
    .first()
    .click();
  // The pick clears the sign-in fields as it lands: type after it.
  await expect(
    page.frameLocator(".plugin-webview-frame").locator("#provider-name"),
  ).toHaveText(label[provider]);
}
/** Encryption is a switch, off for a new connection: the password fields
 *  show once it is on. */
async function encryptOn(panel: FrameLocator) {
  const on = panel.locator("#encrypt");
  if ((await on.isVisible()) && !(await on.isChecked())) await on.check();
}
async function configure(
  page: Page,
  provider: "s3" | "kodo" | "webdav" | "nutstore",
  password = syncPassword,
  enter = false,
) {
  const panel = page.frameLocator(".plugin-webview-frame");
  await pickProvider(page, provider);
  if (provider === "s3" || provider === "webdav")
    await panel.locator("#endpoint").fill("https://fixture.invalid/dav");
  if (provider === "s3" || provider === "kodo")
    await panel.locator("#bucket").fill("test-bucket");
  if (provider === "kodo") {
    // Its address comes from the region, picked from Textus's menu.
    await expect(panel.locator("#endpoint")).toBeHidden();
    await expect(panel.locator("#s3-more")).toBeHidden();
    await panel.locator("#region-pick").click();
    await page
      .getByRole("menuitemradio", { name: "cn-south-1" })
      .or(page.getByRole("menuitem", { name: "cn-south-1" }))
      .first()
      .click();
    await expect(panel.locator("#region-name")).toHaveText("cn-south-1");
  }
  await panel.locator("#account").fill("fixture-account");
  await panel.locator("#secret").fill("fixture-secret");
  await encryptOn(panel);
  await panel.locator("#sync-password").fill(password);
  await panel.locator("#confirm-password").fill(password);
  if (enter) await panel.locator("#confirm-password").press("Enter");
  else await panel.locator("#save").click();
  // Saved, the connection is a card: the account shown only by its start.
  await expect(panel.locator("#connected")).toBeVisible();
  await expect(panel.locator("#c-account")).toHaveText("fixt••••");
  await expect(panel.locator("#secret")).toHaveValue("");
  await expect(panel.locator("#sync-password")).toHaveValue("");
  await expect(panel.locator("#confirm-password")).toHaveValue("");
  await expect(panel.locator("#sync")).toBeEnabled();
  return panel;
}
async function sync(page: Page) {
  const panel = page.frameLocator(".plugin-webview-frame");
  await panel.locator("#sync").click();
  await expect(panel.locator("#status")).toContainText(
    /Synced|No changes|同步完成|所有文件已同步/,
  );
  await expect(panel.locator("#sync")).toBeEnabled();
}
async function device(
  browser: Browser,
  baseURL: string,
  remote: Remote,
  docs: Record<string, string>,
) {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1180, height: 820 },
  });
  const page = await context.newPage();
  await open(page, remote, docs);
  return { context, page };
}

for (const provider of ["s3", "kodo", "webdav", "nutstore"] as const) {
  test(`${provider}: the packaged plugin saves secrets, connects, and syncs through Textus's sandbox`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const remote = new Remote();
    await open(page, remote, { "/work/notes/note.md": "# Hello from Textus" });
    const panel = await configure(page, provider);
    await panel.locator("#test-saved").click();
    await expect(panel.locator("#status")).toContainText("Connection passed");
    await sync(page);
    await evidence(page, `${provider}-sync-success`);
    expect(
      [...remote.files.keys()].some((key) => key.endsWith("/v2/head.bin")),
    ).toBe(true);
    const state = await page.evaluate(() =>
      JSON.stringify(
        (window as unknown as Record<string, unknown>).__devPluginStore,
      ),
    );
    expect(state).not.toContain("fixture-secret");
    expect(state).not.toContain("fixture-account");
    expect(state).not.toContain(syncPassword);
    const remoteBytes = [...remote.files.values()]
      .map((b) => b.toString())
      .join("\n");
    for (const value of [syncPassword, "note.md", "# Hello from Textus"])
      expect(remoteBytes).not.toContain(value);
    expect(
      [...remote.files.values()].map((b) => b.toString()).join("\n"),
    ).not.toContain("fixture-secret");
    await sync(page);
    await expect(panel.locator("#status")).toHaveText("No changes to sync.");
    expect(errors).toEqual([]);
  });
}

test("two Textus devices exchange changes and preserve a concurrent edit as a conflict copy", async ({
  browser,
  baseURL,
}) => {
  const remote = new Remote();
  const a = await device(browser, baseURL!, remote, {
    "/work/notes/note.md": "base",
  });
  const b = await device(browser, baseURL!, remote, {});
  try {
    await configure(a.page, "webdav");
    await configure(b.page, "webdav");
    await sync(a.page);
    await sync(b.page);
    await a.page.evaluate(() => {
      (window as unknown as { __devFs: Record<string, string> }).__devFs[
        "/work/notes/note.md"
      ] = "edit A";
    });
    await b.page.evaluate(() => {
      (window as unknown as { __devFs: Record<string, string> }).__devFs[
        "/work/notes/note.md"
      ] = "edit B";
    });
    await sync(a.page);
    await sync(b.page);
    await evidence(b.page, "conflict-copies");
    await sync(a.page);
    const aFiles = await a.page.evaluate(
      () => (window as unknown as Record<string, unknown>).__devFs,
    );
    const bFiles = await b.page.evaluate(
      () => (window as unknown as Record<string, unknown>).__devFs,
    );
    expect(aFiles).toEqual(bFiles);
    expect(Object.values(aFiles as object).sort()).toEqual([
      "edit A",
      "edit B",
    ]);
  } finally {
    await a.context.close();
    await b.context.close();
  }
});

test("configuration errors preserve input and Chinese UI fits narrow and dark views", async ({
  page,
}) => {
  const remote = new Remote();
  const panel = await open(
    page,
    remote,
    { "/work/notes/note.md": "# 示例" },
    "zh",
  );
  await pickProvider(page, "nutstore", "zh");
  await expect(panel.locator("#endpoint")).toHaveValue(
    "https://dav.jianguoyun.com/dav",
  );
  await panel.locator("#account").fill("fixture-account");
  await panel.locator("#secret").fill("fixture-secret");
  await encryptOn(panel);
  await panel.locator("#sync-password").fill(syncPassword);
  await panel.locator("#confirm-password").fill(syncPassword);
  await panel.locator("#prefix").fill("textus/笔记");
  // A connection tests as typed, before it is saved, and stays unsaved.
  await panel.locator("#test").click();
  await expect(panel.locator("#status")).toContainText("连接测试通过");
  await expect(panel.locator("#connected")).toBeHidden();
  await expect(panel.locator("#secret")).toHaveValue("fixture-secret");
  await panel.locator("#prefix").fill("../unsafe");
  await panel.locator("#save").click();
  await expect(panel.locator("#status")).toContainText("请输入相对目录");
  await expect(panel.locator("#secret")).toHaveValue("fixture-secret");
  await panel.locator("#prefix").fill("textus/笔记");
  await panel.locator("#save").click();
  await expect(panel.locator("#secret")).toHaveValue("");
  await page.setViewportSize({ width: 560, height: 780 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  const width = await panel.locator("body").evaluate((body) => ({
    content: body.scrollWidth,
    view: body.clientWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.view);
  await page.screenshot({
    path: `test-results/cloud-sync-${test.info().project.name}-narrow.png`,
    fullPage: true,
  });
  await evidence(page, "chinese-dark-narrow", "#connected");
  remote.failure = 403;
  await panel.locator("#test-saved").click();
  await expect(panel.locator("#status")).toContainText("认证或权限不足");
  await expect(panel.locator("#sync")).toBeEnabled();
  // Disconnecting forgets this folder's connection; the form comes back empty.
  remote.failure = null;
  await panel.locator("#disconnect").click();
  await page.getByRole("dialog").getByRole("button", { name: "断开" }).click();
  await expect(panel.locator("#connection")).toBeVisible();
  await expect(panel.locator("#options")).toBeHidden();
  await expect(panel.locator("#account")).toHaveValue("");
});

test("automatic sync runs on its configured interval and Enter saves through the sandbox bridge", async ({
  page,
}) => {
  const remote = new Remote();
  await open(page, remote, { "/work/notes/note.md": "# Automatic" });
  const panel = await configure(page, "webdav", syncPassword, true);
  await page.clock.install();
  // Options apply as they change, with no save; the interval starts at 5.
  await panel.locator("#automatic").check();
  await page.clock.runFor(10);
  await expect(panel.locator("#status")).toHaveText("Settings saved.");
  await page.clock.fastForward(5 * 60_000 + 10);
  await expect(panel.locator("#status")).toContainText("uploaded 1");
  expect(
    [...remote.files.keys()].some((key) => key.endsWith("/v2/head.bin")),
  ).toBe(true);
});

test("a save syncs a few seconds later and the status bar says how sync stands", async ({
  page,
}) => {
  const remote = new Remote();
  await open(page, remote, { "/work/notes/note.md": "# Saved" });
  const panel = await configure(page, "s3");
  // A plugin with menu commands shows its first item as one button in the bar.
  const status = page.locator('[data-status-plugin="catvinci.cloud-sync"]');
  await expect(status).toHaveText("Not synced yet");
  await panel.locator("#automatic").check();
  await expect(panel.locator("#status")).toHaveText("Settings saved.");
  await sync(page);
  await expect(status).toHaveText("Synced · just now");
  const head = () =>
    remote.files.get(
      [...remote.files.keys()].find((k) => k.endsWith("/v2/head.bin"))!,
    );
  const before = head();
  const probes = remote.paths.filter((p) => p.includes("/probes/")).length;
  await page.locator(".sidebar .tree-row", { hasText: "note.md" }).click();
  await page.locator('[data-active-tab="true"] .ProseMirror').click();
  await page.keyboard.type(" again");
  await page.keyboard.press("ControlOrMeta+s");
  await expect.poll(() => head() !== before, { timeout: 20_000 }).toBe(true);
  await expect(status).toHaveText("Synced · just now");
  expect(remote.paths.filter((p) => p.includes("/probes/")).length).toBe(
    probes,
  );
  remote.failure = 500;
  await status.click();
  await page.getByRole("menuitem", { name: "Sync now" }).click();
  await expect(status).toHaveText("Sync error");
});

test("a wrong sync password leaves both devices unchanged, then the correct password decrypts", async ({
  browser,
  baseURL,
}) => {
  const remote = new Remote();
  const a = await device(browser, baseURL!, remote, {
    "/work/notes/private-name.md": "private document",
  });
  const b = await device(browser, baseURL!, remote, {});
  try {
    await configure(a.page, "webdav");
    await sync(a.page);
    const panel = await configure(
      b.page,
      "webdav",
      "wrong but sufficiently long password",
    );
    const before = [...remote.files].map(([k, v]) => [k, Buffer.from(v)]);
    await panel.locator("#sync").click();
    await expect(panel.locator("#status")).toContainText(
      "sync password is incorrect",
    );
    await expect(panel.locator("#sync")).toBeEnabled();
    await evidence(b.page, "wrong-password");
    expect([...remote.files]).toEqual(before);
    expect(
      await b.page.evaluate(
        () => (window as unknown as Record<string, unknown>).__devFs,
      ),
    ).toEqual({});
    // Editing keeps the saved keys; only the password is typed again.
    await panel.locator("#edit").click();
    await encryptOn(panel);
    await panel.locator("#sync-password").fill(syncPassword);
    await panel.locator("#confirm-password").fill(syncPassword);
    await panel.locator("#save").click();
    await expect(panel.locator("#sync-password")).toHaveValue("");
    await sync(b.page);
    expect(
      await b.page.evaluate(
        () => (window as unknown as Record<string, unknown>).__devFs,
      ),
    ).toEqual({ "/work/notes/private-name.md": "private document" });
  } finally {
    await a.context.close();
    await b.context.close();
  }
});

test("a tampered encrypted manifest never writes local documents", async ({
  browser,
  baseURL,
}) => {
  const remote = new Remote();
  const a = await device(browser, baseURL!, remote, {
    "/work/notes/note.md": "private",
  });
  const b = await device(browser, baseURL!, remote, {});
  try {
    await configure(a.page, "s3");
    await sync(a.page);
    const key = [...remote.files.keys()].find((k) =>
      k.endsWith("/v2/head.bin"),
    )!;
    remote.files.get(key)![20] ^= 1;
    const panel = await configure(b.page, "s3");
    await panel.locator("#sync").click();
    await expect(panel.locator("#status")).toContainText(
      "Encrypted data failed authentication",
    );
    await evidence(b.page, "tamper-rejected");
    expect(
      await b.page.evaluate(
        () => (window as unknown as Record<string, unknown>).__devFs,
      ),
    ).toEqual({});
  } finally {
    await a.context.close();
    await b.context.close();
  }
});

test("password confirmation errors retain input and an old plaintext directory is refused", async ({
  page,
}) => {
  const remote = new Remote();
  const panel = await open(page, remote, { "/work/notes/note.md": "private" });
  await pickProvider(page, "webdav");
  await panel.locator("#endpoint").fill("https://fixture.invalid/dav");
  await panel.locator("#account").fill("fixture-account");
  await panel.locator("#secret").fill("fixture-secret");
  await encryptOn(panel);
  await panel.locator("#sync-password").fill(syncPassword);
  await panel.locator("#confirm-password").fill("a different password");
  await panel.locator("#save").click();
  await expect(panel.locator("#status")).toContainText(
    "sync passwords do not match",
  );
  await expect(panel.locator("#sync-password")).toHaveValue(syncPassword);
  await panel.locator("#confirm-password").fill(syncPassword);
  await panel.locator("#save").click();
  await expect(panel.locator("#sync-password")).toHaveValue("");
  const old = Buffer.from(
    JSON.stringify({
      format: "textus-cloud-sync/1",
      revision: "old",
      updatedAt: "",
      files: {},
    }),
  );
  remote.files.set("/dav/textus/notes/v1/head.json", old);
  await panel.locator("#sync").click();
  await expect(panel.locator("#status")).toContainText("isn't encrypted");
  expect([...remote.files]).toEqual([["/dav/textus/notes/v1/head.json", old]]);
});

test("the connection card fits a narrow panel in German, the longest words", async ({
  page,
}) => {
  const panel = await open(
    page,
    new Remote(),
    { "/work/notes/a.md": "x" },
    "de",
  );
  await pickProvider(page, "webdav", "de");
  await panel.locator("#endpoint").fill("https://fixture.invalid/dav");
  await panel.locator("#account").fill("fixture-account");
  await panel.locator("#secret").fill("fixture-secret");
  await panel.locator("#save").click();
  await expect(panel.locator("#connected")).toBeVisible();
  await page.setViewportSize({ width: 560, height: 780 });
  const [content, view] = await panel
    .locator("body")
    .evaluate((body) => [body.scrollWidth, body.clientWidth]);
  expect(content).toBeLessThanOrEqual(view);
});

/** As on an iPhone, with the plugin offered there (its manifest says so
 *  from the release that opens it to phones). */
const PHONE = {
  userAgent:
    "Mozilla/5.0 (iPhone; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  viewport: { width: 390, height: 844 },
  hasTouch: true,
};
const onPhones = { ...manifest, platforms: ["desktop", "ios"] };
/** The app hidden or shown, as when the user leaves it and comes back. */
const setVisible = (page: Page, visible: boolean) =>
  page.evaluate((visible) => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => (visible ? "visible" : "hidden"),
    });
    document.dispatchEvent(new Event("visibilitychange"));
  }, visible);

test("on a phone, a sync stops as Textus leaves and goes on, unasked, when it is back", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL, ...PHONE });
  const page = await context.newPage();
  try {
    const remote = new Remote();
    await open(
      page,
      remote,
      { "/work/notes/note.md": "# Phone" },
      "en",
      onPhones,
    );
    const panel = await configure(page, "webdav");
    await panel.locator("#automatic").check();
    await expect(panel.locator("#status")).toHaveText("Settings saved.");
    let release = () => {};
    remote.held = new Promise((done) => (release = done));
    await panel.locator("#sync").click();
    await expect(panel.locator("#cancel")).toBeVisible();
    await setVisible(page, false);
    remote.held = null;
    release();
    await expect(panel.locator("#status")).toHaveText(
      "Paused while Textus is in the background; it goes on when you come back.",
    );
    expect(
      [...remote.files.keys()].some((key) => key.endsWith("/v2/head.bin")),
    ).toBe(false);
    await setVisible(page, true);
    await expect(panel.locator("#status")).toContainText("uploaded 1");
    expect(
      [...remote.files.keys()].some((key) => key.endsWith("/v2/head.bin")),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("on a phone, the page is one column, offers the largest file, and opens a conflict copy from its list", async ({
  browser,
  baseURL,
}) => {
  const remote = new Remote();
  const desk = await device(browser, baseURL!, remote, {
    "/work/notes/note.md": "base",
  });
  const context = await browser.newContext({ baseURL, ...PHONE });
  const page = await context.newPage();
  try {
    const panel = await open(page, remote, {}, "en", onPhones);
    // One field a line, as wide as the page, and nothing wider.
    const field = (await panel.locator("#account").boundingBox())!;
    const form = (await panel.locator("#fields").boundingBox())!;
    expect(field.width).toBeGreaterThan(form.width * 0.8);
    const [content, view] = await panel
      .locator("body")
      .evaluate((body) => [body.scrollWidth, body.clientWidth]);
    expect(content).toBeLessThanOrEqual(view);
    await configure(page, "webdav");
    await expect(panel.locator("#maxFileMiB-name")).toHaveText("32 MB");
    await configure(desk.page, "webdav");
    await sync(desk.page);
    await sync(page);
    for (const [p, text] of [
      [desk.page, "edit on the computer"],
      [page, "edit on the phone"],
    ] as const)
      await p.evaluate((text) => {
        (window as unknown as { __devFs: Record<string, string> }).__devFs[
          "/work/notes/note.md"
        ] = text;
      }, text);
    await sync(desk.page);
    await sync(page);
    const copy = panel.locator("#results .tx-list-row");
    await expect(copy).toHaveText(/^Sync conflicts\/note \(\w{8}\)\.md$/);
    await copy.click();
    await expect(
      page.locator('[data-active-tab="true"] .ProseMirror'),
    ).toHaveText("edit on the computer");
  } finally {
    await context.close();
    await desk.context.close();
  }
});
