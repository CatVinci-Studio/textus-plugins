import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Pacer } from "./pacer";

const pace = { settle: 5_000, gap: 0, every: 300_000 };
let runs: number[], busy: boolean, pacer: Pacer;
beforeEach(() => {
  vi.useFakeTimers();
  runs = [];
  busy = false;
  pacer = new Pacer(
    () => runs.push(Date.now()),
    () => busy,
  );
});
afterEach(() => {
  pacer.stop();
  vi.useRealTimers();
});

it("syncs once, a few seconds after a burst of saves settles", () => {
  pacer.configure(pace);
  const start = Date.now();
  for (let i = 0; i < 4; i++) {
    pacer.saved();
    vi.advanceTimersByTime(2_000);
  }
  expect(runs).toEqual([]);
  vi.advanceTimersByTime(3_000);
  expect(runs).toEqual([start + 11_000]);
});
it("keeps the interval as a fallback and stays quiet when not configured", () => {
  pacer.configure(pace);
  vi.advanceTimersByTime(300_000);
  expect(runs).toHaveLength(1);
  pacer.configure(null);
  pacer.saved();
  vi.advanceTimersByTime(600_000);
  expect(runs).toHaveLength(1);
});
it("does not wait forever while saves keep coming", () => {
  pacer.configure(pace);
  for (let i = 0; i < 40; i++) {
    pacer.saved();
    vi.advanceTimersByTime(2_000);
  }
  expect(runs.length).toBeGreaterThan(0);
});
it("never starts a second sync while one runs, and runs the saved change after", () => {
  pacer.configure(pace);
  busy = true;
  pacer.saved();
  vi.advanceTimersByTime(60_000);
  expect(runs).toEqual([]);
  busy = false;
  pacer.finished();
  vi.advanceTimersByTime(5_000);
  expect(runs).toHaveLength(1);
});
it("spaces save-triggered syncs by the provider's gap", () => {
  pacer.configure({ ...pace, gap: 120_000 });
  pacer.finished();
  pacer.saved();
  vi.advanceTimersByTime(119_000);
  expect(runs).toEqual([]);
  vi.advanceTimersByTime(1_000);
  expect(runs).toHaveLength(1);
});
it("drops a pending save that a manual sync already covered", () => {
  pacer.configure(pace);
  pacer.saved();
  vi.advanceTimersByTime(1_000);
  pacer.started();
  pacer.finished();
  vi.advanceTimersByTime(60_000);
  expect(runs).toEqual([]);
});
