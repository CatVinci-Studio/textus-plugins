# 任务

把文件夹里所有任务集中到一个列表，在那里勾选完成，也能像 Obsidian Tasks 一样查询任务。

- 在任何文档里写 `- [ ] 要做的事` 就是一条任务。
- 侧边栏的 **任务** 标签列出当前文件夹所有文档里的任务，按文档分组，并显示每条任务所在的标题。
- 在那里直接勾选完成，或点一下跳到它所在的文档。
- 给任务写上日期（`📅 2026-11-01`、`due:2026-11-01` 或 `[due:: 2026-11-01]`），旁边会显示日期标签；已过期和 7 天内到期的任务会集中列在最上面的 **即将到期** 里。
- 顶部的输入框按文字、文档名或所在标题筛选任务。
- 已完成的任务默认不显示，可以在 **设置 › 扩展 › 插件 › 任务** 里打开 **显示已完成的任务**。
- 看板上的卡片（开头属性里有 `kanban-plugin` 的文档，或 `名称.kanban.md`）属于看板，不列在侧边栏里。

## Obsidian 写的任务

Obsidian 的 Tasks 插件写的任务，在这里也一样：

- `[/]` 是进行中，仍算待办；`[-]` 是已取消，算已结束。
- 任务末尾的字段（📅 截止、⏳ 计划、🛫 开始、➕ 创建、✅ 完成、❌ 取消、优先级 🔺 ⏫ 🔼 🔽 ⏬ 和 🔁 重复）留在文件里，列表里不显示。
- 勾选任务时写上 ✅ 和当天日期；取消勾选时去掉完成或取消日期。
- 勾选重复任务时，会在上一行加上下一次，日期顺延。能读懂的重复规则有 `🔁 every day`、`every 2 weeks`、`every weekday`、`every weekend`、`every Monday`、`every month on the 15th`、`every month on the last`、`every year` 和 `… when done` 等。

## 任务查询

`tasks` 代码块按条件列出任务，一行一条规则，写法和 Obsidian 一样：

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **状态**：`done`、`not done`，以及 `status.type is`（`todo`、`in_progress`、`done` 或 `cancelled`）。
- **日期**：`due`、`scheduled`、`starts`、`done`、`created`、`cancelled` 或 `happens`，加 `before`、`after`、`on`、`in`、`on or before` 或 `on or after` 和日期：2026-11-01、today、tomorrow、yesterday，或 this／next／last 加 week、month、year。还有 `no due date` 和 `has due date`（其他日期同理）。
- **文字**：`path`、`folder`、`filename`、`description` 或 `heading` 加 `includes` 或 `does not include`；`tag includes`、`tag does not include`、`has tags` 和 `no tags`。
- **其他**：`priority is`（也可加 `above`、`below`、`not`）、`is recurring` 和 `is not recurring`。
- **排序**：`sort by` 和 `group by`（status、due、scheduled、start、done、created、priority、path、folder、filename、heading 或 description，可加 `reverse`）以及 `limit`。不写 `sort by` 时，按 Obsidian Tasks 的顺序：状态、截止日期、优先级、路径。

关于显示的行（`hide …`、`show …`）会略过；其他读不懂的行会列在数量下面。查询块也会列出看板上的卡片。在块里勾选任务，就会勾选它所在文件里的那一行；点一下跳到它那里。

## 权限

插件读取文件夹里的文档来找出任务，只在勾选或添加任务时写入文档。它还为 Textus AI 提供下面的工具。电脑、iPhone 和 iPad 上都能用。

## 更新日志

- **0.4.3** - 带 HTML 注释的待办现在也能勾选，勾选不成时会提示原因。`group by status` 分组顺序正确，任务块在窄面板里自动换行，截止日期样式与侧栏一致，打字更轻快。
- **0.4.2** - 说明和空状态文字更简短。
- **0.4.1** - 工具栏、列表和各个控件都改用 Textus 自己的，随界面一起缩放，适配每个主题；需要 Textus 1.3.12。新增设置「完成的待办移到列表末尾」：在文档或列表里勾选的待办会排到未完成项后面（第一次会请求读取和编辑当前文档的权限）。
- **0.4.0** - 使用 Textus 1.3.10 内置的日期功能，因此需要 Textus 1.3.10。
- **0.3.1** - 打包更新后的公共日期代码，其他没有变化。
- **0.3.0** - 支持 Obsidian Tasks：`[/]` 和 `[-]`、任务字段、完成日期、重复任务和 `tasks` 查询块；开头属性标了 `kanban-plugin` 的看板不列入列表。
- **0.2.1** - 看板（`名称.kanban.md`）上的卡片不再列出。
- **0.2.0** - Textus AI 可以列出、添加和勾选任务。
- **0.1.3** - 界面语言改变时，列表随之切换。
- **0.1.2** - 截止日期按本地时间计算；数量按各语言的复数形式显示。
- **0.1.0-0.1.1** - 最初的版本：把文件夹里所有任务列在侧边栏，可以勾选或跳转，带筛选、截止日期和「即将到期」。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_tasks`：列出打开的文件夹中各文档里的 Markdown 任务（- [ ] ...），默认只列未完成的；每项带文字、截止日期、文档路径和行号。可按状态、文档、标签、截止日期和关键词筛选。不含看板卡片（用 read_board）和定时提醒（用 list_reminders）。
- `add_task`：在打开的文件夹中的某个文档里添加一条任务（- [ ] ...）：加在文末，或某个标题下那一节的末尾；可带截止日期。文档不存在时会新建。返回任务所在位置。要到点通知的用 add_reminder；看板上的卡片用 add_card，数据库的一行用 add_row，写进今天日记的用 append_to_daily_note。
- `complete_task`：按 list_tasks 给出的文档路径和行号，把一条任务勾为完成（- [x]）；done 为 false 时则改回未完成。会像 Obsidian Tasks 一样写上完成日期（✅ YYYY-MM-DD）；重复任务（🔁 every …）会在上一行加上下一次。
<!-- /ai-tools -->
