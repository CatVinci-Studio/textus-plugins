import { withConnection } from "./config";
import type { Draft } from "./connection";
import type { Restore } from "./history-host";
import type { Settings } from "./settings";
import {
  SyncError,
  type Config,
  type ConnectionInput,
  type ViewState,
} from "./model";

/** What the plugin's pages ask of it, the controller answering. */
export interface Host {
  readonly api: Textus.Api;
  readonly settings: Settings;
  readonly state: ViewState;
  readonly views: Set<Textus.Webview>;
  t(key: string, ...args: unknown[]): string;
  broadcast(): void;
  send(view: Textus.Webview, message: unknown): void;
  message(key: string, error?: boolean, ...args: unknown[]): void;
  fail(error: unknown): string;
  refresh(): Promise<void>;
  sync(): Promise<string | null>;
  operation(
    kind: "sync" | "test" | "unlock",
    restore?: Restore,
    draft?: Draft,
  ): Promise<string | null>;
  cancel(): void;
  /** The folder's saved settings, or null before it has a connection. */
  saved(): Config | null;
}

export async function receive(host: Host, message: unknown) {
  if (!message || typeof message !== "object") return;
  const m = message as {
    type?: string;
    config?: Partial<Config>;
    credentials?: ConnectionInput;
    options?: Partial<Config>;
  };
  const { api, settings, state } = host;
  try {
    if (m.type === "ready") {
      host.broadcast();
      return;
    }
    // From the sidebar's page: the form is on the plugin's own page.
    if (m.type === "openSettings") {
      await api.layout.openSettings();
      return;
    }
    if (m.type === "cancel") {
      host.cancel();
      host.message("cancelling");
      return;
    }
    // The sync options apply as they change, a sync running or not.
    if (m.type === "options" && m.options && state.root) {
      await settings.saveOptions(state.root, m.options);
      await host.refresh();
      host.message("optionsSaved");
      return;
    }
    if (state.busy) throw new SyncError("busy");
    if (m.type === "disconnect" && state.root) {
      if (
        !(await api.ui.confirm(host.t("confirmDisconnect"), {
          danger: true,
          okLabel: host.t("disconnect"),
        }))
      )
        return;
      await settings.forget(state.root);
      await host.refresh();
      host.message("disconnected");
      return;
    }
    if (m.type === "test" && m.config && m.credentials) {
      await host.operation("test", undefined, {
        config: m.config,
        credentials: m.credentials,
      });
      return;
    }
    if (m.type === "save" && m.config && m.credentials) {
      const root = await api.files.root();
      if (!root || root !== state.root) throw new SyncError("rootChanged");
      state.busy = true;
      host.broadcast();
      try {
        // The connection from the form, the options as they are.
        await settings.save(
          root,
          withConnection(host.saved(), m.config),
          m.credentials,
        );
        await host.refresh();
        for (const view of host.views) host.send(view, { type: "saved" });
        host.message("saved");
      } finally {
        host.state.busy = false;
        host.broadcast();
      }
    } else if (m.type === "sync") await host.sync();
    else if (m.type === "test" || m.type === "unlock")
      await host.operation(m.type);
  } catch (error) {
    host.fail(error);
  }
}
