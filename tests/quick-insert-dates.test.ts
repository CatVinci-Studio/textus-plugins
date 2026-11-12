import { beforeAll, describe, expect, it } from "vitest";

/** Quick Insert's @ dates (plugins/catvinci.quick-insert/dates.js). */
let nd: {
  suggest: (
    typed: string,
    today: Date,
    limit?: number,
    language?: string,
  ) => { phrase: string; date: string }[];
};

beforeAll(async () => {
  await import("../shared/dates.js");
  // Textus's textus.dates, as the host frame has it.
  const { dates } = globalThis as unknown as {
    dates: { format: (d: Date, f: string) => string };
  };
  (globalThis as unknown as { textus: unknown }).textus = {
    dates: { format: (d: Date, f = "YYYY-MM-DD") => dates.format(d, f) },
  };
  const script = "../plugins/catvinci.quick-insert/dates.js";
  await import(/* @vite-ignore */ script);
  nd = (globalThis as unknown as { naturalDates: typeof nd }).naturalDates;
});

// Wednesday, 2026-10-28.
const wed = new Date(2026, 9, 28);
const date = (typed: string) =>
  nd.suggest(typed, wed).find((s) => s.phrase === typed)?.date;

describe("@ dates", () => {
  it("counts days from today", () => {
    expect(date("tomorrow")).toBe("2026-10-29");
    expect(date("后天")).toBe("2026-10-30");
    expect(date("昨日")).toBe("2026-10-27");
    expect(date("3天后")).toBe("2026-10-31");
    expect(date("後天")).toBe("2026-10-30");
    expect(date("大後天")).toBe("2026-10-31");
    expect(date("3天後")).toBe("2026-10-31");
  });

  it("knows Traditional Chinese weekdays and weeks", () => {
    expect(date("週三")).toBe("2026-11-04");
    expect(date("下週五")).toBe("2026-11-06");
    expect(date("禮拜五")).toBe("2026-10-30");
    expect(date("下週")).toBe("2026-11-04");
  });

  it("lists the UI language's phrases first", () => {
    const first = (language: string) =>
      nd.suggest("", wed, 8, language).map((s) => s.phrase);
    expect(first("en")[0]).toBe("today");
    expect(first("ja")[0]).toBe("今日");
    expect(first("zh-Hant")).toContain("後天");
    expect(first("zh-Hant")).not.toContain("后天");
    expect(first("zh-CN")).toContain("后天");
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
    expect(nd.suggest("tom", wed)).toEqual([
      { phrase: "tomorrow", date: "2026-10-29" },
    ]);
  });
});
