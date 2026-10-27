import { beforeAll, describe, expect, it } from "vitest";

/** Graph View's graph (plugins/catvinci.graph/links.js), a plain script
 *  that puts itself on the global object. */
type Node = { id: string; name: string; kind: string; color?: string };
type Edge = { source: string; target: string; both: boolean };
type Graph = { nodes: Node[]; edges: Edge[] };
type Doc = {
  path: string;
  rel: string;
  tags: string[];
  links: { target: string; resolved: string | null; line: number; text: string }[];
};
let links: {
  graphFromMetadata: (docs: Doc[], options?: { tags?: boolean }) => Graph;
  filterGraph: (graph: Graph, settings: Record<string, unknown>) => Graph;
  neighbourhood: (
    graph: Graph,
    focus: string,
    depth: number,
  ) => Graph;
};

beforeAll(async () => {
  // A path in a variable: the script has no types to check against.
  const script = "../plugins/catvinci.graph/links.js";
  await import(/* @vite-ignore */ script);
  links = (globalThis as unknown as { graphLinks: typeof links }).graphLinks;
});

/** A document of /n linking to the others named, by their rel. */
const doc = (rel: string, to: string[] = [], tags: string[] = []): Doc => ({
  path: `/n/${rel}`,
  rel,
  tags,
  links: to.map((t, line) => ({
    target: t,
    resolved: t.endsWith(".md") ? `/n/${t}` : null,
    line,
    text: `[[${t}]]`,
  })),
});
const ids = (g: Graph) => g.nodes.map((n) => n.id).sort();

describe("the graph of a folder's links", () => {
  it("keeps a link's direction, and two notes linking each other as one line", () => {
    const g = links.graphFromMetadata([
      doc("a.md", ["b.md", "c.md"]),
      doc("b.md", ["a.md"]),
      doc("c.md"),
    ]);
    expect(g.edges).toEqual([
      { source: "/n/a.md", target: "/n/b.md", both: true },
      { source: "/n/a.md", target: "/n/c.md", both: false },
    ]);
  });

  it("makes a missing note of a wiki link to nothing, but not of a web link", () => {
    const g = links.graphFromMetadata([doc("a.md", ["Someday", "https://x.org"])]);
    expect(g.nodes.map((n) => [n.name, n.kind])).toEqual([
      ["a", "note"],
      ["Someday", "missing"],
    ]);
  });

  it("makes each tag a node when tags are asked for", () => {
    const docs = [doc("a.md", [], ["draft"]), doc("b.md", [], ["#Draft"])];
    expect(links.graphFromMetadata(docs).nodes).toHaveLength(2);
    const g = links.graphFromMetadata(docs, { tags: true });
    expect(g.nodes.filter((n) => n.kind === "tag").map((n) => n.name)).toEqual(["#draft"]);
    expect(g.edges).toHaveLength(2);
  });
});

describe("the settings panel's filters", () => {
  const folder = () =>
    links.graphFromMetadata(
      [
        doc("ideas/one.md", ["two.md", "Later"], ["draft"]),
        doc("two.md"),
        doc("alone.md"),
      ],
      { tags: true },
    );
  const base = { tags: false, existingOnly: false, orphans: true, search: "" };

  it("leaves tags, missing notes and orphans out as asked", () => {
    expect(ids(links.filterGraph(folder(), base))).toEqual([
      "/n/alone.md",
      "/n/ideas/one.md",
      "/n/two.md",
      "missing:later",
    ]);
    expect(ids(links.filterGraph(folder(), { ...base, tags: true }))).toContain("tag:#draft");
    const strict = links.filterGraph(folder(), { ...base, existingOnly: true, orphans: false });
    expect(ids(strict)).toEqual(["/n/ideas/one.md", "/n/two.md"]);
  });

  it("searches names and paths, with path:, file:, tag: and a minus", () => {
    const shown = (search: string) =>
      ids(links.filterGraph(folder(), { ...base, existingOnly: true, search }));
    expect(shown("path:ideas")).toEqual(["/n/ideas/one.md"]);
    expect(shown("file:two")).toEqual(["/n/two.md"]);
    expect(shown("tag:#draft")).toEqual(["/n/ideas/one.md"]);
    expect(shown("-alone")).toEqual(["/n/ideas/one.md", "/n/two.md"]);
  });

  it("colours a note by the first group it answers", () => {
    const g = links.filterGraph(folder(), {
      ...base,
      groups: [
        { query: "path:ideas", color: "#f00" },
        { query: "one", color: "#0f0" },
        { query: "", color: "#00f" },
      ],
    });
    const color = (id: string) => g.nodes.find((n) => n.id === id)?.color;
    expect(color("/n/ideas/one.md")).toBe("#f00");
    expect(color("/n/two.md")).toBeUndefined();
  });
});

describe("the local graph", () => {
  // a → b → c, d → b, b ↔ e, c → e.
  const g = () =>
    links.graphFromMetadata([
      doc("a.md", ["b.md"]),
      doc("b.md", ["c.md", "e.md"]),
      doc("c.md", ["e.md"]),
      doc("d.md", ["b.md"]),
      doc("e.md", ["b.md"]),
    ]);

  it("reaches as far as the depth, either way", () => {
    expect(ids(links.neighbourhood(g(), "/n/a.md", 1))).toEqual(["/n/a.md", "/n/b.md"]);
    expect(ids(links.neighbourhood(g(), "/n/a.md", 2))).toHaveLength(5);
  });
});
