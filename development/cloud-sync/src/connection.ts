import { openEncryptedStore } from "./encrypted-store";
import { openPlainStore } from "./plain-store";
import { testConnection, type Fetch } from "./transport";
import { openStore, type Store } from "./store";
import {
  LOCK,
  SyncError,
  checkAbort,
  type Config,
  type ConnectionInput,
} from "./model";

/** A connection typed in, not yet saved. */
export interface Draft {
  config: Partial<Config>;
  credentials: ConnectionInput;
}

/** A connection tested as typed, before it is saved: `credentials` already
 *  resolved against the saved ones (Settings.resolve). */
export async function testDraft(
  config: Config,
  credentials: ConnectionInput & { syncPassword?: string },
  fetch: Fetch,
  signal?: AbortSignal,
) {
  const store = openStore(config, credentials, fetch);
  await testConnection(
    config.encrypt
      ? await openEncryptedStore(store, credentials.syncPassword ?? "", {
          signal,
        })
      : await openPlainStore(store),
  );
}

/** A stale remote lock removed, once the person confirms its start time;
 *  the message key to show, or null when they declined. */
export async function recoverLock(
  store: Store,
  {
    language,
    confirm,
    signal,
  }: {
    language: string;
    confirm: (at: string) => Promise<boolean>;
    signal?: AbortSignal;
  },
): Promise<string | null> {
  const raw = await store.get(LOCK);
  if (!raw) return "noLock";
  let at = "—";
  try {
    const parsed = JSON.parse(new TextDecoder().decode(raw));
    if (
      typeof parsed.startedAt === "string" &&
      Number.isFinite(Date.parse(parsed.startedAt))
    )
      at = new Date(parsed.startedAt).toLocaleString(language);
  } catch {
    /* An unknown lock is still removable with confirmation. */
  }
  if (!(await confirm(at))) return null;
  checkAbort(signal);
  const current = await store.get(LOCK);
  if (
    !current ||
    new TextDecoder().decode(raw) !== new TextDecoder().decode(current)
  )
    throw new SyncError("lockLost");
  await store.remove(LOCK);
  return "unlocked";
}
