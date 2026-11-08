import { expect, it } from "vitest";
import { manifestOf } from "./plugin-host";

// Tools that do the same kind of thing say, in every language, which of
// the others to use instead, so the model picks the right one.
const SIBLINGS: [string, string, string[]][] = [
  [
    "catvinci.tasks",
    "add_task",
    ["add_reminder", "add_card", "add_row", "append_to_daily_note"],
  ],
  ["catvinci.tasks", "list_tasks", ["read_board", "list_reminders"]],
  ["catvinci.kanban", "add_card", ["add_task"]],
  ["catvinci.kanban", "read_board", ["list_tasks"]],
  ["catvinci.database", "add_row", ["add_task"]],
  ["catvinci.daily-notes", "append_to_daily_note", ["add_note", "add_task"]],
  ["catvinci.quick-notes", "add_note", ["append_to_daily_note", "add_task"]],
  ["catvinci.reminders", "add_reminder", ["add_task"]],
  ["catvinci.reminders", "list_reminders", ["list_tasks"]],
];

it("says when to use another plugin's tool instead", () => {
  for (const [id, tool, others] of SIBLINGS) {
    const manifest = manifestOf(id);
    const key = manifest.contributes.aiTools
      .find((t: { name: string }) => t.name === tool)
      .description.replace(/^%(.*)%$/, "$1");
    for (const [lang, strings] of Object.entries(manifest.l10n) as [
      string,
      Record<string, string>,
    ][])
      for (const other of others)
        expect(strings[key], `${id} ${tool} ${lang}`).toContain(other);
  }
});
