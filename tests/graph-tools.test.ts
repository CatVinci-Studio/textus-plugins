import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Graph View's tool for Textus AI (plugins/catvinci.graph/host.js). */
it("gives a note's neighbours within a depth, each with its distance", async () => {
  const doc = (
    rel: string,
    links: [string, string | null][],
    tags: string[] = [],
  ) => ({
    path: "/root/" + rel,
    rel,
    tags,
    links: links.map(([target, resolved]) => ({
      target,
      resolved: resolved && "/root/" + resolved,
      wiki: true,
    })),
  });
  const docs = [
    doc(
      "A.md",
      [
        ["B", "B.md"],
        ["Nowhere", null],
      ],
      ["x"],
    ),
    doc("B.md", [["C", "C.md"]]),
    doc("C.md", []),
    doc("D.md", [["A", "A.md"]], ["x"]),
  ];
  const resolveNote = async (link: string) => ({
    path: "/root/" + link.slice(2, -2) + ".md",
    exists: false,
    kind: "note",
  });
  const { tools } = loadPlugin("catvinci.graph", {
    files: { root: async () => "/root" },
    metadata: { all: async () => docs, resolveNote },
  });
  const one = await tools.get("list_neighbours")!({ path: "A" });
  expect(one.document).toBe("A.md");
  expect(one.notes).toEqual([
    { name: "B", path: "B.md", kind: "note", distance: 1 },
    { name: "D", path: "D.md", kind: "note", distance: 1 },
    { name: "Nowhere", path: null, kind: "missing", distance: 1 },
  ]);
  expect(one.links).toContainEqual({ from: "A.md", to: "B.md", both: false });
  const two = await tools.get("list_neighbours")!({
    path: "A.md",
    depth: 2,
    tags: true,
  });
  expect(
    two.notes.map(
      (n: { name: string; distance: number }) => n.name + n.distance,
    ),
  ).toEqual(["#x1", "B1", "D1", "Nowhere1", "C2"]);
});

it("finds where a link to no document goes as Textus does: a dotted name, a note the index missed", async () => {
  const docs = [
    {
      path: "/root/A.md",
      rel: "A.md",
      tags: [],
      links: [
        { target: "Note v1.2", resolved: null, wiki: true },
        { target: "b", resolved: null, wiki: true },
        { target: "https://x.org", resolved: null },
      ],
    },
    { path: "/root/B.md", rel: "B.md", tags: [], links: [] },
  ];
  const resolveNote = async (link: string, from: string) => {
    expect(from).toBe("/root/A.md");
    const name = link.slice(2, -2);
    return name === "b"
      ? { path: "/root/B.md", exists: true, kind: "note" }
      : { path: "/root/" + name + ".md", exists: false, kind: "note" };
  };
  const { tools } = loadPlugin("catvinci.graph", {
    files: { root: async () => "/root" },
    metadata: { all: async () => docs, resolveNote },
  });
  const near = await tools.get("list_neighbours")!({ path: "A.md" });
  expect(near.notes).toEqual([
    { name: "B", path: "B.md", kind: "note", distance: 1 },
    { name: "Note v1.2", path: null, kind: "missing", distance: 1 },
  ]);
});

it("finds a standard link to no document as one, from the note's folder, and asks once per link and folder", async () => {
  const link = (target: string, wiki = false) => ({ target, resolved: null, wiki });
  const docs = [
    {
      path: "/root/Notes/A.md",
      rel: "Notes/A.md",
      tags: [],
      links: [link("Week45/Nov%208.md"), link("Nov 8", true), link("#Heading")],
    },
    { path: "/root/Notes/B.md", rel: "Notes/B.md", tags: [], links: [link("Week45/Nov%208.md")] },
  ];
  const asked: string[] = [];
  const resolveNote = async (target: string) => {
    asked.push(target);
    return { path: "/root/Notes/Week45/Nov 8.md", exists: false, kind: "note" };
  };
  const { tools } = loadPlugin("catvinci.graph", {
    files: { root: async () => "/root" },
    metadata: { all: async () => docs, resolveNote },
  });
  const near = await tools.get("list_neighbours")!({ path: "Notes/A.md" });
  expect(asked.sort()).toEqual(["Week45/Nov%208.md", "[[Nov 8]]"]);
  expect(near.notes).toEqual([{ name: "Nov 8", path: null, kind: "missing", distance: 1 }]);
});
