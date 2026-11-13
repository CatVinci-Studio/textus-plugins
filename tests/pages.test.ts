import { beforeAll, describe, expect, it } from "vitest";

/** Pages' tree (plugins/catvinci.database/pages.js). */
type Node = {
  name: string;
  rel: string | null;
  dir: string | null;
  icon: string | null;
  children: Node[];
};
let p: {
  tree: (docs: { rel: string; icon?: unknown }[]) => Node[];
  ancestors: (rel: string, rels: string[]) => string[];
  subpage: (parent: string, title: string) => string;
  link: (rel: string, rels: string[]) => string;
  unitOf: (rel: string) => string | null;
  oldUnits: (rels: string[]) => { from: string; to: string }[];
  retitle: (text: string, old: string, title: string) => string;
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/name-order.js");
  const script = "../plugins/catvinci.database/pages.js";
  await import(/* @vite-ignore */ script);
  p = (globalThis as unknown as { pages: typeof p }).pages;
});

const shape = (nodes: Node[]): unknown =>
  nodes.map((n) =>
    n.children.length ? { [n.name]: shape(n.children) } : n.name,
  );

describe("pages", () => {
  it("puts a page's folder under the page, and a folder without one on its own", () => {
    const docs = [
      { rel: "Life.md", icon: "☀️" },
      { rel: "Life/2026 Calendar.md" },
      { rel: "Life/2026 Calendar/Week1.md" },
      { rel: "Life/2026 Calendar/Week2.md" },
      { rel: "Archive/Old.md" },
      { rel: "Inbox.md" },
    ];
    const tree = p.tree(docs);
    expect(shape(tree)).toEqual([
      "Inbox",
      { Life: [{ "2026 Calendar": ["Week1", "Week2"] }] },
      { Archive: ["Old"] },
    ]);
    const life = tree.find((n) => n.name === "Life")!;
    expect(life).toMatchObject({ rel: "Life.md", dir: "Life", icon: "☀️" });
    expect(tree.find((n) => n.name === "Archive")).toMatchObject({
      rel: null,
      dir: "Archive",
    });
  });

  it("finds the pages above a sub-page, the outermost first", () => {
    const rels = [
      "Life.md",
      "Life/2026 Calendar.md",
      "Life/2026 Calendar/Week1.md",
    ];
    expect(p.ancestors("Life/2026 Calendar/Week1.md", rels)).toEqual([
      "Life.md",
      "Life/2026 Calendar.md",
    ]);
    expect(p.ancestors("Life.md", rels)).toEqual([]);
  });

  it("renames only the page's own heading", () => {
    expect(p.retitle("---\na: 1\n...\n\n# Q1: Goals\r\nbody", "Q1- Goals", "Plan")).toBe(
      "---\na: 1\n...\n\n# Plan\r\nbody",
    );
    // No title heading first: left as it is, a later one too.
    expect(p.retitle("Intro\n\n# Agenda\n", "Agenda", "Standup")).toBe("Intro\n\n# Agenda\n");
    // A real name holding what fileName would replace, and a closing #.
    expect(p.retitle("# C# basics\n", "C# basics", "Go")).toBe("# Go\n");
    expect(p.retitle("# C#\n", "C-", "Go")).toBe("# Go\n");
  });

  it("makes a sub-page beside its page", () => {
    expect(p.subpage("Life/Plans.md", "Trip: Japan")).toBe(
      "Life/Plans/Trip- Japan.md",
    );
  });

  it("reads a folder unit - Plans/Plans.md and its sub-pages beside it - as the page and its children", () => {
    const docs = [
      { rel: "Plans/Plans.md", icon: "🎯" },
      { rel: "Plans/Q1.md" },
      { rel: "Plans/Q2/Q2.md" },
      { rel: "Plans/Q2/April.md" },
      { rel: "Life.md" },
      { rel: "Life/Week1.md" },
    ];
    const tree = p.tree(docs);
    expect(shape(tree)).toEqual([
      { Life: ["Week1"] },
      { Plans: ["Q1", { Q2: ["April"] }] },
    ]);
    expect(tree.find((n) => n.name === "Plans")).toMatchObject({
      rel: "Plans/Plans.md",
      dir: "Plans",
      icon: "🎯",
    });
    const rels = docs.map((d) => d.rel);
    expect(p.ancestors("Plans/Q2/April.md", rels)).toEqual([
      "Plans/Plans.md",
      "Plans/Q2/Q2.md",
    ]);
    expect(p.ancestors("Plans/Q2/Q2.md", rels)).toEqual(["Plans/Plans.md"]);
    // A unit's sub-page goes in its own folder; an older page's in the folder beside it.
    expect(p.subpage("Plans/Plans.md", "Q3")).toBe("Plans/Q3.md");
    expect(p.subpage("Life.md", "Week2")).toBe("Life/Week2.md");
    // The older pages that have sub-pages, and where each goes as a unit.
    expect(p.oldUnits(rels)).toEqual([{ from: "Life.md", to: "Life/Life.md" }]);
    expect(p.unitOf("Plans/Plans.md")).toBeNull();
  });
});
