# Notion 导入

把 Notion 的导出包转成当前文件夹里的普通 Markdown 文件，Obsidian 也能直接读。

页面和子页面、图片和附件、页面之间的链接，以及使用 Obsidian Bases 格式的数据库，都会带过来。

1. 在 Notion 里选 **设置 › 导出全部工作区内容**，格式选 **Markdown & CSV**，并包含子页面。把得到的 .zip（或解压后的文件夹）放进 Textus 打开的文件夹。
2. 选 **插件 › 从 Notion 导入…**（或在侧边栏右键这个 .zip），选中导出包。一个 zip 里分成 Part-1.zip、Part-2.zip… 的大导出会合在一起导入。超过 256 MB 的 .zip 无法一次读入：先解压到打开的文件夹里，再选这个文件夹。
3. 给导入的文件夹起个名字（默认 **Notion**），已有的内容不会被改动。导入时有进度条，可以随时取消，已经写入的内容会保留。导入结束会打开一份报告；如果装了 **知识库**，侧边栏会把导入的内容显示成页面树。

## 导入后的样子

- **页面**：有子页面的页面（包括有子页面的数据库行）会变成一个文件夹，页面本身在里面，例如 `Plans/Plans.md`，子页面放在旁边；没有子页面的页面就是一个文件 `Plans.md`。Notion 文件名里的 id 会去掉；数据库行的页面会用完整标题（Notion 在文件名里会截短）。
- **数据库**：每个数据库变成一个文件夹，里面有一个装着 `base` 代码块的页面，各个视图点一下就能切换：有状态列时先显示看板，还有表格；有日期时还有日历。每一行都是这个文件夹里的一篇笔记，属性写在笔记开头：日期写成 2026-01-04，还有勾选、数字、列表，关联写成链接。别的页面里引用这个数据库的地方，也会同样显示出来，并保留导出时的排序。Notion 里完全空白的 “Untitled” 行和页面不会导入。
- **图片和附件** 放进显示它们的页面旁边的 `assets` 文件夹；粘贴进去的图片用页面的名字命名。
- **链接**：页面之间、指向图片和附件的链接都会改成新的名字。指向没有导出的页面的链接会列在报告里。
- **页面之间的链接**：导入开始时询问：标准链接（推荐）`[页面](页面.md)`，和 Notion 导出的一样，任何软件都能打开；或双链 `[[页面]]`，Obsidian 的写法。导入的文件夹会记住这个选择，之后在里面新建的页面也用同一种。
- **提示框（Callout）** 变成 `> [!NOTE]`，保留表情；折叠块保留为 `<details>`。

**页面图标**：Notion 的 Markdown 导出里没有页面图标。再导出一份同样页面的 HTML，导入时选上它，页面的 emoji 图标就会带过来。

**带不过来的**：Notion 的导出里没有封面、评论，也没有保存的视图筛选条件，所以这些不会导入；视图的排序会带过来。公式和汇总属性保留导出时的值，提到的人和日期变成普通文字。

## 导入报告

报告会统计导入了什么，列出找不到的链接、读写失败的文件和改动过的块，并推荐有帮助的插件：第一个是 **知识库**，用来看页面树和数据库；其次是双向链接、快速预览、任务、链接卡片、PDF 阅读器和模板，只在导入的内容用得上时才推荐。**插件 › Notion 导入后推荐的插件…** 可以挑一个安装，安装前 Textus 会先问你，不会自己装上任何插件。

## 权限

所有操作都在你的设备上完成：插件只读写打开的文件夹里的文件，从不联网。需要 Textus 1.3.10 或更新版本。

## 更新日志

- **0.7.13** - A simpler icon, drawn in the text colour.
- **0.7.12** - Its page is in every language Textus speaks. In Chinese, a database is 数据库, and 知识库 is only the Wiki plugin's name. Every language calls the Wiki plugin by its current name.
- **0.7.11** - Its package lists the libraries it carries, with their licenses.
- **0.7.10** - The database code it shares with Database brought up to date (its file columns filled).
- **0.7.9** - Databases it makes keep a view another plugin draws (Textus 1.4.6).
- **0.7.8** - The import report gets a free name as it is written (Textus 1.4.3).
- **0.7.7** - Bundles the Wiki plugin's newer base code; importing works as before.
- **0.7.6** - Importing a database with many rows is quicker.
- **0.7.5** - Page icons now come through from an unzipped HTML export too, and such an export shows up when you pick where the icons come from.
- **0.7.4** - Shares the database's updated filter code: a filter ticking several values reads the same in both. Shorter help and empty-state text.
- **0.7.3** - Once imported, the sidebar goes into the new folder (Textus 1.3.12) and shows its pages tree. Notion's blank rows and pages - no title, nothing written, only the "Not started" status Notion fills in - are left out.
- **0.7.2** - A database that sits under a page (as in Notion) stays a link on that page, no longer also shown there as a table; its own page shows it. Its code is split into smaller files by what each part does.
- **0.7.1** - Shares Two-way Links' fix for working out how a note links.
- **0.7.0** - asks how the pages link: standard links (recommended), as Notion exports them, or [[wiki links]] - a path shown by the page's name; the imported folder keeps the choice for pages made in it later
- **0.6.1** - Calls Workspace by its name in the import report and in the suggested plugins.
- **0.6.0** - Dates written by Textus itself; needs Textus 1.3.10.
- **0.5.0** - Page emoji icons, from Notion's HTML export of the same pages.
- **0.4.0** - Its own plugin again: pages with sub-pages as folders, databases as Obsidian bases, empty "Untitled" pages left out, and the import opened in Workspace's pages tree.
- **0.3.0** - Merged into Workspace for a while; this version only pointed there.
- **0.2.2** - One database block per database, opening on the board when there is a status.
- **0.2.1** - Asks what to name the import's folder; pasted pictures are named after their page.
- **0.2.0** - Reads Notion's newer exports: no doubled pages or rows, rows keep their whole titles, attachments go beside the page that uses them, databases shown on other pages keep their sort.
- **0.1.1** - The report suggests Two-way Links by its new name.
- **0.1.0** - First version: a Notion export (.zip or folder) into a folder of Markdown, ids out of names, links rewritten, databases as notes with front matter, callouts as notes, a report with plugins that help.
