import { defaults, identity, normalizeConfig } from "./config";
import { deviceOf, folderKey } from "./device";
import { hash } from "./content";
import { validatePassword } from "./encryption";
import { scanKey } from "./scan-cache";
import {
  SyncError,
  type Config,
  type Keep,
  type Credentials,
  type ConnectionInput,
} from "./model";

type SavedCredentials = Credentials & { syncPassword?: string };

/** What the page's sync options change; the rest is the connection. */
const OPTIONS = [
  "automatic",
  "interval",
  "saveGap",
  "keepDays",
  "exclude",
  "gitignore",
  "obsidian",
  "parallel",
  "maxFileMiB",
] as const;

/** An account shown, not given away: its start and dots. */
export const masked = (account: string) =>
  account.length > 8 ? `${account.slice(0, 4)}••••` : "••••";

export class Settings {
  readonly device;
  constructor(
    private ctx: Textus.PluginContext,
    private platform?: string,
  ) {
    this.device = deviceOf(platform);
  }
  private folder = (root: string) => folderKey(root, this.platform);
  private async scope(root: string) {
    return hash(new TextEncoder().encode(this.folder(root)));
  }
  async load(root: string): Promise<Config> {
    const raw = await this.ctx.storage.global.get(
      `config:${await this.scope(root)}`,
    );
    if (!raw) return { ...defaults };
    // Saved before encryption was a choice: it was always on.
    const saved = raw as Partial<Config>;
    return normalizeConfig(
      { ...saved, encrypt: saved.encrypt ?? true },
      this.device,
    );
  }
  private async secretKey(root: string, config: Config) {
    return `connection:${await hash(new TextEncoder().encode(this.folder(root) + identity(config)))}`;
  }
  async credentials(root: string, config: Config): Promise<SavedCredentials> {
    const saved = await this.ctx.secrets.get(
      await this.secretKey(root, config),
    );
    if (!saved) throw new SyncError("credentialsRequired");
    try {
      const value = JSON.parse(saved) as SavedCredentials;
      if (!value.account || !value.secret) throw new Error();
      return value;
    } catch {
      throw new SyncError("credentialsRequired");
    }
  }
  /** The sync password, for an encrypted folder only. */
  async password(root: string, config: Config) {
    if (!config.encrypt) return "";
    const password = (await this.credentials(root, config)).syncPassword ?? "";
    validatePassword(password);
    return password;
  }
  async save(
    root: string,
    input: Partial<Config>,
    incoming: ConnectionInput,
  ): Promise<Config> {
    const config = normalizeConfig(input, this.device);
    // Only a keep picked on the page is a new choice; otherwise the one
    // known here stays (the page may show one from before a sync).
    const before = await this.load(root).catch(() => null);
    if (!config.keepPending && before) {
      config.keepDays = before.keepDays;
      config.keepPending = before.keepPending;
    }
    await this.ctx.secrets.set(
      await this.secretKey(root, config),
      JSON.stringify(await this.resolve(root, config, incoming)),
    );
    await this.ctx.storage.global.set(
      `config:${await this.scope(root)}`,
      config,
    );
    return config;
  }
  /** The credentials `incoming` makes for `config`: a field left empty keeps
   *  the one saved for this connection. Checked, not saved. */
  async resolve(
    root: string,
    config: Config,
    incoming: ConnectionInput,
  ): Promise<SavedCredentials> {
    let previous: SavedCredentials = { account: "", secret: "" };
    try {
      previous = await this.credentials(root, config);
    } catch {
      /* A new connection. */
    }
    const account = String(incoming.account ?? "").trim() || previous.account;
    const secret = String(incoming.secret ?? "") || previous.secret;
    if (!account || !secret) throw new SyncError("credentialsRequired");
    // Changing the account cannot silently reuse a different account's secret.
    if (account !== previous.account && !incoming.secret)
      throw new SyncError("credentialsRequired");
    // Kept while encryption is off, for when it is turned back on.
    const syncPassword =
      String(incoming.syncPassword ?? "") || previous.syncPassword || "";
    const sessionToken =
      String(incoming.sessionToken ?? "") ||
      (incoming.secret ? "" : previous.sessionToken);
    if (config.encrypt) {
      validatePassword(syncPassword);
      if (
        (incoming.syncPassword || incoming.confirmPassword) &&
        incoming.syncPassword !== incoming.confirmPassword
      )
        throw new SyncError("syncPasswordMismatch");
      if ([account, secret, sessionToken].includes(syncPassword))
        throw new SyncError("syncPasswordSeparate");
    }
    return { account, secret, syncPassword, sessionToken };
  }
  /** The sync options alone, not the connection: saved as they change. */
  async saveOptions(root: string, options: Partial<Config>): Promise<Config> {
    const picked = Object.fromEntries(
      OPTIONS.filter((k) => k in options).map((k) => [k, options[k]]),
    );
    const next = normalizeConfig(
      { ...(await this.load(root)), ...picked },
      this.device,
    );
    // A keep picked here is this device's to publish (keepPending).
    if ("keepDays" in options) next.keepPending = true;
    await this.ctx.storage.global.set(`config:${await this.scope(root)}`, next);
    return next;
  }
  /** The folder's connection removed from this device: its keys and its
   *  settings. Nothing in the folder or the cloud changes. */
  /** Disconnect: this folder's keys, settings and sync record (its
   *  baseline, last result, encryption pin and half-sent blocks), so
   *  connecting again is a first sync, which deletes nothing. A lock a
   *  killed run left keeps its note: the next run takes that lock back. */
  async forget(root: string) {
    const config = await this.load(root);
    const base = await this.baseKey(root, config).catch(() => null);
    if (base)
      for (const key of [
        base,
        `last:${base}`,
        `vault:${base}`,
        `pending:${base}`,
      ])
        await this.ctx.storage.global.set(key, null);
    await this.ctx.secrets.delete(await this.secretKey(root, config));
    await this.ctx.storage.global.set(`config:${await this.scope(root)}`, null);
    await this.ctx.storage.global.set(await scanKey(this.folder(root)), null);
  }
  /** The folder's keep setting, as a sync that carried `carried` left it,
   *  taken as this one's; false when one was picked meanwhile (it goes out
   *  with the next sync). */
  async adoptKeep(root: string, keep: Keep, carried: number) {
    const key = `config:${await this.scope(root)}`;
    const saved = (await this.ctx.storage.global.get(key)) as Config | null;
    if (!saved || (saved.keepPending && saved.keepDays !== carried))
      return false;
    await this.ctx.storage.global.set(key, {
      ...(saved as Config),
      keepDays: keep.days,
      keepPending: false,
    });
    return true;
  }
  async baseKey(root: string, config: Config) {
    const { account } = await this.credentials(root, config);
    return `encrypted-base:${await hash(new TextEncoder().encode(this.folder(root) + identity(config) + "\n" + account))}`;
  }
}
