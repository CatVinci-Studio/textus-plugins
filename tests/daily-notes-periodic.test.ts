import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Calendar & Daily Notes' weekly and monthly notes
 *  (plugins/catvinci.daily-notes/host.js). */
function setup(files: Record<string, string>, settings: Record<string, unknown> = {}) {
  const commands = new Map<string, () => Promise<void>>();
  const opened: unknown[][] = [];
  const messages: string[] = [];
  const posted: Record<string, unknown>[] = [];
  let receive: (m: Record<string, unknown>) => Promise<void> = async () => {};
  loadPlugin("catvinci.daily-notes", {
    files: folder(files),
    settings: { get: async (key: string) => settings[key] },
    commands: { register: (id: string, run: () => Promise<void>) => (commands.set(id, run), { dispose() {} }) },
    layout: { open: async (...args: unknown[]) => void opened.push(args) },
    ui: { message: async (text: string) => void messages.push(text) },
    views: {
      registerWebview: (_id: string, view: { resolve: (w: unknown) => Promise<void> }) =>
        view.resolve({
          postMessage: (m: Record<string, unknown>) => posted.push(m),
          onDidDispose: () => ({ dispose() {} }),
          onDidReceiveMessage: (f: typeof receive) => ((receive = f), { dispose() {} }),
        }),
    },
  });
  return { commands, opened, messages, posted, send: (m: Record<string, unknown>) => receive(m) };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 5, 9, 30));
});
afterEach(() => vi.useRealTimers());

describe("weekly and monthly notes", () => {
  it("are off until turned on", async () => {
    const files: Record<string, string> = {};
    const { commands, opened, messages } = setup(files);
    await commands.get("catvinci.daily-notes.week")!();
    await commands.get("catvinci.daily-notes.month")!();
    expect(opened).toEqual([]);
    expect(messages).toEqual(["weeklyOff", "monthlyOff"]);
    expect(files).toEqual({});
  });

  it("open this week's and this month's note in a tab, made from their templates", async () => {
    const files: Record<string, string> = {};
    const { commands, opened } = setup(files, {
      weekly: true,
      monthly: true,
      weeklyTemplate: "# {{title}}\\n{{monday:MM-DD}} to {{saturday:MM-DD}}\\n",
      monthlyTemplate: "# {{date:MMMM YYYY}}\\n",
    });
    await commands.get("catvinci.daily-notes.week")!();
    await commands.get("catvinci.daily-notes.month")!();
    expect(files).toEqual({
      "Weekly/2026-W45.md": "# 2026-W45\n11-02 to 11-07\n",
      "Monthly/2026-11.md": "# November 2026\n",
    });
    expect(opened).toEqual([["/root/Weekly/2026-W45.md"], ["/root/Monthly/2026-11.md"]]);
  });

  it("follow their own folder and format settings", async () => {
    const files: Record<string, string> = {};
    const { commands } = setup(files, {
      weekly: true,
      weeklyFolder: "Journal/Weeks/",
      weeklyFormat: "GGGG-[W]WW",
      weeklyTemplate: "",
    });
    await commands.get("catvinci.daily-notes.week")!();
    expect(Object.keys(files)).toEqual(["Journal/Weeks/2026-W45.md"]);
  });

  it("follow the notes a vault's Periodic Notes turns on, the plugin's own settings for the rest", async () => {
    const data = JSON.stringify({
      weekly: { enabled: true, folder: "Periodic/Weeks", format: "YYYY-[w]w", template: "Meta/Week" },
      monthly: { enabled: false, folder: "Periodic/Months", format: "YYYY-MM" },
    });
    const files: Record<string, string> = {
      ".obsidian/plugins/periodic-notes/data.json": data,
      "Meta/Week.md": "Week of {{sunday:YYYY-MM-DD}}\n",
    };
    const { commands, messages } = setup(files, { weekly: false, monthly: true });
    await commands.get("catvinci.daily-notes.week")!();
    await commands.get("catvinci.daily-notes.month")!();
    expect(files["Periodic/Weeks/2026-w45.md"]).toBe("Week of 2026-11-01\n");
    // Months, off in the vault, are on in the plugin's own settings.
    expect(messages).toEqual([]);
    expect(Object.keys(files).some((f) => f.startsWith("Monthly/"))).toBe(true);
    expect(files[".obsidian/plugins/periodic-notes/data.json"]).toBe(data);
  });

  it("open from the calendar's week numbers and month title, which show only when on", async () => {
    const files: Record<string, string> = {};
    const off = setup({});
    await off.send({ type: "ready" });
    expect(off.posted.at(-1)).toMatchObject({ week: null, month: false });

    const on = setup(files, { weekly: true, monthly: true, weeklyFormat: "GGGG-[W]WW" });
    await on.send({ type: "ready" });
    expect(on.posted.at(-1)).toMatchObject({ week: "W", month: true });
    await on.send({ type: "open", date: "2026-12-30", period: "weekly" });
    await on.send({ type: "open", date: "2026-12-01", period: "monthly" });
    expect(on.opened).toEqual([["/root/Weekly/2026-W53.md"], ["/root/Monthly/2026-12.md"]]);
  });
});
