import { beforeAll, describe, expect, it } from "vitest";
import { load } from "js-yaml";

/** Databases as Obsidian bases (shared/bases.js, on yaml.js and expr.js). */
type Row = { rel: string; name: string; props: Record<string, unknown> };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

beforeAll(async () => {
  for (const f of ["yaml", "expr", "bases"]) await import(/* @vite-ignore */ `../shared/${f}.js`);
  db = (globalThis as unknown as { database: unknown }).database;
});

// A base as Obsidian writes one, with a key and a view of a kind Textus doesn't know.
const SOURCE = `filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
properties:
  status:
    displayName: Status
views:
  - type: kanban
    name: Board
    groupBy:
      property: status
      direction: ASC
    groupOrder:
      - Doing
      - Done
    limit: 10
    filters:
      and:
        - 'rate >= 3'
        - tags.contains("work")
        - due.isEmpty()
        - formula.x > 1
    sort:
      - property: due
        direction: DESC
    myPluginKey: kept
  - type: map
    name: Places
`;

describe("a base", () => {
  it("reads a view as the page shows it", () => {
    const { base } = db.parseBase(SOURCE);
    const spec = db.viewSpec(base, 0);
    expect(spec).toMatchObject({
      view: "board",
      name: "Board",
      group: "status",
      groupOrder: ["Doing", "Done"],
      limit: 10,
      sort: [{ key: "due", desc: true }],
      filters: [
        { key: "rate", op: ">=", value: "3" },
        { key: "tags", op: "has", value: "work" },
        { key: "due", op: "empty" },
        { raw: "formula.x > 1" },
      ],
    });
    expect(db.viewSpec(base, 1)).toMatchObject({ view: "table", unknownView: "map" });
    expect(db.viewSpec(base, 0).views.map((v: { name: string }) => v.name)).toEqual(["Board", "Places"]);
  });

  it("writes a view's change back and keeps what it doesn't know", () => {
    const { base } = db.parseBase(SOURCE);
    const next = db.setView(base, 0, {
      groupOrder: ["Done", "Doing", ""],
      sort: [{ key: "name", desc: false }],
      filters: [{ key: "due date", op: "<", value: "2026-02-01" }, { raw: "formula.x > 1" }],
      columns: ["status", "due"],
    });
    const text = db.writeBase(next);
    const back = load(text) as { views: Record<string, unknown>[]; properties: unknown };
    expect(back.views[0]).toMatchObject({
      type: "kanban",
      myPluginKey: "kept",
      groupOrder: ["Done", "Doing", null],
      sort: [{ property: "file.name", direction: "ASC" }],
      filters: { and: ['note["due date"] < date("2026-02-01")', "formula.x > 1"] },
      order: ["file.name", "status", "due"],
    });
    expect(back.views[1]).toEqual({ type: "map", name: "Places" });
    expect(back.properties).toEqual({ status: { displayName: "Status" } });
  });

  it("follows a property renamed or deleted through every view", () => {
    const { base } = db.parseBase(SOURCE);
    const renamed = db.renameKey(base, "status", "stage");
    expect(renamed.views[0].groupBy.property).toBe("stage");
    expect(renamed.properties).toEqual({ stage: { displayName: "Status" } });
    const dropped = db.dropKey(base, "tags");
    expect(dropped.views[0].filters.and).not.toContain('tags.contains("work")');
  });
});

describe("a base's rows", () => {
  const docs = [
    { rel: "Life/Cal/Cal.md", frontmatter: {} },
    { rel: "Life/Cal/Week2.md", frontmatter: { status: "Done", rate: 4 } },
    { rel: "Life/Cal/Week1/Week1.md", frontmatter: { status: "Doing", rate: 2 } },
    { rel: "Life/Cal/Week1/Jan 1.md", frontmatter: {} },
    { rel: "Life/Other.md", frontmatter: { status: "Done" } },
  ];

  it("are a unit's notes and its units, not their sub-pages or its own page", () => {
    const base = db.unitBase("table");
    const { rows, skipped } = db.rowsOf(base, docs, "Life/Cal/Cal.md");
    expect(skipped).toEqual([]);
    expect(rows.map((r: Row) => r.rel)).toEqual(["Life/Cal/Week2.md", "Life/Cal/Week1/Week1.md"]);
    expect(db.folderOf(base, "Life/Cal/Cal.md")).toBe("Life/Cal");
    // The same rows seen from another page.
    const there = { filters: { and: db.folderRows("Life/Cal") }, views: [{ type: "table" }] };
    expect(db.rowsOf(there, docs, "Home.md").rows.map((r: Row) => r.rel)).toEqual(["Life/Cal/Week2.md", "Life/Cal/Week1/Week1.md"]);
    expect(db.folderOf(there, "Home.md")).toBe("Life/Cal");
  });

  it("go through a view's filters and sort, and into a board's lists in its order", () => {
    const { rows } = db.rowsOf(db.unitBase("board"), docs, "Life/Cal/Cal.md");
    const spec = { filters: [{ key: "rate", op: ">=", value: "1" }], sort: [{ key: "rate", desc: true }] };
    expect(db.viewRows(rows, spec, "Life/Cal/Cal.md").map((r: Row) => r.name)).toEqual(["Week2", "Week1"]);
    const lists = db.groups(rows, "status", ["Doing"]).map((g: { value: string }) => g.value);
    expect(lists).toEqual(["Doing", "Done"]);
  });

  it("take their kinds from Obsidian's types file, then from their values", () => {
    const rows = [
      { rel: "a.md", name: "a", props: { due: "2026-01-01", tags: ["x"], n: "3", status: "A" } },
      { rel: "b.md", name: "b", props: { due: "2026-01-02", tags: ["y"], n: "4", status: "A" } },
    ];
    expect(db.typesOf(rows, { n: "number" }, { status: "select" })).toEqual({
      due: "date",
      tags: "tags",
      n: "number",
      status: "select",
    });
  });
});
