export interface Pace {
  /** Quiet time after the last save before syncing. */
  settle: number;
  /** Shortest time between the end of one sync and a save-triggered one. */
  gap: number;
  /** The fallback interval. */
  every: number;
}
/** A save during a burst of saves waits for the burst to end, but no longer
 *  than this. */
const MAX_WAIT = 60_000;

/** When the next automatic sync runs: a few seconds after saves settle, else
 *  every interval. Never while one is running. */
export class Pacer {
  private timer?: ReturnType<typeof setTimeout>;
  private since: number | null = null;
  private last = -Infinity;
  private pace: Pace | null = null;
  constructor(
    private run: () => void,
    private busy: () => boolean,
    private now = () => Date.now(),
  ) {}
  configure(pace: Pace | null) {
    this.pace = pace;
    if (!pace) this.since = null;
    this.arm();
  }
  saved() {
    if (!this.pace) return;
    this.since ??= this.now();
    this.arm();
  }
  finished() {
    this.last = this.now();
    this.arm();
  }
  stop() {
    this.configure(null);
  }
  private arm() {
    clearTimeout(this.timer);
    if (!this.pace) return;
    const { settle, gap, every } = this.pace;
    const now = this.now();
    const at =
      this.since === null
        ? now + every
        : Math.max(
            this.last + gap,
            Math.min(now + settle, this.since + MAX_WAIT),
          );
    this.wait(at - now);
  }
  private wait(ms: number) {
    this.timer = setTimeout(() => {
      // A sync is already running: look again shortly; its end re-arms too.
      if (this.busy()) return this.wait(this.pace?.settle ?? 0);
      this.since = null;
      this.run();
    }, ms);
  }
}
