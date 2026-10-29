import { beforeAll, describe, expect, it } from "vitest";

/** Natural Dates' phrases (plugins/catvinci.natural-dates/dates.js). */
let nd: {
  suggest: (typed: string, today: Date, limit?: number) => { phrase: string; date: string }[];
};

beforeAll(async () => {
  const script = "../plugins/catvinci.natural-dates/dates.js";
  await import(/* @vite-ignore */ script);
  nd = (globalThis as unknown as { naturalDates: typeof nd }).naturalDates;
});

// Wednesday, 2026-10-28.
const wed = new Date(2026, 9, 28);
const date = (typed: string) => nd.suggest(typed, wed).find((s) => s.phrase === typed)?.date;

describe("natural dates", () => {
  it("counts days from today", () => {
    expect(date("tomorrow")).toBe("2026-10-29");
    expect(date("后天")).toBe("2026-10-30");
    expect(date("昨日")).toBe("2026-10-27");
    expect(date("3天后")).toBe("2026-10-31");
  });

  it("takes a weekday as the next one, and next week's from the week after", () => {
    expect(date("friday")).toBe("2026-10-30");
    expect(date("周三")).toBe("2026-11-04");
    expect(date("下周五")).toBe("2026-11-06");
    expect(date("next monday")).toBe("2026-11-02");
    expect(date("来週金曜日")).toBe("2026-11-06");
  });

  it("suggests the phrases that begin with what was typed", () => {
    expect(nd.suggest("下周", wed).map((s) => s.phrase)).toContain("下周五");
    expect(nd.suggest("tom", wed)).toEqual([{ phrase: "tomorrow", date: "2026-10-29" }]);
  });
});
