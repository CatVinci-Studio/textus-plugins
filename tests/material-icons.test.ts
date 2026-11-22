import { existsSync, readFileSync, readdirSync } from "node:fs";
import { expect, it } from "vitest";

/** Material Icon Theme's files: the theme names only icons it carries,
 *  carries none it doesn't name, and each is a plain picture. */
const dir = new URL("../plugins/catvinci.material-icons/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("textus-plugin.json", dir), "utf8"));
const path = manifest.contributes.fileIconThemes[0].path as string;
const theme = JSON.parse(readFileSync(new URL(path, dir), "utf8"));
const defs = theme.iconDefinitions as Record<string, { iconPath: string }>;

it("names only icons it carries, and carries only icons it names", () => {
  const named = Object.values(defs).map((d) => d.iconPath.replace(/^\.\//, ""));
  for (const icon of named) expect(existsSync(new URL(icon, dir)), icon).toBe(true);
  const carried = readdirSync(new URL("icons/", dir)).map((f) => `icons/${f}`);
  expect(carried.sort()).toEqual([...new Set(named)].sort());
});

it("maps every name to an icon it defines, keys in lowercase", () => {
  const maps = ["fileExtensions", "fileNames", "folderNames", "folderNamesExpanded"];
  for (const key of maps)
    for (const [name, id] of Object.entries(theme[key] as Record<string, string>)) {
      expect(defs, `${key}.${name}`).toHaveProperty([id]);
      expect(name, key).toBe(name.toLowerCase());
    }
  for (const key of ["file", "folder", "folderExpanded"]) expect(defs).toHaveProperty([theme[key]]);
  expect(theme.fileExtensions["d.ts"]).toBe("typescript-def");
  expect(theme.fileExtensions.md).toBe("markdown");
});

it("carries pictures, no scripts or outside links", () => {
  for (const file of readdirSync(new URL("icons/", dir))) {
    const svg = readFileSync(new URL(`icons/${file}`, dir), "utf8");
    expect(svg.trimStart().startsWith("<svg"), file).toBe(true);
    expect(svg, file).not.toMatch(/<script|\bon\w+\s*=|<foreignObject|href\s*=\s*["'](?!#)/i);
  }
});

it("carries the icons' license", () => {
  const notices = readFileSync(new URL("THIRD-PARTY-NOTICES.md", dir), "utf8");
  expect(notices).toContain("Copyright (c) 2025 Material Extensions");
  expect(notices).toContain("MIT License");
});
