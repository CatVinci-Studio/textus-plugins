import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Natural Dates' tool for Textus AI (plugins/catvinci.natural-dates/host.js). */
it("turns a day in words into its date, from a given today", async () => {
  const { tools } = loadPlugin("catvinci.natural-dates");
  const parse = (phrase: string) => tools.get("parse_date")!({ phrase, today: "2026-10-28" });
  expect(await parse("Next Wednesday")).toEqual({ phrase: "Next Wednesday", date: "2026-11-04" });
  expect(await parse("@下周五")).toMatchObject({ date: "2026-11-06" });
  expect(await parse("in 12 days")).toMatchObject({ date: "2026-11-09" });
  expect(await parse("12天后")).toMatchObject({ date: "2026-11-09" });
  const unknown = await parse("tomorrow-ish");
  expect(unknown).toHaveProperty("error");
  expect(unknown.suggestions[0]).toEqual({ phrase: "tomorrow", date: "2026-10-29" });
});

/** The @ completion: where it opens (the manifest's pattern, as Textus
 *  compiles it) and what it writes. */
it("opens after a space or bracket only, and keeps a reminder's @", async () => {
  let provider: { provideCompletions(c: unknown): Promise<{ insert: string }[]> } | null = null;
  const { manifest } = loadPlugin("catvinci.natural-dates", {
    editor: { registerCompletion: (_id: string, p: typeof provider) => ((provider = p), { dispose() {} }) },
  });
  const pattern = new RegExp(`(?:${manifest.contributes.completions[0].pattern})$`, "u");
  const match = (text: string) => pattern.exec(text)?.[0] ?? null;
  expect(match("交报告 @tom")).toBe("@tom");
  expect(match("@tom")).toBe("@tom");
  expect(match("交报告 (@tom")).toBe("@tom");
  expect(match("email me@to")).toBeNull();
  expect(match("see [@to")).toBeNull();
  const ask = (text: string) => provider!.provideCompletions({ text, match: match(text), inMath: false });
  expect((await ask("交报告 (@tomorrow"))[0].insert).toMatch(/^@\d{4}-\d{2}-\d{2}$/);
  expect((await ask("交报告 @tomorrow"))[0].insert).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
