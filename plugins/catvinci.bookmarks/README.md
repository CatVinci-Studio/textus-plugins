# Bookmarks

Bookmark a passage and jump back to it from the sidebar, in any document.

Select some words and choose **Bookmark Selection**: right-click the selection, or use **Plugins › Bookmark Selection**. Save the document first, since a bookmark points to its file.

The **Bookmarks** tab in the sidebar lists your bookmarks by document. Click one to open the document at those words. Right-click a bookmark and choose **Remove Bookmark** to delete it. When a document is renamed or moved, its bookmarks follow it.

## Obsidian vaults

When the open folder is an Obsidian vault (it has a `.obsidian` folder):

- Obsidian's own bookmarks in `.obsidian/bookmarks.json` show in the tab too, under **Obsidian**, in Obsidian's groups. Bookmarks of notes, headings and blocks are listed; searches, folders and the like are not.

## Permissions

- Read the document: to read the selection.
- Read files: for Obsidian's `bookmarks.json`.
- Tools for Textus AI: so Textus AI can list your bookmarks.

## Changes

- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_bookmarks`: Lists the user's bookmarks: the words bookmarked in each document, with the document's path in the open folder.
<!-- /ai-tools -->
