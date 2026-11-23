# 任務看板

把工作排成看板上一欄欄的卡片，看板就是一個普通的 Markdown 檔案。

- **外掛 › 新增任務看板…** 會請你取個名字，然後在開啟的資料夾裡建立 _名稱_.md，front matter 裡寫著 `kanban-plugin: board`，並附上三個清單：待辦、進行中、已完成。同名的看板已經存在時，會直接開啟它。
- 只要 front matter 裡有 `kanban-plugin` 的 .md 檔案，都會以看板開啟。Obsidian 的 Kanban 外掛就是這樣儲存看板的，所以兩邊可以互相開啟對方的看板。以前命名為 _名稱_.kanban.md 的看板也照樣能開。
- 每個清單是檔案裡的一個標題，每張卡片是它底下的一項任務，所以在任何地方打開都看得懂。

## 看板上的操作

- 在清單底部 **新增卡片**。點卡片文字可以編輯，勾選核取方塊表示完成。卡片的 ⋯ 按鈕（或按右鍵）可以把它移到別的清單或刪除；刪除後提示裡的「復原」可以找回來。
- **新增清單** 建立一個清單，直接輸入名稱。點清單標題可以改名；空的清單可以從它的 ⋯ 選單刪除。
- 在手機上，一個清單佔滿螢幕，左右滑動到下一個。
- 卡片可以在清單內或清單之間拖曳；按住清單頂端拖曳可以調整清單順序。拖曳時，其他卡片和清單會自動讓出位置。在觸控螢幕上，按住卡片片刻再拖曳；手機上拖到螢幕邊緣時，看板會翻到下一個清單。按住後不移動就放開，會開啟這張卡片的選單。
- 在卡片裡寫 [[連結]]，點一下就開啟那篇筆記。
- **以 Markdown 編輯** 會以文字開啟檔案。在那裡或其他地方做的修改，看板會立刻跟上。
- Obsidian 的 Kanban 在清單之外存在檔案裡的內容，例如它的設定和完成清單上的標記，都會原樣保留。

```markdown
---
kanban-plugin: board
---

## 待辦

- [ ] 寫大綱

## 已完成

- [x] 決定標題
```

## 權限

- 讀寫檔案：開啟和儲存看板。
- Textus AI 工具：讓 Textus AI 能找到和讀取看板、新增卡片和移動卡片。

## 更新紀錄

- **0.4.14** - On a phone or tablet, hold a card a moment to drag it within a list or to another; at the screen's edge on a phone the board turns to the next list, and the page no longer scrolls under the card. Held and let go without moving, a card opens its menu. Dragged near the board's edge, the board scrolls, and a card let go below a short list goes into that list. Its page receives Textus's messages by the API's current name.
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

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_boards`：列出開啟的資料夾中的看板（kanban-plugin .md 檔案），以及每個看板的各個列表和其中的卡片數。
- `read_board`：讀取一個看板：依順序給出各個列表，以及每個列表裡卡片的文字和是否已完成。一般文件裡的任務用 list_tasks。
- `add_card`：在看板某個列表的末尾新增一張卡片。只用於看板（kanban-plugin .md）；文件裡的待辦用 add_task。
- `move_card`：把看板上的一張卡片移到另一個列表，或移到所在列表的另一個位置。
<!-- /ai-tools -->
