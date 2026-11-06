import { readdirSync } from "node:fs";
import { expect, it } from "vitest";
import { manifestOf } from "./plugin-host";

// Keys a plugin's default must not take: the editor's own (code block,
// headings, lists), Textus's, and macOS's (Dock, hide, minimize…).
const TAKEN = new Set([
  "mod+alt+c",
  ...Array.from({ length: 10 }, (_, i) => `mod+alt+${i}`),
  "mod+alt+f",
  "mod+alt+s",
  "mod+alt+t",
  "mod+k",
  "mod+g",
  "mod+shift+b",
  "mod+[",
  "mod+]",
  "ctrl+`",
  "ctrl+shift+`",
  "mod+alt+d",
  "mod+alt+h",
  "mod+alt+m",
  "mod+alt+w",
  "mod+alt+escape",
  "mod+alt+space",
  "mod+space",
  "mod+h",
  "mod+m",
  "mod+q",
  "mod+`",
  "ctrl+mod+q",
  "ctrl+mod+space",
]);

it("gives no plugin a default key the editor, Textus or macOS has, or another plugin's", () => {
  const seen = new Map<string, string>();
  for (const id of readdirSync(new URL("../plugins/", import.meta.url))) {
    for (const binding of manifestOf(id).contributes?.keybindings ?? []) {
      const key = binding.key.toLowerCase();
      expect(TAKEN.has(key), `${id}: ${key}`).toBe(false);
      expect(seen.get(key), `${id}: ${key}`).toBeUndefined();
      seen.set(key, id);
    }
  }
});
