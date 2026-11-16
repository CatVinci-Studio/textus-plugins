import { encode, type ObjectStore } from "./model";

/**
 * Blocks this device stored that no published manifest names yet, kept
 * between runs: a sync stopped halfway (cancelled, offline, a service's
 * request limit) goes on where it was instead of checking each block again.
 * They count only while the remote is at the revision they were stored
 * under - a publish elsewhere may have cleaned them away.
 */
export interface Pending {
  revision: string;
  /** A first upload's marker on the remote (see `resume`). */
  marker?: string;
  hashes: string[];
}

export interface PendingStore {
  load(): Promise<unknown>;
  save(pending: Pending | null): Promise<void>;
}

/** The most kept: a few MB of hex at worst. */
const KEPT = 20_000;
/** Blocks stored between two saves. */
const SAVE_EVERY = 100;

const markerKey = (id: string) => `v1/pending/${id}.json`;

function parsePending(value: unknown): Pending | null {
  const p = value as Partial<Pending> | null;
  if (!p || typeof p.revision !== "string" || !Array.isArray(p.hashes))
    return null;
  return {
    revision: p.revision,
    marker: typeof p.marker === "string" ? p.marker : undefined,
    hashes: p.hashes.filter((h): h is string => typeof h === "string"),
  };
}

/**
 * This run's pending blocks: the last run's when they still hold, else none.
 * With no revision yet (a first upload) the revision can't tell a stopped
 * upload from a remote emptied to start over, so a marker put on the remote
 * when the upload began must still be there.
 */
export async function resume(
  store: ObjectStore,
  revision: string,
  saved: PendingStore | undefined,
): Promise<Pending> {
  const last = parsePending(await saved?.load());
  if (
    last &&
    last.revision === revision &&
    (revision || (last.marker && (await store.has(markerKey(last.marker)))))
  )
    return last;
  return { revision, hashes: [] };
}

/** Keeps a run's stored blocks as it goes, saved now and then. */
export class PendingBlocks {
  private since = 0;
  private saving = Promise.resolve();

  constructor(
    private readonly store: ObjectStore,
    private readonly pending: Pending,
    private readonly saved: PendingStore | undefined,
  ) {}

  get hashes(): readonly string[] {
    return this.pending.hashes;
  }

  /** Before a first upload stores anything: its marker on the remote. */
  async begin() {
    if (this.pending.revision || this.pending.marker) return;
    const marker = crypto.randomUUID();
    await this.store.put(markerKey(marker), encode({}));
    this.pending.marker = marker;
  }

  stored(hash: string) {
    this.pending.hashes.push(hash);
    if (++this.since >= SAVE_EVERY) void this.save();
  }

  /** Kept for the next run: this one stopped before publishing. */
  save(): Promise<void> {
    if (!this.saved) return Promise.resolve();
    this.since = 0;
    const { revision, marker, hashes } = this.pending;
    const kept = { revision, marker, hashes: hashes.slice(-KEPT) };
    this.saving = this.saving
      .then(() => this.saved!.save(kept))
      .catch(() => {});
    return this.saving;
  }

  /** Published: every block is named by the manifest now. */
  async done() {
    await this.saving;
    // Left behind, it is dropped next run: the revision has moved on.
    await this.saved?.save(null).catch(() => {});
    const { marker } = this.pending;
    if (marker) await this.store.remove(markerKey(marker)).catch(() => {});
  }
}

/** The pending blocks of the folder whose base is `key`, in plugin storage. */
export const pendingIn = (
  storage: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
  },
  key: string,
): PendingStore => ({
  load: () => storage.get(`pending:${key}`),
  save: (pending) => storage.set(`pending:${key}`, pending),
});
