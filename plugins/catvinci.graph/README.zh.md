# 关系图谱

把你的笔记和它们之间的链接画成一张图，可以看整个文件夹，也可以只看当前文档周围。

- 按 **Ctrl+Alt+G**（Mac 上是 **⌘⌥G**），或用 **插件 › 打开知识图谱**，在标签页里查看整个文件夹。**适应窗口** 让整张图都显示出来。
- 侧边栏的 **图谱** 标签页显示当前文档周围的笔记。点侧边栏图谱面板顶部的按钮打开整个文件夹。
- [[双链]] 和指向其他文档的链接都算；两篇笔记互相链接时只画一条线。指向还没写的笔记的 [[链接]]，也会显示成一个节点。
- 点一篇笔记就打开它。拖动笔记可以摆放位置，拖动空白处可以平移，滚轮或双指缩放。鼠标停在笔记上，会高亮它的链接。在触屏上，点一下笔记会高亮它的链接，再点一下才打开。
- 图会自己调整：放大后显示名字，链接不多时用箭头标出方向，链接越多的笔记越大。没有设置颜色分组时，每篇笔记用它所在文件夹的颜色。
- 文件夹里的文档有变化时，图会重新绘制。

## 设置

点完整图谱顶部的滑块按钮打开它的设置；侧边栏图谱没有设置。

- **筛选**：搜索（`path:ideas`、`file:draft`、`tag:#todo`，前面加 `-` 表示排除）；**标签** 把 #标签 也画成节点；**仅显示已存在的文件** 隐藏还没写的笔记；**孤立文件**（完整图谱）显示没有任何链接的笔记。
- **分组**：给搜索到的笔记上色。**新建分组** 添加一组；**恢复默认** 撤销你的修改。

在 Obsidian 库里，Obsidian 的 `graph.json` 里保存的颜色分组也会用来上色，排在你自己的分组之后。

## 权限

- 读取文件和文档：找出文件夹里的笔记和链接，以及 Obsidian 的 `graph.json`。
- Textus AI 工具：让 Textus AI 能看到一篇文档周围的笔记。

## 更新日志

- **0.5.10** - By touch, a first tap on a note lights it and its links and a second opens it; notes are easier to hit with a finger, and a second finger zooms instead of also moving the graph. Its settings open in Textus's own popover.
- **0.5.9** - Esc while dragging a note or the view puts it back, and a touch the system cancels no longer leaves a drag stuck.
- **0.5.8** - The graph in the sidebar spreads out to fit its panel, instead of starting as a small clump with labels on top of each other. Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.5.7** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.6** - The counts and buttons at the top of the graph tab stay in view: scrolling or pinching over the graph no longer pushes them up under the tab. Labels no longer pile on top of each other: the most linked notes keep theirs and the rest show as you zoom in. A big folder opens already laid out instead of unfolding, and pictures and other attachments a note links to stay out of the graph unless you turn on Attachments in its settings. Switching documents or saving no longer shakes the whole graph loose to settle again.
- **0.5.5** - Standard Markdown links to notes not written yet are placed as Textus places them, and merge with [[links]] to the same note. Fit spreads a small graph over the whole pane, so names no longer sit on each other. Ctrl/Cmd-click opens a note beside the one in front. Labels follow the interface text size, and folder colours follow the theme. The sidebar graph has no settings of its own any more.
- **0.5.4** - A trackpad pinch zooms smoothly, in step with the gesture; with Textus 1.3.13 a pinch on a Mac zooms the graph, not the document behind it. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.5.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.2** - Obsidian's colour groups come from the nearest vault, even one above the open folder. Needs Textus 1.3.10.
- **0.5.1** - In an Obsidian vault, the colour groups in `.obsidian/graph.json` colour the notes too.
- **0.5.0** - [[Links]] are matched to notes the same way Textus matches them when you click one.
- **0.4.0** - Textus AI can see the notes around a document (`list_neighbours`).
- **0.3.0** - Textus's own controls and menus; colours from the theme.
- **0.2.0-0.2.1** - A settings panel with filters, search and colour groups; tags as nodes; arrows for link direction; the sidebar graph's depth.
- **0.1.0-0.1.1** - First versions: the whole folder in a tab and the notes around the open document in the sidebar, coloured by folder, smooth with thousands of notes.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_neighbours`：给出一篇文档（默认当前文档）在笔记关系图中的周边：几步链接之内（不论方向）的笔记、各自相隔几步，以及它们之间的链接。指向不存在笔记的 [[链接]] 记为 missing。
<!-- /ai-tools -->
