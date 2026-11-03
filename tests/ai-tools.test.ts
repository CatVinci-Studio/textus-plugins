import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadPlugin, manifestOf } from "./plugin-host";

/** Every official plugin's tools for Textus AI, against its manifest. */
const withTools = readdirSync(new URL("../plugins/", import.meta.url))
  .filter((id) => id.startsWith("catvinci."))
  .filter((id) => manifestOf(id).contributes?.aiTools?.length);

describe.each(withTools)("%s's tools", (id) => {
  const manifest = manifestOf(id);
  const tools = manifest.contributes.aiTools as { name: string; description: string; parameters: { type: string } }[];

  it("are registered, each under its manifest's name, and asked for", () => {
    const registered = loadPlugin(id).tools;
    expect([...registered.keys()].sort()).toEqual(tools.map((t) => t.name).sort());
    expect(manifest.permissions).toContain("ai.tools");
  });

  it("are described in every language, with a schema of their arguments", () => {
    for (const tool of tools) {
      expect(tool.name).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(tool.parameters.type).toBe("object");
      const key = /^%(.+)%$/.exec(tool.description)?.[1];
      expect(key, tool.name).toBeTruthy();
      for (const [lang, table] of Object.entries(manifest.l10n as Record<string, Record<string, string>>))
        expect(table[key!], `${tool.name} in ${lang}`).toBeTruthy();
    }
  });
});
