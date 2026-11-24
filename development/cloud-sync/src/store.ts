import { providers } from "./config";
import { GitHubStore } from "./github-store";
import type { Config, Credentials } from "./model";
import { RemoteStore, type Fetch } from "./transport";

/** A connection's store: the service it names speaks either HTTP calls
 *  (S3, WebDAV) or the repository's git database (GitHub). */
export type Store = RemoteStore | GitHubStore;

export function openStore(
  config: Config,
  credentials: Credentials,
  fetch: Fetch,
  sleep?: (ms: number) => Promise<unknown>,
): Store {
  return providers[config.provider].transport === "git"
    ? new GitHubStore(config, credentials, fetch, sleep)
    : new RemoteStore(config, credentials, fetch, sleep);
}