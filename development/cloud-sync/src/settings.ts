import { defaults, identity, normalizeConfig } from "./config";
import { hash } from "./content";
import { validatePassword } from "./encryption";
import {
  SyncError,
  type Config,
  type Keep,
  type Credentials,
  type ConnectionInput,
} from "./model";

type SavedCredentials = Credentials & { syncPassword?: string };

export class Settings {
  constructor(private ctx: Textus.PluginContext) {}
  private async scope(root: string) {
    return hash(new TextEncoder().encode(root));
  }
  async load(root: string): Promise<Config> {
    const raw = await this.ctx.storage.global.get(
      `config:${await this.scope(root)}`,
    );
    if (!raw) return { ...defaults };
    // Saved before encryption was a choice: it was always on.
    const saved = raw as Partial<Config>;
    return normalizeConfig({ ...saved, encrypt: saved.encrypt ?? true });
  }
  private async secretKey(root: string, config: Config) {
    return `connection:${await hash(new TextEncoder().encode(root + identity(config)))}`;
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
    const config = normalizeConfig(input);
    // Only a keep picked on the page is a new choice; otherwise the one
    // known here stays (the page may show one from before a sync).
    const before = await this.load(root).catch(() => null);
    if (!config.keepPending && before) {
      config.keepDays = before.keepDays;
      config.keepPending = before.keepPending;
    }
    const key = await this.secretKey(root, config);
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
    await this.ctx.secrets.set(
      key,
      JSON.stringify({
        account,
        secret,
        syncPassword,
        sessionToken,
      }),
    );
    await this.ctx.storage.global.set(
      `config:${await this.scope(root)}`,
      config,
    );
    return config;
  }
  /** The folder's keep setting, as a sync left it, taken as this one's. */
  async adoptKeep(root: string, keep: Keep) {
    const key = `config:${await this.scope(root)}`;
    const saved = await this.ctx.storage.global.get(key);
    if (!saved) return;
    await this.ctx.storage.global.set(key, {
      ...(saved as Config),
      keepDays: keep.days,
      keepPending: false,
    });
  }
  async baseKey(root: string, config: Config) {
    const { account } = await this.credentials(root, config);
    return `encrypted-base:${await hash(new TextEncoder().encode(root + identity(config) + "\n" + account))}`;
  }
}
