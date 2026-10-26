import { describe, expect, it } from "vitest";
import { communityEntry, releaseZipUrl } from "../scripts/community.mjs";

const good = { id: "jane.word-count", repo: "jane/textus-word-count", version: "0.2.0" };

describe("communityEntry", () => {
  it("reads a listing and where its zip is", () => {
    const entry = communityEntry(good, "community/jane.word-count.json");
    expect(entry).toMatchObject({ ...good, libs: {} });
    expect(releaseZipUrl(entry)).toBe(
      "https://github.com/jane/textus-word-count/releases/download/v0.2.0/jane.word-count-0.2.0.zip",
    );
  });

  it("refuses a listing that is wrong", () => {
    const bad: [Record<string, unknown>, string][] = [
      [good, "community/other.json"],
      [{ ...good, id: "catvinci.word-count" }, "community/catvinci.word-count.json"],
      [{ ...good, repo: "not a repo" }, ""],
      [{ ...good, version: "2" }, ""],
      [{ ...good, sha256: "abc" }, ""],
      [{ ...good, libs: ["x"] }, ""],
    ];
    for (const [json, path] of bad) expect(() => communityEntry(json, path)).toThrow();
  });
});
