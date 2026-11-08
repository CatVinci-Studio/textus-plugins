import { beforeAll, describe, expect, it } from "vitest";

/** Database's logic (plugins/catvinci.database/db.js). */
type Row = { rel: string; name: string; props: Record<string, unknown> };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

beforeAll(async () => {
  const script = "../plugins/catvinci.database/db.js";
  await import(/* @vite-ignore */ script);
  db = (globalThis as unknown as { database: unknown }).database;
});

const WEEKS = [
  { rel: "Life/2026 Calendar/Week1.md", frontmatter: { start: "2026-01-01", end: "2026-01-04", focus: ["Personal"] } },
  { rel: "Life/2026 Calendar/Week2.md", frontmatter: { start: "2026-01-05", end: "2026-01-11", focus: ["Research"], rate: 4 } },
  { rel: "Life/2026 Calendar/Week11.md", frontmatter: { start: "2026-03-09", focus: ["Health", "Personal"] } },
  { rel: "Life/2026 Calendar.md", frontmatter: {} },
  { rel: "Life/2026 Calendar/Week2/Notes.md", frontmatter: {} },
];

describe("database", () => {
  it("reads a block's lines and writes them back", () => {
    const source = "from: 2026 Calendar\nview: board\nsort: -start\nfilter: focus has research\ngroup: focus";
    const spec = db.parseSpec(source);
    expect(spec).toMatchObject({
      from: "2026 Calendar",
      view: "board",
      sort: [{ key: "start", desc: true }],
      filters: [{ key: "focus", op: "has", value: "research" }],
      group: "focus",
    });
    expect(db.writeSpec(spec)).toBe(source);
  });

  it("finds the folder from the document's own, or its sub-page folder", () => {
    expect(db.folderOf("2026 Calendar", "Life/Plans.md")).toBe("Life/2026 Calendar");
    expect(db.folderOf("/Archive", "Life/Plans.md")).toBe("Archive");
    expect(db.folderOf("../Work", "Life/Plans.md")).toBe("Work");
    expect(db.folderOf(null, "Life/2026 Calendar.md")).toBe("Life/2026 Calendar");
    // A folder unit's own page shows its own folder, without itself as a row.
    expect(db.folderOf(null, "Papers/Papers.md")).toBe("Papers");
    expect(db.folderOf(".", "Papers/Papers.md")).toBe("Papers");
    const unit = [{ rel: "Papers/Papers.md", frontmatter: {} }, { rel: "Papers/DINOv3.md", frontmatter: { year: 2025 } }];
    expect(db.rowsOf(unit, "Papers").map((r: Row) => r.rel)).toEqual(["Papers/DINOv3.md"]);
  });

  it("takes the documents right in the folder as rows, with each property's kind", () => {
    const rows: Row[] = db.rowsOf(WEEKS, "Life/2026 Calendar");
    expect(rows.map((r) => r.name)).toEqual(["Week1", "Week2", "Week11"]);
    expect(db.typesOf(rows)).toEqual({ start: "date", end: "date", focus: "tags", rate: "number" });
    expect(db.columnsOf(db.parseSpec(""), rows)).toEqual(["start", "end", "focus", "rate"]);
  });

  it("filters and sorts, numbers as numbers and names in natural order", () => {
    const rows = db.rowsOf(WEEKS, "Life/2026 Calendar");
    const names = (source: string) => db.viewRows(rows, db.parseSpec(source)).map((r: Row) => r.name);
    expect(names("")).toEqual(["Week1", "Week2", "Week11"]);
    expect(names("sort: -start")).toEqual(["Week11", "Week2", "Week1"]);
    expect(names("filter: focus = personal")).toEqual(["Week1", "Week11"]);
    expect(names("filter: rate >= 4")).toEqual(["Week2"]);
    expect(names("filter: start < 2026-02-01\nfilter: focus != research")).toEqual(["Week1"]);
  });

  it("groups a board by a list property, a row in each of its values", () => {
    const rows = db.rowsOf(WEEKS, "Life/2026 Calendar");
    const key = db.groupKey(db.parseSpec(""), rows, db.typesOf(rows));
    expect(key).toBe("focus");
    expect(db.groups(rows, key).map((g: { value: string; rows: Row[] }) => [g.value, g.rows.map((r) => r.name)])).toEqual([
      ["Personal", ["Week1", "Week11"]],
      ["Research", ["Week2"]],
      ["Health", ["Week11"]],
    ]);
    expect(db.regroup(["Health", "Personal"], "Personal", "Work")).toEqual(["Health", "Work"]);
    expect(db.regroup("Todo", "Todo", "Done")).toBe("Done");
  });

  it("keeps a property's chosen kind in the block, and reads repeated short text as a select", () => {
    const spec = db.parseSpec("view: table\ntypes: status=select, tags=tags, bad=nope");
    expect(spec.types).toEqual({ status: "select", tags: "tags" });
    expect(db.writeSpec(spec)).toContain("types: status=select, tags=tags");
    const rows = [
      { rel: "a.md", name: "a", props: { status: "Doing", note: "one" } },
      { rel: "b.md", name: "b", props: { status: "Done", note: "two" } },
      { rel: "c.md", name: "c", props: { status: "Doing", note: "three" } },
    ];
    expect(db.typesOf(rows)).toEqual({ status: "select", note: "text" });
    expect(db.typesOf(rows, { note: "select" }).note).toBe("select");
    expect(db.options(rows, "status")).toEqual(["Doing", "Done"]);
  });

  it("filters on a property being empty, and writes such a filter back without a value", () => {
    const rows = db.rowsOf(WEEKS, "Life/2026 Calendar");
    const names = (source: string) => db.viewRows(rows, db.parseSpec(source)).map((r: Row) => r.name);
    expect(names("filter: rate empty")).toEqual(["Week1", "Week11"]);
    expect(names("filter: rate !empty")).toEqual(["Week2"]);
    expect(db.writeSpec(db.parseSpec("filter: rate !empty"))).toContain("filter: rate !empty");
    expect(db.writeSpec(db.parseSpec("filter: rate !empty"))).not.toMatch(/!empty $/m);
  });

  it("follows a property renamed or deleted through every line of the block", () => {
    const spec = db.parseSpec("columns: focus, rate\nsort: -focus\nfilter: focus has Work\ngroup: focus\ntypes: focus=tags");
    const renamed = db.renameKey(spec, "focus", "area");
    expect(db.writeSpec(renamed)).toBe(
      "view: table\ncolumns: area, rate\nsort: -area\nfilter: area has Work\ngroup: area\ntypes: area=tags",
    );
    expect(db.writeSpec(db.dropKey(spec, "focus"))).toBe("view: table\ncolumns: rate");
  });

  it("keeps rows with no page of their own in the block, as a Markdown table, and writes them back as they were", () => {
    const source =
      "view: board\ngroup: status\nrows:\n| Name | status | year | authors |\n| --- | --- | --- | --- |\n" +
      "| Segment Anything | Completed | 2023 | [A Kirillov, E Mintun] |\n| a \\| b | Doing |  | [[Garden](Garden.md)] |\n| Link | Done |  | [Spec](Spec.md) |";
    const spec = db.parseSpec(source);
    expect(spec).toMatchObject({ view: "board", group: "status" });
    expect(spec.table).toEqual([
      { name: "Segment Anything", props: { status: "Completed", year: 2023, authors: ["A Kirillov", "E Mintun"] } },
      { name: "a | b", props: { status: "Doing", authors: ["[Garden](Garden.md)"] } },
      // One link is a value, not a list.
      { name: "Link", props: { status: "Done", authors: "[Spec](Spec.md)" } },
    ]);
    expect(db.parseSpec(db.writeSpec(spec)).table).toEqual(spec.table);
    expect(db.tableRows(spec).map((r: Row & { inline: boolean }) => [r.rel, r.name, r.inline])).toEqual([
      ["#0", "Segment Anything", true],
      ["#1", "a | b", true],
      ["#2", "Link", true],
    ]);
    // No rows: no "rows:" line.
    expect(db.writeSpec({ ...spec, table: [] })).not.toContain("rows:");
  });
});
