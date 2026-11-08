import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { load } from "js-yaml";
import { FIXTURE, H, exportFiles, id } from "./notion-fixture";

/** Notion Import's conversion (plugins/catvinci.notion-import/notion.js),
 *  run on a synthetic export (tests/fixtures/notion-export). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ni: any;

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/notion-csv.js");
  await import(/* @vite-ignore */ "../shared/yaml.js");
  await import(/* @vite-ignore */ "../shared/bases.js");
  await import(
    /* @vite-ignore */ "../plugins/catvinci.notion-import/notion.js"
  );
  ni = (globalThis as unknown as { notionImport: unknown }).notionImport;
});

/** An import into memory: the files written (bytes as their size) and the report. */
async function importOf(
  paths: string[],
  read: (path: string, kind: string) => Promise<unknown>,
  abortAfter = 0,
) {
  const out: Record<string, string> = {};
  const folders: string[] = [];
  const controller = new AbortController();
  const report = await ni.importExport({
    paths,
    read,
    write: {
      folder: async (path: string) => void folders.push(path),
      text: async (path: string, text: string) => {
        if (path in out) throw new Error(`${path} written twice`);
        out[path] = text;
      },
      bytes: async (path: string, bytes: Uint8Array) =>
        void (out[path] = `<${bytes.length} bytes>`),
    },
    progress: (done: number) => {
      if (abortAfter && done >= abortAfter) controller.abort();
    },
    signal: controller.signal,
  });
  return { out, folders, report };
}

const TOO_BIG = "The file is too big to open here.";

/** The fixture's import; `fail` names the files whose read fails. */
const importFixture = (options: { abortAfter?: number; fail?: string } = {}) =>
  importOf(
    exportFiles(),
    async (path, kind) => {
      if (path === options.fail) throw new Error(TOO_BIG);
      return kind === "text"
        ? readFileSync(join(FIXTURE, path), "utf8")
        : new Uint8Array(readFileSync(join(FIXTURE, path)));
    },
    options.abortAfter,
  );

/** The import of an export given as its files' texts; reading `fail` fails. */
const importMemory = (files: Record<string, string>, fail = "") =>
  importOf(Object.keys(files), async (path, kind) => {
    if (path === fail) throw new Error(TOO_BIG);
    return kind === "text"
      ? files[path]
      : new TextEncoder().encode(files[path]);
  });

describe("names", () => {
  it("drops Notion's id and what file systems refuse", () => {
    expect(ni.cleanName(`Plans ${H}`)).toBe("Plans");
    expect(ni.cleanName(`a/b: c? ${H}`)).toBe("a-b- c-");
    expect(ni.cleanName("trailing. ")).toBe("trailing");
    expect(ni.cleanName(`  ${H}`)).toBe("Untitled");
    expect(ni.cleanName("")).toBe("Untitled");
    expect(ni.cleanName("x".repeat(150))).toHaveLength(100);
    // Never half an emoji, and within what ext4 takes for a name in bytes.
    expect(ni.cleanName("x".repeat(99) + "😀 party")).toBe(
      "x".repeat(99) + "😀",
    );
    expect(
      new TextEncoder().encode(ni.cleanName("中".repeat(120))).length,
    ).toBeLessThanOrEqual(200);
    // Decomposed (as a Mac may write it) becomes composed.
    expect(ni.cleanName("Café")).toBe("Café");
  });

  it("lays out pages, their folders and databases, and numbers names met twice", () => {
    const layout = ni.plan([
      `Notes ${id("9")}.md`,
      `Notes ${id("a")}.md`,
      `Notes ${id("a")}/pic.png`,
      `Home ${H}.md`,
      `Home ${H}/DB ${id("2")}.csv`,
      `Home ${H}/DB ${id("2")}_all.csv`,
      `Home ${H}/DB ${id("2")}/Row ${id("3")}.md`,
      `Home ${H}/image.png`,
      `Home ${H}/image ${id("5")}.png`,
    ]);
    expect(Object.fromEntries(layout.files)).toEqual({
      [`Notes ${id("9")}.md`]: "Notes.md",
      [`Notes ${id("a")}.md`]: "Notes 2/Notes 2.md",
      [`Notes ${id("a")}/pic.png`]: "Notes 2/pic.png",
      [`Home ${H}.md`]: "Home/Home.md",
      [`Home ${H}/DB ${id("2")}.csv`]: "Home/DB/DB.md",
      [`Home ${H}/DB ${id("2")}_all.csv`]: "Home/DB/DB.md",
      [`Home ${H}/DB ${id("2")}/Row ${id("3")}.md`]: "Home/DB/Row.md",
      [`Home ${H}/image ${id("5")}.png`]: "Home/image.png",
      [`Home ${H}/image.png`]: "Home/image 2.png",
    });
    expect(layout.databases).toEqual([
      {
        name: "DB",
        csv: `Home ${H}/DB ${id("2")}_all.csv`,
        page: "Home/DB/DB.md",
        folder: "Home/DB",
        from: `Home ${H}/DB ${id("2")}`,
        intro: null,
        id: id("2"),
      },
    ]);
    expect(layout.byId.get(id("3"))).toBe("Home/DB/Row.md");
    expect(layout.byId.get(id("2"))).toBe("Home/DB/DB.md");
  });

  it("gives names that differ only by case a number too", () => {
    const layout = ni.plan([`plans ${id("1")}.md`, `Plans ${id("2")}.md`]);
    expect([...layout.files.values()].sort()).toEqual([
      "Plans.md",
      "plans 2.md",
    ]);
  });

  it("numbers thousands of pages with one name quickly, and keeps an attachment's own name", () => {
    const paths = Array.from(
      { length: 20000 },
      (_, i) => `Untitled ${i.toString(16).padStart(32, "0")}.md`,
    );
    const start = performance.now();
    const layout = ni.plan(paths);
    expect(performance.now() - start).toBeLessThan(2000);
    expect(layout.files.get(paths[19999])).toBe("Untitled 20000.md");
    const mixed = ni.plan([`A ${id("1")}.md`, `A ${id("2")}.md`, "A.png"]);
    expect(mixed.files.get("A.png")).toBe("A.png");
  }, 60000);

  it("drops the folder a whole zip is in, and a Mac's extra files", () => {
    expect(
      ni.tidyPaths([
        "Export-1/a.md",
        "Export-1/b/c.md",
        "__MACOSX/Export-1/._a.md",
        "Export-1/.DS_Store",
      ]),
    ).toEqual({
      top: "Export-1/",
      paths: ["a.md", "b/c.md"],
    });
    expect(ni.tidyPaths(["a.md", "b/c.md"])).toEqual({
      top: "",
      paths: ["a.md", "b/c.md"],
    });
  });
});

describe("links", () => {
  const layout = () =>
    ni.plan([
      `Home ${H}.md`,
      `Home ${H}/Sub ${id("1")}.md`,
      `Home ${H}/Sub ${id("1")}/a b.png`,
      `Home ${H}/DB ${id("2")}.csv`,
    ]);

  it("follow the new names, encoded and relative", () => {
    const found: { kind: string; target: string }[] = [];
    const text = [
      `[Sub](Home%20${H}/Sub%20${id("1")}.md)`,
      `![pic](Home%20${H}/Sub%20${id("1")}/a%20b.png "A title")`,
      `[DB](Home%20${H}/DB%20${id("2")}.csv)`,
      `[Again](<Home ${H}/Sub ${id("1")}.md#heading>)`,
    ].join("\n");
    // Home and Sub have sub-pages or files, DB is a database: folder units.
    expect(
      ni.rewriteLinks(
        text,
        `Home ${H}.md`,
        "Home/Home.md",
        layout(),
        (l: never) => found.push(l),
      ),
    ).toBe(
      [
        "[Sub](Sub/Sub.md)",
        '![pic](Sub/a%20b.png "A title")',
        "[DB](DB/DB.md)",
        "[Again](Sub/Sub.md#heading)",
      ].join("\n"),
    );
    expect(found.map((l) => l.kind)).toEqual(["page", "file", "page", "page"]);
  });

  it("go up from a sub-page and follow notion.so addresses the export has", () => {
    const text = `[Home](../Home%20${H}.md) [Sub](https://www.notion.so/Sub-${id("1")}?pvs=4)`;
    expect(
      ni.rewriteLinks(
        text,
        `Home ${H}/Sub ${id("1")}.md`,
        "Home/Sub/Sub.md",
        layout(),
      ),
    ).toBe("[Home](../Home.md) [Sub](Sub.md)");
  });

  it("leave the web, anchors, code and missing pages alone, and say which were missing", () => {
    const found: { kind: string; target: string }[] = [];
    const text = [
      "[web](https://example.com/a)",
      `[elsewhere](https://www.notion.so/Other-${id("f")})`,
      "[anchor](#top)",
      "`[code](Sub%20x.md)`",
      "```",
      `[fenced](Home%20${H}/Sub%20${id("1")}.md)`,
      "```",
      `[gone](Gone%20${id("e")}.md)`,
    ].join("\n");
    expect(
      ni.rewriteLinks(text, `Home ${H}.md`, "Home.md", layout(), (l: never) =>
        found.push(l),
      ),
    ).toBe(text);
    expect(found).toEqual([
      { target: "https://example.com/a", kind: "web" },
      { target: `https://www.notion.so/Other-${id("f")}`, kind: "web" },
      { target: `Gone ${id("e")}.md`, kind: "missing" },
    ]);
  });

  it("follow pages whose titles have brackets or parentheses", () => {
    const found: { kind: string }[] = [];
    const layout = ni.plan([
      `Home ${H}.md`,
      `Home ${H}/[WIP] Spec ${id("4")}.md`,
      `Home ${H}/Plan (draft) ${id("3")}.md`,
    ]);
    const text = `[[WIP] Spec](Home%20${H}/%5BWIP%5D%20Spec%20${id("4")}.md) [Plan (draft)](Home%20${H}/Plan%20(draft)%20${id("3")}.md)`;
    expect(
      ni.rewriteLinks(text, `Home ${H}.md`, "Home.md", layout, (l: never) =>
        found.push(l),
      ),
    ).toBe(
      "[[WIP] Spec](Home/[WIP]%20Spec.md) [Plan (draft)](Home/Plan%20%28draft%29.md)",
    );
    expect(found.map((l) => l.kind)).toEqual(["page", "page"]);
  });

  it("encode what a link can't hold", () => {
    expect(ni.encodeLink("A (1)/b#c?.md")).toBe("A%20%281%29/b%23c%3F.md");
    expect(ni.relative("a/b", "a/c/d.md")).toBe("../c/d.md");
    expect(ni.relative("", "x.md")).toBe("x.md");
  });
});

describe("Notion's blocks", () => {
  it("turn callouts into notes, keeping the emoji and dropping Notion's own icon pictures", () => {
    const kinds: string[] = [];
    const text =
      "<aside>\n💡 Remember this.\n\nSecond line.\n</aside>\n\n" +
      '<aside>\n<img src="https://www.notion.so/icons/bulb.svg" alt="https://www.notion.so/icons/bulb.svg" width="40px" />\n\nPlain.\n\n</aside>\n\n' +
      '<aside>\n<img src="x.png" alt="📌" />\n\nPinned.\n</aside>\n\n' +
      // As Notion mostly writes it: the icon before the first words.
      '<aside>\n<img src="https://www.notion.so/icons/info-alternate_blue.svg" alt="https://www.notion.so/icons/info-alternate_blue.svg" width="40px" /> Gazebo 8 is used.\n\n</aside>\n\n' +
      '<aside>\n<img src="x.png" alt="📌" /> Pinned inline.\n</aside>';
    expect(ni.convertCallouts(text, (k: string) => kinds.push(k))).toBe(
      "> [!NOTE]\n> 💡 Remember this.\n>\n> Second line.\n\n> [!NOTE]\n> Plain.\n\n> [!NOTE]\n> 📌 Pinned.\n\n" +
        "> [!NOTE]\n> Gazebo 8 is used.\n\n> [!NOTE]\n> 📌 Pinned inline.",
    );
    expect(kinds).toEqual([
      "callout",
      "callout",
      "icon",
      "callout",
      "callout",
      "icon",
      "callout",
    ]);
  });

  it("leave toggles and callouts in code as they are", () => {
    const text =
      "<details>\n<summary>More</summary>\n\nInside\n\n</details>\n\n```html\n<aside>\nx\n</aside>\n```";
    expect(ni.convertCallouts(text)).toBe(text);
  });
});

describe("front matter", () => {
  it("writes values YAML reads back as they were", () => {
    expect(
      ni.frontMatter({
        status: "In progress",
        due: "2026-01-04",
        done: false,
        budget: 80.5,
        tags: ["Design", "Web"],
        related: ["[Garden](Garden.md)"],
        note: "a: b",
        answer: "yes",
        code: "007",
        empty: [],
        none: null,
      }),
    ).toBe(
      "---\nstatus: In progress\ndue: 2026-01-04\ndone: false\nbudget: 80.5\ntags:\n  - Design\n  - Web\nrelated:\n" +
        '  - "[Garden](Garden.md)"\nnote: "a: b"\nanswer: "yes"\ncode: "007"\n---\n',
    );
    expect(ni.frontMatter({})).toBe("");
  });

  it("reads a page's property values", () => {
    expect(ni.propertyValue("2026年1月4日")).toBe("2026-01-04");
    expect(ni.propertyValue("January 4, 2026 → January 6, 2026")).toEqual({
      start: "2026-01-04",
      end: "2026-01-06",
    });
    expect(ni.propertyValue("Yes")).toBe(true);
    expect(ni.propertyValue("科幻")).toBe("科幻");
  });
});

describe("databases", () => {
  it("add a board for a status and a calendar for dates", () => {
    const rows = [
      { props: { status: "Doing", due: "2026-01-04", owner: "Ann" } },
      { props: { status: "Done", due: "2026-01-05", owner: "Bo" } },
      {
        props: {
          status: "Doing",
          due: "2026-01-06",
          due_end: "2026-01-07",
          owner: "Cy",
        },
      },
    ];
    expect(ni.boardKey(rows)).toBe("status");
    expect(ni.dateKey(rows)).toBe("due");
    // One base, on its board, its views a click apart: the calendar's dates already set.
    const page = ni.databasePage("Tasks", rows).text;
    expect(page.startsWith("# Tasks\n\n```base\n")).toBe(true);
    expect(
      load(page.slice(page.indexOf("```base\n") + 8, page.lastIndexOf("```"))),
    ).toMatchObject({
      filters: {
        and: expect.arrayContaining(["file.inFolder(this.file.folder)"]),
      },
      views: [
        { type: "kanban", name: "Board", groupBy: { property: "status" } },
        { type: "table", name: "Table" },
        { type: "calendar", name: "Calendar", date: "due", end: "due_end" },
      ],
    });
  });

  it("add a board for a status column even when every row's status differs", () => {
    const rows = [
      { props: { status: "Not started" } },
      { props: { status: "In progress" } },
      { props: { status: "Done" } },
    ];
    expect(ni.boardKey(rows)).toBe("status");
    expect(
      ni.boardKey([
        { props: { problem_statement: "a" } },
        { props: { problem_statement: "b" } },
      ]),
    ).toBeNull();
  });

  it("is a table alone without a status or a date", () => {
    const rows = [{ props: { owner: "Ann" } }, { props: { owner: "Bo" } }];
    const { text, group, date } = ni.databasePage("People", rows);
    expect([group, date]).toEqual([null, null]);
    expect(
      (
        load(
          text.slice(text.indexOf("```base\n") + 8, text.lastIndexOf("```")),
        ) as { views: unknown }
      ).views,
    ).toEqual([{ type: "table", name: "Table" }]);
  });
});

describe("the fixture's import", () => {
  it("writes clean names in the page/sub-folder layout, never twice", async () => {
    const { out } = await importFixture();
    expect(Object.keys(out).sort()).toEqual(
      [
        "Home/Home.md",
        "Home/Meeting Template.md",
        "Home/Projects/Projects.md",
        "Home/Projects/Garden.md",
        "Home/Projects/Launch.md",
        "Home/Projects/Website Redesign/Website Redesign.md",
        "Home/Projects/Website Redesign/mockup.png",
        "Home/Reading List/Reading List.md",
        "Home/Reading List/cover.png",
        "Home/Spec.pdf",
        "Home/logo.png",
        "Notes 2.md",
        "Notes.md",
        "读书笔记/读书笔记.md",
        "读书笔记/三体.md",
        "读书笔记/任务/任务.md",
        "读书笔记/任务/写读后感.md",
        "读书笔记/任务/整理笔记.md",
        "读书笔记/任务/读第一章.md",
      ].sort(),
    );
    expect(out["Home/logo.png"]).toBe("<70 bytes>");
    expect(Object.keys(out).join("\n")).not.toMatch(/[0-9a-f]{32}/);
  });

  it("rewrites the home page's links, callouts and attachments", async () => {
    const { out } = await importFixture();
    // A folder unit now: Home/Home.md, its links from inside Home/.
    const home = out["Home/Home.md"];
    expect(home).toContain(
      "> [!NOTE]\n> Welcome to the workspace.\n>\n> Read the [Reading List](Reading%20List/Reading%20List.md) first.",
    );
    expect(home).toContain("> [!NOTE]\n> 💡 Remember to export every week.");
    expect(home).toContain("[Projects](Projects/Projects.md)");
    expect(home).toContain(
      "[Website Redesign](Projects/Website%20Redesign/Website%20Redesign.md)",
    );
    // The database shown here as well: its rows by its folder's path in the open folder.
    expect(home).toContain(
      '```base\nfilters:\n  and:\n    - file.inFolder((if(this.file.folder.isEmpty(), "Projects", this.file.folder + "/Projects")))\n',
    );
    expect(home).toContain("![Logo](logo.png)");
    expect(home).toContain("[Spec](Spec.pdf)");
    expect(home).toContain(
      `[Old page](Home%20${H}/Deleted%20Page%20${id("b")}.md)`,
    );
    expect(home).not.toContain("<aside>");
  });

  it("keeps code as it was in a sub-page", async () => {
    const { out } = await importFixture();
    expect(out["Home/Reading List/Reading List.md"]).toBe(
      "# Reading List\n\nBack to [Home](../Home.md).\n\n![Cover](cover.png)\n\n" +
        "```md\n[raw](Keep%20" +
        id("1") +
        ".md)\n```\n\nInline code stays: `[code](Keep%20" +
        id("1") +
        ".md)`.\n",
    );
  });

  it("makes a document per row with the CSV's properties, relations as links", async () => {
    const { out } = await importFixture();
    // A row with a picture of its own is a folder unit, its picture beside it.
    expect(out["Home/Projects/Website Redesign/Website Redesign.md"]).toBe(
      "---\nstatus: In progress\ndue: 2026-01-04\ntags:\n  - Design\n  - Web\ndone: false\nbudget: 1200\n" +
        'related:\n  - "[Garden](../Garden.md)"\n---\n# Website Redesign\n\n' +
        "The new site. See [Garden](../Garden.md) and the [home page](../../Home.md).\n\n![Mockup](mockup.png)\n",
    );
    expect(out["Home/Projects/Garden.md"]).toContain(
      "due: 2026-02-10\ndue_end: 2026-02-12\n",
    );
    // Every row is a note, one with no page of its own too.
    expect(out["Home/Projects/Launch.md"]).toBe(
      "---\nstatus: In progress\ndue: 2026-03-01\ntags:\n  - Web\ndone: false\nrelated:\n" +
        '  - "[Website Redesign](Website%20Redesign/Website%20Redesign.md)"\n  - "[Garden](Garden.md)"\n---\n# Launch\n',
    );
    // The database is a folder unit; its base chooses the unit's rows.
    expect(out["Home/Projects/Projects.md"]).toContain(
      "```base\nfilters:\n  and:\n    - file.inFolder(this.file.folder)\n",
    );
    expect(out["Home/Projects/Projects.md"]).toContain(
      "  - type: kanban\n    name: Board\n    groupBy:\n      property: status\n",
    );
    expect(out["Home/Projects/Projects.md"].match(/```base/g)).toHaveLength(1);
  });

  it("reads the Chinese database: its dates, its status and a relation", async () => {
    const { out } = await importFixture();
    expect(out["读书笔记/任务/读第一章.md"]).toBe(
      '---\n状态: 进行中\n日期: 2026-01-04\n书:\n  - "[三体](../三体.md)"\n---\n# 读第一章\n\n先读到“科学边界”。\n',
    );
    expect(out["读书笔记/任务/写读后感.md"]).toBe(
      "---\n状态: 未开始\n日期: 2026-02-01\n---\n# 写读后感\n",
    );
    expect(out["读书笔记/任务/任务.md"]).toContain(
      "groupBy:\n      property: 状态",
    );
    expect(out["读书笔记/任务/任务.md"]).toContain("date: 日期");
  });

  it("keeps the opening Key: value lines of a page that isn't a row, and links CJK names", async () => {
    const { out } = await importFixture();
    const page = out["读书笔记/读书笔记.md"];
    expect(
      page.startsWith(
        "# 读书笔记\n\n创建时间: 2026年1月4日\n标签: 科幻\n已读: Yes\n\n我的读书笔记。",
      ),
    ).toBe(true);
    expect(page).toContain("[三体](三体.md)");
    expect(page).toContain("[任务](任务/任务.md)");
    expect(page).toContain("<details>\n<summary>折叠内容</summary>");
    expect(out["读书笔记/三体.md"]).toContain(
      "> [!NOTE]\n> 📌 刘慈欣著。\n\n回到[读书笔记](读书笔记.md)。",
    );
  });

  it("makes each folder once, a parent before its child", async () => {
    const { folders } = await importFixture();
    expect(new Set(folders).size).toBe(folders.length);
    for (const f of folders)
      if (f.includes("/"))
        expect(folders.indexOf(f.slice(0, f.lastIndexOf("/")))).toBeLessThan(
          folders.indexOf(f),
        );
  });

  it("reports the counts, the links not found and the blocks changed", async () => {
    const { report } = await importFixture();
    expect(report).toMatchObject({
      pages: 7,
      databases: 2,
      rows: 6,
      files: 4,
      total: 18,
      done: 18,
      stopped: false,
    });
    expect(report.missing).toEqual([
      { page: "Home/Home.md", target: `Home ${H}/Deleted Page ${id("b")}.md` },
    ]);
    expect(report.blocks).toEqual({
      callout: ["Home/Home.md", "Home/Home.md", "读书笔记/三体.md"],
      icon: ["Home/Home.md"],
    });
    expect(report.stats).toEqual({
      subpages: 3,
      databases: 2,
      links: report.stats.links,
      todos: 10,
      urls: 2,
      pdfs: 1,
      templates: 1,
    });
    expect(report.stats.links).toBeGreaterThan(5);
  });

  it("lists a file it couldn't read, and imports the rest", async () => {
    const { out, report } = await importFixture({ fail: `Home ${H}/Spec.pdf` });
    expect(report.failed).toEqual([
      { path: `Home ${H}/Spec.pdf`, error: TOO_BIG },
    ]);
    expect(report).toMatchObject({
      done: 18,
      total: 18,
      files: 3,
      stopped: false,
    });
    expect(out).not.toHaveProperty("Home/Spec.pdf");
    expect(out["Home/Home.md"]).toContain("[Spec](Spec.pdf)");
    const t = (key: string, ...args: unknown[]) => [key, ...args].join("|");
    expect(ni.reportPage(report, [], t, { source: "x", date: "d" })).toContain(
      `## failedTitle\n\nfailedIntro\n\n- \`Home ${H}/Spec.pdf\`: ${TOO_BIG}\n`,
    );
  });

  it("stops between files when cancelled, keeping what it wrote", async () => {
    const { out, report } = await importFixture({ abortAfter: 3 });
    expect(report.stopped).toBe(true);
    expect(report.done).toBeLessThan(report.total);
    expect(Object.keys(out).length).toBeGreaterThan(0);
    expect(Object.keys(out).length).toBeLessThan(19);
  });
});

describe("an export's harder cases", () => {
  const D = id("d");
  // A database's rows: the documents in its folder, not its own page (DB/DB.md).
  const rowDocs = (out: Record<string, string>, dir: string) =>
    Object.keys(out)
      .filter(
        (p) =>
          p.startsWith(dir + "/") && p !== `${dir}/${dir.split("/").pop()}.md`,
      )
      .sort();

  it("finds a row's page when Notion cut its file name or swapped / : ? in it, and gives it its whole title", async () => {
    const long = "How we migrated the billing service to the new event bus";
    const { out, report } = await importMemory({
      [`DB ${D}.csv`]: `Name,Status\n${long},Done\n"Q1/Q2: plan?",Doing\n`,
      [`DB ${D}/${long.slice(0, 50)} ${id("1")}.md`]: `# ${long}\n\nStatus: Done\n\nBody one.`,
      [`DB ${D}/Q1 Q2  plan  ${id("2")}.md`]:
        "# Q1/Q2: plan?\n\nStatus: Doing\n\nBody two.",
    });
    expect(rowDocs(out, "DB")).toEqual([`DB/${long}.md`, "DB/Q1 Q2  plan.md"]);
    expect(out[`DB/${long}.md`]).toBe(
      `---\nstatus: Done\n---\n# ${long}\n\nBody one.\n`,
    );
    expect(out["DB/Q1 Q2  plan.md"]).toBe(
      "---\nstatus: Doing\n---\n# Q1/Q2: plan?\n\nBody two.\n",
    );
    expect(report).toMatchObject({ rows: 2, pages: 0 });
  });

  it("goes on when a row's page can't be read while it looks for it", async () => {
    const page = `DB ${D}/Q1 Q2  plan  ${id("2")}.md`;
    const { out, report } = await importMemory(
      {
        [`DB ${D}.csv`]: 'Name,Status\n"Q1/Q2: plan?",Doing\n',
        [page]: "# Q1/Q2: plan?",
      },
      page,
    );
    // Nothing could be read of it: the row keeps the CSV's properties, and the page is a failure.
    expect(
      Object.values(out).some((text) =>
        text.startsWith("---\nstatus: Doing\n---\n# Q1/Q2: plan?\n"),
      ),
    ).toBe(true);
    expect(report.failed).toEqual([{ path: page, error: TOO_BIG }]);
  });

  it("gives rows that share a title the page whose properties agree with them", async () => {
    const { out } = await importMemory({
      [`Meetings ${D}.csv`]:
        'Name,Date\nWeekly sync,"January 5, 2026"\nWeekly sync,"January 12, 2026"\n',
      [`Meetings ${D}/Weekly sync ${id("c")}.md`]:
        "# Weekly sync\n\nDate: January 12, 2026\n\nJan 12 notes",
      [`Meetings ${D}/Weekly sync ${id("f")}.md`]:
        "# Weekly sync\n\nDate: January 5, 2026\n\nJan 5 notes",
    });
    expect(out["Meetings/Weekly sync.md"]).toBe(
      "---\ndate: 2026-01-12\n---\n# Weekly sync\n\nJan 12 notes\n",
    );
    expect(out["Meetings/Weekly sync 2.md"]).toBe(
      "---\ndate: 2026-01-05\n---\n# Weekly sync\n\nJan 5 notes\n",
    );
  });

  it("matches tens of thousands of rows to their pages quickly", async () => {
    const files: Record<string, string> = {};
    const names = Array.from({ length: 20000 }, (_, i) => `Row ${i}`);
    files[`Big ${D}.csv`] = "Name\n" + [...names].reverse().join("\n") + "\n";
    names.forEach(
      (name, i) =>
        (files[`Big ${D}/${name} ${i.toString(16).padStart(32, "0")}.md`] =
          `# ${name}\n\nBody ${i}`),
    );
    const start = performance.now();
    const { out, report } = await importMemory(files);
    expect(performance.now() - start).toBeLessThan(5000);
    expect(report).toMatchObject({ rows: 20000, pages: 0 });
    expect(out["Big/Row 7.md"]).toBe("# Row 7\n\nBody 7\n");
  }, 120000);

  it("copies a .csv or .md attached to a page as it is", async () => {
    const sales = "Region,Q1\nNorth,10\nSouth,20\n";
    const notes = "# My notes\n\nStatus: Draft\n\nbody";
    const { out } = await importMemory({
      [`Home ${H}.md`]: `# Home\n\n[sales.csv](Home%20${H}/sales.csv) [notes](Home%20${H}/notes.md)`,
      [`Home ${H}/sales.csv`]: sales,
      [`Home ${H}/notes.md`]: notes,
    });
    expect(out).toEqual({
      "Home/Home.md": "# Home\n\n[sales.csv](sales.csv) [notes](notes.md)\n",
      "Home/sales.csv": `<${sales.length} bytes>`,
      "Home/notes.md": `<${notes.length} bytes>`,
    });
  });

  it("reads property lines only on a database's row pages", async () => {
    const { out } = await importMemory({
      [`Home ${H}.md`]: `# Home\n\nSource: [Guide](Home%20${H}/Guide%20${id("1")}.md)\n\nMore text.`,
      [`Home ${H}/Guide ${id("1")}.md`]:
        "# Guide\n\nDate: Mar 3, 2026 retro\n\nAgenda",
      [`DB ${D}.csv`]: "Name,Status\nA,Done\n",
      [`DB ${D}/B ${id("2")}.md`]:
        "# B\n\nStatus: Doing\n\nA row the CSV doesn't have.",
    });
    expect(out["Home/Home.md"]).toBe(
      "# Home\n\nSource: [Guide](Guide.md)\n\nMore text.\n",
    );
    expect(out["Home/Guide.md"]).toBe(
      "# Guide\n\nDate: Mar 3, 2026 retro\n\nAgenda\n",
    );
    expect(out["DB/B.md"]).toBe(
      "---\nstatus: Doing\n---\n# B\n\nA row the CSV doesn't have.\n",
    );
  });

  it("links a relation to a page whose title has parentheses", async () => {
    const P = id("e");
    const { out } = await importMemory({
      [`Projects ${P}.csv`]: "Name\nPlan (v2)\n",
      [`Projects ${P}/Plan (v2) ${id("3")}.md`]: "# Plan (v2)\n\nBody",
      [`Tasks ${D}.csv`]: `Name,Project\nA,Plan (v2) (Projects%20${P}/Plan%20(v2)%20${id("3")}.md)\n`,
    });
    // A has nothing written in it and is a note all the same; its relation a link.
    expect(out["Tasks/A.md"]).toContain(
      '  - "[Plan (v2)](../Projects/Plan%20%28v2%29.md)"',
    );
  });
});

describe("suggestions and the report", () => {
  const stats = {
    subpages: 3,
    databases: 2,
    links: 4,
    todos: 10,
    urls: 1,
    pdfs: 1,
    templates: 1,
  };
  const none = {
    subpages: 0,
    databases: 0,
    links: 0,
    todos: 0,
    urls: 0,
    pdfs: 0,
    templates: 0,
  };

  // Only plugins that work on what the import writes: Kanban, Reminders and Daily Notes read files of their own.
  it("suggests a plugin for each thing the export holds, in order", () => {
    // Workspace first: it shows the pages tree and the databases.
    expect(ni.recommend(stats).map((s: { id: string }) => s.id)).toEqual([
      "catvinci.database",
      "catvinci.backlinks",
      "catvinci.quick-preview",
      "catvinci.tasks",
      "catvinci.link-cards",
      "catvinci.pdf-viewer",
      "catvinci.templates",
    ]);
    expect(ni.recommend(stats)[1]).toEqual({
      id: "catvinci.backlinks",
      why: "why.catvinci.backlinks",
    });
  });

  it("leaves out what is installed, what the export doesn't use and a few to-dos", () => {
    expect(ni.recommend(none)).toEqual([]);
    expect(ni.recommend({ ...none, todos: 9 })).toEqual([]);
    expect(
      ni
        .recommend({ ...none, links: 1 }, new Set(["catvinci.backlinks"]))
        .map((s: { id: string }) => s.id),
    ).toEqual(["catvinci.quick-preview"]);
  });

  it("has a line for each suggestion, the missing links and the blocks", async () => {
    const { report } = await importFixture();
    const t = (key: string, ...args: unknown[]) => [key, ...args].join("|");
    const page = ni.reportPage(
      report,
      ni.recommend(report.stats, new Set(["catvinci.quick-preview"])),
      t,
      {
        source: "Export.zip",
        date: "2026-11-05",
      },
    );
    expect(
      page.startsWith(
        "# reportTitle\n\nreportFrom|Export.zip|2026-11-05\n\n- countPages|7\n- countDatabases|2|6\n- countFiles|4\n",
      ),
    ).toBe(true);
    expect(page).toContain(
      "## helpTitle\n\nhelpIntro\n\n- **plugin.catvinci.database**: why.catvinci.database\n- **plugin.catvinci.backlinks**: why.catvinci.backlinks\n",
    );
    expect(page).not.toContain("plugin.catvinci.quick-preview");
    expect(page).toContain(
      `## missingTitle\n\nmissingIntro\n\n- [Home](Home/Home.md): \`Home ${H}/Deleted Page ${id("b")}.md\``,
    );
    expect(page).toContain(
      "- callouts|3 ([Home](Home/Home.md), [三体](读书笔记/三体.md))",
    );
    expect(page).toContain("- icons|1 ([Home](Home/Home.md))");
  });

  it("says when it was cancelled, and leaves out empty sections", () => {
    const report = {
      pages: 1,
      databases: 0,
      rows: 0,
      files: 0,
      done: 1,
      total: 5,
      stopped: true,
      missing: [],
      failed: [],
      blocks: { callout: [], icon: [] },
    };
    const page = ni.reportPage(
      report,
      [],
      (key: string, ...args: unknown[]) => [key, ...args].join("|"),
      { source: "x", date: "d" },
    );
    expect(page).toContain("> [!WARNING]\n> stopped|1|5");
    expect(page).not.toContain("##");
  });

  it("has every string it uses in every language", () => {
    const manifest = JSON.parse(
      readFileSync(
        new URL(
          "../plugins/catvinci.notion-import/textus-plugin.json",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    const en = Object.keys(manifest.l10n.en);
    for (const s of ni.recommend(stats))
      expect(en).toEqual(expect.arrayContaining([s.why, "plugin." + s.id]));
    for (const [lang, strings] of Object.entries(manifest.l10n))
      expect(Object.keys(strings as object), lang).toEqual(en);
    expect(Object.keys(manifest.l10n)).toHaveLength(10);
  });
});

describe("Notion's newer export", () => {
  // Folders without ids, a page of its own beside each database's CSV, views as links to the CSV
  // with their filters and sorts, and every attachment in attachments/<id>/.
  const P = id("a");
  const DB = id("b");
  const DB2 = "b6060000000000000000000000000ff8";
  const att = "attachments/1826959b-650f-480d-8114-06720583c63e/image.png";
  const files = {
    [`Papers ${P}.md`]: `# Papers\n\n## By date\n\n[03/2026](Papers/03%202026%20${DB}_all.csv)\n\nfilters: \nAuthor\nsort: \nStatus: descending\nYear: ascending\n\nAfter.\n`,
    [`Papers/03 2026 ${DB}.md`]: `# 03/2026\n\nOur reading list.\n\n[03/2026](03%202026%20${DB}_all.csv)\n\nfilters: \nAuthor\n`,
    [`Papers/03 2026 ${DB}_all.csv`]:
      "Title,Status,Year\nA paper on time series forecasting with exogenous variables,Done,2026\nShort,Doing,2025\n",
    [`Papers/03 2026 ${DB}.csv`]: "Title,Status,Year\nShort,Doing,2025\n",
    [`Papers/03 2026/A paper on time series forecasting with exogenous ${id("1")}.md`]: `# A paper on time series forecasting with exogenous variables\n\nStatus: Done\n\n![](../../${att.replace(/\//g, "/")})\n`,
    [`Papers/03 2026/Short ${id("2")}.md`]: "# Short\n\nStatus: Doing\n",
    [`Papers/Notes ${id("3")}.md`]: "# Notes (Fall)\n",
    [`Papers/Notes ${DB2}.md`]: "# Notes (Spring)\n",
    [`Papers/Notes b606-0ff8/Week 1 ${id("4")}.md`]: "# Week 1\n",
    [att]: "png",
    ["attachments/2d5c7343-c11f-49a3-92cb-ff404c2bb9bc/slides.pptx"]: "pptx",
  };

  it("pairs each page with its folder, makes one database of its CSV, page and rows, and names them in full", async () => {
    const { out } = await importMemory(files);
    const names = Object.keys(out).sort();
    // Pages with sub-pages and databases are folder units (X/X.md).
    expect(names).toEqual([
      "Papers/03 2026/03 2026.md",
      "Papers/03 2026/A paper on time series forecasting with exogenous variables.md",
      "Papers/03 2026/Short.md",
      "Papers/03 2026/assets/A paper on time series forecasting with exogenous variables.png",
      "Papers/Notes (Fall).md",
      "Papers/Notes (Spring)/Notes (Spring).md",
      "Papers/Notes (Spring)/Week 1.md",
      "Papers/Papers.md",
      "attachments/slides.pptx",
    ]);
    // The database's own page: its title and words, then its views; no CSV link or filter lines.
    expect(out["Papers/03 2026/03 2026.md"]).toMatch(
      /^# 03\/2026\n\nOur reading list\.\n\n```base\nfilters:\n/,
    );
    expect(out["Papers/03 2026/03 2026.md"]).toContain(
      "groupBy:\n      property: status",
    );
    expect(out["Papers/03 2026/03 2026.md"]).not.toMatch(
      /_all\.csv|\nAuthor\n/,
    );
    // A view elsewhere: the link to the database's page, and the database shown, sorted as it was.
    expect(out["Papers/Papers.md"]).toContain(
      '[03/2026](03%202026/03%202026.md)\n\n```base\nfilters:\n  and:\n    - file.inFolder((if(this.file.folder.isEmpty(), "03 2026", this.file.folder + "/03 2026")))\n',
    );
    expect(out["Papers/Papers.md"]).toContain(
      "    sort:\n      - property: status\n        direction: DESC\n      - property: year\n        direction: ASC\n```\n\nAfter.",
    );
    // A picture beside the page that shows it.
    expect(
      out[
        "Papers/03 2026/A paper on time series forecasting with exogenous variables.md"
      ],
    ).toContain(
      "![](assets/A%20paper%20on%20time%20series%20forecasting%20with%20exogenous%20variables.png)",
    );
  });

  it("takes an export with subpages beside their pages, no folders, and the current view's CSV only", async () => {
    const { out } = await importMemory({
      [`Home ${P}.md`]: `# Home\n\n[Child](Child%20${id("5")}.md)\n\n[Tasks](Tasks%20${DB}.csv)\n`,
      [`Child ${id("5")}.md`]: "# Child\n",
      [`Tasks ${DB}.csv`]: "Name,Status\nWrite,Doing\n",
    });
    expect(Object.keys(out).sort()).toEqual([
      "Child.md",
      "Home.md",
      "Tasks/Tasks.md",
      "Tasks/Write.md",
    ]);
    expect(out["Tasks/Write.md"]).toBe("---\nstatus: Doing\n---\n# Write\n");
    expect(out["Home.md"]).toContain("[Child](Child.md)");
    expect(out["Home.md"]).toContain(
      '[Tasks](Tasks/Tasks.md)\n\n```base\nfilters:\n  and:\n    - file.inFolder((if(this.file.folder.isEmpty(), "Tasks", this.file.folder + "/Tasks")))\n',
    );
  });

  it("leaves out Notion's empty Untitled rows", async () => {
    const T = id("8");
    const { out, report } = await importMemory({
      [`Log ${T}.csv`]:
        "Name,Status\nUntitled,\nUntitled,\nKept,Doing\nUntitled,Done\n",
    });
    expect(Object.keys(out).sort()).toEqual([
      "Log/Kept.md",
      "Log/Log.md",
      "Log/Untitled.md",
    ]);
    expect(out["Log/Untitled.md"]).toBe("---\nstatus: Done\n---\n# Untitled\n");
    expect(report).toMatchObject({ rows: 2, skipped: 2 });
    // An empty Untitled page of its own, too.
    const page = await importMemory({
      [`Untitled ${id("7")}.md`]: "# Untitled\n",
      [`Kept ${id("6")}.md`]: "# Kept\n",
    });
    expect(Object.keys(page.out)).toEqual(["Kept.md"]);
  });
});

describe("page icons from an HTML export", () => {
  it("are read by page id, emoji only, and the import says where each page went", async () => {
    const html = (icon: string) =>
      `<html><body><article><header><div class="page-header-icon undefined">${icon}</div><h1 class="page-title">x</h1></header></article></body></html>`;
    const files: Record<string, string> = {
      [`Home ${H}.html`]: html('<span class="icon">🏠</span>'),
      [`Home ${H}/Sub ${id("1")}.html`]: html('<span class="icon">📚</span>'),
      [`Home ${H}/Pic ${id("2")}.html`]: html('<img class="icon" src="x.png"/>'),
      "index.html": html('<span class="icon">❓</span>'),
    };
    const icons = await ni.iconsOf({
      paths: Object.keys(files),
      read: async (p: string) => files[p],
    });
    expect(icons).toEqual({ [H]: "🏠", [id("1")]: "📚" });

    const md: Record<string, string> = {
      [`Home ${H}.md`]: "# Home\n",
      [`Home ${H}/Sub ${id("1")}.md`]: "# Sub\n",
    };
    const { report } = await importOf(Object.keys(md), async (p) => md[p]);
    expect(Object.keys(report.byId).sort()).toEqual([H, id("1")].sort());
    expect(report.byId[id("1")]).toMatch(/Sub\.md$/);
  });
});
