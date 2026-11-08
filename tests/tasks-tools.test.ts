import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Tasks' tools for Textus AI (plugins/catvinci.tasks/host.js). */
function setup(files: Record<string, string>) {
  const f = folder(files);
  const task = (
    text: string,
    line: number,
    done = false,
    due: string | null = null,
    tags: string[] = [],
  ) => ({
    text,
    line,
    done,
    due,
    tags,
  });
  const metadata = {
    all: async () => [
      {
        path: "/root/Plan.md",
        rel: "Plan.md",
        tasks: [
          task("Write 📅 2026-11-03", 2, false, "2026-11-03"),
          task("Read #home", 3, true, null, ["home"]),
        ],
      },
      {
        path: "/root/Home.md",
        rel: "Home.md",
        tasks: [task("Clean #home", 0, false, null, ["home"])],
      },
    ],
  };
  return loadPlugin("catvinci.tasks", { files: f, metadata }).tools;
}

describe("tasks' tools", () => {
  it("list open tasks by default, filtered as asked, lines from 1", async () => {
    const tools = setup({});
    const open = await tools.get("list_tasks")!({});
    expect(open.tasks.map((t: { text: string }) => t.text)).toEqual([
      "Write",
      "Clean #home",
    ]);
    expect(open.tasks[0]).toMatchObject({
      due: "2026-11-03",
      path: "Plan.md",
      line: 3,
    });
    const home = await tools.get("list_tasks")!({
      status: "all",
      tag: "#home",
    });
    expect(home.tasks.map((t: { path: string }) => t.path)).toEqual([
      "Plan.md",
      "Home.md",
    ]);
    const due = await tools.get("list_tasks")!({
      due_before: "2026-11-05",
      path: "Plan",
    });
    expect(due.total).toBe(1);
  });

  it("add a task under a heading, at the end, or in a new document", async () => {
    const files: Record<string, string> = {
      "Plan.md": "# Plan\n\n## Today\n\n- [ ] One\n\n## Later\n\nSome day.\n",
    };
    const tools = setup(files);
    expect(
      await tools.get("add_task")!({
        text: "Two",
        path: "Plan.md",
        heading: "Today",
        due: "2026-11-04",
      }),
    ).toMatchObject({ line: 6 });
    await tools.get("add_task")!({ text: "Three", path: "Plan.md" });
    expect(files["Plan.md"]).toBe(
      "# Plan\n\n## Today\n\n- [ ] One\n- [ ] Two 📅 2026-11-04\n\n## Later\n\nSome day.\n\n- [ ] Three\n",
    );
    await tools.get("add_task")!({
      text: "Four",
      path: "Inbox/New",
      heading: "Inbox",
    });
    expect(files["Inbox/New.md"]).toBe("## Inbox\n\n- [ ] Four\n");
    expect(
      await tools.get("add_task")!({ text: "x", path: "../out.md" }),
    ).toHaveProperty("error");
  });

  it("tick off a task by its line, and refuse a line that isn't one", async () => {
    const files: Record<string, string> = {
      "Plan.md": "# Plan\n\n- [ ] One\n",
    };
    const tools = setup(files);
    expect(
      await tools.get("complete_task")!({
        path: "Plan.md",
        line: 3,
        text: "One",
      }),
    ).toMatchObject({ done: true });
    expect(files["Plan.md"]).toBe("# Plan\n\n- [x] One\n");
    await tools.get("complete_task")!({
      path: "Plan.md",
      line: 3,
      done: false,
    });
    expect(files["Plan.md"]).toBe("# Plan\n\n- [ ] One\n");
    expect(
      await tools.get("complete_task")!({ path: "Plan.md", line: 1 }),
    ).toHaveProperty("error");
    expect(
      await tools.get("complete_task")!({
        path: "Plan.md",
        line: 3,
        text: "Other",
      }),
    ).toHaveProperty("error");
  });
});

it("leaves a Kanban board's cards to the board, in the panel and the tools", async () => {
  const task = (text: string, line: number) => ({
    text,
    line,
    done: false,
    due: null,
    tags: [],
  });
  const metadata = {
    all: async () => [
      {
        path: "/root/Plan.md",
        rel: "Plan.md",
        headings: [],
        tasks: [task("Write", 0)],
      },
      {
        path: "/root/Work.kanban.md",
        rel: "Work.kanban.md",
        headings: [],
        tasks: [task("Card", 2)],
      },
    ],
  };
  let panel: { items: () => Promise<{ label: string }[]> } | null = null;
  const views = {
    registerList: (_id: string, p: typeof panel) => (
      (panel = p),
      { setMessage() {}, refresh() {}, dispose() {} }
    ),
  };
  const { tools } = loadPlugin("catvinci.tasks", {
    files: { ...folder({}), root: async () => "/root" },
    metadata,
    views,
  });
  expect(
    (await tools.get("list_tasks")!({})).tasks.map(
      (t: { text: string }) => t.text,
    ),
  ).toEqual(["Write"]);
  expect((await panel!.items()).map((i) => i.label)).toEqual(["Write"]);
});
