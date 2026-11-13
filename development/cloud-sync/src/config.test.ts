import { describe, expect, it } from "vitest";
import { inScope, normalizeConfig, relativePath } from "./config";
import { parseManifest } from "./content";
import { scopeOf } from "./scope";
import { FORMAT, encode } from "./model";

describe("connection and data boundaries", () => {
  it("uses Nutstore's fixed endpoint and a dedicated workspace folder", () => {
    expect(
      normalizeConfig({
        provider: "nutstore",
        endpoint: "https://wrong.example",
        prefix: "/我的笔记/",
      }),
    ).toMatchObject({
      endpoint: "https://dav.jianguoyun.com/dav",
      prefix: "我的笔记",
    });
  });
  it.each([
    "http://example.com",
    "https://user:secret@example.com",
    "https://example.com?secret=x",
    "https://example.com/#x",
    "bad",
  ])("rejects credential-bearing or unsafe endpoint %s", (endpoint) => {
    expect(() => normalizeConfig({ provider: "webdav", endpoint })).toThrow(
      "invalidEndpoint",
    );
  });
  it.each([
    "../x",
    "/x",
    "a//b",
    "a/./b",
    "a/..",
    "a\\b",
    "CON.md",
    "x/nul",
    "a:",
    "a ",
  ])("rejects nonportable relative path %s", (path) =>
    expect(relativePath(path)).toBe(false),
  );
  it("allows only documented project data and supported workspace documents", () => {
    for (const path of [
      "a.md",
      // Obsidian's databases and canvases.
      "Books.base",
      "Map.canvas",
      "图片/图.png",
      "manual.pdf",
      ".textus/agent.md",
      ".textus/memory/a.md",
      ".textus/skills/a.md",
    ])
      expect(inScope(path)).toBe(true);
    for (const path of [
      ".env",
      ".git/config",
      "provider_keys.json",
      ".textus/plugins/other/state.json",
      ".textus/secret.md",
      "node_modules/a.md",
      "private.local",
      "script.js",
    ])
      expect(inScope(path)).toBe(false);
  });
  it("leaves out what the user's rules and .gitignore leave out, as Git reads them", () => {
    const scope = scopeOf(
      {
        exclude: "drafts/\n*.pdf\n!keep.pdf\n/top.md\nnotes/**/old-?.md",
        gitignore: true,
        obsidian: false,
      },
      "# build\nout/\n",
    );
    for (const path of ["a.md", "keep.pdf", "sub/top.md", "notes/old.md"])
      expect(scope.wants(path)).toBe(true);
    for (const path of [
      "drafts/a.md",
      "x/drafts/a.md",
      "manual.pdf",
      "top.md",
      "notes/a/b/old-1.md",
      "out/a.md",
      ".obsidian/app.json",
    ])
      expect(scope.wants(path)).toBe(false);
    expect(scope.enters("drafts")).toBe(false);
    expect(scope.enters("notes")).toBe(true);
    // Nothing comes back from inside a folder left out.
    expect(
      scopeOf({
        exclude: "a/\n!a/b.md",
        gitignore: false,
        obsidian: false,
      }).wants("a/b.md"),
    ).toBe(false);
    // Git's finer points: classes, escapes, case, where ** stands.
    const cases: [string, string, boolean][] = [
      ["note[0-9].md", "note3.md", false],
      ["note[!0-9].md", "note3.md", true],
      ["\\#x.md", "#x.md", false],
      ["drafts/", "Drafts/a.md", false],
      ["foo/**\n!foo/keep.md", "foo/keep.md", true],
      ["foo/**", "foo/a.md", false],
      ["logs/**.md", "logs.md", true],
      ["logs/**.md", "logs/a/b.md", true],
      ["a/**/b.md", "a/b.md", false],
      ["a.md\\ ", "a.md ", false],
      ["a.md   ", "a.md", false],
      ["[", "a.md", true],
    ];
    for (const [exclude, path, wanted] of cases)
      expect([
        exclude,
        scopeOf({ exclude, gitignore: false, obsidian: false }).wants(path),
      ]).toEqual([exclude, wanted]);
    // The folder's .gitignore counts only when asked for.
    expect(
      scopeOf({ exclude: "", gitignore: false, obsidian: false }, "out/").wants(
        "out/a.md",
      ),
    ).toBe(true);
  });
  it("carries Obsidian's shared settings only when asked, never its per-device files", () => {
    const scope = scopeOf({ exclude: "", gitignore: false, obsidian: true });
    expect(scope.wants(".obsidian/app.json")).toBe(true);
    expect(scope.wants(".obsidian/workspace.json")).toBe(false);
    expect(scope.wants(".obsidian/plugins/x/data.json")).toBe(false);
  });
  it.each([
    "../escape.md",
    "/absolute.md",
    ".textus/plugins/other/a.md",
    "CON.md",
  ])("rejects remote manifest path %s", (path) => {
    expect(() =>
      parseManifest(
        encode({
          format: FORMAT,
          revision: "r",
          updatedAt: "now",
          files: { [path]: { hash: "a".repeat(64), size: 0, blocks: [] } },
        }),
      ),
    ).toThrow("invalidManifest");
  });
  it("rejects manifest sizes that disagree with the referenced blocks", () => {
    expect(() =>
      parseManifest(
        encode({
          format: FORMAT,
          revision: "r",
          updatedAt: "now",
          files: {
            "a.md": {
              hash: "a".repeat(64),
              size: 10,
              blocks: [{ hash: "b".repeat(64), size: 9 }],
            },
          },
        }),
      ),
    ).toThrow("invalidManifest");
  });
});
