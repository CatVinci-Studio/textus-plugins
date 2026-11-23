# 中英文间距

在中文、日文与英文字母或数字之间加上空格。

## 给文档加空格

- 选择 **插件 › 在中英文之间加空格**，或在右键菜单里选同一项。「用Textus写作」变成「用 Textus 写作」。整篇文档的改动可以一步撤销，完成后会提示改了几处。
- 在插件设置里打开 **保存时也自动加**，每次保存都会自动调整。只改正文：段落、标题、列表等。
- 韩文不处理：韩文本来就用空格分词。

## 保持原样的内容

- 代码、公式、链接和维基链接、脚注、#标签、提醒 (@…)、%% 批注、HTML 和 front matter，保存时也一样。
- Obsidian 的写法：块 id（^1a2b3c）、Dataview 字段（key:: value）、==高亮== 和 Obsidian Tasks 的字段（📅 2026-11-07）。

## 权限

- **读取和编辑文档**：给当前文档加空格。
- **写入文件**：打开 **保存时也自动加** 时，在保存时调整文档。
- **Textus AI 工具**：让 Textus AI 能帮你给一段文字加空格。

## 更新日志

- **0.3.0** - From Textus 1.4.4, a paragraph missing a space between CJK and Latin text is underlined; its card adds the spaces. Turn it off in the plugin's settings.
- **0.2.4** - A code block inside a longer fence (```` holding ```) is left alone.
- **0.2.3** - Its Textus AI tool says what it does: Chinese and Japanese, not Korean.
- **0.2.2** - leaves Obsidian's block ids, Dataview fields, highlights and Tasks fields as written
- **0.2.1** - leaves #tags, reminders and %% comments alone; on save only prose blocks change
- **0.2.0** - a tool for Textus AI, `fix_cjk_spacing`
- **0.1.3** - runs on the desktop and on iOS
- **0.1.2** - leaves links, wiki links, footnotes, tags and front matter alone
- **0.1.0-0.1.1** - first versions: the command in the right-click and Plugins menus, and spacing on save

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `fix_cjk_spacing`：在一段 Markdown 中给中日文字与英文字母、数字之间加上空格，代码和链接保持不变，和插件命令的做法一样。返回处理后的文本，不写入任何文件。
<!-- /ai-tools -->
