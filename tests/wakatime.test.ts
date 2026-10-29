import { beforeAll, describe, expect, it } from "vitest";

/** WakaTime's heartbeat rules (plugins/catvinci.wakatime/beat.js). */
let wb: {
  due: (last: { path: string; at: number } | null, path: string, now: number, isWrite: boolean) => boolean;
  heartbeat: (path: string, now: number, isWrite: boolean, folder: string | null) => Record<string, unknown>;
  EVERY_MS: number;
};

beforeAll(async () => {
  const script = "../plugins/catvinci.wakatime/beat.js";
  await import(/* @vite-ignore */ script);
  wb = (globalThis as unknown as { wakaBeat: typeof wb }).wakaBeat;
});

describe("WakaTime heartbeats", () => {
  it("sends on a new document, every two minutes on the same one, and on every save", () => {
    const last = { path: "/n/a.md", at: 0 };
    expect(wb.due(null, "/n/a.md", 1000, false)).toBe(true);
    expect(wb.due(last, "/n/a.md", wb.EVERY_MS - 1, false)).toBe(false);
    expect(wb.due(last, "/n/a.md", wb.EVERY_MS, false)).toBe(true);
    expect(wb.due(last, "/n/b.md", 10, false)).toBe(true);
    expect(wb.due(last, "/n/a.md", 10, true)).toBe(true);
  });

  it("describes a writing session, the open folder as its project", () => {
    expect(wb.heartbeat("C:\\notes\\a.md", 1_700_000_000_000, true, "C:\\notes\\")).toEqual({
      entity: "C:\\notes\\a.md",
      type: "file",
      category: "writing docs",
      time: 1_700_000_000,
      is_write: true,
      language: "Markdown",
      project: "notes",
    });
    expect(wb.heartbeat("/a.md", 0, false, null)).not.toHaveProperty("project");
  });
});
