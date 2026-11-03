import { expect, it } from "vitest";
import { toolSection, withSection } from "../scripts/readme-tools.mjs";

/** The README section listing a plugin's tools for Textus AI (scripts/readme-tools.mjs). */
const manifest = {
  contributes: { aiTools: [{ name: "count_words", description: "%tool.count%" }] },
  l10n: { en: { "tool.count": "Counts words." }, zh: { "tool.count": "统计字数。" } },
};

it("lists the tools in the README's language, falling back to English", () => {
  expect(toolSection(manifest, "zh")).toContain("- `count_words`：统计字数。");
  expect(toolSection(manifest, "de")).toContain("## Werkzeuge für Textus AI");
  expect(toolSection(manifest, "de")).toContain("- `count_words`: Counts words.");
  expect(toolSection({ contributes: {} }, "en")).toBe("");
});

it("replaces its own section and leaves the rest of the README alone", () => {
  const once = withSection("# Stats\n\nCounts.\n", toolSection(manifest, "en"));
  expect(withSection(once, toolSection(manifest, "en"))).toBe(once);
  expect(withSection(once, "")).toBe("# Stats\n\nCounts.\n");
  expect(withSection("# Plain\n", "")).toBe("# Plain\n");
});
