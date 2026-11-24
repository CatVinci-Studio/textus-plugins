import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

it("refuses an official plugin the store can't place in a category", () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  // Beneath the repository, so the copied script resolves its dependencies.
  const fixture = mkdtempSync(join(root, ".official-build-"));
  try {
    for (const dir of ["scripts", "skills", "community", "plugins/jane.notes"])
      mkdirSync(join(fixture, dir), { recursive: true });
    for (const file of ["build.mjs", "community.mjs", "history.mjs", "notices.mjs"])
      copyFileSync(join(root, "scripts", file), join(fixture, "scripts", file));
    const schema = "packages/textus-plugin/textus-plugin.schema.json";
    mkdirSync(join(fixture, "packages/textus-plugin"), { recursive: true });
    copyFileSync(join(root, schema), join(fixture, schema));
    writeFileSync(join(fixture, "libs.json"), "{}");
    writeFileSync(join(fixture, "removed.json"), '{"plugins":[]}');
    const check = (extra: object) => {
      writeFileSync(
        join(fixture, "plugins/jane.notes/textus-plugin.json"),
        JSON.stringify({
          id: "jane.notes",
          name: "Notes",
          version: "1.0.0",
          publisher: "jane",
          description: "Notes.",
          engines: { textus: ">=1.3.0" },
          platforms: ["desktop", "ios"],
          ...extra,
        }),
      );
      return spawnSync(
        process.execPath,
        [join(fixture, "scripts/build.mjs"), "--check"],
        { cwd: fixture, encoding: "utf8" },
      );
    };
    expect(check({}).stderr).toContain("category must be one of notes");
    expect(check({ category: "games" }).status).not.toBe(0);
    expect(check({ category: "notes", needsTextusAi: "yes" }).stderr).toContain(
      "needsTextusAi",
    );
    const ok = check({ category: "notes", needsTextusAi: true });
    expect(ok.status, ok.stderr).toBe(0);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
