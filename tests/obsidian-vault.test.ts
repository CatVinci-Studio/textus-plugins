import { beforeAll, expect, it } from "vitest";

/** Moment-style formats from an Obsidian vault's settings (shared/obsidian-vault.js). */
let vault: {
  formatDate: (d: Date, format: string, language?: string) => string;
  parseDate: (text: string, format: string) => string | null;
};

beforeAll(async () => {
  await import("../shared/obsidian-vault.js");
  vault = (globalThis as unknown as { obsidianVault: typeof vault }).obsidianVault;
});

it("writes and reads back the formats daily notes are named by", () => {
  const day = new Date(2026, 10, 2, 9, 5);
  expect(vault.formatDate(day, "YYYY-MM-DD")).toBe("2026-11-02");
  expect(vault.formatDate(day, "YYYY/MM/D [at] HH:mm")).toBe("2026/11/2 at 09:05");
  expect(vault.formatDate(day, "dddd, MMMM D", "en")).toBe("Monday, November 2");
  expect(vault.parseDate("2026/11/2026-11-02", "YYYY/MM/YYYY-MM-DD")).toBe("2026-11-02");
  expect(vault.parseDate("02.11.2026", "DD.MM.YYYY")).toBe("2026-11-02");
  expect(vault.parseDate("2026-02-30", "YYYY-MM-DD")).toBe(null);
  expect(vault.parseDate("notes", "YYYY-MM-DD")).toBe(null);
});
