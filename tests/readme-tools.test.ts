import { expect, it } from "vitest";
import { changesOf, strayVersions, toolSection, withChanges, withSection } from "../scripts/readme-tools.mjs";

/** The README section listing a plugin's tools for Textus AI (scripts/readme-tools.mjs). */
const manifest = {
  contributes: {
    aiTools: [{ name: "count_words", description: "%tool.count%" }],
  },
  l10n: {
    en: { "tool.count": "Counts words." },
    zh: { "tool.count": "统计字数。" },
  },
};

it("lists the tools in the README's language, falling back to English", () => {
  expect(toolSection(manifest, "zh")).toContain("- `count_words`：统计字数。");
  expect(toolSection(manifest, "de")).toContain("## Werkzeuge für Textus AI");
  expect(toolSection(manifest, "de")).toContain(
    "- `count_words`: Counts words.",
  );
  expect(toolSection({ contributes: {} }, "en")).toBe("");
});

it("replaces its own section and leaves the rest of the README alone", () => {
  const once = withSection("# Stats\n\nCounts.\n", toolSection(manifest, "en"));
  expect(withSection(once, toolSection(manifest, "en"))).toBe(once);
  expect(withSection(once, "")).toBe("# Stats\n\nCounts.\n");
  expect(withSection("# Plain\n", "")).toBe("# Plain\n");
});

it("puts the English README's changes, in English, under each language's heading", () => {
  const english = "# Stats\n\nCounts.\n\n## Changes\n\n- **0.2.0** - Counts pages.\n- **0.1.0** - First.\n";
  const list = changesOf(english);
  expect(list).toBe("- **0.2.0** - Counts pages.\n- **0.1.0** - First.");
  const zh = "# 统计\n\n统计字数。\n\n## 更新日志\n\n- **0.1.0** - 第一版。\n\n<!-- ai-tools -->\n## Textus AI 工具\n<!-- /ai-tools -->\n";
  expect(withChanges(zh, "zh", list)).toBe(
    "# 统计\n\n统计字数。\n\n## 更新日志\n\n- **0.2.0** - Counts pages.\n- **0.1.0** - First.\n\n<!-- ai-tools -->\n## Textus AI 工具\n<!-- /ai-tools -->\n",
  );
  expect(withChanges(english, "en", list)).toBe(english);
  // A README without the heading gets one, before its tools.
  expect(withChanges("# Statistik\n\nZählt.\n", "de", list)).toBe(
    "# Statistik\n\nZählt.\n\n## Änderungen\n\n- **0.2.0** - Counts pages.\n- **0.1.0** - First.\n",
  );
});

it("finds a version's line outside the Changes section", () => {
  const misplaced = "# Wiki\n\n## Pages\n\n- **0.8.3** - Late.\n\n## Changes\n\n- **0.7.7** - Older.\n";
  expect(strayVersions(misplaced, "en")).toEqual(["- **0.8.3** - Late."]);
  expect(strayVersions("# Wiki\n\n## Changes\n\n- **0.7.7** - Older.\n", "en")).toEqual([]);
});
