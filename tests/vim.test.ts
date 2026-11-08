import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/** Vim's host (plugins/catvinci.vim/host.js): how the lines of the Key
 *  mappings setting - a vimrc's map lines - are read. */
type Mapping = { lhs: string[]; rhs: string[] };
let parseMappings: (text: string) => Record<"n" | "v" | "i", Mapping[]>;

beforeAll(() => {
  const source = readFileSync(
    new URL("../plugins/catvinci.vim/host.js", import.meta.url),
    "utf8",
  );
  const exports: { parseMappings?: typeof parseMappings } = {};
  new Function("exports", source)(exports);
  parseMappings = exports.parseMappings!;
});

describe("Vim's key mappings", () => {
  it("reads inoremap jj <Esc> for insert mode only", () => {
    const maps = parseMappings("inoremap jj <Esc>");
    expect(maps.i).toEqual([{ lhs: ["j", "j"], rhs: ["Escape"] }]);
    expect(maps.n).toEqual([]);
    expect(maps.v).toEqual([]);
  });

  it("gives map and noremap to normal and visual mode", () => {
    const maps = parseMappings("noremap H ^");
    expect(maps.n).toEqual([{ lhs: ["H"], rhs: ["^"] }]);
    expect(maps.v).toEqual([{ lhs: ["H"], rhs: ["^"] }]);
    expect(maps.i).toEqual([]);
  });

  it("knows the leader, special keys and Ctrl chords", () => {
    const maps = parseMappings(
      [
        'let mapleader = ","',
        "nnoremap <silent> <leader>w :w<CR>",
        "nnoremap <C-s> :w<CR>",
        "nnoremap <Space> <C-d>",
      ].join("\n"),
    );
    expect(maps.n).toEqual([
      { lhs: [",", "w"], rhs: [":", "w", "Enter"] },
      { lhs: ["ctrl+s"], rhs: [":", "w", "Enter"] },
      { lhs: [" "], rhs: ["ctrl+d"] },
    ]);
  });

  it("passes over comments, set lines and what it doesn't know", () => {
    const maps = parseMappings(
      ['" comment', "set number", "syntax on", "", "xnoremap < <gv"].join("\n"),
    );
    expect(maps.n).toEqual([]);
    expect(maps.v).toEqual([{ lhs: ["<"], rhs: ["<", "g", "v"] }]);
  });
});

describe("an Obsidian vault's .obsidian.vimrc", () => {
  it("lets a later line map the same keys again", () => {
    const maps = parseMappings("nnoremap L x\nnmap L dd");
    expect(maps.n).toEqual([{ lhs: ["L"], rhs: ["d", "d"] }]);
  });

  it("is read after the plugin's own lines, its mappings applied", async () => {
    const { folder, loadPlugin } = await import("./plugin-host");
    let key: ((k: string) => void) | null = null;
    const ops: { op: string }[] = [];
    loadPlugin("catvinci.vim", {
      files: folder({
        ".obsidian/app.json": "{}",
        ".obsidian.vimrc": '" Obsidian\nnmap L dd\nunmap <Space>\nexmap x obcommand y\nnnoremap K x',
      }),
      settings: {
        get: async (k: string) => (k === "mappings" ? "nnoremap L x\nnnoremap H x" : undefined),
      },
      editor: {
        keys: {
          onKey: (fn: typeof key) => ((key = fn), { dispose() {} }),
          capture: async () => {},
          exec: async (op: { op: string }) => (ops.push(op), { empty: false }),
        },
      },
    });
    const press = async (k: string) => {
      key!(k);
      await new Promise((r) => setTimeout(r, 20));
    };
    await new Promise((r) => setTimeout(r, 20));
    await press("L");
    await press("H");
    await press("K");
    const done = ops.map((o) => o.op).filter((op) => /^delete/.test(op));
    expect(done).toEqual(["deleteLines", "deleteChars", "deleteChars"]);
  });
});
