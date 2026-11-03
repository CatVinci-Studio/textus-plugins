import { describe, expect, it } from "vitest";
import { folder, loadPlugin, memoryStorage } from "./plugin-host";

/** Version History's tools for Textus AI (plugins/catvinci.version-history/host.js). */
async function setup() {
  const storage = memoryStorage();
  const files = { "Plan.md": "# Plan\n\none\ntwo\nthree\nfour\nfive\nsix\n" };
  const { tools } = loadPlugin("catvinci.version-history", {
    files: folder(files),
    editor: { getPath: async () => "/root/Plan.md" },
  }, storage);
  const versions = [
    { at: Date.UTC(2026, 10, 2, 10), text: "# Plan\n\none\ntwo\nthree\nfour\nfive\nsix\n" },
    { at: Date.UTC(2026, 10, 1, 10), text: "# Plan\n\none\n2\nthree\nfour\nfive\nsix\nseven\n" },
  ];
  return { tools, storage, versions };
}

describe("version history's tools", () => {
  it("list a document's versions, newest first", async () => {
    const { tools, storage, versions } = await setup();
    // Kept as the plugin keeps them: under its hash of the path.
    const keyOf = (path: string) => {
      let a = 0x811c9dc5;
      let b = 0x01000193;
      for (let i = 0; i < path.length; i++) {
        const c = path.charCodeAt(i);
        a = Math.imul(a ^ c, 0x01000193) >>> 0;
        b = Math.imul(b ^ c, 0x811c9dc5) >>> 0;
      }
      return "v:" + a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
    };
    await storage.set(keyOf("/root/Plan.md"), { path: "/root/Plan.md", versions });
    expect(await tools.get("list_versions")!({ path: "Plan" })).toEqual({
      document: "Plan.md",
      versions: [
        { version: 1, saved: "2026-11-02T10:00:00.000Z", lines: 9, characters: 36 },
        { version: 2, saved: "2026-11-01T10:00:00.000Z", lines: 10, characters: 40 },
      ],
    });
    const diff = await tools.get("diff_versions")!({ from: 2 });
    expect(diff).toMatchObject({ document: "Plan.md", from: "version 2", to: "current" });
    expect(diff.diff).toBe("…\n  \n  one\n+ two\n- 2\n  three\n  four\n  five\n  six\n- seven\n  ");
    expect(await tools.get("diff_versions")!({ from: 1 })).toMatchObject({ diff: "(no changes)" });
    expect(await tools.get("diff_versions")!({ from: 9 })).toHaveProperty("error");
  });
});
