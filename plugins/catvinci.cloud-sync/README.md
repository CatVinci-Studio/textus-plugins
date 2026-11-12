# Cloud Sync

Keep a folder the same on your computers through your own S3-compatible storage, WebDAV or Nutstore, encrypted before it leaves each device.

The storage service sees neither the contents of your files nor their names.
Cloud Sync needs Textus 1.3.2 or later on the desktop.

## Getting started

1. Open the folder to sync in Textus, then choose **Plugins › Cloud Sync**
   (or **Connection settings…** in its sidebar tab).
2. Pick the storage service and enter its server address and sign-in. Nutstore
   needs only your email and an app password from Account › Security.
3. Set a **sync password** of at least 12 characters and keep it in your
   password manager: it can't be reset.
4. Choose **Save connection**, then **Sync now**.

On another device, open the matching folder and enter the same service, the
same remote folder and the same sync password. Turn on **Sync automatically
while Textus is open**: it then syncs a few seconds after you save or rename a
file, and also every 5 minutes in case nothing triggered it (you can set 5 to
1,440 minutes). A file you delete goes out with the next sync. **Plugins › Sync
now** runs a sync at any time.

Once a connection is saved, the status bar shows how sync stands: **Synced ·
2 min. ago**, **Syncing…**, **Sync conflict** or **Sync error**. Click it to
open the panel.

When both devices changed the same file, both versions stay: yours in place,
the other device's in `Sync conflicts/`.

**Permissions:** read and write the open folder (to scan it and apply what
comes down), and reach any website (only the HTTPS server you enter). No
telemetry, analytics, remote code or self-updates.

## Details

S3 takes a custom endpoint (empty means AWS), region, bucket, path-style or
virtual-host addressing and an optional session token under **More options**.
The remote folder holds the plugin's storage format, not a plain file mirror;
use a different one for each workspace.

Credentials are stored through `ctx.secrets`, separately from sync state.
They are never sent back to the settings page or copied to the remote
manifest. Blank credential fields keep an existing connection's credentials.
Changing the endpoint, remote folder or account requires appropriate credentials.
The sync password is also saved locally through `ctx.secrets` for automatic sync,
never returned to the settings page or sent to the storage service. Blank password
fields retain it. Entering a different password here does not re-encrypt an existing
repository: it must match the password used to initialize that remote folder.

## What is synced

- Saved `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt` and `.csv` documents, and
  Obsidian's bases (`.base`) and canvases (`.canvas`).
- Images, PDF, Office/OpenDocument files, audio and video. The exact allowlist
  is `development/cloud-sync/src/config.ts` in the plugin repository.
- Textus project data: `.textus/agent.md`, `style.md`, `style.previous.md`,
  and Markdown under `.textus/library/`, `memory/` and `skills/`.

Global settings, chat history, drafts, unsaved edits, credentials, other
plugins' data, arbitrary dotfiles and build/dependency folders are excluded.
Only files inside the open workspace can be accessed. Files outside it,
including linked attachments outside the folder, are not uploaded.

The current limits are 128 MiB per file, 20,000 visited files/folders,
48 directory levels, and an 8 MiB manifest. Empty directories are not synced.
Paths that are unsafe on supported platforms, or differ only in case or
Unicode normalization, stop the run rather than being silently renamed.

## Changes and conflicts

SHA-256 hashes and the last successful sync determine which side changed.
Only changed content is transferred. Files are stored in 2 MiB blocks and
shared blocks are reused; ETags are not treated as content hashes.

- Independent edits are copied to the other device.
- Concurrent edits keep the local file and save the remote version under
  `Sync conflicts/`. Both versions are published for other devices.
- Open destination files are deferred; save and close them, then sync again.
- Existing text files are updated through Textus's version-checked
  `files.process` API. Existing binary files are never overwritten: differing
  attachments keep both versions, even when only one side changed. The current
  plugin API has no conditional binary replacement operation.
- A file deleted on one device is deleted on the others at their next sync,
  and the other devices move it to the system Trash, where you can restore it.
  The remote lists deleted files in its encrypted manifest for 30 days (the
  newest 2,000); there is no way to restore from that list in the app yet.
  A rename reaches the other devices as a rename.
- There is no remote garbage collection yet: a deleted file's encrypted
  blocks and old snapshots stay on the server, and anyone with the sync
  password can still recover it from there. To remove content for good, use
  a fresh remote folder for a cleaned workspace.
- An edit wins over a deletion: if one device deleted a file the other edited
  since they last synced, the edited file comes back everywhere.
- A device syncing a folder for the first time never deletes anything; a file
  only one side has is copied to the other.
- Files open in a tab are not removed or renamed; close them and sync again.
- Update every device to 0.4 before relying on deletions: an older device puts
  a file deleted elsewhere back.

Content and filenames are **encrypted before upload**, with HTTPS in transit.
Use a private S3 bucket or WebDAV folder. The service account
needs read, write and delete permission in the dedicated remote folder
(delete is needed for temporary objects and locks).

## Requests per sync

Measured by the tests over HTTP for a small document, after the session's
first sync (the first also checks the server's exclusive writes: 4 requests
more on S3):

| Sync                                  | S3  | WebDAV / Nutstore |
| ------------------------------------- | --- | ----------------- |
| Nothing changed                       | 8   | 16                |
| One edited document (one 2 MiB block) | 17  | 32                |
| One deleted file                      | 14  | 26                |

Each further changed block adds 3 requests on S3, up to 5 on WebDAV. WebDAV
costs more because it creates folders and takes the lock with an upload and a
`MOVE`. Syncs after saves wait until saving settles (5 s), and no sooner than
30 s (WebDAV) or 3 min (Nutstore) after the previous one, which keeps Nutstore
under its 550 requests per 30 minutes.

## End-to-end encryption

Cloud Sync always encrypts; there is no plaintext fallback or encryption-off switch.
File contents, paths, content hashes and snapshots are authenticated and encrypted
using AES-256-GCM through Web Crypto. Each encryption uses a fresh 96-bit nonce and
a 128-bit tag. Authentication binds the repository's encryption header and the
logical object key, preventing substitution between blocks, manifests and snapshots.

A 256-bit root is derived locally with PBKDF2-HMAC-SHA-256, 600,000 iterations and
a random 256-bit repository salt. HKDF-SHA-256 derives separate keys for AES and
HMAC-SHA-256 object naming. Names for content blocks are keyed HMACs, not public
plaintext hashes. Equal blocks are reused within a repository; unrelated repositories
use different salts and keys. Decryption authenticates bytes before applying files.

Only public KDF parameters, a repository ID and an encrypted fixed verification
message are stored in the encryption descriptor. A device pins the descriptor's
fingerprint after its first successful unlock and stops if it changes or disappears.
Wrong passwords, malformed descriptors and tampered ciphertext stop sync.

The provider can still observe the chosen remote prefix, object sizes and counts,
block reuse within one repository, request timing and the anonymous lock owner/time.
The protocol does not guarantee detection of a malicious server replaying an older
valid encrypted state. Strong passwords matter because remote ciphertext allows
offline password guessing; the KDF raises its cost but cannot make a weak password
strong. This implementation has automated interoperability and tampering tests,
but has not received an independent security audit.

Local files remain readable. The password lives in Textus's per-user local secrets
storage, not in the remote repository; this does not protect a compromised or unlocked
client. Losing the password or original encryption descriptor makes remote recovery
impossible. A full backup must include the descriptor and encrypted objects.

### Remote format

- `v1/head.json`: the public encryption descriptor (`textus-cloud-sync-e2ee/1`).
  The old path is intentional: v0.1 clients reject this format before uploading files.
- `v1/lock.json`: shared exclusion with old and new clients; no document data.
- `v2/head.bin`: encrypted current manifest, with the trash of deleted files.
- `v2/blocks/<prefix>/<HMAC>`: encrypted content blocks.
- `v2/snapshots/<revision>.bin`: immutable encrypted manifests.

Encrypted objects contain `TCS2`, a 12-byte nonce, then ciphertext and its 16-byte
GCM tag. AAD is UTF-8 of the canonical JSON header (`format`, `repositoryId`, `kdf`,
`iterations`, `salt`, in that order), a newline and the logical v1 object key. The
password is UTF-8 without normalization. HKDF uses the UTF-8 repository ID as salt
and `textus-cloud-sync-e2ee/1/content` or `/names` as info. Block HMAC input is the
UTF-8 logical `v1/blocks/<hash-prefix>/<SHA-256>` key. The verification plaintext is
`Textus encrypted workspace key check`, with logical key `key-check`; its envelope
is hex-encoded in `verifier`. These choices are verified against Node's independent
PBKDF2, HKDF, HMAC and AES-GCM APIs in tests.

### Upgrading from v0.1

An existing plaintext remote is refused without changing it. First ensure one local
workspace contains all the files and conflict copies you need, then select a **new,
empty remote folder** and set a sync password. Sync that complete workspace first;
other devices can then join using an encrypted version and the same password and remote folder.

Old remote data, including provider version history and backups, remains unencrypted.
The plugin does not automatically delete or migrate it. Manage old copies through
your provider after verifying the encrypted workspace. In-place password rotation
is not supported; use another new remote folder to change passwords.

## Interrupted sync

A remote lock serializes devices. S3 uses `If-None-Match: *`; WebDAV uses a
temporary upload followed by `MOVE` with `Overwrite: F`, including Nutstore's
409 response for an existing target. The connection test verifies exclusion
before a sync can touch workspace data. No listing API or unbounded directory
listing is required.

Encrypted blocks and an immutable snapshot are written before `v2/head.bin` is
published. The local baseline advances only after publication succeeds.
Retries reuse completed blocks. Cancellation stops after the current network
request and releases the lock when possible. Textus's network API bounds a
request to 60 seconds; it does not offer request-level cancellation.

New binary downloads reserve a path with a unique marker recorded in local
plugin storage. After an interrupted write, the next sync resumes that exact
marker instead of uploading it as file content. If another application changes
the file, its content is preserved. Keep the plugin's local data when retrying.

After a crash, **Sync stuck? › Recover stale lock** removes the lock only after
confirmation. Check that all other devices have stopped syncing first.
Locks never expire automatically, so a slow device cannot lose its write
ownership just because a timer expired. If the descriptor or current manifest is
accidentally removed, a previously joined device stops. Restore a complete remote
backup with the original descriptor. Encrypted snapshots are bound to their own
object names and cannot be copied directly over `v2/head.bin`; restoring a single
snapshot requires decrypting and re-encrypting it for that logical key. There is
currently no single-snapshot restore UI.
Do not change the remote files while a sync is running.

## Moving from the community plugin

The official plugin is `catvinci.cloud-sync`. The earlier community plugin,
`ciao1019.cloud-sync`, has separate local settings, secrets and sync state.
Before switching, finish or recover any interrupted sync with the old plugin,
then turn off its automatic sync and disable it. Keep a backup of the workspace.

Install the official plugin and enter the same storage connection, exact remote
folder and sync password. The encrypted remote format is unchanged, so existing
v0.2/v0.3 remote data can be read without moving or re-encrypting it. Local
credentials, descriptor pins and baselines are not copied across plugin IDs;
the first run joins the existing remote as a new device and may preserve
conflict copies if files differ. Never run both plugins' automatic sync on the
same workspace. Plaintext v0.1 data still needs the separate upgrade procedure above.

## Development and credits

Source, protocol tests and build instructions live in
[development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync).
The catalog packages the readable files in `plugins/catvinci.cloud-sync/`
without compiling them. Releases follow this repository's official plugin
workflow, with a tag such as `catvinci.cloud-sync-v0.3.0`.

Originally developed by Ciao1019; the 0.3.0 interface and setup improvements
were contributed by ChengAo Shen. The MIT notices are preserved in `LICENSE`
and `THIRD_PARTY_NOTICES.md`. The storage design was informed by Petrichor/Sylva's
`apps/api/internal/cloudsync/`; no Go source or PostgreSQL backup format is copied.

## Changes

- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
