import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Calendar & Daily Notes' tools for Textus AI (plugins/catvinci.daily-notes/host.js). */
function setup(files: Record<string, string>) {
  const settings = {
    get: async (key: string) => (key === "folder" ? "Journal" : undefined),
  };
  return loadPlugin("catvinci.daily-notes", { files: folder(files), settings })
    .tools;
}

describe("daily notes' tools", () => {
  it("read a day's note, or say there is none", async () => {
    const tools = setup({ "Journal/2026-11-02.md": "# 2026-11-02\n\nRain.\n" });
    expect(await tools.get("read_daily_note")!({ date: "2026-11-02" })).toEqual(
      {
        date: "2026-11-02",
        path: "Journal/2026-11-02.md",
        exists: true,
        text: "# 2026-11-02\n\nRain.\n",
      },
    );
    expect(
      await tools.get("read_daily_note")!({ date: "2026-11-03" }),
    ).toMatchObject({ exists: false, text: null });
    expect(
      await tools.get("read_daily_note")!({ date: "Monday" }),
    ).toHaveProperty("error");
  });

  it("append to a day's note, made from the template when missing", async () => {
    const files: Record<string, string> = {
      "Journal/2026-11-02.md": "# 2026-11-02\n\n- Rain\n",
    };
    const tools = setup(files);
    await tools.get("append_to_daily_note")!({
      date: "2026-11-02",
      text: "- Wind",
    });
    await tools.get("append_to_daily_note")!({
      date: "2026-11-02",
      text: "Calm by night.",
    });
    expect(files["Journal/2026-11-02.md"]).toBe(
      "# 2026-11-02\n\n- Rain\n- Wind\n\nCalm by night.\n",
    );
    await tools.get("append_to_daily_note")!({
      date: "2026-11-03",
      text: "First.",
    });
    expect(files["Journal/2026-11-03.md"]).toBe("# 2026-11-03\n\nFirst.\n");
  });
});

describe("daily notes in an Obsidian vault, and from Templates", () => {
  const load = (
    files: Record<string, string>,
    settings: Record<string, string> = {},
  ) =>
    loadPlugin("catvinci.daily-notes", {
      files: folder(files),
      settings: { get: async (key: string) => settings[key] },
    }).tools;

  it("follows .obsidian/daily-notes.json: folder, name format and template", async () => {
    const files: Record<string, string> = {
      ".obsidian/daily-notes.json":
        '{"folder":"Journal/","format":"YYYY/MM/YYYY-MM-DD","template":"Meta/Day"}',
      "Meta/Day.md": "# {{title}} ({{date:dddd}})\n",
    };
    const tools = load(files, { folder: "Daily" });
    await tools.get("append_to_daily_note")!({
      date: "2026-11-02",
      text: "Rain.",
    });
    expect(files["Journal/2026/11/2026-11-02.md"]).toBe(
      "# 2026-11-02 (Monday)\n\nRain.\n",
    );
    expect(files[".obsidian/daily-notes.json"]).toContain("Journal/");
    expect(
      await tools.get("read_daily_note")!({ date: "2026-11-02" }),
    ).toMatchObject({
      path: "Journal/2026/11/2026-11-02.md",
      exists: true,
    });
  });

  it("uses a template of the Templates folder the setting names", async () => {
    const files: Record<string, string> = {
      "Templates/Daily.md": "## {{date}}\n\n- [ ] \n",
    };
    const tools = load(files, { template: "Daily" });
    await tools.get("append_to_daily_note")!({
      date: "2026-11-02",
      text: "- [ ] Call",
    });
    expect(files["Daily/2026-11-02.md"]).toBe(
      "## 2026-11-02\n\n- [ ]\n- [ ] Call\n",
    );
  });

  it("fills in the setting's template for the note's day", async () => {
    const files: Record<string, string> = {};
    const tools = load(files, {
      template:
        "# {{date}} {{weekday}}\\n{{yesterday}} {{tomorrow}} {{title}} {{nope}}\\n",
    });
    await tools.get("append_to_daily_note")!({
      date: "2026-03-01",
      text: "Sun.",
    });
    expect(files["Daily/2026-03-01.md"]).toBe(
      "# 2026-03-01 Sunday\n2026-02-28 2026-03-02 2026-03-01 {{nope}}\n\nSun.\n",
    );
  });
});
