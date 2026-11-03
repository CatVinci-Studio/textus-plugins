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
