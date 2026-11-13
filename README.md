# Textus Plugins

The plugins for [Textus](https://textus.md), the Markdown editor. None of them comes with Textus: you install the ones you want from **Settings › Extensions › Plugins**, and Textus downloads them from this repository.

## The plugins

<!-- plugins -->
| Plugin | What it does |
| --- | --- |
| Bookmarks | Bookmark a passage and come back to it from the sidebar - across documents. |
| Calendar & Daily Notes | A calendar in the sidebar and a note for each day, kept in a folder of the open folder. |
| Canvas | Open Obsidian's canvases (.canvas) in a tab: notes, pictures, links and groups on a board to drag and zoom. Excalidraw drawings show the picture exported from them. |
| Chart.js | Simple charts from a Chart.js configuration. |
| CJK Spacing | Puts a space between Chinese or Japanese text and Latin letters or numbers. |
| Claude Code | Claude Code in Textus AI: it reads your folder, writes and edits your notes, and asks before it changes anything. |
| Clipboard History | What you copied or cut in your documents, newest first, in the sidebar: click one to put it in again. |
| Cloud Sync | End-to-end encrypted workspace sync with S3, WebDAV or Nutstore. Keep both versions on conflict. |
| Codex | Codex in Textus AI: it reads your folder, writes and edits your notes, and asks before it changes anything. |
| DeepSeek Harness | DeepSeek Harness in Textus AI: DeepSeek's own agent reads your folder, writes and edits your notes, and asks before it changes anything. |
| Desk Pet | A chibi companion that floats on your desktop or in the window while you write: Moyu, or the LLM-chan of the model Textus AI is using. She writes when you type, dozes when you stop, cheers when you save and leans in when Textus AI is at work. |
| ECharts | Charts from an ECharts option - bars, lines, pies and more. |
| Emacs | Emacs keys in the editor: C-f C-b C-n C-p, C-a C-e, M-f M-b, M-< M->, the mark (C-SPC) and the region, C-k and C-w into a kill ring, C-y and M-y, C-/ undo and C-x prefixes. |
| Function Plot | Graphs of functions, one per line: sin(x), x^2 - 1. |
| Graph View | Your notes and the links between them as a graph - for the whole folder, or around the document in front - with filters and colour groups. |
| Heading Numbers | Numbers headings as you write - 1, 1.1, 1.2 - without changing the text; exports can carry the numbers too. |
| HTML View | See .html files as the pages they are, in a tab. Edit source opens one as text. |
| Image Viewer | Open pictures and SVG files in a tab: zoom, fit, and an SVG's source. |
| Images Follow Document | Each document's pictures in a folder beside it: Note.assets/ for Note.md, as Typora and VS Code keep them. |
| Keenable Search | Lets Textus AI search the web with Keenable, with no key needed; set a Keenable API key for its full search. Searches go to Keenable only while Textus AI uses this tool. |
| LaTeX Completion | LaTeX command completion in formulas: type a backslash and the start of a command - \fr, \alp - to pick from the commands that begin so, each with what it draws. Enter or Tab writes it, with the caret inside its braces. |
| Link Cards | A link as a card with its page's title, description and picture - or a Bilibili video playing in place. Kept in the document as text. |
| Marp | Present a document as slides, the Marp way: a new slide at each ---, themes and layout by Marp directives. The deck follows your writing in a tab beside it, and saves as one HTML file to present from any browser. |
| Mind Map | Draws a Markdown outline - headings and lists - as a mind map. |
| Notion Import | Brings in a Notion export (the .zip or its folder) as plain Markdown notes: pages within pages as folders, databases in Obsidian's Bases format, pictures and files beside their pages. Pair it with Wiki to see the pages tree and the databases. |
| OpenCode | OpenCode in Textus AI: any model it is set up with reads your folder, writes and edits your notes, and asks before it changes anything. |
| Openverse Pictures | Openly licensed pictures for Textus AI: it finds them on Openverse (Flickr, museums and more) - CC BY, CC BY-SA, CC0 and public domain only - each with the credit its licence asks for. No account or key; Openverse allows about 200 searches a day. |
| PDF Viewer | Open PDFs in a tab beside your notes: pages, zoom, and text to select and copy. |
| PlantUML | UML and other diagrams from PlantUML text, drawn on your computer - or by the PlantUML server, if you choose. Drawing on your computer takes about 100 MB more memory; the PlantUML server takes none. |
| Pomodoro | A focus timer floating over the window or the desktop: 25 minutes of work, 5 of rest, a notification at each end. |
| Quick Insert | Type / for headings, lists, tables, formulas and more, : for emoji, @ for a date (@tomorrow, @next friday), and turn a paragraph into another kind of block. |
| Quick Notes | Jot something down without leaving the document: notes in the sidebar, kept in Inbox.md or today's daily note, to insert later or open as a document. |
| Quick Preview | Preview a linked document without opening it: rest the pointer on a Markdown link or a [[wikilink]] to read its opening, or the section or block it names, in a card beside it. Pin keeps the card open while you write. |
| Reminders | Reminders for the lines you date: write (@2026-11-02 09:00) in a line and a notification brings it back then - even with Textus's windows closed in background mode. A click opens the line. |
| Sheet Music (ABC) | Sheet music from ABC notation. |
| Tags | Every #tag in the open folder in the sidebar, with how many notes use it: open one for its notes, rename a tag everywhere, or merge two by renaming one to the other. |
| Task Board | Kanban boards kept in Markdown: a list per heading, a card per task, in a .md with kanban-plugin in its front matter, as Obsidian's Kanban writes it. |
| Tasks | Every task (- [ ]) in the open folder's documents, in one list: tick one off there, or go to it. |
| Templates | Documents and snippets from your own templates: the date, time and title filled in, as Obsidian and Templater fill them. |
| Tidy | Tidy text and Markdown: underlines what breaks common Markdown rules and fixes it in one go, removes blank lines and trailing spaces, switches punctuation between Chinese and English, turns full-width letters into ASCII and joins lines - leaving code, math, front matter and Obsidian's own syntax as written. |
| Timeline | Events in order, a line each: when \| what \| more. |
| Two-way Links | Two-way links: type [[ to link a note, a heading or a block, and ![[ to embed one; in the sidebar, the notes that link to the document in front, the ones that name it without a link - linked in one click - and the notes it links to. |
| Version History | Each save of a document kept as a version: see what changed since, and bring an old one back. |
| Vim | Vim's modes and keys in the editor: normal, insert and visual, motions, operators, counts, registers and dot repeat, the command line (:w, :q, :wq, :12), key mappings as in a vimrc - and flash: s and a letter, then a label, to jump anywhere on screen. |
| WakaTime | Sends your writing time in Textus to your WakaTime account, beside your coding - only while Textus is in front and you are writing; time in the background doesn't count. Works offline: heartbeats wait and go later. Nothing is sent until you set your API key. |
| WaveDrom | Digital timing diagrams from WaveJSON. |
| Web View | Open web pages in a tab beside your notes. |
| Wiki | Pages within pages, and bases of your notes as tables, boards, calendars, galleries and lists - in Obsidian's Bases format, so Obsidian opens the same databases. All plain Markdown files. |
| Word Reader | Read Word documents as they look in Word, in a tab. Edit as Markdown turns one into a document of yours. |
| Writing Stats | Word counts and a daily writing goal: words and characters in the document and the selection, reading time, what you wrote today, the days in a row you met your goal, and the whole folder - CJK counted by character. |
| Zotero | Cite from your Zotero library while you write. Needs Zotero running, with Settings › Advanced › Allow other applications on this computer to communicate with Zotero on. |
<!-- /plugins -->

Quick Notes can also start a note from the tray or menu bar with every window closed, once **Keep running in the background** is on - it offers to turn it on.

Each one asks for the permissions it needs before it runs, and you can take any of them back in its page in Settings › Plugins.

## How Textus gets them

Each plugin's folder in [`plugins/`](plugins/) is packaged by `npm run build` into a zip, with the libraries [`libs.json`](libs.json) lists. The [release workflow](.github/workflows/release.yml) publishes each new version as a release of its own (`catvinci.graph-v1.0.0`) and the catalog, `index.json`, on the `catalog` release, with the skill files in [`skills/`](skills/) beside it. Textus reads that catalog, and checks each package against the SHA-256 it lists before it installs it.

## Writing a plugin

A plugin is a folder with a `textus-plugin.json` and its code, run in a sandbox. Start from [`template/`](template/), a small plugin that works; the guide is [Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md) in the Textus repository, and the plugins here are complete examples. To try yours, use **Settings › Extensions › Plugins › Load a plugin folder…**; to publish it, **Export for Publishing…** on its page lays it out as a repository of its own with a release workflow.

Plugins from other repositories are listed through [`community/`](community/): one file naming the repository and version, reviewed on its pull request. See [Listing in the Textus market](LISTING.md) - for a skill in [`skills/`](skills/) too.

## Developing these plugins

```sh
npm ci
npm run check   # reads every manifest, runs the tests
npm run build   # dist/: the zips and index.json
node scripts/readme-tools.mjs   # each README's "Tools for Textus AI", from its manifest
```

Cloud Sync keeps its typed development source and protocol tests in
[`development/cloud-sync/`](development/cloud-sync/README.md). Its readable runtime
is checked in under `plugins/catvinci.cloud-sync/`; packaging never compiles it.

The Textus app's tests and its development server use a checkout of this repository placed beside the app (`textus-plugins/`), or the one `TEXTUS_PLUGINS_DIR` names.

## License

MIT - see [LICENSE](LICENSE). The libraries copied into the packages keep their own licenses: PDF.js (Apache-2.0), JSZip (MIT) and docx-preview (Apache-2.0).

