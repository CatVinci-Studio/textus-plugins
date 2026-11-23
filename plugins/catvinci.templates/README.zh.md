# 模板

用你自己的模板新建文档、插入片段，日期、时间和标题会自动填好。

模板就是打开的文件夹里 **Templates** 文件夹中的 Markdown 文件（在 Obsidian 库里，是它的模板设置指定的文件夹），所以会跟着你的笔记走。还没有任何模板时，会先建一个 **会议记录** 模板。

- **插件 › 从模板新建…** 用某个模板在打开的文件夹最上层新建一篇文档。它会问文档名，已经有同名文档时不会新建。
- **插件 › 插入模板…**，或斜杠菜单里的 **插入模板…**，把模板插到光标处。
- **插件 › 存为模板…** 把当前文档存成模板。名字已被占用时会加上编号，不会覆盖任何文件。

## 会填什么

- 用模板时会填好 `{{date}}`、`{{time}}` 和 `{{title}}`；`{{date:YYYY-MM-DD}}`、`{{time:HH:mm}}` 可以指定格式，和 Obsidian 一样。
- 在 Obsidian 库里，`{{date}}` 和 `{{time}}` 使用库的模板设置里的日期、时间格式。
- Templater 的常用标签也会填好：`<% tp.date.now("YYYY-MM-DD") %>`（可带天数偏移，比如 `-1`，或 `"P1W"`）、`tp.date.today`、`tomorrow` 和 `yesterday`、`<% tp.file.title %>`、`tp.file.creation_date()` 和 `tp.file.folder()`；`<% tp.file.cursor() %>` 会把光标放在那里。
- 脚本和其他标签一律不执行：原样保留，并用一条通知列出它们。

需要 Textus 1.4.3 或更新版本。插件需要读写打开的文件夹里的文件，用来存放模板和新文档；读取和编辑当前文档，用来插入模板或存为模板；并为 Textus AI 提供下面两个工具。

## 更新日志

- **0.5.6** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.5.5** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller. Needs Textus 1.4.3.
- **0.5.4** - A taken name gets the next free one as the file is written, never a clash (Textus 1.4.3).
- **0.5.3** - The store description now opens with what the plugin does.
- **0.5.2** - Templates in a hidden or lowercase templates folder, and in its subfolders, now show up. After Insert, the caret lands right after the template.
- **0.5.1** - **New from Template…** from a file's or folder's right-click menu makes the document in that folder.
- **0.5.0** - Templates are filled in by Textus itself, the same way as daily notes; needs Textus 1.3.10.
- **0.4.1** - Templates are listed in natural order: 2 before 10.
- **0.4.0** - Templater's common `tp.date` and `tp.file` tags, and an Obsidian vault's Templates date and time formats; tags that aren't run are named in a notice.
- **0.3.0** - Templates are Markdown files in the Templates folder (a vault's own templates folder in Obsidian), moved there once from where older versions kept them; `{{date:FORMAT}}` and `{{time:FORMAT}}`.
- **0.2.0** - Textus AI can list your templates and make a document from one.
- **0.1.3** - Says where it runs: desktop and iPhone.
- **0.1.2** - New from Template refuses a name that is already taken.
- **0.1.0-0.1.1** - First versions: new documents, inserted snippets and saved templates, with `{{date}}`, `{{time}}` and `{{title}}`; store page and icon.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_templates`：列出用户的文档模板，每个带名称和 Markdown 内容；使用时其中的 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 标签会被填入。
- `create_from_template`：用用户的某个模板在打开的文件夹中新建一篇文档，并填入 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 标签。返回它的路径；notRun 列出保持原样的标签。
<!-- /ai-tools -->
