import { expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Templates' tools for Textus AI (plugins/catvinci.templates/host.js). */
it("lists the templates and makes a document from one, filled in", async () => {
  const files: Record<string, string> = {};
  const storage = memoryStorage({ "Weekly.md": "# {{title}}\n\nWritten {{date}}.\n" });
  const { tools } = loadPlugin("catvinci.templates", { files: folder(files) }, storage);
  expect(await tools.get("list_templates")!({})).toEqual({
    templates: [{ name: "Weekly", text: "# {{title}}\n\nWritten {{date}}.\n" }],
  });
  const made = await tools.get("create_from_template")!({ template: "weekly", title: "Week 45", folder: "Reviews" });
  expect(made).toEqual({ path: "Reviews/Week 45.md", template: "Weekly" });
  expect(files["Reviews/Week 45.md"]).toMatch(/^# Week 45\n\nWritten \d{4}-\d{2}-\d{2}\.\n$/);
  expect((await tools.get("create_from_template")!({ template: "Daily", title: "x" })).error).toContain("Weekly");
  expect(await tools.get("create_from_template")!({ template: "Weekly", title: "Week 45", folder: "Reviews" })).toHaveProperty("error");
});
