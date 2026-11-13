import { ENCRYPTION_FORMAT } from "./encryption";
import { ENCRYPTED_HEAD } from "./encrypted-store";
import { HEAD, SyncError, type ObjectStore } from "./model";

/** An unencrypted folder is the store itself; one that holds encrypted data
 *  is refused, so the two never mix in one remote folder. */
export async function openPlainStore(raw: ObjectStore): Promise<ObjectStore> {
  const head = await raw.get(HEAD);
  let format: unknown;
  try {
    format = head && JSON.parse(new TextDecoder().decode(head))?.format;
  } catch {
    format = undefined;
  }
  if (format === ENCRYPTION_FORMAT || (await raw.has(ENCRYPTED_HEAD)))
    throw new SyncError("remoteEncrypted");
  return raw;
}
