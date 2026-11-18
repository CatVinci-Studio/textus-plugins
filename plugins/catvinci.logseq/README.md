# Logseq Folders

Opens a Logseq graph the way Logseq writes it: links by page name, pictures in assets, journals in their folder and date format.

## What it does

- When the folder you open, or a folder above it, is a Logseq graph kept as files (it has `logseq/config.edn`), Textus writes links by page name (`[[Page]]`), puts pages made from a link in `pages/` (or your `:pages-directory`), and Daily Notes keeps journals in `journals/`, named as your `:journal/file-name-format` says.
- Logseq's picture folder, `assets/`, is offered once on a card in the corner. Take it, and it is kept in the folder's `.textus/settings.json`; keep yours, and Textus won't ask again.
- Wikilinks in the graph are found from the graph's folder even without this plugin.

## Permissions

It asks only to **read the open folder's files**: Textus hands it `logseq/config.edn` and it says what the file means. It changes nothing.

## Changes

- **0.1.0** - First version: Logseq's settings offered when a Logseq graph is opened. Needs Textus 1.4.6.
