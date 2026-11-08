import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Database's tools for Textus AI (plugins/catvinci.database/host.js). */
function setup() {
  const files: Record<string, string> = { "Books/Dune.md": "# Dune\n", "Books/Emma.md": "# Emma\n", "Other.md": "" };
  const fm: Record<string, Record<string, unknown>> = {
    "Books/Dune.md": { rating: 5, read: new Date("2026-01-03"), tags: ["sf"] },
    "Books/Emma.md": { rating: 3, tags: ["classic"] },
  };
  const f = folder(files);
  const api = {
    files: {
      ...f,
      frontmatter: {
        update: async (path: string, change: (o: Record<string, unknown>) => void) => {
          const rel = path.slice("/root/".length);
          change((fm[rel] ??= {}));
        },
      },
    },
    metadata: {
      all: async () => Object.keys(files).map((rel) => ({ path: "/root/" + rel, rel, frontmatter: fm[rel] ?? {} })),
    },
  };
  const { tools } = loadPlugin("catvinci.database", api);
  return { files, fm, call: (name: string, args: Record<string, unknown>) => tools.get(name)!(args) };
}

describe("database's tools", () => {
  it("query a database's rows, filtered and sorted as a block would", async () => {
    const { call } = setup();
    const all = await call("query_rows", { database: "Books", sort: "-rating" });
    expect(all.rows).toEqual([
      { name: "Dune", path: "Books/Dune.md", properties: { rating: 5, read: "2026-01-03", tags: ["sf"] } },
      { name: "Emma", path: "Books/Emma.md", properties: { rating: 3, tags: ["classic"] } },
    ]);
    const some = await call("query_rows", { database: "Books/", filter: ["rating >= 4", "tags has sf"] });
    expect(some.rows.map((r: { name: string }) => r.name)).toEqual(["Dune"]);
    expect(await call("query_rows", { database: "Nowhere" })).toHaveProperty("error");
  });

  it("add a row as a document with its properties", async () => {
    const { call, files, fm } = setup();
    expect(await call("add_row", { database: "Books", name: "Ulysses", properties: { rating: 4 }, body: "Long." })).toEqual({
      database: "Books",
      path: "Books/Ulysses.md",
    });
    expect(files["Books/Ulysses.md"]).toBe("# Ulysses\n\nLong.\n");
    expect(fm["Books/Ulysses.md"]).toEqual({ rating: 4 });
    expect(await call("add_row", { database: "Books", name: "Dune" })).toHaveProperty("error");
  });
});

describe("database's view of a folder unit from another page", () => {
  it("shows the unit page's table rows, and writes their edits into that page", async () => {
    const files: Record<string, string> = {
      "Papers/Papers.md": "# Papers\n\n```database\nview: table\nrows:\n| Name | status |\n| --- | --- |\n| SAM | Doing |\n```\n",
      "Papers/Dune.md": "# Dune\n",
      "Home.md": "# Home\n",
    };
    let render: (b: unknown, w: unknown) => Promise<void> = async () => {};
    const api = {
      files: { ...folder(files), frontmatter: { get: async () => ({}), update: async () => {} } },
      metadata: { all: async () => Object.keys(files).map((rel) => ({ path: "/root/" + rel, rel, frontmatter: {} })) },
      views: { registerCodeBlock: (_: string, r: { render: typeof render }) => ((render = r.render), { dispose() {} }) },
    };
    loadPlugin("catvinci.database", api);
    const posted: { rows: { rel: string; name: string }[] }[] = [];
    let receive: (m: unknown) => Promise<unknown> = async () => {};
    const webview = {
      html: "",
      postMessage: (m: { data: (typeof posted)[0] }) => posted.push(m.data),
      onDidDispose: () => {},
      onDidReceiveMessage: (f: typeof receive) => (receive = f),
    };
    const block = { path: "/root/Home.md", source: "from: Papers\nview: table", setSource: async () => {}, onDidChange: () => {} };
    await render(block, webview);
    await receive({ type: "ready" });
    expect(posted.at(-1)!.rows.map((r) => [r.rel, r.name])).toEqual(
      expect.arrayContaining([["Papers/Dune.md", "Dune"], ["Papers/Papers.md#0", "SAM"]]),
    );
    expect(posted.at(-1)!.rows).toHaveLength(2);
    await receive({ type: "set", rel: "Papers/Papers.md#0", key: "status", value: "Done" });
    expect(files["Papers/Papers.md"]).toContain("| SAM | Done |");
    expect(files["Papers/Papers.md"]).toMatch(/^# Papers\n\n```database\n[\s\S]*\n```\n$/);
  });
});
