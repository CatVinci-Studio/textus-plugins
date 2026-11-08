import { describe, expect, it, vi } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Reminders' tools for Textus AI (plugins/catvinci.reminders/host.js). */
describe("reminders' tools", () => {
  it("list the coming reminders, soonest first", async () => {
    const files = {
      "Plan.md":
        "# Plan\n\n- [ ] Call (@2999-01-02 10:30)\n- [ ] Old (@2000-01-01)\n",
      "Home.md": "Water the plants (@2999-01-01)\n",
    };
    const { tools } = loadPlugin("catvinci.reminders", {
      files: folder(files),
    });
    expect(await tools.get("list_reminders")!({})).toEqual({
      reminders: [
        {
          when: "2999-01-01 09:00",
          text: "Water the plants",
          path: "Home.md",
          line: 1,
        },
        { when: "2999-01-02 10:30", text: "Call", path: "Plan.md", line: 3 },
      ],
    });
  });

  it("add one to the end of the document in front", async () => {
    const edit = vi.fn(async () => true);
    const { tools } = loadPlugin("catvinci.reminders", { editor: { edit } });
    expect(
      await tools.get("add_reminder")!({
        text: "Send it",
        when: "2999-03-04 8:05",
      }),
    ).toEqual({
      added: "- [ ] Send it (@2999-03-04 08:05)",
      past: false,
    });
    expect(edit).toHaveBeenCalledWith({
      action: "append",
      text: "- [ ] Send it (@2999-03-04 08:05)",
    });
    expect(
      await tools.get("add_reminder")!({ text: "x", when: "tomorrow" }),
    ).toHaveProperty("error");
  });
});
