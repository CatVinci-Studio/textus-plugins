# Graph View

Your notes and the links between them, as a graph.

- **Ctrl+Alt+G** (**⌘⌥G** on a Mac), or **Plugins › Open the Graph View**, shows the whole folder in a tab.
- The **Graph** tab in the sidebar shows the notes around the document in front.
- Both [[wiki links]] and links to other documents count. Click a note to open it (with Ctrl or ⌘, in a new tab); drag to move around, scroll to zoom.
- The sliders button at the top opens the graph's settings:
  - **Filters**: search (`path:ideas`, `file:draft`, `tag:#todo`, a `-` to leave out), tags as nodes, notes not yet created, notes with no links. The sidebar's graph also sets how far it reaches.
  - **Groups**: colour the notes a search finds.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_neighbours`: A document's neighbourhood in the graph of notes - the one in front unless a path is given: the notes within a few links of it either way, each with how many links away, and the links between them. A [[link]] to no note shows as kind missing.
<!-- /ai-tools -->
