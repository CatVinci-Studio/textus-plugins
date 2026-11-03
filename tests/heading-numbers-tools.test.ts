import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** Heading Numbers' tool for Textus AI (plugins/catvinci.heading-numbers/host.js). */
it("numbers headings as the editor does, again over old numbers, or takes them out", async () => {
  const { tools } = loadPlugin("catvinci.heading-numbers");
  const number = tools.get("number_headings")!;
  const text = "# Title\n\n## Intro\n\n```\n## not a heading\n```\n\n## 7 Methods\n\n### Data\n\n## 2026 plans";
  const numbered = "# Title\n\n## 1 Intro\n\n```\n## not a heading\n```\n\n## 2 Methods\n\n### 2.1 Data\n\n## 3 2026 plans";
  expect(await number({ text })).toEqual({ text: numbered });
  expect(await number({ text: numbered })).toEqual({ text: numbered });
  expect((await number({ text: numbered, remove: true })).text).toBe(
    "# Title\n\n## Intro\n\n```\n## not a heading\n```\n\n## Methods\n\n### Data\n\n## 2026 plans",
  );
});
