# 任务看板

把工作排成看板上一列列的卡片，看板就是一个普通的 Markdown 文件。

- **插件 › 新建任务看板…** 会让你起个名字，然后在打开的文件夹里新建 _名字_.md，front matter 里写着 `kanban-plugin: board`，并带有三个列表：待办、进行中、已完成。同名的看板已经存在时，直接打开它。
- 凡是 front matter 里有 `kanban-plugin` 的 .md 文件，都会作为看板打开。Obsidian 的 Kanban 插件就是这样保存看板的，所以两边可以互相打开对方的看板。以前命名为 _名字_.kanban.md 的看板也照样能打开。
- 每个列表是文件里的一个标题，每张卡片是它下面的一条任务，所以在任何地方打开都看得懂。

## 看板上的操作

- 在列表底部 **添加卡片**。点卡片文字可以编辑，勾上复选框表示完成。卡片的 ⋯ 按钮（或右键）可以把它移到别的列表或删除；删除后提示里的「撤销」可以找回来。
- **添加列表** 新建一个列表，直接输入名字。点列表标题可以改名；空列表可以从它的 ⋯ 菜单删除。
- 在手机上，一个列表占满屏幕，左右滑动到下一个。
- 卡片可以在列表内或列表之间拖动；按住列表顶部拖动可以调整列表顺序。拖动时，其他卡片和列表会自动让开位置。在触屏上，按住卡片片刻再拖动；手机上拖到屏幕边缘时，看板会翻到下一个列表。按住后不移动就松手，会打开这张卡片的菜单。
- 在卡片里写 [[链接]]，点一下就打开那篇笔记。
- **作为 Markdown 编辑** 以文本形式打开文件。在那里或其他地方做的修改，看板会立刻跟上。
- Obsidian 的 Kanban 在列表之外保存在文件里的内容，比如它的设置和完成列表上的标记，都原样保留。

```markdown
---
kanban-plugin: board
---

## 待办

- [ ] 写大纲

## 已完成

- [x] 定标题
```

## 权限

- 读写文件：打开和保存看板。
- Textus AI 工具：让 Textus AI 能找到和读取看板、添加卡片和移动卡片。

## 更新日志

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list.
- **0.4.13** - A card's ⋯ menu (or a right-click) moves it to another list or deletes it, with Undo, instead of an × that deleted at once - always showing on a touch screen. A new list starts with its name being written. On a phone a list fills the screen and a swipe settles on the next; in a narrow tab, Edit as Markdown goes into the ⋯ menu.
- **0.4.12** - Cards and lists make way at the pace of the rest of Textus.
- **0.4.11** - A list dragged by its head lifts and slides along the board as Textus's own tabs do; Esc puts it back.
- **0.4.10** - A card's checkbox sits on the middle of its first line at any text size.
- **0.4.9** - Right-clicking a card or list name while you edit it (to paste) no longer ends the edit, and an input method's Enter on iPhone and iPad picks its words instead of saving. The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.4.8** - A board with Windows (CRLF) line endings keeps them, and a board changed while you edit (saved as Markdown in Textus, or by a plugin) shows that change instead of writing over it, and says so. The store description now opens with what the plugin does.
- **0.4.7** - A blank line inside a card no longer splits it, and Escape no longer leaves an empty card. The AI leaves ordinary notes alone, and the board fits narrow panels.
- **0.4.6** - The board fades at its edges where lists run past the window.
- **0.4.5** - A dragged card or list stays right under the pointer and lifts like everything dragged in Textus. Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.4** - Dragging a card or a list no longer selects text on the way.
- **0.4.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.2** - Cards and lists follow the pointer as you drag, the others making way. Needs Textus 1.3.10.
- **0.4.1** - Keeps the mark Obsidian's Kanban puts on a done list.
- **0.4.0** - Renamed Task Board (was Kanban). New boards are plain .md files with `kanban-plugin` in their front matter, as Obsidian writes them; .kanban.md boards still open.
- **0.3.1** - Textus AI tells boards apart from tasks written in documents.
- **0.3.0** - Textus AI can list and read boards, add cards and move them.
- **0.2.0** - Textus's own controls and menus.
- **0.1.0-0.1.3** - First versions: boards as Markdown, cards dragged between lists, lists moved by their head, [[links]] that open notes, Edit as Markdown, changes made elsewhere shown at once, Obsidian's settings kept.

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `list_boards`：列出打开的文件夹中的看板（kanban-plugin .md 文件），以及每个看板的各个列表和其中的卡片数。
- `read_board`：读取一个看板：按顺序给出各个列表，以及每个列表里卡片的文字和是否已完成。普通文档里的任务用 list_tasks。
- `add_card`：在看板某个列表的末尾添加一张卡片。只用于看板（kanban-plugin .md）；文档里的待办用 add_task。
- `move_card`：把看板上的一张卡片移到另一个列表，或移到所在列表的另一个位置。
<!-- /ai-tools -->
