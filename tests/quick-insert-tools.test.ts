import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

type Provider = { provideCompletions(c: unknown): Promise<{ insert: string; detail: string }[]> };

/** Quick Insert's @ dates and their tool for Textus AI
 *  (plugins/catvinci.quick-insert/host.js). */
function setup(api: Record<string, unknown> = {}) {
  const providers = new Map<string, Provider>();
  const { tools, manifest } = loadPlugin("catvinci.quick-insert", {
    ...api,
    editor: { registerCompletion: (id: string, p: Provider) => (providers.set(id, p), { dispose() {} }) },
  });
  const at = manifest.contributes.completions.find((c: { id: string }) => c.id === "catvinci.quick-insert.at");
  const pattern = new RegExp(`(?:${at.pattern})$`, "u");
  const match = (text: string) => pattern.exec(text)?.[0] ?? null;
  const ask = (text: string) =>
    providers.get("catvinci.quick-insert.at")!.provideCompletions({ text, match: match(text), inMath: false });
  return { tools, match, ask };
}

it("turns a day in words into its date, from a given today", async () => {
  const parse = (phrase: string) => setup().tools.get("parse_date")!({ phrase, today: "2026-10-28" });
  expect(await parse("Next Wednesday")).toEqual({ phrase: "Next Wednesday", date: "2026-11-04" });
  expect(await parse("@下周五")).toMatchObject({ date: "2026-11-06" });
  expect(await parse("in 12 days")).toMatchObject({ date: "2026-11-09" });
  expect(await parse("12天后")).toMatchObject({ date: "2026-11-09" });
  const unknown = await parse("tomorrow-ish");
  expect(unknown).toHaveProperty("error");
  expect(unknown.suggestions[0]).toEqual({ phrase: "tomorrow", date: "2026-10-29" });
});

/** Where the @ completion opens (the manifest's pattern, as Textus
 *  compiles it) and what it writes. */
it("opens after a space or bracket only, and keeps a reminder's @", async () => {
  const { match, ask } = setup();
  expect(match("交报告 @tom")).toBe("@tom");
  expect(match("@tom")).toBe("@tom");
  expect(match("交报告 (@tom")).toBe("@tom");
  expect(match("email me@to")).toBeNull();
  expect(match("see [@to")).toBeNull();
  expect((await ask("交报告 (@tomorrow"))[0].insert).toMatch(/^@\d{4}-\d{2}-\d{2}$/);
  expect((await ask("交报告 @tomorrow"))[0].insert).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

describe("an @ date as a link", () => {
  const linkFor = async (files: Record<string, string>) => {
    const { ask } = setup({ files: folder(files), settings: { get: async () => "link" } });
    const [picked] = await ask("Due @today");
    const [y, m, d] = picked.detail.split("-").map(Number);
    return { insert: picked.insert, day: new Date(y, m - 1, d) };
  };

  it("names the day's note as the vault's daily notes do", async () => {
    const plain = await linkFor({});
    expect(plain.insert).toBe(`[[${(await setup().ask("@today"))[0].detail}]]`);
    expect((await linkFor({ ".obsidian/app.json": "{}" })).insert).toBe(plain.insert);
    const named = await linkFor({ ".obsidian/daily-notes.json": '{"folder":"Journal","format":"MMMM Do, YYYY"}' });
    expect(named.insert).toMatch(/^\[\[[A-Z][a-z]+ \d{1,2}(st|nd|rd|th), \d{4}\]\]$/);
    // A name format that makes folders: the link is the folder's to write.
    const nested = await linkFor({ ".obsidian/daily-notes.json": '{"folder":"Journal","format":"YYYY/MM/YYYY-MM-DD"}' });
    const y = nested.day.getFullYear();
    const mm = String(nested.day.getMonth() + 1).padStart(2, "0");
    expect(nested.insert).toMatch(new RegExp(`^\\[\\[${y}-${mm}-\\d{2}\\]\\]$`));
  });
});

/** Natural Dates (plugins/catvinci.natural-dates) is now only a notice. */
it("Natural Dates offers Quick Insert once", async () => {
  const offers: unknown[] = [];
  const storage = memoryStorage();
  const load = () =>
    loadPlugin(
      "catvinci.natural-dates",
      { commands: { execute: async (_id: string, args: unknown) => (offers.push(args), true) } },
      storage,
    );
  const { manifest } = load();
  await new Promise((r) => setTimeout(r, 0));
  load();
  await new Promise((r) => setTimeout(r, 0));
  expect(offers).toEqual([{ id: "catvinci.quick-insert", reason: "merged" }]);
  expect(manifest.contributes).toEqual({});
  expect(manifest.permissions).toEqual([]);
});
