# 任务

把文件夹里所有任务集中到一个列表。

- 在任何文档里写 `- [ ] 要做的事` 就是一条任务。
- 侧边栏的 **任务** 标签列出当前文件夹所有文档里的任务。
- 在那里直接勾选完成，或点一下跳到它所在的文档。
- 要不要显示已完成的任务，在插件设置里改。
- 给任务写上日期（`📅 2026-11-01` 或 `due:2026-11-01`），旁边会显示日期标签；已过期和 7 天内到期的任务会集中列在最上面的 **即将到期** 里。
- 顶部的输入框按文字、文档名或所在标题筛选任务。
- 看板上的卡片（front matter 里有 `kanban-plugin` 的文档，或 `名称.kanban.md`）交给看板，不列在这里。

## Obsidian 写的任务

Obsidian 的 Tasks 插件写的任务，在这里也一样：

- `[/]` 是进行中，仍算待办；`[-]` 是已取消，算已结束。
- 任务末尾的字段——📅 截止、⏳ 计划、🛫 开始、➕ 创建、✅ 完成、❌ 取消、优先级（🔺 ⏫ 🔼 🔽 ⏬）和 🔁 重复——留在文件里，列表里不显示。
- 勾选任务时写上 ✅ 和当天日期；取消勾选时去掉。
- 勾选重复任务（`🔁 every day`、`every 2 weeks`、`every weekday`、`every Monday`、`every month on the 15th`、`every year`、`… when done`）时，会在上一行加上下一次，日期顺延。

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

能读的规则：`not done` 和 `done`；`due`、`scheduled`、`starts`、`done`、`created` 加 `before`、`after`、`on`、`on or before`、`on or after` 和日期（2026-11-01、today、tomorrow、yesterday、this／next／last week、month、year）；`no due date` 和 `has due date`；`path`、`filename`、`description`、`heading` 加 `includes` 或 `does not include`；`tag includes`；`priority is`；`is recurring`；`sort by`、`group by`（path、folder、filename、heading、due、priority、status）和 `limit`。关于显示的行（`hide …`、`show …`）会略过；其他读不懂的行会列在数量下面。在块里勾选任务，就会勾选它所在文件里的那一行；点一下跳到它那里。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_tasks`：列出打开的文件夹中各文档里的 Markdown 任务（- [ ] ...），默认只列未完成的；每项带文字、截止日期、文档路径和行号。可按状态、文档、标签、截止日期和关键词筛选。 不含看板卡片（用 read_board）和定时提醒（用 list_reminders）。
- `add_task`：在打开的文件夹中的某个文档里添加一条任务（- [ ] ...）：加在文末，或某个标题下那一节的末尾；可带截止日期。文档不存在时会新建。返回任务所在位置。 要到点通知的用 add_reminder；看板上的卡片用 add_card，数据库的一行用 add_row，写进今天日记的用 append_to_daily_note。
- `complete_task`：按 list_tasks 给出的文档路径和行号，把一条任务勾为完成（- [x]）；done 为 false 时则改回未完成。会像 Obsidian Tasks 一样写上完成日期（✅ YYYY-MM-DD）；重复任务（🔁 every …）会在上一行加上下一次。
<!-- /ai-tools -->
