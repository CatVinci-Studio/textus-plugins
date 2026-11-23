# 提醒

在一行里写上时间，比如 `(@2026-11-02 09:00)`，到时会弹出系统通知提醒你这一行。

标记可以写在任何一行里：待办、标题都可以。到了那个时间，通知会显示这一行的文字和所在文档，点通知就会打开这一行。

- 只写 `(@2026-11-02)`，会在当天早上 9 点提醒。
- **插件 › 提醒我…**，或斜杠菜单里的 **提醒我…**，会在光标处帮你插入时间标记：一小时后、今晚 8 点、明天 9 点、下周一 9 点，或自己输入的日期和时间。
- 打了勾的待办（`- [x] …`）算已完成，不再提醒。
- 侧边栏的 **提醒** 标签按时间先后列出即将到来的提醒，点一条就打开那一行。
- 提醒由 Textus 自己记着：有窗口开着时会准时提醒；打开 **设置 › 通用** 里的 **在后台保持运行** 后，窗口全关了也照样提醒。Textus 没运行时错过的提醒，会在下次启动时补上。

标记的写法与 Obsidian 的 Reminder 插件相同，同一份笔记在那边也能提醒。

需要 Textus 1.4.3 或更新版本。插件需要读取打开的文件夹里的文件，用来找到标记；在编辑器里写入，用来插入标记；显示通知；并为 Textus AI 提供下面两个工具。

## 更新日志

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_reminders`：列出即将到来的提醒（打开的文件夹中各文档里的 (@2026-11-02 09:00) 标记），按时间先后排列，每条带时间、文字、文档路径和行号。 按截止日期列任务用 list_tasks。
- `add_reminder`：在当前文档末尾添加一条提醒，写成带时间的任务行：- [ ] 文字 (@2026-11-02 09:00)；到时会弹出通知。 用户要在某个时间被提醒时用它；只有截止日期的待办用 add_task。
<!-- /ai-tools -->
