# 双向链接

输入 `[[` 链接笔记、标题或段落，用 `![[` 把它们嵌进来，并在侧边栏查看哪些笔记链接到当前文档。

`[[笔记]]` 这样的双链是 Textus 自带的，不装插件也能写、能点开。这个插件帮你写链接，把链接指向的内容直接显示出来，并列出当前文档周围的链接。

## 边写边链接

- 输入 `[[`，在弹出的面板里选一篇笔记：按文件名、第一个标题，或 front matter 里的 `aliases` 都能找到。选别名时写成 `[[笔记|别名]]`。
- 输入 `#` 后列出这篇笔记的标题：`[[笔记#标题]]`。`[[#` 列出当前文档自己的标题。
- 输入 `#^` 后列出它的段落：段落、列表项、表格、引用。没有 id 的段落，选中后会在那篇笔记里给它末尾加上一个（如 `^1a2b3c`），写法和 Obsidian 一样。
- 先选中几个字再输入 `[[`，就把它们变成链接。
- 链接按文件夹的写法写入：文件夹自己选的，或 Obsidian 库的链接格式；没有的话跟随这篇笔记已有的链接；都没有就写标准链接 `[Nov 8](Week45/Nov%208.md)`，在任何软件里都能打开。需要写路径的双链只显示页面名。

## 嵌入

- `![[笔记]]` 把整篇笔记显示在这里，`![[笔记#标题]]` 显示那一节，`![[笔记#^id]]` 显示那一段。嵌入的内容只读，原笔记改了会跟着更新。
- 把光标放到这一行上，就能编辑链接本身。

## 侧边栏里的链接

侧边栏的 **双向链接** 标签显示哪些笔记链接到当前文档，以及它链接到了哪里。

- **已链接提及**：其他笔记里用 [[维基链接]] 或文件链接指向这里的那几行。点一下就跳过去。
- **未链接提及**：提到这篇笔记（按文件名、第一个标题或 `aliases`）却没有加链接的地方。右键选 **添加链接**，就变成链接；如果那一行用的是别名，别名会保留为链接文字。
- **出链**：这篇笔记链接到的笔记，包括还没创建的。
- 顶部的输入框可以筛选列表。

## 标准链接还是双链

- **插件 › 新链接写法：标准链接还是双链…** 选择打开的文件夹里新链接怎么写。选择保存在文件夹的 `.textus/settings.json` 里，Textus 和其他插件都照着写。
- **插件 › 把链接转成标准链接…** 和 **把链接转成双链…** 改写当前文档或文件夹里所有笔记的链接。动手前先告诉你要改多少个链接，每个链接仍然指向原来的地方。代码、文件开头的属性和找不到目标的链接保持不变；图片和其他文件一直用标准链接。

## 权限

- **读取和编辑文档**：边写边补全链接，把选中的文字变成链接。
- **读写打开的文件夹中的文件**：查找链接和提及，给未链接提及补上链接，给段落加上 `^id`。
- **Textus AI 工具**：让 Textus AI 能列出一篇文档的链接。

## 更新日志

- **0.4.8** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_backlinks`：针对一篇文档（默认当前文档）：列出链接到它的笔记（路径、行号、那一行的文字）、提到它却没加链接的行，以及它链接到的笔记。
<!-- /ai-tools -->
