import { describe, expect, it } from "vitest";
import { statsOf } from "../scripts/stats.mjs";

const release = (tag: string, date: string, downloads: number[]) => ({
  tag_name: tag,
  published_at: `${date}T10:00:00Z`,
  assets: downloads.map((n, i) => ({
    name: i ? "notes.txt" : `${tag}.zip`,
    download_count: n,
  })),
});

describe("statsOf", () => {
  it("adds up a plugin's zip downloads over its versions, with its first and latest dates", () => {
    expect(
      statsOf([
        release("catvinci.tasks-v0.1.1", "2026-10-27", [5, 99]),
        release("catvinci.tasks-v0.1.0", "2026-10-20", [12]),
        release("catvinci.vim-v0.1.0", "2026-10-21", [3]),
        release("catalog", "2026-10-27", [1000]),
      ]),
    ).toEqual({
      "catvinci.tasks": { installs: 17, published: "2026-10-20", updated: "2026-10-27" },
      "catvinci.vim": { installs: 3, published: "2026-10-21", updated: "2026-10-21" },
    });
  });
});
