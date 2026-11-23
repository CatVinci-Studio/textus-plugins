/** Coming back to Textus this long after the last sync syncs again. */
export const RETURN_GAP = 2 * 60_000;

export interface Syncing {
  /** Automatic sync is on for the open folder, which has a connection. */
  automatic(): boolean;
  busy(): boolean;
  sync(): void;
  /** The running sync stops after its current request. */
  cancel(): void;
  /** The automatic sync's timers held, or let go. */
  pause(paused: boolean): void;
}

/** When a phone syncs: once a folder opens, and on coming back to Textus
 *  when the last sync is two minutes old or was cut short. Never in the
 *  background, where the system may stop Textus at any moment: the sync
 *  running then stops after its current request, and goes on when Textus
 *  is back. */
export class Lifecycle {
  private last = -Infinity;
  private due = false;
  /** A sync stopped as Textus left, automatic or not: it goes on. */
  private cut = false;
  away: boolean;
  constructor(
    private s: Syncing,
    state: string,
    private now = () => Date.now(),
  ) {
    this.away = state === "background";
    if (this.away) s.pause(true);
  }
  opened() {
    this.run();
  }
  changed(state: string) {
    if (state === "background") {
      if (this.away) return;
      this.away = true;
      this.s.pause(true);
      if (this.s.busy()) {
        this.s.cancel();
        this.cut = true;
      }
    } else if (state === "active" && this.away) {
      this.away = false;
      this.s.pause(false);
      if (this.cut || this.now() - this.last >= RETURN_GAP) this.run();
    }
  }
  /** A sync ended; `ok` when it went through. */
  finished(ok: boolean) {
    if (ok) this.last = this.now();
    // Went through after all, before the stop reached it.
    if (ok && this.away) this.cut = false;
    if (this.due) {
      this.due = false;
      this.run();
    }
  }
  private run() {
    if (this.away || !(this.cut || this.s.automatic())) return;
    if (this.s.busy()) this.due = true;
    else {
      this.cut = false;
      this.s.sync();
    }
  }
}
