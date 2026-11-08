# Task Board

Plan work as cards in lists on a board, kept as a plain Markdown file.

- **Plugins › New Task Board…** asks for a name and makes _name_.md in the open folder, with `kanban-plugin: board` in its front matter and three lists: To do, Doing and Done. If a board of that name is already there, it opens instead.
- Any .md file with `kanban-plugin` in its front matter opens as a board. That is how Obsidian's Kanban plugin writes its boards, so each app opens the other's. Older boards named _name_.kanban.md still open as boards.
- Each list is a heading in the file and each card a task under it, so the board stays readable anywhere.

## On the board

- **Add a card** at the bottom of a list. Click a card's text to edit it, tick its box when it is done, and use its × button to remove it.
- **Add list** makes a new list. Click a list's title to rename it; an empty list can be removed.
- Drag cards within a list or to another one, and drag a list by its head to reorder the lists. The others make way as you drag.
- Write a [[link]] in a card and click it to open that note.
- **Edit as Markdown** opens the file as text. The board follows changes made there or anywhere else.
- What Obsidian's Kanban keeps in the file besides the lists, such as its settings and the mark on its done list, stays as written.

```markdown
---
kanban-plugin: board
---

## To do

- [ ] Write the outline

## Done

- [x] Pick a title
```

## Permissions

- Read and write files: to open boards and save them.
- Tools for Textus AI: so Textus AI can find and read boards, add cards and move them.

## Changes

- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_boards`: Lists the Kanban boards (kanban-plugin .md files) in the open folder, each with its lists and how many cards each holds.
- `read_board`: Reads a Kanban board: its lists in order, each with its cards' text and whether each is done. Tasks written in ordinary documents are list_tasks.
- `add_card`: Adds a card to the end of a list on a Kanban board. Only for a board (kanban-plugin .md); a to-do in a document is add_task.
- `move_card`: Moves a card on a Kanban board to another list, or to another place in its own.
<!-- /ai-tools -->
