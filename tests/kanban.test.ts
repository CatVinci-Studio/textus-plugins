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
});

it("keeps Obsidian's mark of a done list, not as a card", () => {
  const text = "---\nkanban-plugin: board\n---\n\n## Doing\n\n- [ ] a\n\n## Done\n\n**Complete**\n- [x] b\n";
  const board = md.parse(text);
  expect(board.lists[1].cards.map((c: { text: string }) => c.text)).toEqual(["b"]);
  expect(md.serialize(board)).toContain("## Done\n\n**Complete**\n\n- [x] b");
  // A list headed by a bold card further down is just a card.
  expect(md.parse("## A\n\n- [ ] x\n**not a mark**\n").lists[0].cards).toHaveLength(2);
});

