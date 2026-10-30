# Database

The documents of a folder as a table, a board, a calendar or a gallery - Notion's databases, kept as plain Markdown files. Each document is a row; the properties in its front matter are the columns:

```markdown
---
start: 2026-01-05
end: 2026-01-11
focus: [Research]
rate: 4
---

# Week 2
```

Put a `database` block in any document - type `/database` or choose **New Database…** - and it shows the folder beside the document:

````markdown
```database
from: 2026 Calendar
view: table
sort: start
```
````

- **Table**: click a cell to change it; the document's front matter changes with it. Dates get a date picker, lists are written `a, b`, a `rate` from 0 to 5 shows as stars.
- **Board**: cards in lists, one per value of a list property (or `group: status`); drag a card to another list to change it.
- **Calendar**: each page on its date (`date: start`), across to its `end` if it has one. Double-click a day for a new page on it.
- **Gallery**: a card per page, with its `cover` picture or `icon`.
- **New** makes a page in the folder.

More lines for the block: `columns: start, focus` (which, in what order), `sort: -rate` (`-` for descending), `filter: focus has Research` (`=`, `!=`, `has`, `>`, `<`, one per line), `group:`, `date:`, `end:`.

**From Notion**: export the database as Markdown & CSV, unzip it into the open folder, right-click its `.csv` in the sidebar and choose **Import from Notion…**. Its pages come in as documents with their properties as front matter, with a page showing them.

**With Textus AI**: ask for one - "make a 2026 weekly calendar with a focus and a rating" - and it makes the folder, its pages and the block.
