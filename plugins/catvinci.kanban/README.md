# Kanban

Boards of cards in lists, kept as a plain Markdown file.

- **Plugins › New Kanban Board…** makes one, named _name_.kanban.md.
- Each list is a heading in the file and each card a task under it, so the board stays readable anywhere.
- Add a card at the bottom of a list; drag cards between lists, and lists to reorder them. A ticked card is done.
- Write a [[link]] in a card and click it to open that note.
- **Edit as Markdown** opens the file as text; the board shows your changes.

```markdown
## To do

- [ ] Write the outline

## Done

- [x] Pick a title
```

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_boards`: Lists the Kanban boards (name.kanban.md files) in the open folder, each with its lists and how many cards each holds.
- `read_board`: Reads a Kanban board: its lists in order, each with its cards' text and whether each is done. Tasks written in ordinary documents are list_tasks.
- `add_card`: Adds a card to the end of a list on a Kanban board. Only for a board (name.kanban.md); a to-do in a document is add_task.
- `move_card`: Moves a card on a Kanban board to another list, or to another place in its own.
<!-- /ai-tools -->
