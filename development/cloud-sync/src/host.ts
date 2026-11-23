import { pendingIn } from "./pending";
import { defaults, normalizeConfig, withConnection } from "./config";
import { receive, type Host } from "./messages";
import { StatusBar } from "./status-bar";
import { parseBase } from "./content";
import { synchronize } from "./engine";
import { DeletionQuestion } from "./guard";
import { lockNoteIn } from "./lock";
import { readGitignore, scopeOf } from "./scope";
import { openEncryptedStore } from "./encrypted-store";
import { openPlainStore } from "./plain-store";
import { Workspace } from "./local";
import { Pacer } from "./pacer";
import { masked, Settings } from "./settings";
import { doneText, fewPerSecond } from "./status";
import { RemoteStore, testConnection } from "./transport";
import { recoverLock, testDraft, type Draft } from "./connection";
import {
  deviceName,
  registerHistory,
  restoreInto,
  type Restore,
} from "./history-host";
import {
  ID,
  type ViewState,
  SyncError,
  checkAbort,
  type Config,
  type ObjectStore,
  type Result,
} from "./model";

class Controller implements Host {
  readonly settings: Settings;
  readonly views = new Set<Textus.Webview>();
  private pacer = new Pacer(
    () => void this.sync(false),
    () => this.state.busy,
  );
  private deletions = new DeletionQuestion();
  private bar?: StatusBar;
  /** Stores whose exclusive create was proven this session. */
  private tested = new Set<string>();
  private abort?: AbortController;
  /** The latest run's workspace; its own trash and rename events arrive late. */
  private workspace?: Workspace;
  private disposed = false;
  state: ViewState = {
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
    readonly api: Textus.Api,
  ) {
    this.settings = new Settings(ctx);
  }
  t = (key: string, ...args: unknown[]) => this.api.l10n.t(key, ...args);
  send(view: Textus.Webview, message: unknown) {
    // A tab can close while a status update crosses the asynchronous bridge.
    void view.postMessage(message).catch(() => this.views.delete(view));
  }
  broadcast() {
    for (const view of this.views)
      this.send(view, { type: "state", ...this.state });
    this.bar?.show();
  }
  message(key: string, error = false, ...args: unknown[]) {
    this.state.message = this.t(key, ...args);
    this.state.error = error;
    this.broadcast();
  }
  private stopped?: SyncError;
  fail(error: unknown) {
    const e =
      error instanceof SyncError ? error : new SyncError("unknownError");
    this.stopped = e;
    this.message(e.code, true, ...e.args);
    // Provider response bodies and raw network errors can contain credentials.
    this.ctx.log.warn(e.code);
    return e.code;
  }
  /** A sync; one stopped before deleting many files from the cloud asks
   *  the person, and runs again with what they agreed to. */
  async sync(byHand = true, allowDeletions = 0): Promise<string | null> {
    const code = await this.operation(
      "sync",
      undefined,
      undefined,
      allowDeletions,
    );
    if (code !== "manyDeletions" || this.disposed) return code;
    const count = Number(this.stopped?.args[0]);
    const yes = await this.deletions.ask(count, byHand, (n) =>
      this.api.ui.confirm(this.t("confirmDeletions", n), {
        danger: true,
        okLabel: this.t("deleteInCloud"),
      }),
    );
    if (yes) return this.sync(byHand, count);
    if (yes === false) this.message("deletionsKept");
    return code;
  }
  async refresh() {
    const root = await this.api.files.root();
    const config = root ? await this.settings.load(root) : { ...defaults };
    let configured = false;
    let account: string | undefined;
    if (root)
      try {
        account = masked(
          (await this.settings.credentials(root, config)).account,
        );
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
      account: configured ? account : undefined,
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
            gap: config.saveGap * 60_000,
            every: config.interval * 60_000,
          }
        : null,
    );
  }
  saved = () => (this.state.configured ? this.state.config : null);
  private async store() {
    const root = await this.api.files.root();
    if (!root) throw new SyncError("noFolder");
    if (root !== this.state.root) throw new SyncError("rootChanged");
    const config = await this.settings.load(root);
    const credentials = await this.settings.credentials(root, config);
    const store = new RemoteStore(config, credentials, this.api.net.fetch);
    // A busy server asked for a pause: said, so the sync isn't taken as stuck.
    store.onWait = (seconds) =>
      this.message("waiting", false, Math.ceil(seconds));
    return { root, config, store };
  }
  /** The remote folder, opened plain or encrypted as the folder is set up. */
  private async open(
    root: string,
    config: Config,
    store: RemoteStore,
    { test = false, quiet = false } = {},
  ) {
    const key = await this.settings.baseKey(root, config);
    const pin = await this.ctx.storage.global.get(`vault:${key}`);
    if (pin != null && (typeof pin !== "string" || !/^[a-f0-9]{64}$/.test(pin)))
      throw new SyncError("invalidBase");
    let opened: ObjectStore;
    if (config.encrypt) {
      if (!quiet) this.message("unlockingEncryption");
      const encrypted = await openEncryptedStore(
        store,
        await this.settings.password(root, config),
        {
          pin: pin as string | undefined,
          signal: this.abort?.signal,
        },
      );
      await this.ctx.storage.global.set(`vault:${key}`, encrypted.fingerprint);
      opened = encrypted;
    } else opened = await openPlainStore(store);
    if (test || !this.tested.has(key)) await testConnection(opened);
    this.tested.add(key);
    checkAbort(this.abort?.signal);
    return { key, opened };
  }
  page = (name: string) => this.ctx.plugin.readText(name);
  /** The remote folder as the history page reads it. */
  async remote() {
    const { root, config, store } = await this.store();
    return {
      root,
      store: (await this.open(root, config, store, { quiet: true })).opened,
    };
  }
  /** Runs one operation; resolves to its error's code, null when it went well. */
  async operation(
    kind: "sync" | "test" | "unlock",
    restore?: Restore,
    draft?: Draft,
    allowDeletions = 0,
  ): Promise<string | null> {
    if (this.state.busy || this.disposed) return "busy";
    this.state.busy = true;
    this.state.progress = null;
    this.abort = new AbortController();
    this.message(kind === "sync" ? "scanning" : "testing");
    try {
      // A connection being typed in, tested before it is saved.
      if (draft) {
        const root = this.state.root;
        if (!root) throw new SyncError("noFolder");
        const config = normalizeConfig(
          withConnection(this.saved(), draft.config),
        );
        const keys = await this.settings.resolve(
          root,
          config,
          draft.credentials,
        );
        await testDraft(config, keys, this.api.net.fetch, this.abort?.signal);
        this.message("tested");
        return null;
      }
      const { root, config, store } = await this.store();
      if (kind === "unlock") {
        const said = await recoverLock(store, {
          language: this.api.env.language,
          confirm: (at) =>
            this.api.ui.confirm(this.t("confirmUnlock", at), {
              danger: true,
              okLabel: this.t("unlock"),
            }),
          signal: this.abort?.signal,
        });
        if (said) this.message(said);
        return null;
      }
      const { key, opened } = await this.open(root, config, store, {
        test: kind === "test",
      });
      if (kind === "test") {
        this.message("tested");
        return null;
      }
      const base = parseBase(await this.ctx.storage.global.get(key));
      this.pacer.started();
      // The folder's .gitignore, read each sync: it changes as Git's does.
      const gitignore = config.gitignore
        ? await readGitignore(this.api.files, root)
        : "";
      this.workspace = new Workspace(
        this.api,
        root,
        this.ctx.storage.global,
        this.abort.signal,
        scopeOf(config, gitignore),
      );
      if (restore) await restoreInto(this.workspace, opened, restore);
      const cleaned = `cleaned:${key}`;
      const cleanupDue =
        Date.now() - Number((await this.ctx.storage.global.get(cleaned)) ?? 0) >
        86_400_000;
      const result = await synchronize({
        store: opened,
        local: this.workspace,
        keep: { days: config.keepDays, chosen: config.keepPending === true },
        // The folder's setting, once published, is this device's too.
        onKeep: async (keep) => {
          if (keep.days === config.keepDays && !config.keepPending) return;
          const adopted = await this.settings.adoptKeep(
            root,
            keep,
            config.keepDays,
          );
          if (adopted && this.state.root === root)
            this.state.config = {
              ...this.state.config,
              keepDays: keep.days,
              keepPending: false,
            };
        },
        device: await deviceName(this.ctx, this.api),
        cleanupDue,
        parallel: config.parallel,
        base,
        signal: this.abort.signal,
        saveBase: (next) => this.ctx.storage.global.set(key, next),
        pending: pendingIn(this.ctx.storage.global, key),
        lockNote: lockNoteIn(this.ctx.storage.global, key),
        allowDeletions,
        progress: fewPerSecond((phase, current, total) => {
          this.state.progress = total ? current / total : null;
          this.message(phase, false, current, total);
        }),
      });
      const at = new Date().toISOString();
      await this.ctx.storage.global.set(`last:${key}`, { at, result });
      if (cleanupDue) await this.ctx.storage.global.set(cleaned, Date.now());
      if ((await this.api.files.root()) !== root) {
        await this.refresh();
        return null;
      }
      this.state.result = result;
      this.state.lastRun = at;
      const done = doneText(result, this.t);
      if (done) this.message("done", false, done);
      else this.message("unchanged");
      return null;
    } catch (error) {
      return this.fail(error);
    } finally {
      this.state.busy = false;
      this.state.progress = null;
      this.abort = undefined;
      this.broadcast();
      this.pacer.finished();
    }
  }
  cancel() {
    this.abort?.abort();
  }
  /** One page over one state; in the sidebar (`compact`) only the
   *  status and Sync now, the connection being set up on the plugin's own
   *  page - a sidebar keeps to what is used at a glance. On the plugin's
   *  page (`settings`) its groups line up with the page's own. */
  async resolve(view: Textus.Webview, place?: "sidebar" | "settings") {
    this.views.add(view);
    view.onDidReceiveMessage((m) => {
      void receive(this, m);
    });
    view.onDidDispose(() => this.views.delete(view));
    const html = await this.ctx.plugin.readText("panel.html");
    view.html = place
      ? html.replace("<body>", `<body data-place="${place}">`)
      : html;
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
      api.commands.register(`${ID}.sync`, () => this.sync()),
      // The tab, the sidebar and Settings show one page over one state.
      api.views.registerWebview(`${ID}.panel`, {
        resolve: (view) => this.resolve(view),
      }),
      api.views.registerWebview(`${ID}.sidebar`, {
        resolve: (view) => this.resolve(view, "sidebar"),
      }),
      api.views.registerSettingsPage({
        resolve: (view) => this.resolve(view, "settings"),
      }),
      ...registerHistory(api, this),
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
    this.bar = new StatusBar(api, this.t, () =>
      this.disposed ? null : this.state,
    );
    await this.refresh();
  }
  stop() {
    this.disposed = true;
    this.pacer.stop();
    this.abort?.abort();
    this.bar?.stop();
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
