# 日历与每日笔记

在当前文件夹里为每一天保存一篇笔记，侧边栏的日历可以带你回到任何一天。

- 按 **Ctrl+Alt+J**（Mac 上是 **⌘⌥J**），或选 **插件 › 打开今天的笔记**，就会打开今天的笔记；第一次打开时自动新建。
- **插件 › 打开前一天的笔记** 和 **插件 › 打开后一天的笔记**，从当前这天的笔记跳到前后一天。
- 侧边栏的 **日历** 标签显示一个月，有笔记的日子会标出来。点某一天打开那天的笔记，点 **今天** 回到今天。一周从哪天开始跟随 Textus 的语言，与周数一致。
- 已经存在的笔记不会被覆盖。

## 设置

- **每日笔记文件夹**：当前文件夹里的一个子文件夹，默认是 `Daily`。
- **新一天笔记的开头**：新笔记一开始的内容，默认是 `# {{date}}`。可以写 `{{date}}`、`{{weekday}}`、`{{yesterday}}` 和 `{{tomorrow}}`（可用来写 `[[{{yesterday}}]]` 这样的链接）、`{{time}}`、`{{title}}`、`{{date:格式}}` 和 `{{date+1d}}`；`\n` 表示换行。也可以直接写 Templates 文件夹里某个模板的名字，比如 `Daily`。
- **每周笔记** 和 **每月笔记**：默认关闭。打开后，用 **插件 › 打开本周笔记** 和 **打开本月笔记**，或点日历里的周数和月份名，就能打开它们。各自有自己的文件夹（`Weekly`、`Monthly`）、命名格式（`gggg-[W]ww` 得到 `2026-W45`，`YYYY-MM` 得到 `2026-11`）和模板。每周模板可以用 `{{monday:YYYY-MM-DD}}` … `{{sunday}}` 写出这一周的每一天。

## Obsidian 库

在 Obsidian 库里，改为按库自己的日记设置：文件夹、命名格式（比如 `YYYY/MM/YYYY-MM-DD` 或 `MMMM Do, YYYY`）和模板。Textus 不会改动这些设置。库里没有日记设置时，笔记放在库的最上层，和 Obsidian 一样。`{{date}}`、`{{yesterday}}` 和 `{{tomorrow}}` 按笔记的命名格式写出。库里装了 Periodic Notes 插件时，每周和每月笔记按它的设置来。

## 权限

插件需要读写当前文件夹里的文件，用来查找和新建笔记；还要读取当前打开的是哪篇文档，以便找到前一天和后一天。它也为 Textus AI 提供两个工具，见下文。支持桌面版和 iPhone，需要 Textus 1.3.10 或更新版本。

## 更新日志

- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `read_daily_note`：读取某一天的日记（默认今天）：从日记文件夹中给出它的路径、是否存在以及全文。
- `append_to_daily_note`：在某一天的日记（默认今天）末尾追加 Markdown 内容；如果还没有这篇日记，先按模板新建。 想先放在侧栏、以后再用的笔记用 add_note；带日期的待办用 add_task。
<!-- /ai-tools -->
