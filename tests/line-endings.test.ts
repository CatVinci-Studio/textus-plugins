import { expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Tasks and Backlinks change one line of a file and leave every other
 *  byte - each line's own CRLF or LF - as it was. */
const mixed = "# Plan\r\n\r\n- [ ] One\n- [ ] Two\r\nSee Ideas here.\nend";

function tasks(files: Record<string, string>) {
  let list: { onCheck: (item: unknown, checked: boolean) => Promise<void> } | null = null;
  const views = { registerList: (_id: string, p: typeof list) => ((list = p), { setMessage() {}, refresh() {}, dispose() {} }) };
  const { tools } = loadPlugin("catvinci.tasks", { files: folder(files), views });
  return { tools, check: (data: unknown, done: boolean) => list!.onCheck({ data }, done) };
}

it("Tasks ticks a task without touching other lines' endings", async () => {
  const files = { "Plan.md": mixed };
  const { tools, check } = tasks(files);
  await tools.get("complete_task")!({ path: "Plan.md", line: 3 });
  expect(files["Plan.md"]).toBe(mixed.replace("- [ ] One", "- [x] One"));
  await check({ path: "/root/Plan.md", line: 3, text: "Two" }, true);
  expect(files["Plan.md"]).toBe(mixed.replace("- [ ] One", "- [x] One").replace("- [ ] Two", "- [x] Two"));
});

it("Tasks adds a task with its neighbours' ending, the rest byte for byte", async () => {
  const files = { "Plan.md": "# Plan\r\n\r\n- [ ] One\r\nNotes\nend" };
  const { tools } = tasks(files);
  await tools.get("add_task")!({ path: "Plan.md", text: "Two" });
  expect(files["Plan.md"]).toBe("# Plan\r\n\r\n- [ ] One\r\nNotes\nend\n\n- [ ] Two");
  const crlf = { "Plan.md": "## Today\r\n\r\n- [ ] One\r\n" };
  await tasks(crlf).tools.get("add_task")!({ path: "Plan.md", text: "Two", heading: "Today" });
  expect(crlf["Plan.md"]).toBe("## Today\r\n\r\n- [ ] One\r\n- [ ] Two\r\n");
});

it("Backlinks links a mention without touching other lines' endings", async () => {
  const files = { "Log.md": mixed, "Ideas.md": "# Ideas\n" };
  let link: ((m: unknown) => Promise<void>) | null = null;
  const commands = { register: (_id: string, fn: typeof link) => ((link = fn), { dispose() {} }) };
  loadPlugin("catvinci.backlinks", { files: folder(files), commands });
  await link!({ path: "/root/Log.md", line: 4, text: "See Ideas here.", name: "Ideas", to: "/root/Ideas.md" });
  expect(files["Log.md"]).toBe(mixed.replace("See Ideas here.", "See [[Ideas]] here."));
});
