import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Templates (plugins/catvinci.templates/host.js): templates are files in
 *  the open folder's templates folder. */
function setup(
  files: Record<string, string>,
  stored: Record<string, string> = {},
) {
  const notices: string[] = [];
  const f = {
    ...folder(files),
    find: async (glob: string) => folder(files).find(glob),
  };
  const loaded = loadPlugin(
    "catvinci.templates",
    { files: f, ui: { notice: (text: string) => void notices.push(text) } },
    memoryStorage(stored),
  );
  return { tools: loaded.tools, notices };
}

describe("templates", () => {
  it("lists the folder's templates and makes a document from one, filled in", async () => {
    const files: Record<string, string> = {
      "Templates/Weekly.md": "# {{title}}\n\nWritten {{date}}.\n",
    };
    const { tools } = setup(files);
    expect(await tools.get("list_templates")!({})).toEqual({
      folder: "Templates",
      templates: [
        { name: "Weekly", text: "# {{title}}\n\nWritten {{date}}.\n" },
      ],
    });
    const made = await tools.get("create_from_template")!({
      template: "weekly",
      title: "Week 45",
      folder: "Reviews",
    });
    expect(made).toEqual({ path: "Reviews/Week 45.md", template: "Weekly" });
    expect(files["Reviews/Week 45.md"]).toMatch(
      /^# Week 45\n\nWritten \d{4}-\d{2}-\d{2}\.\n$/,
    );
    expect(
      (
        await tools.get("create_from_template")!({
          template: "Daily",
          title: "x",
        })
      ).error,
    ).toContain("Weekly");
    expect(
      await tools.get("create_from_template")!({
        template: "Weekly",
        title: "Week 45",
        folder: "Reviews",
      }),
    ).toHaveProperty("error");
  });

  it("uses an Obsidian vault's templates folder, and Moment formats", async () => {
    const files: Record<string, string> = {
      ".obsidian/templates.json": '{"folder":"Meta/Tpl"}',
      "Meta/Tpl/Day.md": "{{date:YYYY}} [{{date:[Week] MM}}]",
      "Templates/Other.md": "not this one",
    };
    const { tools } = setup(files);
    const list = await tools.get("list_templates")!({});
    expect(list.folder).toBe("Meta/Tpl");
    expect(list.templates.map((x: { name: string }) => x.name)).toEqual([
      "Day",
    ]);
    await tools.get("create_from_template")!({ template: "Day", title: "D" });
    expect(files["D.md"]).toMatch(/^\d{4} \[Week \d{2}\]$/);
    expect(files[".obsidian/templates.json"]).toBe('{"folder":"Meta/Tpl"}');
  });

  it("moves stored templates into the folder once, numbering clashes, overwriting nothing", async () => {
    const files: Record<string, string> = { "Templates/Weekly.md": "mine" };
    const stored = {
      "Weekly.md": "stored weekly",
      "Same.md": "same",
      "Plan.md": "plan",
    };
    files["Templates/Same.md"] = "same";
    const { tools, notices } = setup(files, stored);
    await tools.get("list_templates")!({});
    expect(files).toEqual({
      "Templates/Weekly.md": "mine",
      "Templates/Weekly 2.md": "stored weekly",
      "Templates/Same.md": "same",
      "Templates/Plan.md": "plan",
    });
    expect(notices).toHaveLength(1);
    expect(notices[0]).toContain("Templates");
    delete files["Templates/Plan.md"];
    await tools.get("list_templates")!({});
    expect(files["Templates/Plan.md"]).toBeUndefined();
    expect(notices).toHaveLength(1);
  });
});
