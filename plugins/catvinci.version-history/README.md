# Version History

Keeps each save of a document as a version, so you can see what changed and bring an old one back.

- Each time you save, the document's text is kept as a version. Saves close together - autosave's every few seconds - count as one, with a new version at most every 15 minutes. The last 50 versions of each document are kept.
- The **History** tab in the sidebar lists the versions of the document in front, newest first, grouped by day: Today, Yesterday, then the date.
- Pick one to see what changed since, line by line.
- **Restore This Version** offers the old text as an edit to the document, which you accept or reject like any other. **Open as a New Document** opens it beside instead.
- Versions are kept inside Textus, not in your folder. Documents over 2 MB are not kept, and when the storage is full the oldest versions go first.

## Permissions

- Read files and the document: to keep each saved version and compare it with the text now.
- Propose edits: to bring an old version back as an edit you accept or reject.
- Tools for Textus AI: so Textus AI can list a document's versions and compare them.

## Changes

- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_versions`: Lists the saved versions of a document - the one in front unless a path is given - newest first, numbered from 1, each with when it was saved and its size.
- `diff_versions`: Shows what changed between two versions of a document, or between a version and the document as it is now, line by line: + added, - removed, with a little context.
<!-- /ai-tools -->
