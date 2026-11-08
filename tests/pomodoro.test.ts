import { beforeAll, describe, expect, it } from "vitest";

/** Pomodoro's timer (plugins/catvinci.pomodoro/timer.js). */
type State = {
  phase: string;
  running: boolean;
  left: number;
  endsAt: number | null;
  rounds: number;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let p: any;
const minutes = { focus: 25, rest: 5 };
const MIN = 60000;

beforeAll(async () => {
  await import("../plugins/catvinci.pomodoro/timer.js");
  p = (globalThis as unknown as { pomodoro: unknown }).pomodoro;
});

describe("a Pomodoro timer", () => {
  it("starts, pauses where it stood and goes on from there", () => {
    let s: State = p.fresh(minutes);
    expect(p.left(s, 0)).toBe(25 * MIN);
    s = p.toggle(s, 1000);
    expect(p.left(s, 1000 + 10 * MIN)).toBe(15 * MIN);
    s = p.toggle(s, 1000 + 10 * MIN);
    expect(s.running).toBe(false);
    expect(p.left(s, 999 * MIN)).toBe(15 * MIN);
    s = p.toggle(s, 50 * MIN);
    expect(p.left(s, 55 * MIN)).toBe(10 * MIN);
  });

  it("moves on to a break when focus ends, and back, counting rounds", () => {
    let s: State = p.toggle(p.fresh(minutes), 0);
    expect(p.tick(s, 24 * MIN, minutes).ended).toBeNull();
    let out = p.tick(s, 25 * MIN + 500, minutes);
    expect(out.ended).toBe("focus");
    s = out.state;
    expect(s.phase).toBe("rest");
    // The break counts from when focus ended, not from when it was noticed.
    expect(p.left(s, 25 * MIN + 500)).toBe(5 * MIN - 500);
    out = p.tick(s, 30 * MIN, minutes);
    expect(out.ended).toBe("rest");
    expect(out.state).toMatchObject({ phase: "focus", rounds: 1 });
  });

  it("skips to the next span, stopped or running as it was, and writes the clock", () => {
    const stopped = p.next(p.fresh(minutes), 0, minutes);
    expect(stopped).toMatchObject({
      phase: "rest",
      running: false,
      left: 5 * MIN,
    });
    expect(p.clock(5 * MIN)).toBe("05:00");
    expect(p.clock(61_001)).toBe("01:02");
  });
});
