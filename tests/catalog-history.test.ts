import { describe, expect, it } from "vitest";
// @ts-expect-error - a plain script, without types
import { versionsOf } from "../scripts/history.mjs";

const entry = (version: string, textus: string, versions?: unknown[]) => ({
  id: "catvinci.x",
  version,
  manifest: { engines: { textus }, permissions: ["files.read"] },
  url: `https://example/x-${version}.zip`,
  sha256: `sha-${version}`,
  size: 10,
  ...(versions ? { versions } : {}),
});

describe("a plugin's earlier versions in the catalog", () => {
  it("keeps the version published now when a new one replaces it", () => {
    const published = { plugins: [entry("0.2.0", ">=1.4.2")] };
    expect(versionsOf(published, entry("0.3.0", ">=1.4.3"))).toEqual([
      {
        version: "0.2.0",
        textus: ">=1.4.2",
        permissions: ["files.read"],
        url: "https://example/x-0.2.0.zip",
        sha256: "sha-0.2.0",
        size: 10,
      },
    ]);
  });

  it("carries the history on, once each, and none for a new plugin", () => {
    const older = {
      version: "0.1.0",
      textus: ">=1.3.0",
      url: "u",
      sha256: "s",
    };
    const published = { plugins: [entry("0.2.0", ">=1.4.2", [older])] };
    expect(
      versionsOf(published, entry("0.2.0", ">=1.4.2")).map(
        (v: { version: string }) => v.version,
      ),
    ).toEqual(["0.1.0"]);
    expect(
      versionsOf(published, entry("0.3.0", ">=1.4.3")).map(
        (v: { version: string }) => v.version,
      ),
    ).toEqual(["0.2.0", "0.1.0"]);
    expect(versionsOf(null, entry("0.1.0", ">=1.4.3"))).toEqual([]);
  });
});
