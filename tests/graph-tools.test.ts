import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Graph View's tool for Textus AI (plugins/catvinci.graph/host.js). */
it("gives a note's neighbours within a depth, each with its distance", async () => {
  const doc = (rel: string, links: [string, string | null][], tags: string[] = []) => ({
    path: "/root/" + rel,
    rel,
    tags,
    links: links.map(([target, resolved]) => ({ target, resolved: resolved && "/root/" + resolved })),
  });
  const docs = [
    doc("A.md", [["B", "B.md"], ["Nowhere", null]], ["x"]),
    doc("B.md", [["C", "C.md"]]),
    doc("C.md", []),
    doc("D.md", [["A", "A.md"]], ["x"]),
  ];
  const { tools } = loadPlugin("catvinci.graph", { files: { root: async () => "/root" }, metadata: { all: async () => docs } });
  const one = await tools.get("list_neighbours")!({ path: "A" });
  expect(one.document).toBe("A.md");
  expect(one.notes).toEqual([
    { name: "B", path: "B.md", kind: "note", distance: 1 },
    { name: "D", path: "D.md", kind: "note", distance: 1 },
    { name: "Nowhere", path: null, kind: "missing", distance: 1 },
  ]);
  expect(one.links).toContainEqual({ from: "A.md", to: "B.md", both: false });
  const two = await tools.get("list_neighbours")!({ path: "A.md", depth: 2, tags: true });
  expect(two.notes.map((n: { name: string; distance: number }) => n.name + n.distance)).toEqual(["#x1", "B1", "D1", "Nowhere1", "C2"]);
});
