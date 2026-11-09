import { defaults, providers } from "./config";
import { parseBase } from "./content";
import { synchronize } from "./engine";
import { openEncryptedStore } from "./encrypted-store";
import { Workspace } from "./local";
import { Pacer } from "./pacer";
import { Settings } from "./settings";
import { statusText } from "./status";
import { RemoteStore, testConnection } from "./transport";
import {
  ID,
  LOCK,
  SyncError,
  checkAbort,
  type Config,
  type ConnectionInput,
  type Result,
} from "./model";

interface ViewState {
  root: string | null;
  config: Config;
  configured: boolean;
  busy: boolean;
  message: string;
  error: boolean;
  progress: number | null;
  result?: Result;
  lastRun?: string;
}

class Controller {
  private settings: Settings;
  private views = new Set<Textus.Webview>();
  private pacer = new Pacer(
    () => void this.operation("sync"),
    () => this.state.busy,
  );
  private item?: Textus.StatusItemHandle;
  private shown: string | null = null;
  private clock?: ReturnType<typeof setInterval>;
  /** Stores whose exclusive create was proven this session. */
  private tested = new Set<string>();
  private abort?: AbortController;
  /** The latest run's workspace; its own trash and rename events arrive late. */
  private workspace?: Workspace;
  private disposed = false;
  private state: ViewState = {
    root: null,
    config: { ...defaults },
    configured: false,
    busy: false,
    message: "",
    error: false,
    progress: null,
  };
  constructor(
    private ctx: Textus.PluginContext,
    private api: Textus.Api,
  ) {
    this.settings = new Settings(ctx);
  }
  private t = (key: string, ...args: unknown[]) =>
    this.api.l10n.t(key, ...args);
  private send(view: Textus.Webview, message: unknown) {
    // A tab can close while a status update crosses the asynchronous bridge.
    void view.postMessage(message).catch(() => this.views.delete(view));
  }
  private broadcast() {
    for (const view of this.views)
      this.send(view, { type: "state", ...this.state });
    this.showStatus();
  }
  private showStatus() {
    const text = this.disposed
      ? null
      : statusText(this.state, Date.now(), this.t, this.api.env.language);
    if (!text) {
      this.item?.dispose();
      this.item = undefined;
    } else if (!this.item)
      this.item = this.api.ui.statusItem("status", {
        text,
        tooltip: this.state.message,
        command: `${ID}.open`,
      });
    else if (text !== this.shown)
      this.item.update({ text, tooltip: this.state.message });
    this.shown = text;
  }
  private message(key: string, error = false, ...args: unknown[]) {
    this.state.message = this.t(key, ...args);
    this.state.error = error;
    this.broadcast();
  }
  private fail(error: unknown) {
    const e =
      error instanceof SyncError ? error : new SyncError("unknownError");
    this.message(e.code, true, ...e.args);
    // Provider response bodies and raw network errors can contain credentials.
    this.ctx.log.warn(e.code);
  }
  async refresh() {
    const root = await this.api.files.root();
    const config = root ? await this.settings.load(root) : { ...defaults };
    let configured = false;
    if (root)
      try {
        await this.settings.credentials(root, config);
        await this.settings.password(root, config);
        configured = true;
      } catch {
        /* Not configured. */
      }
    this.state = {
      root,
      config,
      configured,
      busy: this.state.busy,
      message: this.t(
        !root ? "noFolder" : configured ? "ready" : "notConfigured",
      ),
      error: false,
      progress: null,
    };
    if (root && configured) {
      const key = await this.settings.baseKey(root, config);
      const last = (await this.ctx.storage.global.get(`last:${key}`)) as {
        at: string;
        result: Result;
      } | null;
      if (last && typeof last.at === "string") {
        this.state.lastRun = last.at;
        this.state.result = last.result;
      }
    }
    this.broadcast();
    this.pacer.configure(
      !this.disposed && config.automatic && configured && root
        ? {
            settle: 5_000,
            gap: providers[config.provider].saveGap,
            every: config.interval * 60_000,
          }
        : null,
    );
  }
  private async store() {
    const root = await this.api.files.root();
    if (!root) throw new SyncError("noFolder");
    if (root !== this.state.root) throw new SyncError("rootChanged");
    const config = await this.settings.load(root);
    const credentials = await this.settings.credentials(root, config);
    return {
      root,
      config,
      store: new RemoteStore(config, credentials, this.api.net.fetch),
    };
  }
  private async recover(store: RemoteStore) {
    const raw = await store.get(LOCK);
    if (!raw) {
      this.message("noLock");
      return;
    }
    let at = "—";
    try {
      const parsed = JSON.parse(new TextDecoder().decode(raw));
      if (
        typeof parsed.startedAt === "string" &&
        Number.isFinite(Date.parse(parsed.startedAt))
      )
        at = new Date(parsed.startedAt).toLocaleString(this.api.env.language);
    } catch {
      /* An unknown lock is still removable with confirmation. */
    }
    if (
      !(await this.api.ui.confirm(this.t("confirmUnlock", at), {
        danger: true,
        okLabel: this.t("unlock"),
      }))
    )
      return;
    checkAbort(this.abort?.signal);
    const current = await store.get(LOCK);
    if (
      !current ||
      new TextDecoder().decode(raw) !== new TextDecoder().decode(current)
    )
      throw new SyncError("lockLost");
    await store.remove(LOCK);
    this.message("unlocked");
  }
  async operation(kind: "sync" | "test" | "unlock") {
    if (this.state.busy || this.disposed) return;
    this.state.busy = true;
    this.state.progress = null;
    this.abort = new AbortController();
    this.message(kind === "sync" ? "scanning" : "testing");
    try {
      const { root, config, store } = await this.store();
      if (kind === "unlock") {
        await this.recover(store);
        return;
      }
      const key = await this.settings.baseKey(root, config);
      const pin = await this.ctx.storage.global.get(`vault:${key}`);
      if (
        pin != null &&
        (typeof pin !== "string" || !/^[a-f0-9]{64}$/.test(pin))
      )
        throw new SyncError("invalidBase");
      this.message("unlockingEncryption");
      const encrypted = await openEncryptedStore(
        store,
        await this.settings.password(root, config),
        {
          pin: pin as string | undefined,
          signal: this.abort.signal,
        },
      );
      await this.ctx.storage.global.set(`vault:${key}`, encrypted.fingerprint);
      if (kind === "test" || !this.tested.has(key))
        await testConnection(encrypted);
      this.tested.add(key);
      checkAbort(this.abort.signal);
      if (kind === "test") {
        this.message("tested");
        return;
      }
      const base = parseBase(await this.ctx.storage.global.get(key));
      this.pacer.started();
      this.workspace = new Workspace(
        this.api,
        root,
        this.ctx.storage.global,
        this.abort.signal,
      );
      const result = await synchronize({
        store: encrypted,
        local: this.workspace,
        base,
        signal: this.abort.signal,
        saveBase: (next) => this.ctx.storage.global.set(key, next),
        progress: (phase, current, total) => {
          this.state.progress = total ? current / total : null;
          this.message(phase, false, current, total);
        },
      });
      const at = new Date().toISOString();
      await this.ctx.storage.global.set(`last:${key}`, { at, result });
      if ((await this.api.files.root()) !== root) {
        await this.refresh();
        return;
      }
      this.state.result = result;
      this.state.lastRun = at;
      // Only what happened: "uploaded 2, 1 conflict copy".
      const parts = (
        [
          ["doneUploaded", result.uploaded],
          ["doneDownloaded", result.downloaded],
          ["doneRemoved", result.removed],
          ["doneMoved", result.moved],
          ["doneConflicts", result.conflicts.length],
          ["doneDeferred", result.deferred.length],
        ] as const
      )
        .filter(([, n]) => n > 0)
        .map(([key, n]) => this.t(key, n));
      if (parts.length)
        this.message("done", false, parts.join(this.t("listSeparator")));
      else this.message("unchanged");
    } catch (error) {
      this.fail(error);
    } finally {
      this.state.busy = false;
      this.state.progress = null;
      this.abort = undefined;
      this.broadcast();
      this.pacer.finished();
    }
  }
  private async receive(message: unknown) {
    if (!message || typeof message !== "object") return;
    const m = message as {
      type?: string;
      config?: Partial<Config>;
      credentials?: ConnectionInput;
    };
    try {
      if (m.type === "ready") {
        this.broadcast();
        return;
      }
      if (m.type === "cancel") {
        this.abort?.abort();
        this.message("cancelling");
        return;
      }
      if (this.state.busy) throw new SyncError("busy");
      if (m.type === "save" && m.config && m.credentials) {
        const root = await this.api.files.root();
        if (!root || root !== this.state.root)
          throw new SyncError("rootChanged");
        this.state.busy = true;
        this.broadcast();
        try {
          await this.settings.save(root, m.config, m.credentials);
          await this.refresh();
          for (const view of this.views) this.send(view, { type: "saved" });
          this.message("saved");
        } finally {
          this.state.busy = false;
          this.broadcast();
        }
      } else if (
        m.type === "sync" ||
        m.type === "test" ||
        m.type === "unlock"
      ) {
        await this.operation(m.type);
      }
    } catch (error) {
      this.fail(error);
    }
  }
  async resolve(view: Textus.Webview) {
    this.views.add(view);
    view.onDidReceiveMessage((m) => {
      void this.receive(m);
    });
    view.onDidDispose(() => this.views.delete(view));
    view.html = await this.ctx.plugin.readText("panel.html");
  }
  private changed(path: string) {
    if (!this.workspace?.touched.has(path)) this.pacer.saved();
  }
  async start() {
    const { api, ctx } = this;
    ctx.subscriptions.push(
      api.commands.register(`${ID}.open`, () =>
        api.layout.openView(`${ID}.panel`),
      ),
      api.commands.register(`${ID}.sync`, () => this.operation("sync")),
      // The tab, the sidebar and Settings show one page over one state.
      ...[`${ID}.panel`, `${ID}.sidebar`].map((id) =>
        api.views.registerWebview(id, {
          resolve: (view) => this.resolve(view),
        }),
      ),
      api.views.registerSettingsPage({ resolve: (view) => this.resolve(view) }),
      api.files.onDidSave(() => this.pacer.saved()),
      api.files.onDidDelete(({ path }) => this.changed(path)),
      api.files.onDidRename(({ from }) => this.changed(from)),
      api.files.onDidChangeRoot(({ path }) => {
        if (path === this.state.root) return;
        this.abort?.abort();
        void this.refresh().catch((e) => this.fail(e));
      }),
      { dispose: () => this.stop() },
    );
    this.clock = setInterval(() => this.showStatus(), 30_000);
    await this.refresh();
  }
  stop() {
    this.disposed = true;
    clearInterval(this.clock);
    this.pacer.stop();
    this.abort?.abort();
    this.showStatus();
  }
}

let controller: Controller | undefined;
export function activate(ctx: Textus.PluginContext) {
  controller = new Controller(ctx, textus);
  return controller.start();
}
export function deactivate() {
  controller?.stop();
}
