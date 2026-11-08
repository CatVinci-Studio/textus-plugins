import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Today, local, as YYYY-MM-DD: the done date Tasks writes. */
const today = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
};

/** Tasks' tools for Textus AI (plugins/catvinci.tasks/host.js). */
function setup(files: Record<string, string>) {
  const f = folder(files);
  const task = (text: string, line: number, done = false, due: string | null = null, tags: string[] = []) => ({
    text, line, done, due, tags,
  });
  const metadata = {
    all: async () => [
      { path: "/root/Plan.md", rel: "Plan.md", tasks: [task("Write 📅 2026-11-03", 2, false, "2026-11-03"), task("Read #home", 3, true, null, ["home"])] },
      { path: "/root/Home.md", rel: "Home.md", tasks: [task("Clean #home", 0, false, null, ["home"])] },
    ],
  };
  return loadPlugin("catvinci.tasks", { files: f, metadata }).tools;
}

describe("tasks' tools", () => {
  it("list open tasks by default, filtered as asked, lines from 1", async () => {
    const tools = setup({});
    const open = await tools.get("list_tasks")!({});
    expect(open.tasks.map((t: { text: string }) => t.text)).toEqual(["Write", "Clean #home"]);
    expect(open.tasks[0]).toMatchObject({ due: "2026-11-03", path: "Plan.md", line: 3 });
    const home = await tools.get("list_tasks")!({ status: "all", tag: "#home" });
    expect(home.tasks.map((t: { path: string }) => t.path)).toEqual(["Plan.md", "Home.md"]);
    const due = await tools.get("list_tasks")!({ due_before: "2026-11-05", path: "Plan" });
    expect(due.total).toBe(1);
  });

  it("add a task under a heading, at the end, or in a new document", async () => {
    const files: Record<string, string> = {
      "Plan.md": "# Plan\n\n## Today\n\n- [ ] One\n\n## Later\n\nSome day.\n",
    };
    const tools = setup(files);
    expect(await tools.get("add_task")!({ text: "Two", path: "Plan.md", heading: "Today", due: "2026-11-04" })).toMatchObject({ line: 6 });
    await tools.get("add_task")!({ text: "Three", path: "Plan.md" });
    expect(files["Plan.md"]).toBe(
      "# Plan\n\n## Today\n\n- [ ] One\n- [ ] Two 📅 2026-11-04\n\n## Later\n\nSome day.\n\n- [ ] Three\n",
    );
    await tools.get("add_task")!({ text: "Four", path: "Inbox/New", heading: "Inbox" });
    expect(files["Inbox/New.md"]).toBe("## Inbox\n\n- [ ] Four\n");
    expect(await tools.get("add_task")!({ text: "x", path: "../out.md" })).toHaveProperty("error");
  });

  it("tick off a task by its line, and refuse a line that isn't one", async () => {
    const files: Record<string, string> = { "Plan.md": "# Plan\n\n- [ ] One\n" };
    const tools = setup(files);
    expect(await tools.get("complete_task")!({ path: "Plan.md", line: 3, text: "One" })).toMatchObject({ done: true });
    expect(files["Plan.md"]).toBe("# Plan\n\n- [x] One ✅ " + today() + "\n");
    await tools.get("complete_task")!({ path: "Plan.md", line: 3, done: false });
    expect(files["Plan.md"]).toBe("# Plan\n\n- [ ] One\n");
    expect(await tools.get("complete_task")!({ path: "Plan.md", line: 1 })).toHaveProperty("error");
    expect(await tools.get("complete_task")!({ path: "Plan.md", line: 3, text: "Other" })).toHaveProperty("error");
  });
});

it("leaves a Kanban board's cards to the board, in the panel and the tools", async () => {
  const task = (text: string, line: number) => ({ text, line, done: false, due: null, tags: [] });
  const metadata = {
    all: async () => [
      { path: "/root/Plan.md", rel: "Plan.md", headings: [], tasks: [task("Write", 0)] },
      { path: "/root/Work.kanban.md", rel: "Work.kanban.md", headings: [], tasks: [task("Card", 2)] },
    ],
  };
  let panel: { items: () => Promise<{ label: string }[]> } | null = null;
  const views = { registerList: (_id: string, p: typeof panel) => ((panel = p), { setMessage() {}, refresh() {}, dispose() {} }) };
  const { tools } = loadPlugin("catvinci.tasks", { files: { ...folder({}), root: async () => "/root" }, metadata, views });
  expect((await tools.get("list_tasks")!({})).tasks.map((t: { text: string }) => t.text)).toEqual(["Write"]);
  expect((await panel!.items()).map((i) => i.label)).toEqual(["Write"]);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/** A folder whose index is made from its files as Textus's is: a task's
 *  box says only empty or not; a board is known by its front matter. */
function indexed(files: Record<string, string>) {
  const metadata = {
    all: async () =>
      Object.keys(files).map((rel) => ({
        path: "/root/" + rel,
        rel,
        headings: [],
        frontmatter: /^---\nkanban-plugin:/.test(files[rel]) ? { "kanban-plugin": "board" } : {},
        tasks: files[rel].split("\n").flatMap((line, i) => {
          const m = /^\s*(?:[-*+]|\d+[.)])\s+\[([^\]])\]\s+(.*)$/.exec(line);
          return m ? [{ text: m[2], line: i, done: m[1] !== " ", due: null, tags: [] }] : [];
        }),
      })),
  };
  let panel: Any = null;
  let block: Any = null;
  const views = {
    registerList: (_id: string, p: Any) => ((panel = p), { setMessage() {}, refresh() {}, dispose() {} }),
    registerCodeBlock: (_language: string, p: Any) => ((block = p), { dispose() {} }),
  };
  const opened: unknown[] = [];
  const layout = { open: async (where: unknown) => void opened.push(where) };
  const { tools } = loadPlugin("catvinci.tasks", { files: folder(files), metadata, views, layout });
  return { tools, panel: () => panel, block: () => block, opened };
}

/** A ```tasks block drawn: what its page was sent, and a way to talk back. */
async function drawBlock(render: (b: unknown, w: unknown) => Promise<void>, source: string) {
  const sent: Any[] = [];
  let toHost: (m: unknown) => Promise<void> = async () => {};
  const webview = {
    html: "",
    postMessage: async (m: unknown) => void sent.push(m),
    onDidReceiveMessage: (fn: typeof toHost) => ((toHost = fn), { dispose() {} }),
    onDidDispose: () => ({ dispose() {} }),
  };
  await render({ source, meta: {}, path: "/root/Query.md", onDidChange: () => ({ dispose() {} }) }, webview);
  await toHost({ type: "ready" });
  const last = () => sent[sent.length - 1].result;
  return { webview, last, say: (m: unknown) => toHost(m) };
}

describe("Obsidian Tasks' way of writing tasks", () => {
  it("reads [/] as open and [-] as finished, and lists the text without its fields", async () => {
    const files = {
      "Plan.md": "- [/] Draft ⏫ ⏳ 2026-11-03 📅 2099-11-04\n- [-] Dropped ❌ 2026-11-01\n- [x] Shipped ✅ 2026-11-02\n- [ ] Next 🔁 every week\n",
    };
    const { tools, panel } = indexed(files);
    const open = await tools.get("list_tasks")!({});
    expect(open.tasks).toEqual([
      { text: "Draft", done: false, status: "in_progress", due: "2099-11-04", path: "Plan.md", line: 1, scheduled: "2026-11-03", priority: "high" },
      { text: "Next", done: false, status: "todo", due: null, path: "Plan.md", line: 4, recurrence: "every week" },
    ]);
    const done = await tools.get("list_tasks")!({ status: "done" });
    expect(done.tasks.map((t: { status: string }) => t.status)).toEqual(["cancelled", "done"]);
    expect((await panel().items()).map((i: Any) => [i.label, i.checkbox])).toEqual([
      ["Draft", false],
      ["Next", false],
    ]);
  });

  it("ticks a task in the panel with a done date, and opens it again without", async () => {
    const files = { "Plan.md": "- [/] Draft 📅 2099-01-01\n" };
    const { panel } = indexed(files);
    const [item] = await panel().items();
    await panel().onCheck(item, true);
    expect(files["Plan.md"]).toBe("- [x] Draft 📅 2099-01-01 ✅ " + today() + "\n");
    await panel().onCheck({ ...item, data: { ...item.data, text: "Draft" } }, false);
    expect(files["Plan.md"]).toBe("- [ ] Draft 📅 2099-01-01\n");
  });

  it("puts a recurring task's next occurrence above it when the tool ticks it", async () => {
    const files = { "Plan.md": "# Plan\n- [ ] Water 🔁 every day 📅 2026-11-05\n" };
    const { tools } = indexed(files);
    expect(await tools.get("complete_task")!({ path: "Plan.md", line: 2, text: "Water" })).toEqual({
      path: "Plan.md",
      line: 3,
      text: "Water",
      done: true,
      next: { line: 2, text: "- [ ] Water 🔁 every day 📅 2026-11-06" },
    });
    expect(files["Plan.md"]).toBe(
      "# Plan\n- [ ] Water 🔁 every day 📅 2026-11-06\n- [x] Water 🔁 every day 📅 2026-11-05 ✅ " + today() + "\n",
    );
  });

  it("leaves out the cards of a board known by its front matter", async () => {
    const { tools } = indexed({ "Plan.md": "- [ ] Write\n", "Board.md": "---\nkanban-plugin: board\n---\n\n## To do\n\n- [ ] Card\n" });
    expect((await tools.get("list_tasks")!({})).tasks.map((t: { text: string }) => t.text)).toEqual(["Write"]);
  });
});

describe("a ```tasks block", () => {
  const files = (): Record<string, string> => ({
    "Work/Plan.md": "- [ ] Call ⏫ 📅 2099-11-20\n- [/] Draft 📅 2099-11-09\n- [x] Shipped ✅ 2026-11-02\n",
    "Home.md": "- [ ] Rent 📅 " + today(-1) + " #home\n- [-] Old\n",
  });

  it("lists the tasks its query picks, grouped, with what it left out", async () => {
    const { block } = indexed(files());
    const { webview, last } = await drawBlock(block().render, "not done\ngroup by path\nsort by priority\nhide edit button\nfilter by function x");
    expect(webview.html).toContain("block.js");
    expect(last().count).toBe("query.count.other 3");
    expect(last().unsupported).toBe("query.unsupported filter by function x");
    expect(last().groups.map((g: Any) => g.names)).toEqual([["Home"], ["Work/Plan"]]);
    expect(last().groups[1].tasks.map((t: Any) => [t.description, t.status, t.priority])).toEqual([
      ["Call", "todo", "⏫"],
      ["Draft", "in_progress", ""],
    ]);
    expect(last().groups[0].tasks[0]).toMatchObject({ description: "Rent #home", file: "Home", tone: "danger" });
  });

  it("names a group without a date, and says how many of how many it shows", async () => {
    const { block } = indexed(files());
    expect((await drawBlock(block().render, "limit 2")).last().count).toBe("query.count.other 5 · query.shown 2");
    const grouped = (await drawBlock(block().render, "group by due")).last().groups;
    expect(grouped[grouped.length - 1].names).toEqual(["query.noDate"]);
  });

  it("ticks a task in its file, and opens it at its line", async () => {
    const f = files();
    const { block, opened } = indexed(f);
    const { last, say } = await drawBlock(block().render, "path includes Plan\nnot done");
    const call = last().groups[0].tasks.find((t: Any) => t.description === "Call");
    await say({ type: "check", path: call.path, line: call.line, text: call.text, done: true });
    expect(f["Work/Plan.md"].split("\n")[0]).toBe("- [x] Call ⏫ 📅 2099-11-20 ✅ " + today());
    expect(last().groups[0].tasks.map((t: Any) => t.description)).toEqual(["Draft"]);
    await say({ type: "open", path: call.path, line: call.line });
    expect(opened).toEqual([{ path: "/root/Work/Plan.md", line: 0 }]);
  });
});
