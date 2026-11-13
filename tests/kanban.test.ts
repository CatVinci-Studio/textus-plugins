import { beforeAll, expect, it } from "vitest";

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
