import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** The synthetic Notion export the Notion Import tests run on. */
export const FIXTURE = new URL("./fixtures/notion-export/", import.meta.url)
  .pathname;
export const H = "0a1b2c3d4e5f60718293a4b5c6d7e8f9";
export const id = (c: string) => c.repeat(32);

export function exportFiles(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) =>
      statSync(join(dir, name)).isDirectory()
        ? walk(join(dir, name))
        : [relative(FIXTURE, join(dir, name))],
    );
  return walk(FIXTURE).sort();
}
