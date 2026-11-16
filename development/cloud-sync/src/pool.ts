/**
 * Transfers at once, both ways: at most `limit` of them and `budget` bytes
 * of files in memory (one always fits). A task's failure comes back from
 * the next `take` or from `drain`, and stops new ones starting.
 */
export class Pool {
  private running = new Set<Promise<void>>();
  private failure: { error: unknown } | null = null;
  private count = 0;
  private bytes = 0;
  private waiting: (() => void)[] = [];
  constructor(
    private limit: number,
    private budget: number,
  ) {}
  private check() {
    if (this.failure) throw this.failure.error;
  }
  /** A slot for `size` bytes, if one is free now. */
  tryTake(size: number) {
    const fits =
      this.count === 0 ||
      (this.count < this.limit && this.bytes + size <= this.budget);
    if (fits) {
      this.count++;
      this.bytes += size;
    }
    return fits;
  }
  /** A slot for `size` bytes, once one is free. */
  async take(size: number) {
    this.check();
    while (!this.tryTake(size)) {
      await new Promise<void>((wake) => this.waiting.push(wake));
      this.check();
    }
  }
  give(size: number) {
    this.count--;
    this.bytes -= size;
    const waiting = this.waiting;
    this.waiting = [];
    for (const wake of waiting) wake();
  }
  /** `task` run in a slot taken for `size` bytes, given back when it ends. */
  run(size: number, task: () => Promise<void>) {
    const run: Promise<void> = task()
      .catch((error) => {
        this.failure ??= { error };
      })
      .finally(() => {
        this.running.delete(run);
        this.give(size);
      });
    this.running.add(run);
  }
  /** Every task done, or the first failure. */
  async drain() {
    await this.settle();
    this.check();
  }
  /** Every started task settled, failed or not: before the lock goes. */
  async settle() {
    while (this.running.size) await Promise.race(this.running);
  }
}
