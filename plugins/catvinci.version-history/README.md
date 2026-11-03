# Version History

Every save of a document, kept.

- Each time you save, the document's text is kept as a version.
- The **History** tab in the sidebar lists the versions of the document in front, newest first.
- Pick one to see what changed since; **Restore This Version** brings it back, or **Open as a New Document** opens it beside.
- Saves close together - autosave's every few seconds - are one version, a new one at most every 15 minutes; the last 50 are kept.
- Versions are grouped by day: Today, Yesterday, then the date.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `list_versions`: Lists the saved versions of a document - the one in front unless a path is given - newest first, numbered from 1, each with when it was saved and its size.
- `diff_versions`: Shows what changed between two versions of a document, or between a version and the document as it is now, line by line: + added, - removed, with a little context.
<!-- /ai-tools -->
