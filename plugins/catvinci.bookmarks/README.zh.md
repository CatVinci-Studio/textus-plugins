# 书签

给一段文字加书签，之后从侧栏一点就能跳回去，不限文档。

选中一些文字，选择 **给选中文字加书签**：在选中的文字上右键，或用 **插件 › 给选中文字加书签**。文档要先保存，因为书签要记住它所在的文件。

侧栏的 **书签** 标签页按文档列出所有书签，点一下就打开文档并跳到那段文字。右键书签，选 **删除书签** 即可删除。文档改名或移动后，书签会跟着走。

## Obsidian 库

打开的文件夹是 Obsidian 库（里面有 `.obsidian` 文件夹）时：

- Obsidian 自己的书签（`.obsidian/bookmarks.json`）也列在这个标签页里，放在 **Obsidian 书签** 下，保留 Obsidian 的分组。只列笔记、标题和块的书签，搜索、文件夹等不列。

## 权限

- 读取文档：读取选中的文字。
- 读取文件：用于 Obsidian 的 `bookmarks.json`。
- Textus AI 工具：让 Textus AI 能列出你的书签。

## 更新日志

- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
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
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_bookmarks`：列出用户的书签：每篇文档中加了书签的文字，以及该文档在打开的文件夹中的路径。
<!-- /ai-tools -->
