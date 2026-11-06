import { expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Backlinks' tool for Textus AI (plugins/catvinci.backlinks/host.js). */
it("lists a document's backlinks, unlinked mentions and links, lines from 1, as the sidebar does", async () => {
  const files = {
    "Plan.md": "# Plan\n\nSee [[Ideas]] and [[Gone]].\n",
    "Ideas.md": "# Ideas\n",
    "Log.md": "# Log\n\nWorked on the Plan today.\nMore in [[Plan]].\n",
  };
  const docs = [
    { path: "/root/Plan.md", rel: "Plan.md", title: "Plan", links: [
      { target: "Ideas", resolved: "/root/Ideas.md", line: 2, text: "See [[Ideas]]" },
      { target: "Gone", resolved: null, line: 2, text: "[[Gone]]" },
    ] },
    { path: "/root/Ideas.md", rel: "Ideas.md", title: "Ideas", links: [] },
    { path: "/root/Log.md", rel: "Log.md", title: "Log", links: [] },
  ];
  const metadata = {
    all: async () => docs,
    get: async () => ({ frontmatter: {} }),
    backlinks: async () => [{ path: "/root/Log.md", line: 3, text: "[[Plan]]" }],
    // Where a click would make the note a link finds none for.
    resolveNote: async (link: string) => ({ path: "/root/" + link.slice(2, -2) + ".md", exists: false, kind: "note", line: null }),
    search: async () => ({
      hits: [
        { path: "/root/Log.md", rel: "Log.md", line: 3, text: "Worked on the Plan today." },
        { path: "/root/Log.md", rel: "Log.md", line: 4, text: "More in [[Plan]]." },
      ],
    }),
  };
  let panel: { items: () => Promise<{ id: string; group: string }[]> } | null = null;
  const views = {
    registerList: (_id: string, provider: typeof panel) => {
      panel = provider;
      return { setMessage() {}, refresh() {}, dispose() {} };
    },
  };
  const editor = { getPath: async () => "/root/Plan.md" };
  const { tools } = loadPlugin("catvinci.backlinks", { files: folder(files), metadata, views, editor });
  expect(await tools.get("list_backlinks")!({ path: "Plan" })).toEqual({
    document: "Plan.md",
    linked: [{ path: "Log.md", line: 4, text: "More in [[Plan]]." }],
    unlinked: [{ path: "Log.md", line: 3, text: "Worked on the Plan today." }],
    outgoing: [{ name: "Ideas", path: "Ideas.md" }, { name: "Gone", path: null }],
  });
  expect(await tools.get("list_backlinks")!({ path: "Nope.md" })).toHaveProperty("error");
  // The sidebar's list, from the same findings.
  expect((await panel!.items()).map((i) => [i.id, i.group])).toEqual([
    ["in:/root/Log.md:3", "linked · 1"],
    ["named:/root/Log.md:2", "unlinked · 1"],
    ["out:/root/ideas.md", "outgoing · 2"],
    ["out:/root/gone.md", "outgoing · 2"],
  ]);
});

it("links an unlinked mention as Textus writes links, keeping every other byte and line ending", async () => {
  const before = "# Log\r\n\r\nWorked on the plan today.\nMore in [[Plan]].\r\nEnd";
  const files: Record<string, string> = { "Log.md": before, "Plan.md": "# Plan\n" };
  let link: ((mention: unknown) => Promise<void>) | null = null;
  const commands = {
    register: (id: string, run: typeof link) => {
      if (id === "catvinci.backlinks.link") link = run;
      return { dispose() {} };
    },
  };
  const metadata = {
    linkTo: async (to: string, _from: string, o: { alias?: string }) =>
      "[[" + to.slice(6, -3) + (o.alias ? "|" + o.alias : "") + "]]",
  };
  loadPlugin("catvinci.backlinks", { files: folder(files), metadata, commands });
  const mention = { path: "/root/Log.md", line: 2, text: "Worked on the plan today.", name: "Plan", to: "/root/Plan.md" };
  await link!(mention);
  expect(files["Log.md"]).toBe(before.replace("the plan today", "the [[Plan|plan]] today"));
  // The line changed since it was listed: nothing is written.
  const now = files["Log.md"];
  await link!({ ...mention, line: 0 });
  expect(files["Log.md"]).toBe(now);
});
