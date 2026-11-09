import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Dataview queries as bases (plugins/catvinci.database/dataview.js). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dv: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bexpr: any;

beforeAll(async () => {
  for (const f of ["yaml", "expr", "base-filters", "bases"])
    await import(/* @vite-ignore */ `../shared/${f}.js`);
  await import(/* @vite-ignore */ "../plugins/catvinci.database/dataview.js");
  const g = globalThis as unknown as Record<string, unknown>;
  dv = g.dataview;
  db = g.database;
  bexpr = g.bexpr;
});

/** The base a query becomes, checked to be one Textus reads in full. */
function base(query: string) {
  const out = dv.toBase(query);
  expect(out.error).toBeUndefined();
  const parsed = db.parseBase(out.yaml);
  expect(parsed.error).toBeUndefined();
  for (const f of [parsed.base.filters, parsed.base.views[0].filters])
    expect(bexpr.filterOf(f).skipped).toEqual([]);
  return parsed.base;
}
const view = (query: string) => base(query).views[0];
const where = (cond: string) => view("TABLE x WHERE " + cond).filters.and;
const refused = (query: string) => dv.toBase(query).error;

describe("a Dataview query as a base", () => {
  it("makes a TABLE's fields the view's columns, the name first", () => {
    const b = base("TABLE status, due, file.mtime, file.folder");
    expect(b.views[0]).toEqual({
      type: "table",
      name: "Table",
      order: ["file.name", "status", "due", "file.mtime", "file.folder"],
    });
    expect(b.filters).toBeUndefined();
  });

  it("keeps AS names as the properties' display names", () => {
    const b = base('TABLE status AS "State", file.link AS Note, due');
    expect(b.properties).toEqual({
      status: { displayName: "State" },
      "file.name": { displayName: "Note" },
    });
    expect(b.views[0].order).toEqual(["file.name", "status", "due"]);
  });

  it("leaves the name out for WITHOUT ID", () => {
    expect(view("table without id title, rating").order).toEqual(["title", "rating"]);
  });

  it("makes LIST a list view, with its one field", () => {
    expect(view('LIST FROM "Books"')).toEqual({ type: "list", name: "List", order: ["file.name"] });
    expect(view("LIST author").order).toEqual(["file.name", "author"]);
  });

  it("turns FROM folders, tags and links into the base's filters", () => {
    expect(base('TABLE x FROM "Projects/"').filters).toEqual({ and: ['file.inFolder("Projects")'] });
    expect(base('TABLE x FROM "Notes/a.md"').filters).toEqual({ and: ['file.path == "Notes/a.md"'] });
    expect(base("TABLE x FROM #work/ml").filters).toEqual({ and: ['file.hasTag("work/ml")'] });
    expect(base("TABLE x FROM [[Home|home]]").filters).toEqual({ and: ['file.hasLink(link("Home"))'] });
    expect(base("TABLE x FROM [[]]").filters).toEqual({ and: ["file.hasLink(this.file)"] });
  });

  it("joins FROM's sources by and, or and -", () => {
    expect(base('TABLE x FROM "A" and -#done').filters).toEqual({
      and: ['file.inFolder("A")', '!file.hasTag("done")'],
    });
    expect(base('TABLE x FROM ("A" or "B") and #t').filters).toEqual({
      and: ['file.inFolder("A") || file.inFolder("B")', 'file.hasTag("t")'],
    });
  });

  it("turns WHERE's comparisons into the view's filters", () => {
    expect(where('status = "done" and rating >= 4 and pages < 300 and a != 1 and b > -2 and c <= 5')).toEqual([
      'status == "done"',
      "rating >= 4",
      "pages < 300",
      "a != 1",
      "b > -2",
      "c <= 5",
    ]);
  });

  it("keeps or, ! and brackets", () => {
    expect(where("(a = 1 or b = 2) and !(c = 3)")).toEqual(["a == 1 || b == 2", "!(c == 3)"]);
    expect(where("a = 1 OR b = 2 AND c = 3")).toEqual(["a == 1 || b == 2 && c == 3"]);
    expect(where("done")).toEqual(["done"]);
  });

  it("maps contains, file fields, null and dates", () => {
    expect(where('contains(genre, "sf") and !contains(file.tags, "#old")')).toEqual([
      'genre.contains("sf")',
      '!file.hasTag("old")',
    ]);
    expect(where('file.name != "Index" and file.folder = "A" and file.ctime < date(2024-01-31)')).toEqual([
      'file.basename != "Index"',
      'file.folder == "A"',
      'file.ctime < date("2024-01-31")',
    ]);
    expect(where("due = null and owner != null")).toEqual(["due.isEmpty()", "!owner.isEmpty()"]);
    expect(where("due <= date(today) and file.mtime >= date(now) - dur(7 days)")).toEqual([
      "due <= today()",
      'file.mtime >= now() - "7 days"',
    ]);
    expect(where("x = [[Home]] and this.file.folder = file.folder and price * 2 > 10")).toEqual([
      'x == link("Home")',
      "this.file.folder == file.folder",
      "price * 2 > 10",
    ]);
    expect(where("due-date < date(tomorrow)")).toEqual(['note["due-date"] < today() + "1d"']);
  });

  it("joins several WHERE clauses", () => {
    expect(view("TABLE x WHERE a = 1 WHERE b = 2").filters.and).toEqual(["a == 1", "b == 2"]);
  });

  it("turns SORT and LIMIT into the view's", () => {
    const v = view('TABLE due FROM "A" WHERE a = 1 SORT due DESC, file.name ascending, rating LIMIT 10');
    expect(v.sort).toEqual([
      { property: "due", direction: "DESC" },
      { property: "file.name", direction: "ASC" },
      { property: "rating", direction: "ASC" },
    ]);
    expect(v.limit).toBe(10);
    expect(db.viewSpec(base("TABLE due SORT due desc"), 0).sort).toEqual([{ key: "due", desc: true }]);
  });

  it("drops // comment lines and says so", () => {
    const out = dv.toBase("// my books\nTABLE x");
    expect(out.warnings).toEqual(["// my books"]);
    expect(out.yaml).toContain("type: table");
  });

  it("refuses what has no sure match, naming it", () => {
    expect(refused('TASK FROM "A"')).toBe("TASK");
    expect(refused("CALENDAR due")).toBe("CALENDAR");
    expect(refused("TABLE x GROUP BY status")).toBe("GROUP BY status");
    expect(refused("TABLE x FLATTEN tags")).toBe("FLATTEN tags");
    expect(refused("TABLE length(file.tasks)")).toBe("length(file.tasks)");
    expect(refused("TABLE a + b AS sum")).toBe("a + b");
    expect(refused("TABLE book.author")).toBe("book.author");
    expect(refused("TABLE file.inlinks")).toBe("file.inlinks");
    expect(refused('TABLE x WHERE startswith(file.name, "a")')).toBe("startswith()");
    expect(refused("TABLE x WHERE file.day = date(today)")).toBe("file.day");
    expect(refused("TABLE x WHERE due < date(sow)")).toBe("date(sow)");
    expect(refused("TABLE x WHERE due = dur(1 week)")).toBe("dur(1 week)");
    expect(refused("TABLE x FROM outgoing([[A]])")).toBe("outgoing()");
    expect(refused("TABLE x LIMIT 5 SORT x")).toBe("SORT x");
    expect(refused("TABLE x SORT a SORT b")).toBe("SORT b");
    expect(refused("TABLE x WHERE a = 1 FROM \"A\"")).toBe('FROM "A"');
    expect(refused("LIST a, b")).toBe("a, b");
    expect(refused("TABLE x WHERE a >")).toBe("WHERE");
    expect(refused("TABLE x WHERE a = 1 b")).toBe("b");
    expect(refused("")).toBe("");
  });

  it("finds the query in a ```dataview block", () => {
    expect(dv.blockQuery("```dataview\nLIST\n```")).toEqual({ query: "LIST" });
    expect(dv.blockQuery("~~~~ dataview\nTABLE a\nFROM #t\n~~~~")).toEqual({ query: "TABLE a\nFROM #t" });
    expect(dv.blockQuery("```dataviewjs\ndv.list()\n```")).toEqual({ error: "dataviewjs" });
    expect(dv.blockQuery("```js\nx\n```")).toBeNull();
  });
});

describe("Convert Dataview query to base", () => {
  type Block = { id: string; kind: string; markdown: string };
  function run(blocks: Block[], selected = "", picked: string | null = null) {
    const edits: unknown[] = [];
    const notices: string[] = [];
    const commands = new Map<string, (...a: unknown[]) => Promise<void>>();
    const keep = (id: string, fn: (...a: unknown[]) => Promise<void>) => (commands.set(id, fn), { dispose() {} });
    loadPlugin("catvinci.database", {
      commands: { register: keep, registerEditorCommand: keep },
      ui: {
        notice: async (text: string) => void notices.push(text),
        pick: async () => picked,
      },
    });
    const editor = {
      getBlocks: async () => blocks,
      getSelection: async () => ({ text: selected, markdown: null }),
      edit: async (change: unknown) => (edits.push(change), true),
    };
    return commands.get("catvinci.database.fromDataview")!(editor).then(() => ({ edits, notices }));
  }
  const DV = { id: "b1", kind: "code", markdown: '```dataview\nTABLE due\nFROM "A"\n```' };
  const JS = { id: "b2", kind: "code", markdown: "```dataviewjs\ndv.list()\n```" };
  const TEXT = { id: "p", kind: "paragraph", markdown: "Hello" };

  it("puts a base in the block's place, as one edit", async () => {
    const { edits, notices } = await run([TEXT, DV]);
    expect(notices).toEqual([]);
    expect(edits).toEqual([
      {
        action: "replace",
        block: "b1",
        text: '```base\nfilters:\n  and:\n    - file.inFolder("A")\nviews:\n  - type: table\n    name: Table\n    order:\n      - file.name\n      - due\n```',
      },
    ]);
  });

  it("takes the block holding the selection, else asks which", async () => {
    const other = { ...DV, id: "b3", markdown: "```dataview\nLIST\n```" };
    expect((await run([DV, other], "LIST")).edits).toMatchObject([{ block: "b3" }]);
    expect((await run([DV, other], "", "b1")).edits).toMatchObject([{ block: "b1" }]);
    expect((await run([DV, other], "", null)).edits).toEqual([]);
  });

  it("says why, and changes nothing, when it can't", async () => {
    expect(await run([TEXT])).toEqual({ edits: [], notices: ["dataviewNone"] });
    expect(await run([JS])).toEqual({ edits: [], notices: ["dataviewCant dataviewjs"] });
    const grouped = { ...DV, markdown: "```dataview\nTABLE x GROUP BY y\n```" };
    expect(await run([grouped])).toEqual({ edits: [], notices: ["dataviewCant GROUP BY y"] });
  });
});
