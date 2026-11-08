import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Database's tools for Textus AI (plugins/catvinci.database/host.js). */
function setup() {
  const files: Record<string, string> = {
    "Books/Dune.md": "# Dune\n",
    "Books/Emma.md": "# Emma\n",
    "Other.md": "",
  };
  const fm: Record<string, Record<string, unknown>> = {
    "Books/Dune.md": { rating: 5, read: new Date("2026-01-03"), tags: ["sf"] },
    "Books/Emma.md": { rating: 3, tags: ["classic"] },
  };
  const f = folder(files);
  const api = {
    files: {
      ...f,
      frontmatter: {
        update: async (
          path: string,
          change: (o: Record<string, unknown>) => void,
        ) => {
          const rel = path.slice("/root/".length);
          change((fm[rel] ??= {}));
        },
      },
    },
    metadata: {
      all: async () =>
        Object.keys(files).map((rel) => ({
          path: "/root/" + rel,
          rel,
          frontmatter: fm[rel] ?? {},
        })),
    },
  };
  const { tools } = loadPlugin("catvinci.database", api);
  return {
    files,
    fm,
    call: (name: string, args: Record<string, unknown>) =>
      tools.get(name)!(args),
  };
}

describe("database's tools", () => {
  it("query a database's rows, filtered and sorted as a block would", async () => {
    const { call } = setup();
    const all = await call("query_rows", {
      database: "Books",
      sort: "-rating",
    });
    expect(all.rows).toEqual([
      {
        name: "Dune",
        path: "Books/Dune.md",
        properties: { rating: 5, read: "2026-01-03", tags: ["sf"] },
      },
      {
        name: "Emma",
        path: "Books/Emma.md",
        properties: { rating: 3, tags: ["classic"] },
      },
    ]);
    const some = await call("query_rows", {
      database: "Books/",
      filter: ["rating >= 4", 'tags.contains("sf")'],
    });
    expect(some.rows.map((r: { name: string }) => r.name)).toEqual(["Dune"]);
    expect(await call("query_rows", { database: "Nowhere" })).toHaveProperty(
      "error",
    );
  });

  it("add a row as a document with its properties", async () => {
    const { call, files, fm } = setup();
    expect(
      await call("add_row", {
        database: "Books",
        name: "Ulysses",
        properties: { rating: 4 },
        body: "Long.",
      }),
    ).toEqual({
      database: "Books",
      path: "Books/Ulysses.md",
    });
    expect(files["Books/Ulysses.md"]).toBe("# Ulysses\n\nLong.\n");
    expect(fm["Books/Ulysses.md"]).toEqual({ rating: 4 });
    expect(
      await call("add_row", { database: "Books", name: "Dune" }),
    ).toHaveProperty("error");
  });
});

describe("a base drawn in a note", () => {
  it("shows the notes it chooses, and writes a view's change into the block", async () => {
    const files: Record<string, string> = {
      "Papers/Papers.md": "# Papers\n",
      "Papers/Dune.md": "# Dune\n",
      "Papers/Emma/Emma.md": "# Emma\n",
      "Papers/Emma/Notes.md": "# Notes\n",
      "Home.md": "# Home\n",
    };
    const fm: Record<string, Record<string, unknown>> = {
      "Papers/Dune.md": { status: "Doing" },
      "Papers/Emma/Emma.md": { status: "Done" },
    };
    let render: (b: unknown, w: unknown) => Promise<void> = async () => {};
    const api = {
      files: {
        ...folder(files),
        frontmatter: {
          get: async (p: string) => fm[p.slice(6)] ?? {},
          update: async () => {},
        },
      },
      metadata: {
        all: async () =>
          Object.keys(files).map((rel) => ({
            path: "/root/" + rel,
            rel,
            frontmatter: fm[rel] ?? {},
          })),
      },
      views: {
        registerCodeBlock: (_: string, r: { render: typeof render }) => (
          (render = r.render),
          { dispose() {} }
        ),
        registerFileEditor: () => ({ dispose() {} }),
      },
    };
    loadPlugin("catvinci.database", api);
    const posted: {
      rows: { rel: string }[];
      views: unknown[];
      folder: string;
    }[] = [];
    let receive: (m: unknown) => Promise<unknown> = async () => {};
    const webview = {
      html: "",
      postMessage: (m: { type: string; data: (typeof posted)[0] }) =>
        m.type === "data" && posted.push(m.data),
      onDidDispose: () => {},
      onDidReceiveMessage: (f: typeof receive) => (receive = f),
    };
    const block = {
      path: "/root/Home.md",
      source:
        'filters:\n  and:\n    - file.inFolder("Papers")\n    - file.path != "Papers/Papers.md"\n    - file.folder == "Papers" || file.folder.endsWith("/" + file.basename) && !file.folder.slice(7).contains("/")\nviews:\n  - type: table\n    name: Table',
      setSource: async (text: string) => {
        block.source = text;
      },
      onDidChange: () => {},
    };
    await render(block, webview);
    await receive({ type: "ready", index: 0 });
    expect(
      posted
        .at(-1)!
        .rows.map((r) => r.rel)
        .sort(),
    ).toEqual(["Papers/Dune.md", "Papers/Emma/Emma.md"]);
    expect(posted.at(-1)!.folder).toBe("Papers");
    await receive({
      type: "spec",
      spec: { group: "status", groupOrder: ["Done", "Doing"] },
    });
    expect(block.source).toContain("groupBy:\n      property: status");
    expect(block.source).toContain("groupOrder:\n      - Done\n      - Doing");
    expect(block.source).toContain('file.inFolder("Papers")');
    await receive({ type: "addView", view: "board" });
    expect(block.source).toContain("- type: kanban\n    name: Board");
  });
});

describe("a base naming a folder by its path", () => {
  it("names it by its new path when the folder is renamed", async () => {
    const files: Record<string, string> = {
      "Home.md":
        '# Home\n\n```base\nfilters:\n  and:\n    - file.inFolder("Work/Plans")\n    - file.inFolder("Work/Plans/2026")\nviews:\n  - type: table\n```\n',
      "Other.md": '```base\nfilters: file.inFolder("Work/Plansx")\n```\n',
      "Work/Goals/a.md": "# a\n",
    };
    const renames: ((c: { from: string; to: string }) => void)[] = [];
    loadPlugin("catvinci.database", {
      files: {
        ...folder(files),
        onDidRename: (fn: (typeof renames)[0]) => (
          renames.push(fn),
          { dispose() {} }
        ),
      },
      metadata: {
        all: async () =>
          Object.keys(files).map((rel) => ({
            path: "/root/" + rel,
            rel,
            frontmatter: {},
          })),
      },
      views: {
        registerCodeBlock: () => ({ dispose() {} }),
        registerFileEditor: () => ({ dispose() {} }),
        registerList: () => ({ refresh() {}, dispose() {} }),
      },
    });
    renames.forEach((fn) =>
      fn({ from: "/root/Work/Plans", to: "/root/Work/Goals" }),
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(files["Home.md"]).toContain(
      'file.inFolder("Work/Goals")\n    - file.inFolder("Work/Goals/2026")',
    );
    expect(files["Other.md"]).toContain('file.inFolder("Work/Plansx")');
  });
});
