import { beforeAll, describe, expect, it } from "vitest";

type Board = { lists: { title: string; cards: { text: string }[] }[] };
let md: { parse(text: string): Board; serialize(board: Board): string };

beforeAll(async () => {
  const script = "../plugins/catvinci.kanban/kanban-markdown.js";
  await import(/* @vite-ignore */ script);
  md = (globalThis as Record<string, unknown>).kanbanMarkdown as typeof md;
});

it("keeps Obsidian Kanban's archive and settings as written, not as cards", () => {
  const text = [
    "---",
    "kanban-plugin: basic",
    "---",
    "",
    "## Todo",
    "",
    "- [ ] Write",
    "",
    "***",
    "",
    "## Archive",
    "",
    "- [x] Old",
    "",
    "%% kanban:settings",
    "```",
    '{"kanban-plugin":"basic"}',
    "```",
    "%%",
    "",
  ].join("\n");
  const board = md.parse(text);
  expect(board.lists.map((l) => l.title)).toEqual(["Todo"]);
  expect(board.lists[0].cards.map((c) => c.text)).toEqual(["Write"]);
  expect(md.serialize(board)).toBe(text);
  const crlf = text.replace(/\n/g, "\r\n");
  expect(md.serialize(md.parse(crlf))).toBe(crlf);
});

it("keeps Obsidian's mark of a done list, not as a card", () => {
  const text = "---\nkanban-plugin: board\n---\n\n## Doing\n\n- [ ] a\n\n## Done\n\n**Complete**\n- [x] b\n";
  const board = md.parse(text);
  expect(board.lists[1].cards.map((c: { text: string }) => c.text)).toEqual(["b"]);
  expect(md.serialize(board)).toContain("## Done\n\n**Complete**\n\n- [x] b");
  // A list headed by a bold card further down is just a card.
  expect(md.parse("## A\n\n- [ ] x\n**not a mark**\n").lists[0].cards).toHaveLength(2);
});


it("keeps a blank line inside a card as one card", () => {
  const board = { lists: [{ title: "A", cards: [{ text: "first\n\nsecond", done: false }] }] };
  const text = md.serialize(board as Board);
  expect(text).not.toMatch(/ +\n/);
  expect(md.parse(text).lists[0].cards.map((c) => c.text)).toEqual(["first\n\nsecond"]);
  // A blank line before an unindented line still ends the card.
  expect(md.parse("## A\n\n- [ ] a\n\nstray\n").lists[0].cards).toHaveLength(2);
});

/** The board's menus (board-edit.js): Move to, and Delete with Undo. */
describe("a card's and a list's menu", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let edit: any;
  beforeAll(async () => {
    const script = "../plugins/catvinci.kanban/board-edit.js";
    await import(/* @vite-ignore */ script);
    edit = (globalThis as Record<string, unknown>).kanbanEdit;
  });
  const TEXT = "---\nkanban-plugin: board\n---\n\n## Todo\n\n- [ ] One\n- [ ] Two\n\n## Done\n\n- [x] Three\n\n## Later\n";

  it("moves a card to the end of another list", () => {
    const board = md.parse(TEXT);
    const [todo, done] = board.lists;
    expect(edit.moveCard(board, todo.cards[0], done)).toBe(true);
    expect(md.serialize(board)).toContain("## Todo\n\n- [ ] Two\n\n## Done\n\n- [x] Three\n- [ ] One\n");
    expect(edit.moveCard(board, done.cards[0], done)).toBe(false);
  });

  it("puts a deleted card back where it was, and the board as it was written", () => {
    const board = md.parse(TEXT);
    const taken = edit.removeCard(board, board.lists[0].cards[0]);
    expect(md.serialize(board)).not.toContain("One");
    expect(edit.restore(board, taken)).toBe(true);
    expect(md.serialize(board)).toBe(TEXT);
  });

  it("puts a deleted list back in its place", () => {
    const board = md.parse(TEXT);
    const taken = edit.removeList(board, board.lists[2]);
    expect(board.lists.map((l) => l.title)).toEqual(["Todo", "Done"]);
    expect(edit.restore(board, taken)).toBe(true);
    expect(md.serialize(board)).toBe(TEXT);
  });

  it("leaves a board read again from the file alone, and a card whose list went", () => {
    const board = md.parse(TEXT);
    const taken = edit.removeCard(board, board.lists[1].cards[0]);
    const reread = md.parse(TEXT);
    expect(edit.restore(reread, taken)).toBe(false);
    expect(md.serialize(reread)).toBe(TEXT);
    edit.removeList(board, board.lists[1]);
    expect(edit.restore(board, taken)).toBe(false);
  });
});
