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
