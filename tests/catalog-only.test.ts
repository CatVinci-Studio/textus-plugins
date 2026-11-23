import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { sameButCatalogOnly } from "../scripts/catalog-only.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = (extra: object = {}) =>
  JSON.stringify({ id: "jane.notes", version: "1.0.0", main: "host.js", ...extra }, null, 2);

describe("manifest keys only the catalog reads", () => {
  it("make no difference to the package, whatever else does", () => {
    expect(sameButCatalogOnly(manifest(), manifest({ category: "notes" }))).toBe(true);
    expect(
      sameButCatalogOnly(
        manifest({ category: "notes" }),
        manifest({ category: "sync", needsTextusAi: true }),
      ),
    ).toBe(true);
    expect(sameButCatalogOnly(manifest(), manifest({ main: "other.js" }))).toBe(false);
    expect(
      sameButCatalogOnly(manifest(), manifest({ category: "notes", version: "1.0.1" })),
    ).toBe(false);
  });

  it("need no new version", () => {
    const repo = mkdtempSync(join(tmpdir(), "check-bumps-"));
    try {
      const git = (...args: string[]) =>
        execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], {
          cwd: repo,
        });
      mkdirSync(join(repo, "plugins/jane.notes"), { recursive: true });
      writeFileSync(join(repo, "libs.json"), "{}");
      writeFileSync(join(repo, "package-lock.json"), "{}");
      const write = (extra: object) =>
        writeFileSync(join(repo, "plugins/jane.notes/textus-plugin.json"), manifest(extra));
      write({});
      git("init", "-q", "-b", "main");
      git("add", "-A");
      git("commit", "-qm", "base");
      git("checkout", "-qb", "work");
      const check = (extra: object) => {
        write(extra);
        git("commit", "-qam", "change");
        return spawnSync(process.execPath, [join(root, "scripts/check-bumps.mjs"), "main"], {
          cwd: repo,
          encoding: "utf8",
        });
      };
      expect(check({ category: "notes", needsTextusAi: true }).status).toBe(0);
      expect(check({ category: "notes", main: "other.js" }).stderr).toContain(
        "jane.notes 1.0.0",
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("leave the released package as it is, with its hash", async () => {
    const dir = mkdtempSync(join(tmpdir(), "same-package-"));
    try {
      const zip = (text: string) =>
        new JSZip()
          .file("textus-plugin.json", text)
          .file("host.js", "x")
          .generateAsync({ type: "nodebuffer" });
      writeFileSync(join(dir, "released.zip"), await zip(manifest()));
      mkdirSync(join(dir, "dist"));
      const index = { plugins: [{ id: "jane.notes", sha256: "new", size: 0 }] };
      writeFileSync(join(dir, "dist/index.json"), JSON.stringify(index));
      const same = async (text: string) => {
        writeFileSync(join(dir, "built.zip"), await zip(text));
        return spawnSync(
          process.execPath,
          [join(root, "scripts/same-package.mjs"), "released.zip", "built.zip", "jane.notes"],
          { cwd: dir },
        ).status;
      };
      expect(await same(manifest({ category: "notes", needsTextusAi: true }))).toBe(0);
      expect(await same(manifest({ main: "other.js" }))).not.toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
