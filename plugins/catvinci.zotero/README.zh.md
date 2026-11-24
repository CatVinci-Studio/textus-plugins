# Zotero

写作时直接从 Zotero 文献库插入引用。

## 准备

同一台电脑上要开着 Zotero 7 或更新版本（Zotero 10 也可以），并在 Zotero 的 **设置 › 高级** 中打开“允许此计算机上的其他应用程序与 Zotero 通信”。插件只和你电脑上的 Zotero 通信，数据不会离开这台电脑。

## 插入引用

- 按 **Ctrl+Alt+R**（Mac 上是 **⌘⌥R**），或在右键菜单里选 **从 Zotero 插入引用…**，或选 **插件 › 从 Zotero 插入引用…**。最近引用过的文献排在前面，之后可以搜索整个文献库。
- 如果选中了文字，就用这些文字搜索。
- 选中一条文献，引用就插入到光标处。
- 把鼠标停在引用上，或停在指向 Zotero 条目的链接上，会显示作者、年份、出处和摘要开头。
- **插件 › 插入参考文献列表** 在文末加上 **参考文献** 一节，列出文档引用的所有文献，按第一作者和年份排序。再运行一次会替换原来的列表，不会重复添加。

## 引用的写法

在插件设置的 **引用的写法** 里选择：

- **Pandoc 键：[@key]**（默认）。在 **设置 › 编辑与外观 › 导出** 里选好参考文献文件（.bib）后，用 Pandoc 导出时会变成格式化的参考文献。
- **作者和年份：(Author, 2024)**。
- **Obsidian 笔记链接：[[@key]]**，链接到这条文献的文献笔记。笔记还不存在时，插件会问你要不要新建。
- **能打开 Zotero 的链接**。

引用键取自条目的 Citation Key 字段（或 Extra 里的 `Citation Key:` 一行，Better BibTeX 就是这样写的）。

## 文献笔记

- **插件 › 从 Zotero 新建文献笔记…** 新建 `@citekey.md`（已经有了就直接打开），写入条目的标题、作者、年份、摘要、DOI 或网址，以及它在 Zotero 里的高亮和笔记。
- 笔记默认建在打开的文件夹下的 **References** 里，可以在 **文献笔记文件夹** 中修改。
- **文献笔记模板** 可以指向文件夹里的一个 Markdown 文件，比如 `Templates/Literature.md`，里面可以用 `{{title}}`、`{{authors}}`、`{{year}}`、`{{abstract}}`、`{{citekey}}`、`{{DOI}}`、`{{URL}}`、`{{highlights}}`、`{{notes}}` 和 `{{date:YYYY-MM-DD}}`。留空时，新建一篇带 front matter 的普通笔记。
- 在 Obsidian 库里，会沿用 Zotero Integration 或 Citations 插件设置的文件夹和模板。用其他模板语言写的模板，会改用普通笔记。

## 权限

- **网络，仅限 localhost:23119**：连接这台电脑上 Zotero 的本地接口。
- **读取和编辑文档**：插入引用和参考文献列表，用选中的文字搜索。
- **读写打开的文件夹中的文件**：读取模板和库里的 Zotero 插件设置，新建文献笔记。
- **Textus AI 工具**：让 Textus AI 能搜索你的文献库。

## 更新日志

- **0.4.6** - A simpler icon, drawn in the text colour.
- **0.4.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.4.4** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.4.3** - A citation now replaces the selected words; the References list no longer says Zotero is unreachable when it answers, and hover previews show up more reliably.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its code is split into smaller files by what each part does; nothing changes in use.
- **0.4.0** - literature note templates are filled by Textus's own template engine; needs Textus 1.3.10
- **0.3.0** - literature notes from Zotero, with a template and an Obsidian vault's settings; citations as `[[@citekey]]`
- **0.2.1** - the shortcut moves from Ctrl+Alt+C to Ctrl+Alt+R
- **0.2.0** - a tool for Textus AI, `search_library`
- **0.1.3** - listed for the desktop only
- **0.1.2** - works with Zotero 10's local API; the references list is replaced when made again, and code is never read for citations
- **0.1.0-0.1.1** - first versions: citing with recent works first, hover cards for citations, the references list, four citation styles

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `search_library`：搜索这台电脑上用户的 Zotero 文献库（需要 Zotero 7 或更新版本正在运行）：给出每个条目的 key、标题、作者、年份、类型、出处、引用键，以及按用户所选格式要插入的引文。连不上 Zotero 时会失败并说明该怎么做。
<!-- /ai-tools -->
