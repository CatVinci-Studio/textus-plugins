import { expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

type Capture = { mode: string; keys: string[] } | null;

/** Emacs's host with a fake editor: what it captured, ran and showed. */
async function emacs(held = true) {
  let key: ((k: string) => void) | null = null;
  const captures: Capture[] = [];
  const ops: Record<string, unknown>[] = [];
  const shown: string[] = [];
  const commands: string[] = [];
  const status = (text: string) => ({
    dispose: () => shown.push(""),
    update: (c: { text: string }) => shown.push(c.text),
    text,
  });
  loadPlugin("catvinci.emacs", {
    env: { platform: "windows" },
    settings: {
      get: async (k: string) => k === "ctrlKeys",
      onDidChange: () => {},
    },
    commands: {
      register: () => ({ dispose() {} }),
      execute: async (id: string) => void commands.push(id),
    },
    ui: {
      statusItem: (_id: string, item: { text: string }) => (
        shown.push(item.text),
        status(item.text)
      ),
    },
    editor: {
      keys: {
        onKey: (fn: typeof key) => ((key = fn), { dispose() {} }),
        capture: async (c: Capture) => (captures.push(c), held),
        exec: async (op: Record<string, unknown>) => (ops.push(op), {}),
      },
    },
  });
  const settle = () => new Promise((r) => setTimeout(r, 20));
  await settle();
  const press = async (k: string) => (key!(k), settle());
  return { captures, ops, shown, commands, press };
}

it("takes C-s and C-g after C-x, so C-x C-s saves on Windows", async () => {
  const e = await emacs();
  await e.press("ctrl+x");
  expect(e.captures.at(-1)).toEqual({
    mode: "all",
    keys: ["ctrl+s", "ctrl+g"],
  });
  await e.press("ctrl+s");
  expect(e.commands).toEqual(["textus.save"]);
  expect(e.captures.at(-1)!.mode).toBe("some");
  expect(e.shown.at(-1)).toBe("Emacs");
});

it("shows no status while another plugin holds the keys", async () => {
  const e = await emacs(false);
  expect(e.shown).toEqual([]);
});

it("pages with one move of 20 lines", async () => {
  const e = await emacs();
  await e.press("ctrl+v");
  expect(e.ops).toEqual([
    { op: "move", unit: "down", count: 20, select: false },
  ]);
});
