import { beforeAll, describe, expect, it } from "vitest";

/** Tasks' reading and writing of Obsidian Tasks' lines and its ```tasks
 *  queries (plugins/catvinci.tasks/obsidian-tasks.js, query.js). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ot: any, tq: any, order: any;

beforeAll(async () => {
  await import(/* @vite-ignore */ "../shared/text-lines.js");
  for (const file of ["obsidian-tasks.js", "task-order.js", "query.js"])
    await import(/* @vite-ignore */ "../plugins/catvinci.tasks/" + file);
  const g = globalThis as unknown as {
    obsidianTasks: unknown;
    tasksQuery: unknown;
    taskOrder: unknown;
  };
  ot = g.obsidianTasks;
  tq = g.tasksQuery;
  order = g.taskOrder;
});

// A Saturday.
const TODAY = "2026-11-07";

describe("a task line", () => {
  it("reads Obsidian Tasks' statuses: [/] is open, [-] is not", () => {
    const status = (line: string) => [
      ot.parse(line).status,
      ot.parse(line).open,
    ];
    expect(status("- [ ] a")).toEqual(["todo", true]);
    expect(status("- [/] a")).toEqual(["in_progress", true]);
    expect(status("- [x] a")).toEqual(["done", false]);
    expect(status("- [X] a")).toEqual(["done", false]);
    expect(status("- [-] a")).toEqual(["cancelled", false]);
    expect(status("- [?] a")).toEqual(["todo", true]);
    expect(ot.parse("Not a task")).toBeNull();
  });

  it("reads the fields at the end of the line, the text without them", () => {
    const task = ot.parse(
      "- [ ] Write the report #work ⏫ 🔁 every week ➕ 2026-11-01 🛫 2026-11-02 ⏳ 2026-11-03 📅 2026-11-04 ^abc123",
    );
    expect(task).toMatchObject({
      description: "Write the report #work",
      priority: "high",
      recurrence: "every week",
      created: "2026-11-01",
      start: "2026-11-02",
      scheduled: "2026-11-03",
      due: "2026-11-04",
      tags: ["#work"],
    });
    expect(ot.parse("- [x] Read ✅ 2026-11-05 #home").description).toBe(
      "Read #home",
    );
    expect(ot.parse("- [-] Old ❌ 2026-11-05").cancelled).toBe("2026-11-05");
    expect(ot.parse("- [ ] Plain due:2026-11-09 here").due).toBe("2026-11-09");
    // A field in the middle of the text is text, as in Obsidian Tasks.
    expect(ot.parse("- [ ] Meet 📅 2026-11-09 with Ann").description).toBe(
      "Meet 📅 2026-11-09 with Ann",
    );
  });

  it("writes the done date when ticked and takes it off when opened", () => {
    expect(ot.setDone("- [ ] Write 📅 2026-11-09", true, TODAY).lines).toEqual([
      "- [x] Write 📅 2026-11-09 ✅ 2026-11-07",
    ]);
    expect(ot.setDone("  * [/] Write ^id1", true, TODAY).lines).toEqual([
      "  * [x] Write ✅ 2026-11-07 ^id1",
    ]);
    expect(ot.setDone("- [x] Write ✅ 2026-11-01", false, TODAY).lines).toEqual(
      ["- [ ] Write"],
    );
    expect(ot.setDone("- [-] Old ❌ 2026-11-01", false, TODAY).lines).toEqual([
      "- [ ] Old",
    ]);
    expect(ot.setDone("- [x] Done ✅ 2026-11-01", true, TODAY).lines).toEqual([
      "- [x] Done ✅ 2026-11-01",
    ]);
    expect(ot.setDone("plain", true, TODAY)).toBeNull();
  });

  it("puts a recurring task's next occurrence above it, its dates moved together", () => {
    const r = ot.setDone(
      "- [ ] Water 🔁 every week ⏳ 2026-11-03 📅 2026-11-05 ➕ 2026-10-01 ^w",
      true,
      TODAY,
    );
    expect(r.lines).toEqual([
      "- [ ] Water 🔁 every week ⏳ 2026-11-10 📅 2026-11-12",
      "- [x] Water 🔁 every week ⏳ 2026-11-03 📅 2026-11-05 ➕ 2026-10-01 ✅ 2026-11-07 ^w",
    ]);
    // "when done": from the day it is ticked.
    expect(
      ot.setDone(
        "- [ ] Cut hair 🔁 every 4 weeks when done 📅 2026-10-01",
        true,
        TODAY,
      ).next,
    ).toBe("- [ ] Cut hair 🔁 every 4 weeks when done 📅 2026-12-05");
    // No dates: the same task again; a rule not understood: just ticked.
    expect(ot.setDone("- [ ] Stretch 🔁 every day", true, TODAY).next).toBe(
      "- [ ] Stretch 🔁 every day",
    );
    expect(
      ot.setDone("- [ ] Odd 🔁 every blue moon 📅 2026-11-01", true, TODAY)
        .next,
    ).toBeNull();
  });

  it("knows the common rules", () => {
    const next = (rule: string, due: string) =>
      ot.nextDates({ recurrence: rule, due }, TODAY).due;
    expect(next("every day", "2026-11-07")).toBe("2026-11-08");
    expect(next("every 3 days", "2026-11-07")).toBe("2026-11-10");
    expect(next("every 2 weeks", "2026-11-07")).toBe("2026-11-21");
    expect(next("every month", "2026-01-31")).toBe("2026-02-28");
    expect(next("every 3 months", "2026-11-15")).toBe("2027-02-15");
    expect(next("every year", "2028-02-29")).toBe("2029-02-28");
    expect(next("every weekday", "2026-11-06")).toBe("2026-11-09");
    expect(next("every weekend", "2026-11-07")).toBe("2026-11-08");
    expect(next("every Monday", "2026-11-07")).toBe("2026-11-09");
    expect(next("every tuesday and friday", "2026-11-10")).toBe("2026-11-13");
    expect(next("every week on Monday, Wednesday", "2026-11-09")).toBe(
      "2026-11-11",
    );
    expect(next("every 2 weeks on Monday", "2026-11-09")).toBe("2026-11-23");
    expect(next("every month on the 15th", "2026-11-20")).toBe("2026-12-15");
    expect(next("every month on the 31st", "2027-01-31")).toBe("2027-03-31");
    expect(next("every month on the last", "2026-11-30")).toBe("2026-12-31");
    expect(ot.rule("every fortnight")).toBeNull();
  });
});

describe("a ```tasks query", () => {
  const task = (
    line: string,
    rel = "Plan.md",
    n = 0,
    heading: string | null = null,
  ) => ({
    ...ot.parse(line),
    rel,
    path: "/root/" + rel,
    line: n,
    heading,
  });
  const tasks = () => [
    task("- [ ] Pay rent 📅 2026-11-01 #home", "Home.md", 0),
    task("- [/] Draft 🔼 📅 2026-11-09", "Work/Plan.md", 1, "This week"),
    task("- [ ] Call ⏫ 📅 2026-11-20", "Work/Plan.md", 2, "Later"),
    task("- [ ] Someday #idea", "Ideas.md", 0),
    task("- [x] Shipped 📅 2026-11-02 ✅ 2026-11-03", "Work/Plan.md", 3),
    task("- [-] Dropped 📅 2026-11-08", "Work/Plan.md", 4),
  ];
  const run = (source: string) => {
    const q = tq.parse(source, TODAY);
    const r = tq.run(q, tasks());
    return {
      q,
      r,
      names: r.groups.flatMap((g: { tasks: { description: string }[] }) =>
        g.tasks.map((t) => t.description),
      ),
    };
  };

  it("filters by status and dates", () => {
    expect(run("not done").names).toEqual([
      "Pay rent #home",
      "Draft",
      "Call",
      "Someday #idea",
    ]);
    expect(run("done").names).toEqual(["Shipped", "Dropped"]);
    expect(run("due before today").names).toEqual([
      "Pay rent #home",
      "Shipped",
    ]);
    expect(run("not done\ndue after 2026-11-09").names).toEqual(["Call"]);
    expect(run("due on 2026-11-09").names).toEqual(["Draft"]);
    expect(run("due on or before 2026-11-02").names).toEqual([
      "Pay rent #home",
      "Shipped",
    ]);
    expect(run("due today").names).toEqual([]);
    expect(run("due tomorrow").names).toEqual(["Dropped"]);
    // The week from Monday 2 November to Sunday 8 November.
    expect(run("due this week").names).toEqual(["Shipped", "Dropped"]);
    expect(run("due next week").names).toEqual(["Draft"]);
    expect(run("no due date").names).toEqual(["Someday #idea"]);
    expect(run("done on 2026-11-03").names).toEqual(["Shipped"]);
  });

  it("filters by path, tag, priority and words", () => {
    expect(run("path includes work\nnot done").names).toEqual([
      "Draft",
      "Call",
    ]);
    expect(run("path does not include Work").names).toEqual([
      "Pay rent #home",
      "Someday #idea",
    ]);
    expect(run("tag includes #home").names).toEqual(["Pay rent #home"]);
    expect(run("tags do not include #home\nnot done").names).toEqual([
      "Draft",
      "Call",
      "Someday #idea",
    ]);
    expect(run("priority is high").names).toEqual(["Call"]);
    expect(run("priority is above none").names).toEqual(["Draft", "Call"]);
    expect(run("description includes RENT").names).toEqual(["Pay rent #home"]);
  });

  it("sorts, limits and groups", () => {
    expect(run("not done\nsort by priority").names).toEqual([
      "Call",
      "Draft",
      "Pay rent #home",
      "Someday #idea",
    ]);
    expect(run("not done\nsort by due reverse").names).toEqual([
      "Someday #idea",
      "Call",
      "Draft",
      "Pay rent #home",
    ]);
    const limited = run("not done\nlimit 2");
    expect(limited.names).toEqual(["Pay rent #home", "Draft"]);
    expect(limited.r.total).toBe(4);
    const byPath = run("not done\ngroup by path");
    expect(byPath.r.groups.map((g: { names: string[] }) => g.names)).toEqual([
      ["Home"],
      ["Ideas"],
      ["Work/Plan"],
    ]);
    const byDue = run("not done\ngroup by due");
    expect(byDue.r.groups.map((g: { names: string[] }) => g.names[0])).toEqual([
      "2026-11-01",
      "2026-11-09",
      "2026-11-20",
      "",
    ]);
    // Status groups as Obsidian Tasks lists them, not by name.
    expect(
      run("group by status").r.groups.map(
        (g: { names: string[] }) => g.names[0],
      ),
    ).toEqual(["todo", "in_progress", "done", "cancelled"]);
  });

  it("passes over how the list looks, and gives back what it doesn't understand", () => {
    const { q, names } = run(
      "not done\nhide edit button\nshort mode\n# a comment\n\n(due today) OR (no due date)\nfilter by function task.urgency > 5",
    );
    expect(names).toHaveLength(4);
    expect(q.unsupported).toEqual([
      "(due today) OR (no due date)",
      "filter by function task.urgency > 5",
    ]);
    expect(run("due before someday").q.unsupported).toEqual([
      "due before someday",
    ]);
  });
});

describe("finished tasks last", () => {
  it("puts a list's finished tasks after its open ones, each with what is under it", () => {
    const lines = [
      "- [x] a",
      "  - [ ] a1",
      "- [ ] b",
      "- [-] c",
      "- [ ] d",
      "  - [x] d1",
      "  - [ ] d2",
    ];
    expect(order.orderList(lines)).toEqual([
      "- [ ] b",
      "- [ ] d",
      "  - [ ] d2",
      "  - [x] d1",
      "- [x] a",
      "  - [ ] a1",
      "- [-] c",
    ]);
  });

  it("leaves a numbered list and an ordered one as they are", () => {
    const numbered = ["1. [x] a", "2. [ ] b"];
    expect(order.orderList(numbered)).toEqual(numbered);
    expect(order.orderAround("- [ ] a\n- [x] b\n", 0)).toBeNull();
  });

  it("orders only the list around the line ticked", () => {
    const text = "# Day\n\n- [x] a\n- [ ] b\n\nText\n\n- [x] c\n- [ ] d\n";
    const moved = order.orderAround(text, 2);
    expect(moved.text).toBe(
      "# Day\n\n- [ ] b\n- [x] a\n\nText\n\n- [x] c\n- [ ] d\n",
    );
    expect([moved.place(2), moved.place(3), moved.place(8)]).toEqual([3, 2, 8]);
    expect(order.orderAround(text.replace(/\n/g, "\r\n"), 2).text).toBe(
      moved.text.replace(/\n/g, "\r\n"),
    );
    // Mixed endings stay at their places.
    const mixed = "# Day\r\n\n- [x] a\r\n- [ ] b\n";
    expect(order.orderAround(mixed, 2).text).toBe("# Day\r\n\n- [ ] b\r\n- [x] a\n");
  });

  it("tells a tick from other typing", () => {
    expect(order.unticked("- [x] a ✅ 2026-11-08\n- [ ] b")).toBe(
      order.unticked("- [ ] a\n- [ ] b"),
    );
    expect(order.unticked("- [ ] a\n- [ ] b")).not.toBe(
      order.unticked("- [ ] a!\n- [ ] b"),
    );
  });
});
