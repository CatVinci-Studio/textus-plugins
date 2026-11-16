/** Up to `limit` tasks at once. A task's failure comes back from the next
 *  `add` or from `drain`, and stops new ones starting. */
export class Pool {
  private running = new Set<Promise<void>>();
  private failure: { error: unknown } | null = null;
  constructor(private limit: number) {}
  private check() {
    if (this.failure) throw this.failure.error;
  }
  /** `task` started once a slot is free. */
  async add(task: () => Promise<void>) {
    while (this.running.size >= this.limit) await Promise.race(this.running);
    this.check();
    const run: Promise<void> = task()
      .catch((error) => {
        this.failure ??= { error };
      })
      .finally(() => this.running.delete(run));
    this.running.add(run);
  }
  /** Every task done, or the first failure. */
  async drain() {
    while (this.running.size) await Promise.race(this.running);
    this.check();
  }
  /** Every started task settled, failed or not: before the lock goes. */
  async settle() {
    while (this.running.size) await Promise.race(this.running);
  }
}
