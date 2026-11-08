import { beforeAll, describe, expect, it } from "vitest";

/** Bases expressions (plugins/catvinci.database/expr.js). */
type Doc = {
  rel: string;
  frontmatter?: Record<string, unknown>;
  tags?: unknown[];
  links?: unknown[];
};
let x: {
  compile: (s: string) => (ctx: unknown) => unknown;
  filterOf: (f: unknown) => {
    test: (ctx: unknown) => boolean;
    skipped: string[];
  };
  fileOf: (d: Doc) => unknown;
};

beforeAll(async () => {
  const script = "../shared/expr.js";
  await import(/* @vite-ignore */ script);
  x = (globalThis as unknown as { bexpr: typeof x }).bexpr;
});

const ctx = (doc: Doc, self?: Doc) => ({
  file: x.fileOf(doc),
  this: self ? x.fileOf(self) : null,
});
const run = (s: string, doc: Doc, self?: Doc) => x.compile(s)(ctx(doc, self));

// The rows of a folder unit's database: the pages right in its folder, and
// the units one level down (a row with sub-pages), not their sub-pages.
const UNIT_ROWS = [
  "file.inFolder(this.file.folder)",
  "file.path != this.file.path",
  'file.folder == this.file.folder || file.folder == if(this.file.folder.isEmpty(), file.basename, this.file.folder + "/" + file.basename)',
];

describe("Bases expressions", () => {
  const week = {
    rel: "Life/2026 Calendar/Week1.md",
    frontmatter: {
      status: "Done",
      rate: 4,
      due: "2026-01-04",
      tags: ["work", "plan/q1"],
    },
  };

  it("compares properties, by name or note[...], numbers, dates and text", () => {
    expect(run('status == "Done"', week)).toBe(true);
    expect(run('status != "Done"', week)).toBe(false);
    expect(run("rate > 3 && rate <= 4", week)).toBe(true);
    expect(run('note["rate"] * 2 == 8', week)).toBe(true);
    expect(run('due < date("2026-02-01")', week)).toBe(true);
    expect(run('due + "1 week" > date("2026-01-10")', week)).toBe(true);
    expect(run("missing.isEmpty() && !status.isEmpty()", week)).toBe(true);
    expect(run('tags.contains("work") && file.hasTag("plan")', week)).toBe(
      true,
    );
  });

  it("knows the file: its name, folder, path and links", () => {
    expect(run("file.basename", week)).toBe("Week1");
    expect(run("file.name", week)).toBe("Week1.md");
    expect(run('file.inFolder("Life")', week)).toBe(true);
    expect(run('file.inFolder("Lif")', week)).toBe(false);
    expect(
      run('file.hasLink("Plans")', { rel: "a.md", links: ["Work/Plans.md"] }),
    ).toBe(true);
  });

  it("finds a unit's rows and leaves out their sub-pages and the unit's own page", () => {
    const self = { rel: "Life/2026 Calendar/2026 Calendar.md" };
    const { test, skipped } = x.filterOf({ and: UNIT_ROWS });
    expect(skipped).toEqual([]);
    const rows = [
      "Life/2026 Calendar/Week2.md",
      "Life/2026 Calendar/Week1/Week1.md",
      "Life/2026 Calendar/Week1/Jan 1.md",
      "Life/2026 Calendar/Week1/Jan 2/Jan 2.md",
      "Life/2026 Calendar/2026 Calendar.md",
      "Life/Reminders/Pay rent.md",
    ].filter((rel) => test(ctx({ rel }, self)));
    expect(rows).toEqual([
      "Life/2026 Calendar/Week2.md",
      "Life/2026 Calendar/Week1/Week1.md",
    ]);
  });

  it("passes what it can't read and says so", () => {
    const { test, skipped } = x.filterOf({
      and: ['status == "Done"', "formula.ppu > 5", "file.size >"],
    });
    expect(test(ctx(week))).toBe(true);
    expect(skipped).toEqual(["file.size >"]);
    expect(x.filterOf({ not: ['status == "Done"'] }).test(ctx(week))).toBe(
      false,
    );
    expect(
      x.filterOf({ or: ["rate > 9", 'status == "Done"'] }).test(ctx(week)),
    ).toBe(true);
  });
});
