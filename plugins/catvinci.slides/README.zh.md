# Marp

用 [Marp](https://marp.app) 的写法，把文档做成幻灯片放映。

## 做幻灯片

- 每个 `---` 开始新的一页。
- **插件 › 以幻灯片放映** 在文档旁边的标签页里显示幻灯片，随写作实时更新。← →（或 ↑ ↓、Page Up、Page Down）和空格键翻页；**全屏**（或按 F）开始放映。放映时，点画面左边三分之一回到上一页，点其他地方到下一页，左右滑动也能翻页；碰一下画面或移动鼠标会出现 **退出放映**，也可以按 Esc。
- 用 Marp 的指令选择主题和版式，例如写在文档开头：

```markdown
---
theme: gaia
paginate: true
---
```

- 图片会显示在幻灯片里，包括 Obsidian 的 `![[photo.png]]`；`![[photo.png|300]]` 设置宽度（`300x200` 同时设置宽和高）。

## 保存幻灯片

**插件 › 导出幻灯片为 HTML**（或幻灯片里的 **保存 HTML**）在文档旁边保存 `name.slides.html`：一个文件，用任何浏览器都能放映，按键一样。图片按文档所在文件夹里的路径链接，所以这个文件要和图片放在一起。需要先保存文档。

基于 [Marp Core](https://github.com/marp-team/marp-core)（MIT），自带主题（default、gaia、uncover）、数学公式和代码高亮，因此插件大约 4 MB。

## 权限

- **读取文档**：边写边画出幻灯片。
- **读写文件**：找到要显示的图片，并在文档旁边保存 HTML 幻灯片。
- **Textus AI 工具**：让 Textus AI 能帮你保存幻灯片。

桌面版和 iOS 都能用。

## 更新日志

- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `export_slides`：把当前文档按 Marp 幻灯片导出（每条 --- 分隔一页），在它旁边保存为一个 HTML 文件（name.slides.html），可在任何浏览器中放映。返回文件路径和页数。
<!-- /ai-tools -->
