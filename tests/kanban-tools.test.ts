import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Kanban's tools for Textus AI (plugins/catvinci.kanban/host.js). */
const BOARD = "---\nkanban-plugin: basic\n---\n\n## Todo\n\n- [ ] Write\n- [ ] Read [[Notes]]\n\n## Done\n";

function setup() {
  const files: Record<string, string> = { "Work/Launch.kanban.md": BOARD, "Notes.md": "# Notes\n" };
  const { tools } = loadPlugin("catvinci.kanban", { files: folder(files) });
  return { files, call: (name: string, args: Record<string, unknown> = {}) => tools.get(name)!(args) };
}

describe("kanban's tools", () => {
  it("list the boards and read one", async () => {
    const { call } = setup();
    expect(await call("list_boards")).toEqual({
      boards: [{ path: "Work/Launch.kanban.md", lists: [{ title: "Todo", cards: 2 }, { title: "Done", cards: 0 }] }],
    });
    const board = await call("read_board", { board: "Work/Launch" });
    expect(board.lists[0].cards).toEqual([{ text: "Write", done: false }, { text: "Read [[Notes]]", done: false }]);
    expect(await call("read_board", { board: "Nope" })).toHaveProperty("error");
  });

  it("add a card to a list, named in any case", async () => {
    const { call, files } = setup();
    expect(await call("add_card", { board: "Work/Launch.kanban.md", list: "done", text: "Plan", done: true })).toMatchObject({
      list: "Done",
      position: 1,
    });
    expect(files["Work/Launch.kanban.md"]).toContain("## Done\n\n- [x] Plan\n");
    expect((await call("add_card", { board: "Work/Launch", list: "Later", text: "x" })).error).toContain("Todo, Done");
  });

  it("move a card by some of its words, to a place in a list", async () => {
    const { call, files } = setup();
    expect(await call("move_card", { board: "Work/Launch", card: "read", to: "Done" })).toMatchObject({ from: "Todo", to: "Done" });
    await call("move_card", { board: "Work/Launch", card: "Write", to: "Done", position: 1 });
    expect(files["Work/Launch.kanban.md"]).toBe(
      "---\nkanban-plugin: basic\n---\n\n## Todo\n\n## Done\n\n- [ ] Write\n- [ ] Read [[Notes]]\n",
    );
    expect(await call("move_card", { board: "Work/Launch", card: "Nothing", to: "Todo" })).toHaveProperty("error");
  });
});
