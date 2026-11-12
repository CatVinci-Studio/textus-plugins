# Graph View

Draws your notes and the links between them as a graph, for the whole folder or around the document in front.

- **Ctrl+Alt+G** (**⌘⌥G** on a Mac), or **Plugins › Open the Graph View**, shows the whole folder in a tab. **Fit** brings all of it into view.
- The **Graph** tab in the sidebar shows the notes around the document in front. The button at the top of the sidebar's Graph panel opens the whole folder.
- [[Wiki links]] and links to other documents both count; two notes that link to each other share one line. A [[link]] to a note not written yet shows as a note of its own.
- Click a note to open it. Drag a note to place it, drag the background to move around, and scroll or pinch to zoom. Rest the pointer on a note to light up its links.
- The graph adapts by itself: names appear as you zoom in, arrows show which way links go when there are few enough to read, and a note with more links is larger. Without colour groups, each note takes its folder's colour.
- When documents in the folder change, the graph is drawn again.

## Settings

The sliders button at the top of the full graph opens its settings; the sidebar graph has none.

- **Filters**: a search (`path:ideas`, `file:draft`, `tag:#todo`, a `-` in front to leave out); **Tags** shows #tags as nodes; **Existing files only** hides notes not written yet; **Orphans** (full graph) shows notes with no links.
- **Groups**: colour the notes a search finds. **New group** adds one; **Restore defaults** clears your changes.

In an Obsidian vault, the colour groups saved in Obsidian's `graph.json` colour the notes too, after your own groups.

## Permissions

- Read files and the document: to find the folder's notes and links, and Obsidian's `graph.json`.
- Tools for Textus AI: so Textus AI can see the notes around a document.

## Changes

- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_neighbours`: A document's neighbourhood in the graph of notes - the one in front unless a path is given: the notes within a few links of it either way, each with how many links away, and the links between them. A [[link]] to no note shows as kind missing.
<!-- /ai-tools -->
