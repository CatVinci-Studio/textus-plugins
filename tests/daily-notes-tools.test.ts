import { describe, expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Calendar & Daily Notes' tools for Textus AI (plugins/catvinci.daily-notes/host.js). */
function setup(files: Record<string, string>) {
  const settings = { get: async (key: string) => (key === "folder" ? "Journal" : undefined) };
  return loadPlugin("catvinci.daily-notes", { files: folder(files), settings }).tools;
}

describe("daily notes' tools", () => {
  it("read a day's note, or say there is none", async () => {
    const tools = setup({ "Journal/2026-11-02.md": "# 2026-11-02\n\nRain.\n" });
    expect(await tools.get("read_daily_note")!({ date: "2026-11-02" })).toEqual({
      date: "2026-11-02",
      path: "Journal/2026-11-02.md",
      exists: true,
      text: "# 2026-11-02\n\nRain.\n",
    });
    expect(await tools.get("read_daily_note")!({ date: "2026-11-03" })).toMatchObject({ exists: false, text: null });
    expect(await tools.get("read_daily_note")!({ date: "Monday" })).toHaveProperty("error");
  });

  it("append to a day's note, made from the template when missing", async () => {
    const files: Record<string, string> = { "Journal/2026-11-02.md": "# 2026-11-02\n\n- Rain\n" };
    const tools = setup(files);
    await tools.get("append_to_daily_note")!({ date: "2026-11-02", text: "- Wind" });
    await tools.get("append_to_daily_note")!({ date: "2026-11-02", text: "Calm by night." });
    expect(files["Journal/2026-11-02.md"]).toBe("# 2026-11-02\n\n- Rain\n- Wind\n\nCalm by night.\n");
    await tools.get("append_to_daily_note")!({ date: "2026-11-03", text: "First." });
    expect(files["Journal/2026-11-03.md"]).toBe("# 2026-11-03\n\nFirst.\n");
  });
});
