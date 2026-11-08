import { beforeAll, describe, expect, it } from "vitest";

/** Notion's export as data (shared/notion-csv.js), the parser Database and
 *  Notion Import both run. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let csv: any;

beforeAll(async () => {
  const script = "../shared/notion-csv.js";
  await import(/* @vite-ignore */ script);
  csv = (globalThis as unknown as { notionCsv: unknown }).notionCsv;
});

describe("Notion's CSV", () => {
  it("turns a Notion export's CSV into documents with front matter", () => {
    const source =
      "﻿Week name,Start Day,End Day,Focus Field,Rate\n" +
      'Week1 0123456789abcdef0123456789abcdef,"January 1, 2026","January 4, 2026",Personal,\n' +
      'Week11,"March 9, 2026","March 15, 2026","Health, Personal",4\n' +
      'Week14,"March 30, 2026","April 5, 2026","Research, Work",\n';
    expect(csv.fromNotionCsv(source)).toEqual([
      {
        name: "Week1",
        props: {
          start_day: "2026-01-01",
          end_day: "2026-01-04",
          focus_field: ["Personal"],
        },
      },
      {
        name: "Week11",
        props: {
          start_day: "2026-03-09",
          end_day: "2026-03-15",
          focus_field: ["Health", "Personal"],
          rate: 4,
        },
      },
      {
        name: "Week14",
        props: {
          start_day: "2026-03-30",
          end_day: "2026-04-05",
          focus_field: ["Research", "Work"],
        },
      },
    ]);
  });

  it("reads quoted cells, doubled quotes, line breaks and CRLF", () => {
    expect(csv.parseCsv('a,b\r\n"x, y","say ""hi""\nthere"\r\n,\r\n')).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"\nthere'],
    ]);
  });

  it("reads Notion's dates in English, ISO, Chinese, Japanese and Korean", () => {
    expect(csv.dateOf("January 4, 2026")).toBe("2026-01-04");
    expect(csv.dateOf("Jan 4, 2026 3:00 PM")).toBe("2026-01-04");
    expect(csv.dateOf("4 January 2026")).toBe("2026-01-04");
    expect(csv.dateOf("2026-01-04")).toBe("2026-01-04");
    expect(csv.dateOf("2026/1/4 15:00")).toBe("2026-01-04");
    expect(csv.dateOf("2026年1月4日")).toBe("2026-01-04");
    expect(csv.dateOf("2026年1月4日 15:00")).toBe("2026-01-04");
    expect(csv.dateOf("2026년 1월 4일")).toBe("2026-01-04");
    expect(csv.dateOf("2026년 1월 4일 오후 3:00")).toBe("2026-01-04");
    expect(csv.dateOf("January 4, 2026 10:00 AM → 12:00 PM")).toBe(
      "2026-01-04",
    );
    expect(csv.dateOf("Mayday 4, 2026")).toBeNull();
    expect(csv.dateOf("2026-13-01")).toBeNull();
    expect(csv.dateOf("Version 1.3.8")).toBeNull();
  });

  it("reads Notion's long dates in German, French, Spanish and Portuguese", () => {
    expect(csv.dateOf("4. Januar 2026")).toBe("2026-01-04");
    expect(csv.dateOf("4. März 2026")).toBe("2026-03-04");
    expect(csv.dateOf("4 janvier 2026")).toBe("2026-01-04");
    expect(csv.dateOf("1 août 2026 15:00")).toBe("2026-08-01");
    expect(csv.dateOf("4 de enero de 2026")).toBe("2026-01-04");
    expect(csv.dateOf("4 de janeiro de 2026")).toBe("2026-01-04");
    expect(csv.rangeOf("4. Januar 2026 → 6. Januar 2026")).toEqual({
      start: "2026-01-04",
      end: "2026-01-06",
    });
    expect(csv.dateOf("3 Bananen 2026")).toBeNull();
  });

  it("leaves text that only starts with a date, and versions, as text", () => {
    expect(csv.dateOf("2026-01-04 release shipped")).toBeNull();
    expect(csv.dateOf("4 May 2026 was the kickoff")).toBeNull();
    expect(csv.dateOf("Mar 3, 2026 retro: went well")).toBeNull();
    expect(csv.dateOf("2024.10.2")).toBeNull();
    const rows = csv.fromNotionCsv(
      'Name,Version,Due\nA,2024.10.2,"January 4, 2026"\nB,2025.1.3,"January 5, 2026"\n',
    );
    expect(rows[0].props).toEqual({ version: "2024.10.2", due: "2026-01-04" });
  });

  it("splits a date range into its two ends", () => {
    expect(csv.rangeOf("February 10, 2026 → February 12, 2026")).toEqual({
      start: "2026-02-10",
      end: "2026-02-12",
    });
    expect(csv.rangeOf("2026年2月10日 → 2026年2月12日")).toEqual({
      start: "2026-02-10",
      end: "2026-02-12",
    });
    expect(csv.rangeOf("February 10, 2026")).toBeNull();
  });

  it("turns cells into values: Yes/No, numbers, lists, text", () => {
    expect(csv.cellValue("Yes")).toBe(true);
    expect(csv.cellValue("No")).toBe(false);
    expect(csv.cellValue("80.5")).toBe(80.5);
    expect(csv.cellValue("-3")).toBe(-3);
    expect(csv.cellValue("a, b", true)).toEqual(["a", "b"]);
    expect(csv.cellValue("In progress")).toBe("In progress");
    expect(csv.cellValue("  ")).toBeNull();
    // Digits that wouldn't read back the same stay text: zip codes, ids, versions.
    expect(csv.cellValue("02139")).toBe("02139");
    expect(csv.cellValue("1.10")).toBe("1.10");
    expect(csv.cellValue("12345678901234567890")).toBe("12345678901234567890");
  });

  it("reads a multi-select whose rows mostly hold one option as lists", () => {
    const rows = csv.fromNotionCsv(
      'Name,Tags\nA,"Health, Personal"\nB,Health\nC,Personal\nD,Work\n',
    );
    expect(rows.map((r: { props: { tags: unknown } }) => r.props.tags)).toEqual(
      [["Health", "Personal"], ["Health"], ["Personal"], ["Work"]],
    );
  });

  it("reads a relation's pages, by path or notion.so address", () => {
    const id = "4".repeat(32);
    expect(
      csv.relationItems(
        `Garden (Projects%20x/Garden%20${id}.md), Web (https://www.notion.so/Web-${"3".repeat(32)})`,
      ),
    ).toEqual([
      { title: "Garden", target: `Projects%20x/Garden%20${id}.md` },
      { title: "Web", target: `https://www.notion.so/Web-${"3".repeat(32)}` },
    ]);
    expect(csv.relationItems("Plain text (with a note)")).toBeNull();
    expect(csv.relationItems("")).toBeNull();
  });

  it("reads related pages whose titles have parentheses", () => {
    const id = "4".repeat(32);
    const web = `https://www.notion.so/Plan-v2-${"3".repeat(32)}`;
    expect(
      csv.relationItems(
        `Plan (v2) (Projects%20x/Plan%20(v2)%20${id}.md), Web (${web})`,
      ),
    ).toEqual([
      { title: "Plan (v2)", target: `Projects%20x/Plan%20(v2)%20${id}.md` },
      { title: "Web", target: web },
    ]);
    expect(csv.relationItems(`X (Projects%20x/X%20${id}.md) extra`)).toBeNull();
    const rows = csv.fromNotionCsv(
      `Name,Rel\nA,"Plan (v2) (Plan%20(v2)%20${id}.md)"\nB,Garden (Garden%20${id}.md)\n`,
    );
    expect(rows.map((r: { props: { rel: unknown } }) => r.props.rel)).toEqual([
      ["Plan (v2)"],
      ["Garden"],
    ]);
  });

  it("gives relations as titles by default, or as the caller makes them, and keeps a range's end", () => {
    const id = "4".repeat(32);
    const source = `Name,Related,When\nA,Garden (Garden%20${id}.md),"March 1, 2026 → March 3, 2026"\nB,,\n`;
    expect(csv.fromNotionCsv(source)).toEqual([
      {
        name: "A",
        props: {
          related: ["Garden"],
          when: "2026-03-01",
          when_end: "2026-03-03",
        },
      },
      { name: "B", props: {} },
    ]);
    const linked = csv.fromNotionCsv(source, {
      relation: (item: { target: string }) => item.target,
    });
    expect(linked[0].props.related).toEqual([`Garden%20${id}.md`]);
  });

  it("finds ids and drops them from names", () => {
    const id = "0a1b2c3d4e5f60718293a4b5c6d7e8f9";
    expect(csv.withoutId(`Plans ${id}`)).toBe("Plans");
    expect(csv.withoutId("Plans")).toBe("Plans");
    expect(csv.idOf(`Plans ${id}.md`)).toBe(id);
    expect(csv.idOf(`https://www.notion.so/Plans-${id}?pvs=4`)).toBe(id);
    expect(csv.idOf("Plans.md")).toBeNull();
    expect(csv.propertyName("Start Day")).toBe("start_day");
    expect(csv.propertyName("创建时间")).toBe("创建时间");
  });

  it("splits a page into its title, property lines and body", () => {
    const page =
      "# Website\n\nStatus: Done\nDue: January 4, 2026\n\nThe text: with a colon.\n";
    expect(csv.pageParts(page)).toEqual({
      title: "Website",
      props: [
        ["Status", "Done"],
        ["Due", "January 4, 2026"],
      ],
      body: "The text: with a colon.",
    });
    // A paragraph that starts "Note: …" and goes on is the body's.
    expect(csv.pageParts("# A\n\nNote: this\nand more text\n").props).toEqual(
      [],
    );
    expect(csv.pageParts("# A\n\nNote: this\nand more text\n").body).toBe(
      "Note: this\nand more text",
    );
    expect(csv.notionBody("# A\n\nKey: v\n\nBody")).toBe("Body");
    // Only a database row has property lines: another page keeps them as text.
    expect(
      csv.pageParts("# Meeting\n\nDate: Mar 3, 2026 retro\n\nAgenda", false),
    ).toEqual({
      title: "Meeting",
      props: [],
      body: "Date: Mar 3, 2026 retro\n\nAgenda",
    });
  });
});
