import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Templates (plugins/catvinci.templates/host.js): templates are files in
 *  the open folder's templates folder. */
function setup(files: Record<string, string>, stored: Record<string, string> = {}) {
  const notices: string[] = [];
  const f = { ...folder(files), find: async (glob: string) => folder(files).find(glob) };
  const loaded = loadPlugin(
    "catvinci.templates",
    { files: f, ui: { notice: (text: string) => void notices.push(text) } },
    memoryStorage(stored),
  );
  return { tools: loaded.tools, notices };
}

describe("templates", () => {
  it("lists the folder's templates and makes a document from one, filled in", async () => {
    const files: Record<string, string> = { "Templates/Weekly.md": "# {{title}}\n\nWritten {{date}}.\n" };
    const { tools } = setup(files);
    expect(await tools.get("list_templates")!({})).toEqual({
      folder: "Templates",
      templates: [{ name: "Weekly", text: "# {{title}}\n\nWritten {{date}}.\n" }],
    });
    const made = await tools.get("create_from_template")!({ template: "weekly", title: "Week 45", folder: "Reviews" });
    expect(made).toEqual({ path: "Reviews/Week 45.md", template: "Weekly" });
    expect(files["Reviews/Week 45.md"]).toMatch(/^# Week 45\n\nWritten \d{4}-\d{2}-\d{2}\.\n$/);
    expect((await tools.get("create_from_template")!({ template: "Daily", title: "x" })).error).toContain("Weekly");
    expect(await tools.get("create_from_template")!({ template: "Weekly", title: "Week 45", folder: "Reviews" })).toHaveProperty("error");
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
    expect(list.templates.map((x: { name: string }) => x.name)).toEqual(["Day"]);
    await tools.get("create_from_template")!({ template: "Day", title: "D" });
    expect(files["D.md"]).toMatch(/^\d{4} \[Week \d{2}\]$/);
    expect(files[".obsidian/templates.json"]).toBe('{"folder":"Meta/Tpl"}');
  });

  it("moves stored templates into the folder once, numbering clashes, overwriting nothing", async () => {
    const files: Record<string, string> = { "Templates/Weekly.md": "mine" };
    const stored = { "Weekly.md": "stored weekly", "Same.md": "same", "Plan.md": "plan" };
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

describe("templates written for Obsidian", () => {
  it("write {{date}} and {{time}} in the vault's Templates formats", async () => {
    const files: Record<string, string> = {
      ".obsidian/templates.json": '{"folder":"Tpl","dateFormat":"DD.MM.YYYY","timeFormat":"h A"}',
      "Tpl/Day.md": "{{date}} {{time}} {{date:YYYY}}",
    };
    await setup(files).tools.get("create_from_template")!({ template: "Day", title: "D" });
    expect(files["D.md"]).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{1,2} [AP]M \d{4}$/);
  });

  it("fill in Templater's tags, and name the ones left as written", async () => {
    const files: Record<string, string> = {
      "Templates/Note.md": '# <% tp.file.title %>\nIn <% tp.file.folder(true) %>, <% tp.date.now("YYYY") %>\n<% tp.system.prompt("x") %>',
    };
    const made = await setup(files).tools.get("create_from_template")!({ template: "Note", title: "Idea", folder: "Inbox" });
    expect(made.notRun).toEqual(['<% tp.system.prompt("x") %>']);
    expect(files["Inbox/Idea.md"]).toMatch(/^# Idea\nIn Inbox, \d{4}\n<% tp\.system\.prompt\("x"\) %>$/);
  });

  it("puts the caret at tp.file.cursor() in a new document, with one notice for what wasn't run", async () => {
    const files: Record<string, string> = {
      "Templates/Log.md": "# <% tp.file.title %>\n\n<% tp.file.cursor() %>Entry\n<%* run() %> <% tp.web.random_picture() %> <%* run() %>",
    };
    const commands = new Map<string, () => Promise<void>>();
    const notices: string[] = [];
    const revealed: unknown[] = [];
    loadPlugin("catvinci.templates", {
      files: folder(files),
      commands: { register: (id: string, run: () => Promise<void>) => (commands.set(id, run), { dispose() {} }) },
      ui: {
        pick: async (items: { value: string }[]) => items[0].value,
        input: async () => "Monday",
        notice: (text: string) => void notices.push(text),
      },
      layout: { open: async () => {} },
      editor: { getText: async () => files["Monday.md"], reveal: async (place: unknown) => void revealed.push(place) },
    });
    await commands.get("catvinci.templates.new")!();
    expect(files["Monday.md"]).toBe("# Monday\n\nEntry\n<%* run() %> <% tp.web.random_picture() %> <%* run() %>");
    expect(revealed).toEqual([{ line: 2, text: "Entry" }]);
    expect(notices).toEqual(["notRun <%* run() %>  <% tp.web.random_picture() %>"]);
  });
});
