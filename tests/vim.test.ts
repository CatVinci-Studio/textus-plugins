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
        "let mapleader = \",\"",
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
      ['" comment', "set number", "syntax on", "", "xnoremap < <gv"].join(
        "\n",
      ),
    );
    expect(maps.n).toEqual([]);
    expect(maps.v).toEqual([{ lhs: ["<"], rhs: ["<", "g", "v"] }]);
  });
});
