import { beforeAll, describe, expect, it } from "vitest";

/** {{key}} and {{key:FORMAT}} filled in (shared/fill-template.js). */
let fillTemplate: (
  text: string,
  values: Record<string, unknown>,
  options?: { now?: Date; language?: string; dateFormat?: string },
) => string;

beforeAll(async () => {
  await import("../shared/dates.js");
  await import("../shared/fill-template.js");
  fillTemplate = (globalThis as unknown as { fillTemplate: typeof fillTemplate })
    .fillTemplate;
});

describe("a filled template", () => {
  it("has each known {{key}} replaced, lists joined, null as nothing", () => {
    expect(
      fillTemplate("# {{title}}\n{{ authors }} ({{year}}){{doi}}", {
        title: "Attention",
        authors: ["Ashish Vaswani", "Noam Shazeer"],
        year: 2017,
        doi: null,
      }),
    ).toBe("# Attention\nAshish Vaswani, Noam Shazeer (2017)");
  });

  it("keeps a key it has no value for as written", () => {
    expect(fillTemplate("{{title}} {{unknown}} {{other:YYYY}}", { title: "A" })).toBe(
      "A {{unknown}} {{other:YYYY}}",
    );
  });

  it("writes a date value in the format a key names", () => {
    const values = { added: "2024-03-05T10:00:00", published: "2017-06-12", year: "2017" };
    expect(fillTemplate("{{added:DD/MM/YYYY}} {{published:MMMM YYYY}} {{year:YY}}", values)).toBe(
      "05/03/2024 June 2017 17",
    );
  });

  it("leaves text that isn't a date as it is under a format", () => {
    expect(fillTemplate("{{title:YYYY}}", { title: "Attention" })).toBe("Attention");
  });

  it("gives {{date}} and {{time}} from now unless the values have them", () => {
    const now = new Date(2026, 10, 7, 9, 5);
    expect(fillTemplate("{{date}} {{time}} {{date:YYYY}}", {}, { now })).toBe("2026-11-07 09:05 2026");
    expect(fillTemplate("{{date}}", { date: "2017" }, { now })).toBe("2017");
  });
});
