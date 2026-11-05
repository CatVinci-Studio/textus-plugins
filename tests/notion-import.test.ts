import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import JSZip from "jszip";
import { beforeAll, describe, expect, it } from "vitest";
import { loadPlugin, memoryStorage } from "./plugin-host";

/** Notion Import's conversion (plugins/catvinci.notion-import/notion.js),
 *  run on a synthetic export (tests/fixtures/notion-export). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ni: any;

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/notion-csv.js");
  await import(/* @vite-ignore */ "../plugins/catvinci.notion-import/notion.js");
  ni = (globalThis as unknown as { notionImport: unknown }).notionImport;
});

const FIXTURE = new URL("./fixtures/notion-export/", import.meta.url).pathname;
const H = "0a1b2c3d4e5f60718293a4b5c6d7e8f9";
const id = (c: string) => c.repeat(32);

function exportFiles(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) =>
      statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [relative(FIXTURE, join(dir, name))],
    );
  return walk(FIXTURE).sort();
}

/** An import into memory: the files written (bytes as their size) and the report. */
async function importOf(paths: string[], read: (path: string, kind: string) => Promise<unknown>, abortAfter = 0) {
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
      bytes: async (path: string, bytes: Uint8Array) => void (out[path] = `<${bytes.length} bytes>`),
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
      return kind === "text" ? readFileSync(join(FIXTURE, path), "utf8") : new Uint8Array(readFileSync(join(FIXTURE, path)));
    },
    options.abortAfter,
  );

/** The import of an export given as its files' texts. */
const importMemory = (files: Record<string, string>) =>
  importOf(Object.keys(files), async (path, kind) => (kind === "text" ? files[path] : new TextEncoder().encode(files[path])));

describe("names", () => {
  it("drops Notion's id and what file systems refuse", () => {
    expect(ni.cleanName(`Plans ${H}`)).toBe("Plans");
    expect(ni.cleanName(`a/b: c? ${H}`)).toBe("a-b- c-");
    expect(ni.cleanName("trailing. ")).toBe("trailing");
    expect(ni.cleanName(`  ${H}`)).toBe("Untitled");
    expect(ni.cleanName("")).toBe("Untitled");
    expect(ni.cleanName("x".repeat(150))).toHaveLength(100);
    // Never half an emoji, and within what ext4 takes for a name in bytes.
    expect(ni.cleanName("x".repeat(99) + "😀 party")).toBe("x".repeat(99) + "😀");
    expect(new TextEncoder().encode(ni.cleanName("中".repeat(120))).length).toBeLessThanOrEqual(200);
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
      [`Notes ${id("a")}.md`]: "Notes 2.md",
      [`Notes ${id("a")}/pic.png`]: "Notes 2/pic.png",
      [`Home ${H}.md`]: "Home.md",
      [`Home ${H}/DB ${id("2")}.csv`]: "Home/DB.md",
      [`Home ${H}/DB ${id("2")}_all.csv`]: "Home/DB.md",
      [`Home ${H}/DB ${id("2")}/Row ${id("3")}.md`]: "Home/DB/Row.md",
      [`Home ${H}/image ${id("5")}.png`]: "Home/image.png",
      [`Home ${H}/image.png`]: "Home/image 2.png",
    });
    expect(layout.databases).toEqual([
      { name: "DB", csv: `Home ${H}/DB ${id("2")}_all.csv`, page: "Home/DB.md", folder: "Home/DB", from: `Home ${H}/DB ${id("2")}` },
    ]);
    expect(layout.byId.get(id("3"))).toBe("Home/DB/Row.md");
    expect(layout.byId.get(id("2"))).toBe("Home/DB.md");
  });

  it("gives names that differ only by case a number too", () => {
    const layout = ni.plan([`plans ${id("1")}.md`, `Plans ${id("2")}.md`]);
    expect([...layout.files.values()].sort()).toEqual(["Plans.md", "plans 2.md"]);
  });

  it("numbers thousands of pages with one name quickly, and keeps an attachment's own name", () => {
    const paths = Array.from({ length: 20000 }, (_, i) => `Untitled ${i.toString(16).padStart(32, "0")}.md`);
    const start = performance.now();
    const layout = ni.plan(paths);
    expect(performance.now() - start).toBeLessThan(2000);
    expect(layout.files.get(paths[19999])).toBe("Untitled 20000.md");
    const mixed = ni.plan([`A ${id("1")}.md`, `A ${id("2")}.md`, "A.png"]);
    expect(mixed.files.get("A.png")).toBe("A.png");
  }, 60000);

  it("drops the folder a whole zip is in, and a Mac's extra files", () => {
    expect(ni.tidyPaths(["Export-1/a.md", "Export-1/b/c.md", "__MACOSX/Export-1/._a.md", "Export-1/.DS_Store"])).toEqual({
      top: "Export-1/",
      paths: ["a.md", "b/c.md"],
    });
    expect(ni.tidyPaths(["a.md", "b/c.md"])).toEqual({ top: "", paths: ["a.md", "b/c.md"] });
  });
});

describe("links", () => {
  const layout = () =>
    ni.plan([`Home ${H}.md`, `Home ${H}/Sub ${id("1")}.md`, `Home ${H}/Sub ${id("1")}/a b.png`, `Home ${H}/DB ${id("2")}.csv`]);

  it("follow the new names, encoded and relative", () => {
    const found: { kind: string; target: string }[] = [];
    const text = [
      `[Sub](Home%20${H}/Sub%20${id("1")}.md)`,
      `![pic](Home%20${H}/Sub%20${id("1")}/a%20b.png "A title")`,
      `[DB](Home%20${H}/DB%20${id("2")}.csv)`,
      `[Again](<Home ${H}/Sub ${id("1")}.md#heading>)`,
    ].join("\n");
    expect(ni.rewriteLinks(text, `Home ${H}.md`, "Home.md", layout(), (l: never) => found.push(l))).toBe(
      ["[Sub](Home/Sub.md)", '![pic](Home/Sub/a%20b.png "A title")', "[DB](Home/DB.md)", "[Again](Home/Sub.md#heading)"].join(
        "\n",
      ),
    );
    expect(found.map((l) => l.kind)).toEqual(["page", "file", "page", "page"]);
  });

  it("go up from a sub-page and follow notion.so addresses the export has", () => {
    const text = `[Home](../Home%20${H}.md) [Sub](https://www.notion.so/Sub-${id("1")}?pvs=4)`;
    expect(ni.rewriteLinks(text, `Home ${H}/Sub ${id("1")}.md`, "Home/Sub.md", layout())).toBe("[Home](../Home.md) [Sub](Sub.md)");
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
    expect(ni.rewriteLinks(text, `Home ${H}.md`, "Home.md", layout(), (l: never) => found.push(l))).toBe(text);
    expect(found).toEqual([
      { target: "https://example.com/a", kind: "web" },
      { target: `https://www.notion.so/Other-${id("f")}`, kind: "web" },
      { target: `Gone ${id("e")}.md`, kind: "missing" },
    ]);
  });

  it("follow pages whose titles have brackets or parentheses", () => {
    const found: { kind: string }[] = [];
    const layout = ni.plan([`Home ${H}.md`, `Home ${H}/[WIP] Spec ${id("4")}.md`, `Home ${H}/Plan (draft) ${id("3")}.md`]);
    const text = `[[WIP] Spec](Home%20${H}/%5BWIP%5D%20Spec%20${id("4")}.md) [Plan (draft)](Home%20${H}/Plan%20(draft)%20${id("3")}.md)`;
    expect(ni.rewriteLinks(text, `Home ${H}.md`, "Home.md", layout, (l: never) => found.push(l))).toBe(
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
    expect(kinds).toEqual(["callout", "callout", "icon", "callout", "callout", "icon", "callout"]);
  });

  it("leave toggles and callouts in code as they are", () => {
    const text = "<details>\n<summary>More</summary>\n\nInside\n\n</details>\n\n```html\n<aside>\nx\n</aside>\n```";
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
    expect(ni.propertyValue("January 4, 2026 → January 6, 2026")).toEqual({ start: "2026-01-04", end: "2026-01-06" });
    expect(ni.propertyValue("Yes")).toBe(true);
    expect(ni.propertyValue("科幻")).toBe("科幻");
  });
});

describe("databases", () => {
  it("add a board for a status and a calendar for dates", () => {
    const rows = [
      { props: { status: "Doing", due: "2026-01-04", owner: "Ann" } },
      { props: { status: "Done", due: "2026-01-05", owner: "Bo" } },
      { props: { status: "Doing", due: "2026-01-06", due_end: "2026-01-07", owner: "Cy" } },
    ];
    expect(ni.boardKey(rows)).toBe("status");
    expect(ni.dateKey(rows)).toBe("due");
    expect(ni.databasePage("Tasks", "Tasks", rows).text).toBe(
      "# Tasks\n\n```database\nfrom: Tasks\nview: table\n```\n\n```database\nfrom: Tasks\nview: board\ngroup: status\n```\n\n" +
        "```database\nfrom: Tasks\nview: calendar\ndate: due\nend: due_end\n```\n",
    );
  });

  it("add a board for a status column even when every row's status differs", () => {
    const rows = [{ props: { status: "Not started" } }, { props: { status: "In progress" } }, { props: { status: "Done" } }];
    expect(ni.boardKey(rows)).toBe("status");
    expect(ni.boardKey([{ props: { problem_statement: "a" } }, { props: { problem_statement: "b" } }])).toBeNull();
  });

  it("is a table alone without a status or a date", () => {
    const rows = [{ props: { owner: "Ann" } }, { props: { owner: "Bo" } }];
    expect(ni.databasePage("People", "People", rows)).toEqual({
      text: "# People\n\n```database\nfrom: People\nview: table\n```\n",
      group: null,
      date: null,
    });
  });
});

describe("the fixture's import", () => {
  it("writes clean names in the page/sub-folder layout, never twice", async () => {
    const { out } = await importFixture();
    expect(Object.keys(out).sort()).toEqual(
      [
        "Home.md",
        "Home/Meeting Template.md",
        "Home/Projects.md",
        "Home/Projects/Garden.md",
        "Home/Projects/Launch.md",
        "Home/Projects/Website Redesign.md",
        "Home/Projects/Website Redesign/mockup.png",
        "Home/Reading List.md",
        "Home/Reading List/cover.png",
        "Home/Spec.pdf",
        "Home/logo.png",
        "Notes 2.md",
        "Notes.md",
        "读书笔记.md",
        "读书笔记/三体.md",
        "读书笔记/任务.md",
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
    const home = out["Home.md"];
    expect(home).toContain("> [!NOTE]\n> Welcome to the workspace.\n>\n> Read the [Reading List](Home/Reading%20List.md) first.");
    expect(home).toContain("> [!NOTE]\n> 💡 Remember to export every week.");
    expect(home).toContain("[Projects](Home/Projects.md)");
    expect(home).toContain("[Website Redesign](Home/Projects/Website%20Redesign.md)");
    expect(home).toContain("![Logo](Home/logo.png)");
    expect(home).toContain("[Spec](Home/Spec.pdf)");
    expect(home).toContain(`[Old page](Home%20${H}/Deleted%20Page%20${id("b")}.md)`);
    expect(home).not.toContain("<aside>");
  });

  it("keeps code as it was in a sub-page", async () => {
    const { out } = await importFixture();
    expect(out["Home/Reading List.md"]).toBe(
      "# Reading List\n\nBack to [Home](../Home.md).\n\n![Cover](Reading%20List/cover.png)\n\n" +
        "```md\n[raw](Keep%20" + id("1") + ".md)\n```\n\nInline code stays: `[code](Keep%20" + id("1") + ".md)`.\n",
    );
  });

  it("makes a document per row with the CSV's properties, relations as links", async () => {
    const { out } = await importFixture();
    expect(out["Home/Projects/Website Redesign.md"]).toBe(
      "---\nstatus: In progress\ndue: 2026-01-04\ntags:\n  - Design\n  - Web\ndone: false\nbudget: 1200\n" +
        'related:\n  - "[Garden](Garden.md)"\n---\n# Website Redesign\n\n' +
        "The new site. See [Garden](Garden.md) and the [home page](../../Home.md).\n\n![Mockup](Website%20Redesign/mockup.png)\n",
    );
    expect(out["Home/Projects/Garden.md"]).toContain("due: 2026-02-10\ndue_end: 2026-02-12\n");
    // A row without a page of its own is made from the CSV alone.
    expect(out["Home/Projects/Launch.md"]).toBe(
      "---\nstatus: In progress\ndue: 2026-03-01\ntags:\n  - Web\ndone: false\nrelated:\n" +
        '  - "[Website Redesign](Website%20Redesign.md)"\n  - "[Garden](Garden.md)"\n---\n# Launch\n',
    );
    expect(out["Home/Projects.md"]).toContain("view: board\ngroup: status");
    expect(out["Home/Projects.md"]).toContain("view: calendar\ndate: due\nend: due_end");
  });

  it("reads the Chinese database: its dates, its status and a relation", async () => {
    const { out } = await importFixture();
    expect(out["读书笔记/任务/读第一章.md"]).toBe(
      '---\n状态: 进行中\n日期: 2026-01-04\n书:\n  - "[三体](../三体.md)"\n---\n# 读第一章\n\n先读到“科学边界”。\n',
    );
    expect(out["读书笔记/任务/写读后感.md"]).toBe("---\n状态: 未开始\n日期: 2026-02-01\n---\n# 写读后感\n");
    expect(out["读书笔记/任务/整理笔记.md"]).toContain("日期: 2026-03-05");
    expect(out["读书笔记/任务.md"]).toContain("view: board\ngroup: 状态");
    expect(out["读书笔记/任务.md"]).toContain("view: calendar\ndate: 日期");
  });

  it("keeps the opening Key: value lines of a page that isn't a row, and links CJK names", async () => {
    const { out } = await importFixture();
    const page = out["读书笔记.md"];
    expect(page.startsWith("# 读书笔记\n\n创建时间: 2026年1月4日\n标签: 科幻\n已读: Yes\n\n我的读书笔记。")).toBe(true);
    expect(page).toContain("[三体](读书笔记/三体.md)");
    expect(page).toContain("[任务](读书笔记/任务.md)");
    expect(page).toContain("<details>\n<summary>折叠内容</summary>");
    expect(out["读书笔记/三体.md"]).toContain("> [!NOTE]\n> 📌 刘慈欣著。\n\n回到[读书笔记](../读书笔记.md)。");
  });

  it("makes each folder once, a parent before its child", async () => {
    const { folders } = await importFixture();
    expect(new Set(folders).size).toBe(folders.length);
    for (const f of folders) if (f.includes("/")) expect(folders.indexOf(f.slice(0, f.lastIndexOf("/")))).toBeLessThan(folders.indexOf(f));
  });

  it("reports the counts, the links not found and the blocks changed", async () => {
    const { report } = await importFixture();
    expect(report).toMatchObject({ pages: 7, databases: 2, rows: 6, files: 4, total: 18, done: 18, stopped: false });
    expect(report.missing).toEqual([{ page: "Home.md", target: `Home ${H}/Deleted Page ${id("b")}.md` }]);
    expect(report.blocks).toEqual({ callout: ["Home.md", "Home.md", "读书笔记/三体.md"], icon: ["Home.md"] });
    expect(report.stats).toMatchObject({ subpages: 3, databases: 2, boards: 2, dateDatabases: 2, todos: 10, urls: 2, pdfs: 1, templates: 1 });
    expect(report.stats.links).toBeGreaterThan(5);
  });

  it("lists a file it couldn't read, and imports the rest", async () => {
    const { out, report } = await importFixture({ fail: `Home ${H}/Spec.pdf` });
    expect(report.failed).toEqual([{ path: `Home ${H}/Spec.pdf`, error: TOO_BIG }]);
    expect(report).toMatchObject({ done: 18, total: 18, files: 3, stopped: false });
    expect(out).not.toHaveProperty("Home/Spec.pdf");
    expect(out["Home.md"]).toContain("[Spec](Home/Spec.pdf)");
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
  const rowDocs = (out: Record<string, string>, dir: string) => Object.keys(out).filter((p) => p.startsWith(dir + "/")).sort();

  it("finds a row's page when Notion cut its file name or swapped / : ? in it", async () => {
    const long = "How we migrated the billing service to the new event bus";
    const { out, report } = await importMemory({
      [`DB ${D}.csv`]: `Name,Status\n${long},Done\n"Q1/Q2: plan?",Doing\n`,
      [`DB ${D}/${long.slice(0, 50)} ${id("1")}.md`]: `# ${long}\n\nStatus: Done\n\nBody one.`,
      [`DB ${D}/Q1 Q2  plan  ${id("2")}.md`]: "# Q1/Q2: plan?\n\nStatus: Doing\n\nBody two.",
    });
    expect(rowDocs(out, "DB")).toEqual([`DB/${long.slice(0, 50)}.md`, "DB/Q1 Q2  plan.md"]);
    expect(out[`DB/${long.slice(0, 50)}.md`]).toBe(`---\nstatus: Done\n---\n# ${long}\n\nBody one.\n`);
    expect(out["DB/Q1 Q2  plan.md"]).toBe("---\nstatus: Doing\n---\n# Q1/Q2: plan?\n\nBody two.\n");
    expect(report).toMatchObject({ rows: 2, pages: 0 });
  });

  it("gives rows that share a title the page whose properties agree with them", async () => {
    const { out } = await importMemory({
      [`Meetings ${D}.csv`]: 'Name,Date\nWeekly sync,"January 5, 2026"\nWeekly sync,"January 12, 2026"\n',
      [`Meetings ${D}/Weekly sync ${id("c")}.md`]: "# Weekly sync\n\nDate: January 12, 2026\n\nJan 12 notes",
      [`Meetings ${D}/Weekly sync ${id("f")}.md`]: "# Weekly sync\n\nDate: January 5, 2026\n\nJan 5 notes",
    });
    expect(out["Meetings/Weekly sync.md"]).toBe("---\ndate: 2026-01-12\n---\n# Weekly sync\n\nJan 12 notes\n");
    expect(out["Meetings/Weekly sync 2.md"]).toBe("---\ndate: 2026-01-05\n---\n# Weekly sync\n\nJan 5 notes\n");
  });

  it("matches tens of thousands of rows to their pages quickly", async () => {
    const files: Record<string, string> = {};
    const names = Array.from({ length: 20000 }, (_, i) => `Row ${i}`);
    files[`Big ${D}.csv`] = "Name\n" + [...names].reverse().join("\n") + "\n";
    names.forEach((name, i) => (files[`Big ${D}/${name} ${i.toString(16).padStart(32, "0")}.md`] = `# ${name}\n\nBody ${i}`));
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
      "Home.md": "# Home\n\n[sales.csv](Home/sales.csv) [notes](Home/notes.md)\n",
      "Home/sales.csv": `<${sales.length} bytes>`,
      "Home/notes.md": `<${notes.length} bytes>`,
    });
  });

  it("reads property lines only on a database's row pages", async () => {
    const { out } = await importMemory({
      [`Home ${H}.md`]: `# Home\n\nSource: [Guide](Home%20${H}/Guide%20${id("1")}.md)\n\nMore text.`,
      [`Home ${H}/Guide ${id("1")}.md`]: "# Guide\n\nDate: Mar 3, 2026 retro\n\nAgenda",
      [`DB ${D}.csv`]: "Name,Status\nA,Done\n",
      [`DB ${D}/B ${id("2")}.md`]: "# B\n\nStatus: Doing\n\nA row the CSV doesn't have.",
    });
    expect(out["Home.md"]).toBe("# Home\n\nSource: [Guide](Home/Guide.md)\n\nMore text.\n");
    expect(out["Home/Guide.md"]).toBe("# Guide\n\nDate: Mar 3, 2026 retro\n\nAgenda\n");
    expect(out["DB/B.md"]).toBe("---\nstatus: Doing\n---\n# B\n\nA row the CSV doesn't have.\n");
  });

  it("links a relation to a page whose title has parentheses", async () => {
    const P = id("e");
    const { out } = await importMemory({
      [`Projects ${P}.csv`]: "Name\nPlan (v2)\n",
      [`Projects ${P}/Plan (v2) ${id("3")}.md`]: "# Plan (v2)\n\nBody",
      [`Tasks ${D}.csv`]: `Name,Project\nA,Plan (v2) (Projects%20${P}/Plan%20(v2)%20${id("3")}.md)\n`,
    });
    expect(out["Tasks/A.md"]).toContain('project:\n  - "[Plan (v2)](../Projects/Plan%20%28v2%29.md)"');
  });
});

describe("suggestions and the report", () => {
  const stats = { subpages: 3, databases: 2, boards: 1, dateDatabases: 1, links: 4, todos: 10, urls: 1, pdfs: 1, templates: 1 };
  const none = { subpages: 0, databases: 0, boards: 0, dateDatabases: 0, links: 0, todos: 0, urls: 0, pdfs: 0, templates: 0 };

  it("suggests a plugin for each thing the export holds, in order", () => {
    expect(ni.recommend(stats).map((s: { id: string }) => s.id)).toEqual([
      "catvinci.pages",
      "catvinci.database",
      "catvinci.kanban",
      "catvinci.backlinks",
      "catvinci.quick-preview",
      "catvinci.tasks",
      "catvinci.daily-notes",
      "catvinci.reminders",
      "catvinci.link-cards",
      "catvinci.pdf-viewer",
      "catvinci.templates",
    ]);
    expect(ni.recommend(stats)[0]).toEqual({ id: "catvinci.pages", why: "why.catvinci.pages" });
  });

  it("leaves out what is installed, what the export doesn't use and a few to-dos", () => {
    expect(ni.recommend(none)).toEqual([]);
    expect(ni.recommend({ ...none, todos: 9 })).toEqual([]);
    expect(ni.recommend({ ...none, links: 1 }, new Set(["catvinci.backlinks"])).map((s: { id: string }) => s.id)).toEqual([
      "catvinci.quick-preview",
    ]);
  });

  it("has a line for each suggestion, the missing links and the blocks", async () => {
    const { report } = await importFixture();
    const t = (key: string, ...args: unknown[]) => [key, ...args].join("|");
    const page = ni.reportPage(report, ni.recommend(report.stats, new Set(["catvinci.pages"])), t, {
      source: "Export.zip",
      date: "2026-11-05",
    });
    expect(page.startsWith("# reportTitle\n\nreportFrom|Export.zip|2026-11-05\n\n- countPages|7\n- countDatabases|2|6\n- countFiles|4\n")).toBe(true);
    expect(page).toContain("## helpTitle\n\nhelpIntro\n\n- **plugin.catvinci.database**: why.catvinci.database\n");
    expect(page).not.toContain("plugin.catvinci.pages");
    expect(page).toContain(`## missingTitle\n\nmissingIntro\n\n- [Home](Home.md): \`Home ${H}/Deleted Page ${id("b")}.md\``);
    expect(page).toContain("- callouts|3 ([Home](Home.md), [三体](读书笔记/三体.md))");
    expect(page).toContain("- icons|1 ([Home](Home.md))");
  });

  it("says when it was cancelled, and leaves out empty sections", () => {
    const report = { pages: 1, databases: 0, rows: 0, files: 0, done: 1, total: 5, stopped: true, missing: [], failed: [], blocks: { callout: [], icon: [] } };
    const page = ni.reportPage(report, [], (key: string, ...args: unknown[]) => [key, ...args].join("|"), { source: "x", date: "d" });
    expect(page).toContain("> [!WARNING]\n> stopped|1|5");
    expect(page).not.toContain("##");
  });

  it("has every string it uses in every language", () => {
    const manifest = JSON.parse(readFileSync(new URL("../plugins/catvinci.notion-import/textus-plugin.json", import.meta.url), "utf8"));
    const en = Object.keys(manifest.l10n.en);
    for (const s of ni.recommend(stats)) expect(en).toEqual(expect.arrayContaining([s.why, "plugin." + s.id]));
    for (const [lang, strings] of Object.entries(manifest.l10n)) expect(Object.keys(strings as object), lang).toEqual(en);
    expect(Object.keys(manifest.l10n)).toHaveLength(10);
  });
});

describe("zips", () => {
  async function zipOf(files: Record<string, string>) {
    const zip = new JSZip();
    for (const [name, text] of Object.entries(files)) zip.file(name, text);
    return zip.generateAsync({ type: "uint8array" });
  }

  it("reads an export's zip, without the folder it is in", async () => {
    const bytes = await zipOf({ [`Export-x/Home ${H}.md`]: "# Home\n", "Export-x/.DS_Store": "", "__MACOSX/Export-x/._Home.md": "" });
    const source = await ni.zipSource(JSZip, bytes);
    expect(source.paths).toEqual([`Home ${H}.md`]);
    expect(await source.read(`Home ${H}.md`, "text")).toBe("# Home\n");
    expect(ni.isExport(source.paths)).toBe(true);
  });

  it("opens Part-1.zip, Part-2.zip… inside a large export as one", async () => {
    const part1 = await zipOf({ [`Home ${H}.md`]: "# Home\n" });
    const part2 = await zipOf({ [`Home ${H}/Sub ${id("1")}.md`]: "# Sub\n" });
    const outer = new JSZip();
    outer.file("Export-x-Part-1.zip", part1);
    outer.file("Export-x-Part-2.zip", part2);
    const source = await ni.zipSource(JSZip, await outer.generateAsync({ type: "uint8array" }));
    expect(source.paths.sort()).toEqual([`Home ${H}.md`, `Home ${H}/Sub ${id("1")}.md`]);
    expect(await source.read(`Home ${H}/Sub ${id("1")}.md`, "text")).toBe("# Sub\n");
  });

  it("knows a zip that isn't Notion's", async () => {
    const source = await ni.zipSource(JSZip, await zipOf({ "notes/a.md": "# A\n", "b.csv": "x\n" }));
    expect(ni.isExport(source.paths)).toBe(false);
  });
});

describe("the plugin", () => {
  it("loads with jszip before its scripts and asks only to read and write files", () => {
    const { manifest } = loadPlugin("catvinci.notion-import");
    expect(manifest.permissions).toEqual(["files.read", "files.write"]);
    expect(manifest.main).toEqual(["lib/notion-csv.js", "lib/jszip.min.js", "notion.js", "host.js"]);
  });
});

/** The open folder, its files by path: enough of textus.files for the host. */
function disk(files: Record<string, Uint8Array | string>) {
  const root = "/root";
  const dirs = new Set<string>();
  const rel = (path: string) => path.slice(root.length + 1);
  const isDir = (r: string) => dirs.has(r) || Object.keys(files).some((f) => f.startsWith(r + "/"));
  return {
    files,
    dirs,
    api: {
      root: async () => root,
      find: async (glob: string) => {
        const exts = /\{(.+)\}$/.exec(glob)?.[1].split(",") ?? [glob.split(".").pop()];
        return Object.keys(files)
          .filter((f) => exts.some((e) => f.endsWith("." + e)))
          .map((f) => ({ path: root + "/" + f, rel: f }));
      },
      stat: async (path: string) =>
        rel(path) in files || isDir(rel(path)) ? { path, name: path.split("/").pop(), isDir: isDir(rel(path)) } : null,
      read: async (path: string) => files[rel(path)] as Uint8Array,
      readText: async (path: string) => String(files[rel(path)]),
      createFolder: async (path: string) => void dirs.add(rel(path)),
      create: async (path: string, text: string) => {
        if (rel(path) in files) throw new Error("Exists: " + path);
        files[rel(path)] = text;
      },
      write: async (path: string, bytes: Uint8Array) => void (files[rel(path)] = bytes),
    },
  };
}

describe("the import command", () => {
  async function run(installed: string[], offer: (args: unknown) => Promise<unknown>) {
    const zip = new JSZip();
    for (const path of exportFiles()) zip.file("Export-x/" + path, readFileSync(join(FIXTURE, path)));
    const folder = disk({ "Inbox/Export-x.zip": await zip.generateAsync({ type: "uint8array" }) });
    const commands = new Map<string, (...args: unknown[]) => Promise<unknown>>();
    const messages: string[] = [];
    const opened: string[] = [];
    const picks: unknown[][] = [];
    const t = (key: string, ...args: unknown[]) => [key, ...args].join("|");
    loadPlugin(
      "catvinci.notion-import",
      {
        l10n: { t },
        files: folder.api,
        commands: {
          register: (id: string, run: (...args: unknown[]) => Promise<unknown>) => {
            commands.set(id, run);
            return { dispose() {} };
          },
          execute: async (id: string, args: unknown) => (id === "textus.offerPlugin" ? offer(args) : null),
        },
        ui: {
          pick: async (items: { value: unknown }[]) => {
            picks.push(items);
            return items[0].value;
          },
          withProgress: async (_title: string, task: (r: () => void, s: AbortSignal) => Promise<unknown>) =>
            task(() => {}, new AbortController().signal),
          message: async (text: string) => void messages.push(text),
          notice: async (text: string) => void messages.push(text),
        },
        layout: { open: async (path: string) => void opened.push(path) },
        plugins: { get: async (id: string) => (installed.includes(id) ? {} : null) },
      },
      memoryStorage(),
    );
    await commands.get("catvinci.notion-import.import")!();
    return { folder, commands, messages, opened, picks };
  }

  it("imports the zip it picked into a new dated folder and opens the report", async () => {
    const { folder, messages, opened, picks } = await run(["catvinci.pages"], async () => true);
    expect(picks[0]).toEqual([{ label: "Export-x.zip", description: "Inbox/Export-x.zip", value: "/root/Inbox/Export-x.zip" }]);
    const target = [...folder.dirs][0];
    expect(target).toMatch(/^folderName\|\d{4}-\d{2}-\d{2}$/);
    expect(folder.files[target + "/Home/Projects/Launch.md"]).toContain("# Launch");
    expect(folder.files[target + "/Home/logo.png"]).toBeInstanceOf(Uint8Array);
    expect(opened).toEqual(["/root/" + target + "/reportName.md"]);
    const report = String(folder.files[target + "/reportName.md"]);
    expect(report).toContain("- **plugin.catvinci.database**: why.catvinci.database");
    expect(report).not.toContain("plugin.catvinci.pages");
    expect(messages).toEqual(["done|13|2|" + target]);
  });

  it("offers a suggested plugin through Textus, or says where to find it", async () => {
    const offers: unknown[] = [];
    const ok = await run([], async (args) => void offers.push(args));
    await ok.commands.get("catvinci.notion-import.recommend")!();
    expect(offers).toEqual([{ id: "catvinci.pages", reason: "why.catvinci.pages" }]);

    const old = await run([], async () => {
      throw new Error("No command textus.offerPlugin.");
    });
    await old.commands.get("catvinci.notion-import.recommend")!();
    expect(old.messages.at(-1)).toBe("offerFallback|plugin.catvinci.pages");
  });
});
