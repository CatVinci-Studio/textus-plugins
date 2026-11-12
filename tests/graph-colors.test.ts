import { beforeAll, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Graph View colours notes by an Obsidian vault's colour groups
 *  (.obsidian/graph.json) after its own (plugins/catvinci.graph). */
type Graph = { nodes: { id: string; color?: string }[] };
let links: {
  obsidianGroups: (saved: unknown) => { query: string; color: string }[];
};

beforeAll(async () => {
  await import(/* @vite-ignore */ "../plugins/catvinci.graph/links.js");
  links = (globalThis as unknown as { graphLinks: typeof links }).graphLinks;
});

it("reads Obsidian's colour groups as queries and #rrggbb colours", () => {
  expect(
    links.obsidianGroups({
      colorGroups: [
        { query: "path:Work", color: { a: 1, rgb: 14701138 } },
        { query: "tag:#idea", color: { a: 1, rgb: 255 } },
        { query: "", color: { a: 1, rgb: 1 } },
        { query: "x" },
      ],
    }),
  ).toEqual([
    { query: "path:Work", color: "#e05252" },
    { query: "tag:#idea", color: "#0000ff" },
  ]);
  expect(links.obsidianGroups(null)).toEqual([]);
});

it("colours the matching notes in the graph, the panel's groups first", async () => {
  const files: Record<string, string> = {
    "Work/Plan.md": "",
    "Idea.md": "",
    "Other.md": "",
    ".obsidian/graph.json": JSON.stringify({
      colorGroups: [
        { query: "path:Work", color: { a: 1, rgb: 0xff0000 } },
        { query: "tag:#idea", color: { a: 1, rgb: 0x00ff00 } },
        { query: "Other", color: { a: 1, rgb: 0x0000ff } },
      ],
    }),
  };
  const doc = (rel: string, tags: string[] = []) => ({
    path: "/root/" + rel,
    rel,
    tags,
    links: [],
  });
  const storage = new Map<string, unknown>([
    ["global", { groups: [{ query: "Other", color: "#123456" }] }],
  ]);
  let resolve: ((view: unknown) => Promise<void>) | null = null;
  let onMessage: ((m: unknown) => Promise<void>) | null = null;
  const posted: { graph: Graph }[] = [];
  loadPlugin(
    "catvinci.graph",
    {
      files: folder(files),
      metadata: {
        all: async () => [doc("Work/Plan.md"), doc("Idea.md", ["idea"]), doc("Other.md")],
      },
      views: {
        registerWebview: (id: string, p: { resolve: typeof resolve }) => {
          if (id === "catvinci.graph.global") resolve = p.resolve;
          return { dispose() {} };
        },
      },
    },
    {
      get: async (key: string) => storage.get(key),
      set: async (key: string, value: unknown) => void storage.set(key, value),
    } as never,
  );
  await resolve!({
    postMessage: async (m: { graph: Graph }) => void posted.push(m),
    onDidReceiveMessage: (fn: typeof onMessage) => ((onMessage = fn), { dispose() {} }),
    onDidDispose: () => ({ dispose() {} }),
    html: "",
  });
  await onMessage!({ type: "ready" });
  const colour = Object.fromEntries(posted[0].graph.nodes.map((n) => [n.id, n.color]));
  expect(colour).toEqual({
    "/root/Work/Plan.md": "#ff0000",
    "/root/Idea.md": "#00ff00",
    "/root/Other.md": "#123456",
  });
});

it("draws the sidebar graph with its defaults, dropping what older versions kept", async () => {
  const storage = new Map<string, unknown>([["local", { search: "nothing", depth: 3 }]]);
  let resolveLocal: ((view: unknown) => Promise<void>) | null = null;
  let onMessage: ((m: unknown) => Promise<void>) | null = null;
  const posted: { graph: Graph; settings: Record<string, unknown> }[] = [];
  loadPlugin(
    "catvinci.graph",
    {
      files: folder({ "A.md": "" }),
      metadata: { all: async () => [{ path: "/root/A.md", rel: "A.md", tags: [], links: [] }] },
      editor: { getPath: async () => "/root/A.md" },
      views: {
        registerWebview: (id: string, p: { resolve: typeof resolveLocal }) => {
          if (id === "catvinci.graph.local") resolveLocal = p.resolve;
          return { dispose() {} };
        },
      },
    },
    {
      get: async (key: string) => storage.get(key),
      set: async (key: string, value: unknown) => void storage.set(key, value),
    } as never,
  );
  await resolveLocal!({
    postMessage: async (m: (typeof posted)[0]) => void posted.push(m),
    onDidReceiveMessage: (fn: typeof onMessage) => ((onMessage = fn), { dispose() {} }),
    onDidDispose: () => ({ dispose() {} }),
    html: "",
  });
  await onMessage!({ type: "ready" });
  expect(storage.get("local")).toBeNull();
  expect(posted[0].settings).toMatchObject({ search: "", depth: 1 });
  expect(posted[0].graph.nodes.map((n) => n.id)).toEqual(["/root/A.md"]);
});
