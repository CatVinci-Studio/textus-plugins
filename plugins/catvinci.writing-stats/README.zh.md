# 写作统计

在侧边栏显示字数、阅读时间和每日写作目标。

打开侧边栏的 **写作统计** 标签：

- **当前文档**：字数、字符数和阅读时间。
- **选中内容**：选中部分的字数和字符数。
- **今天**：今天在所有文档里新写了多少字，对照每日目标，以及连续达成了几天。目标在插件设置的 **每日目标** 里改：默认 500，设为 0 即不设目标。
- **整个文件夹**：展开后统计打开的文件夹里全部文档的字数、字符数和文档数。

中文、日文、韩文按字计数，其他文字按词计数；Markdown 的标记（`#`、`*`、链接地址、front matter）不计入。阅读时间按每分钟 230 个词或 400 个中日韩文字估算。

支持桌面版和 iPhone，需要 Textus 1.3.0 或更新版本。插件需要读取编辑器和打开的文件夹里的文件来计数，并为 Textus AI 提供下面的工具。

## 更新日志

- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `count_words`：统计一篇文档、某个文件夹里所有文档或当前文档的字数、字符数和阅读时长（分钟）；每个中日韩文字算一个词，Markdown 标记不计。
<!-- /ai-tools -->
