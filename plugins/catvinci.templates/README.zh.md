# 模板

用自己的模板新建文档或插入片段，自动填好日期、时间和标题。

- 模板就是打开的文件夹里 **Templates** 文件夹中的 Markdown 文件（在 Obsidian 库里，是库的模板设置指定的文件夹），笔记到哪里，模板就跟到哪里。旧版本存的模板会自动移过去一次；重名的加上编号，不会覆盖任何文件。`{{date:YYYY-MM-DD}}`、`{{time:HH:mm}}` 可以指定格式，和 Obsidian 一样。
- **从模板新建…** 在打开的文件夹里用模板新建文档；**插入模板…**（或在正文输入 `/`）把模板插到光标处。
- **存为模板…** 把当前文档存成模板。
- 模板里的 `{{date}}`、`{{time}}`、`{{title}}` 使用时会自动填好。一开始自带一个「会议记录」模板。
- 在 Obsidian 库里，`{{date}}`、`{{time}}` 按库的模板设置里的日期、时间格式来写。Templater 的常用标签也会填好：`<% tp.date.now("YYYY-MM-DD") %>`（可以加天数偏移，如 `-1`，或 `"P1W"`）、`tp.date.today`、`tomorrow`、`yesterday`、`<% tp.file.title %>`、`tp.file.creation_date()` 和 `tp.file.folder()`；`<% tp.file.cursor() %>` 处会放光标。脚本和其他标签一律不运行，保持原样，并用一条提示列出来。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_templates`：列出用户的文档模板，每个带名称和 Markdown 内容；使用时其中的 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 标签会被填入。
- `create_from_template`：用用户的某个模板在打开的文件夹中新建一篇文档，并填入 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 标签。返回它的路径；notRun 列出保持原样的标签。
<!-- /ai-tools -->
