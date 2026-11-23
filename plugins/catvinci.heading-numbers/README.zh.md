# 标题编号

写作时在标题前显示编号（1、1.1、1.2），不改动原文。

- 写作时，每个标题前都会显示它的编号：1、1.1、1.2、2…… 编号只是显示出来，文档里的文字保持原样。
- 编号从文档最高一级的标题开始；如果这一级只有一个总标题，就从下一级开始。
- 文档已经手动给标题编了号时，不会再加编号。判断方法是：大多数顶级标题以 `1.`、`1.2`、`一、`、`第一章`、`(一)` 这样的编号开头。
- Obsidian：在文档开头属性里写 `number headings: off`（Obsidian 的 Number Headings 插件用的设置），这篇文档就不显示编号。
- **导出时带编号**（**设置 › 扩展 › 插件 › 标题编号**，默认打开）：导出 HTML 和 PDF 时显示同样的编号。

插件会读取当前文档的标题（读取编辑器的权限），并为 Textus AI 提供下面的 `number_headings` 工具（AI 工具权限）。这个工具返回写入或去掉编号后的文本，不修改任何文件。

## 更新日志

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `number_headings`：把编号写进一段 Markdown 的标题里（1、1.1、1.2），编号方式与编辑器中显示的一致（单独的总标题不编号），已有的编号会被替换；设 remove 时则去掉编号。返回处理后的文本，不写入任何文件。
<!-- /ai-tools -->
