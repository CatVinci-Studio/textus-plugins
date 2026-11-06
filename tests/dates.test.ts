import { beforeAll, describe, expect, it } from "vitest";

/** Moment-style dates and template filling (shared/dates.js), and the
 *  free names files are made under (shared/free-name.js). */
let dates: {
  format: (d: Date, format: string, language?: string) => string;
  day: (d: Date) => string;
  parse: (text: string, format: string) => string | null;
  fill: (text: string, options: { day?: Date; now?: Date; language?: string; values?: Record<string, string> }) => string;
};
let freeName: (stem: string, taken: (name: string) => unknown, options?: { ext?: string; sep?: string; first?: number }) => Promise<string>;

beforeAll(async () => {
  await import("../shared/dates.js");
  await import("../shared/free-name.js");
  const g = globalThis as unknown as { dates: typeof dates; freeName: typeof freeName };
  dates = g.dates;
  freeName = g.freeName;
});

it("writes and reads back the formats daily notes are named by", () => {
  const day = new Date(2026, 10, 2, 9, 5);
  expect(dates.format(day, "YYYY-MM-DD")).toBe("2026-11-02");
  expect(dates.day(new Date(2026, 0, 7, 23, 59))).toBe("2026-01-07");
  expect(dates.format(day, "YYYY/MM/D [at] HH:mm")).toBe("2026/11/2 at 09:05");
  expect(dates.format(day, "dddd, MMMM D", "en")).toBe("Monday, November 2");
  expect(dates.parse("2026/11/2026-11-02", "YYYY/MM/YYYY-MM-DD")).toBe("2026-11-02");
  expect(dates.parse("02.11.2026", "DD.MM.YYYY")).toBe("2026-11-02");
  expect(dates.parse("2026-02-30", "YYYY-MM-DD")).toBe(null);
  expect(dates.parse("notes", "YYYY-MM-DD")).toBe(null);
});

describe("a template filled in", () => {
  const now = new Date(2026, 10, 5, 14, 7);

  it("takes the date of the day given and the time of now", () => {
    const text = "{{date}} {{time}} {{date:dddd D MMMM}} {{time:H.mm}} {{title}}";
    expect(dates.fill(text, { day: new Date(2026, 0, 2), now, language: "en", values: { title: "T" } })).toBe(
      "2026-01-02 14:07 Friday 2 January 14.07 T",
    );
    expect(dates.fill("{{date}} {{date:}}", { now })).toBe("2026-11-05 2026-11-05");
  });

  it("leaves the names it isn't given as written, and what it fills in unread", () => {
    expect(dates.fill("{{weekday}} {{title:x}} {{constructor}} {{title}}", { now, values: { title: "{{date}}" } })).toBe(
      "{{weekday}} {{title:x}} {{constructor}} {{date}}",
    );
  });
});

describe("a free name", () => {
  const takenOf = (names: string[]) => async (name: string) => names.includes(name);

  it("is the name itself, else numbered from 2 after a space", async () => {
    expect(await freeName("Note", takenOf([]))).toBe("Note");
    expect(await freeName("Note", takenOf(["Note", "Note 2"]))).toBe("Note 3");
  });

  it("puts the number before the extension, as asked", async () => {
    expect(await freeName("a", takenOf(["a.png", "a-1.png"]), { ext: ".png", sep: "-", first: 1 })).toBe("a-2.png");
  });
});
