import { describe, expect, it } from "vitest";
import {
  inScope,
  normalizeConfig,
  relativePath,
  withConnection,
} from "./config";
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
  it("lets every service sync every minute, and waits after saves only as set", () => {
    const at = (
      provider: "s3" | "webdav" | "nutstore",
      more: { interval?: number; saveGap?: number } = {},
    ) =>
      normalizeConfig({
        provider,
        endpoint: "https://dav.example.com/dav",
        bucket: "notes",
        ...more,
      });
    for (const p of ["s3", "webdav", "nutstore"] as const)
      expect(at(p, { interval: 1 }).interval).toBe(1);
    // A connection that never set it waits as its service suggests.
    expect(at("s3").saveGap).toBe(0);
    expect(at("webdav").saveGap).toBe(0);
    expect(at("nutstore").saveGap).toBe(3);
    expect(at("nutstore", { saveGap: 0 }).saveGap).toBe(0);
    expect(at("webdav", { saveGap: 10 }).saveGap).toBe(10);
    expect(() => at("s3", { saveGap: 61 })).toThrow("invalidSaveGap");
  });

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
      ["[]a].md", "].md", false],
      ["[!]a].md", "b.md", false],
      ["[!]a].md", "xa].md", true],
      ["**/**/x.md", "x.md", false],
      ["a/**/**/b.md", "a/b.md", false],
      ["[z-a].md", "b.md", true],
      ["📚 Private/", "📚 Private/a.md", false],
      ["📚?.md", "📚x.md", false],
      ["a**/**/b.md", "ab/c/b.md", false],
      ["İ.md", "İ.md", false],
      ["\\😀.md", "😀.md", false],
      ["*.md", "x\ny/b.md", false],
      ["[A-z].md", "_.md", false],
      ["[Z-a].md", "_.md", false],
      ["ΑΣ*", "ΑΣ.md", false],
      ["*Σ/", "ΤΕΛΟΣ/a.md", false],
      ["*a*b*c*Σ.md", "xaybzcΣ.md", false],
    ];
    for (const [exclude, path, wanted] of cases)
      expect([
        exclude,
        scopeOf({ exclude, gitignore: false, obsidian: false }).wants(path),
      ]).toEqual([exclude, wanted]);
    // Many stars cost no more than few: no backtracking.
    const started = Date.now();
    scopeOf({
      exclude: "*a*a*a*a*a*a*a*a*b",
      gitignore: false,
      obsidian: false,
    }).wants("a".repeat(80) + ".md");
    expect(Date.now() - started).toBeLessThan(200);
    // An everyday .gitignore stays quick over many paths.
    const node = scopeOf(
      { exclude: "", gitignore: true, obsidian: false },
      "logs\n*.log\nnpm-debug.log*\nnode_modules/\n.env\ndist/\n*.tgz\n.cache/\ncoverage/\n*.pid",
    );
    const quick = Date.now();
    for (let i = 0; i < 10_000; i++)
      node.wants(`notes/project ${i % 50}/chapter ${i}/draft ${i}.md`);
    expect(Date.now() - quick).toBeLessThan(1000);
    // Thousands of costly rules: only the first thousand are read.
    const hostile = scopeOf(
      { exclude: "", gitignore: true, obsidian: false },
      "/*a*a*a\n".repeat(4999),
    );
    const capped = Date.now();
    hostile.wants("a".repeat(200) + ".md");
    expect(Date.now() - capped).toBeLessThan(2000);
    // A big .gitignore never pushes out the user's own rules.
    expect(
      scopeOf(
        { exclude: "secret.md", gitignore: true, obsidian: false },
        "#".repeat(50_000),
      ).wants("secret.md"),
    ).toBe(false);
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

it("starts a new or changed service from its own wait and transfers, keeping the folder's options", () => {
  const nutstore = { provider: "nutstore" as const, prefix: "notes" };
  expect(normalizeConfig(withConnection(null, nutstore))).toMatchObject({
    saveGap: 3,
    parallel: 2,
  });
  const s3 = normalizeConfig({
    provider: "s3",
    bucket: "my-bucket",
    automatic: true,
    parallel: 16,
  });
  expect(normalizeConfig(withConnection(s3, nutstore))).toMatchObject({
    automatic: true,
    saveGap: 3,
    parallel: 2,
  });
  expect(
    normalizeConfig(
      withConnection(s3, { provider: "s3", bucket: "other-bucket" }),
    ),
  ).toMatchObject({ parallel: 16, bucket: "other-bucket" });
});
