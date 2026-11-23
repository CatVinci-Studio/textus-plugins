# 快速笔记

不离开当前文档就能随手记一笔，记下的内容存进文件夹里的收件箱文件或今天的日记。

- 按 **Ctrl+Alt+N**（Mac 上是 **⌘⌥N**），或用 **插件 › 新建快速笔记…**，输入一条笔记即可保存。
- 在桌面版上，托盘或菜单栏图标里也有 **新建快速笔记…**。插件会请 Textus 在后台继续运行，所以关掉所有窗口后也能用。
- 侧栏的 **快速笔记** 标签页列出所有笔记，最新的在最上面。点 **新建** 直接在这里写一条，也可以在列表里直接修改。
- 每条笔记的操作菜单（点「更多」按钮或右键）里有 **插入**（插到文档的光标处）、**打开** 和 **删除**。存在文档里的笔记，会在那篇文档里打开并跳到它所在的行。
- 删错了？底部的 **撤销** 能在几秒内把它找回来。新建后什么都没写的笔记会自动去掉。
- 笔记有 6 条或更多时，顶部会出现搜索框。

## 笔记存在哪里

笔记存在打开的文件夹里的一篇文档中，所以 Obsidian 和「云同步」都能看到。在插件设置的 **笔记存到** 里选择位置：

- **收件箱文件**（默认）：文件夹顶层的 `Inbox.md`，或在 **收件箱文件** 里设置的其他文档。每条笔记作为一个列表项加在末尾，带日期和时间，比如 `- 2026-11-08 14:05 给安娜打电话`。
- **今天的日记**：放在 `## 快速笔记` 标题下（标题用界面语言），没有就自动加上。每条笔记带时间，比如 `- 14:05 给安娜打电话`。日记的文件夹、文件名和模板沿用文件夹的日记设置（比如 Obsidian 的）；没有设置时是 `Daily/YYYY-MM-DD.md`。

直接修改这个文件，侧栏也会跟着变。旧版本保存的笔记会一次性移进来，按从旧到新的顺序。没有打开文件夹时，笔记保存在 Textus 里。

支持桌面版、iPhone、iPad 和安卓。在手机上，**新建快速笔记…** 在标题栏菜单的 **插件** 里，每条笔记的操作在它的「更多」按钮里。手机上没有托盘，所以不会请你让 Textus 在后台运行。

## 权限

- 读写文件：用于收件箱文件或日记。
- 修改文档：把笔记插到光标处。
- Textus AI 工具：让 Textus AI 能添加快速笔记。

## 更新日志

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `add_note`：在侧边栏的快速笔记列表顶部添加一条笔记，之后可以插入文档，或单独打开成一篇文档。 写今天的日记用 append_to_daily_note；待办用 add_task。
<!-- /ai-tools -->
