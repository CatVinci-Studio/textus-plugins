# 思维导图（Markmap）

在代码块里写由标题和列表组成的 Markdown 大纲，画成思维导图。

写一个语言为 `markmap` 的代码块，在里面写大纲：标题（`#`、`##`）和列表项就是导图的分支。代码块下方会画出导图；点进代码块可以再次查看和修改源码。

- 拖动导图可以移动，也可以放大缩小。点分支上的圆点可以折叠或展开它。
- 在语言后面写 `height=400` 可以设置导图高度（单位像素，默认 360）。
- 分支颜色跟随主题，切换主题时会重新绘制。
- 导出 HTML、PDF、Word 时，导图会作为图片放进去，滚到看不见的导图也一样。

插件基于 [markmap](https://markmap.js.org)。它只申请一项权限：为 Textus AI 提供下面列出的 `check_markmap` 工具，让它在把代码块写进文档前先检查一遍。

## 示例

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## 更新日志

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right. Its page no longer says which devices it runs on: the store shows that.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `check_markmap`：在把 ```markmap 块写进文档之前检查它的源码（以标题和列表项作为思维导图分支的 Markdown 大纲），不实际绘制。返回 ok，或需要先修正的问题。传入时不带代码围栏。
<!-- /ai-tools -->
