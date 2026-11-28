import { expect, it } from "vitest";
import { normalizeConfig } from "./config";
import { readSetupCode, setupCode } from "./setup-code";

it("carries where a folder syncs to another device, never an account, key or password", () => {
  const config = normalizeConfig({
    provider: "s3",
    endpoint: "https://s3.example.com",
    region: "eu-1",
    bucket: "notes",
    prefix: "Textus/笔记",
    pathStyle: true,
    encrypt: true,
  });
  const code = setupCode(config);
  expect(code).toMatch(/^textus-sync:1:[A-Za-z0-9_-]+$/);
  expect(readSetupCode(`  ${code}\n`)).toEqual({
    provider: "s3",
    endpoint: "https://s3.example.com",
    region: "eu-1",
    bucket: "notes",
    prefix: "Textus/笔记",
    pathStyle: true,
    encrypt: true,
  });
  // Nothing secret could be in it: the config holds none, the code only
  // these fields.
  expect(Object.keys(readSetupCode(code)!).sort()).toEqual([
    "bucket",
    "encrypt",
    "endpoint",
    "pathStyle",
    "prefix",
    "provider",
    "region",
  ]);
});

it("reads nothing from text that isn't a code", () => {
  expect(readSetupCode("")).toBeNull();
  expect(readSetupCode("https://dav.example")).toBeNull();
  expect(readSetupCode("textus-sync:1:not json")).toBeNull();
  const unknown = "textus-sync:1:" + btoa(JSON.stringify({ provider: "ftp" }));
  expect(readSetupCode(unknown)).toBeNull();
});
