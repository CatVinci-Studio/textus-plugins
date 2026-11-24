# 關係圖譜

把你的筆記和它們之間的連結畫成一張圖，可以看整個資料夾，也可以只看目前文件周圍。

- 按 **Ctrl+Alt+G**（Mac 上是 **⌘⌥G**），或使用 **外掛 › 開啟知識圖譜**，在分頁裡查看整個資料夾。**符合視窗** 讓整張圖都顯示出來。
- 側邊欄的 **圖譜** 分頁顯示目前文件周圍的筆記。按側邊欄圖譜面板頂端的按鈕開啟整個資料夾。
- [[雙向連結]] 和指向其他文件的連結都算；兩篇筆記互相連結時只畫一條線。指向還沒寫的筆記的 [[連結]]，也會顯示成一個節點。
- 點一篇筆記就會開啟。拖曳筆記可以擺放位置，拖曳空白處可以平移，用滾輪或雙指縮放。游標停在筆記上，會標亮它的連結。在觸控螢幕上，點一下筆記會標亮它的連結，再點一下才開啟。
- 圖會自動調整：放大後顯示名稱，連結不多時用箭頭標出方向，連結越多的筆記越大。沒有設定顏色群組時，每篇筆記使用所在資料夾的顏色。
- 資料夾裡的文件有變動時，圖會重新繪製。

## 設定

按完整圖譜頂端的滑桿按鈕開啟它的設定；側邊欄圖譜沒有設定。

- **篩選**：搜尋（`path:ideas`、`file:draft`、`tag:#todo`，前面加 `-` 表示排除）；**標籤** 把 #標籤 也畫成節點；**僅顯示已存在的檔案** 隱藏還沒寫的筆記；**孤立檔案**（完整圖譜）顯示沒有任何連結的筆記。
- **分組**：為搜尋到的筆記上色。**新增分組** 加入一組；**還原預設值** 取消你的修改。

在 Obsidian 儲存庫裡，Obsidian 的 `graph.json` 中儲存的顏色群組也會用來上色，排在你自己的分組之後。

## 權限

- 讀取檔案和文件：找出資料夾裡的筆記和連結，以及 Obsidian 的 `graph.json`。
- Textus AI 工具：讓 Textus AI 能看到一份文件周圍的筆記。

## 更新紀錄

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

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_neighbours`：給出一份文件（預設目前文件）在筆記關係圖中的周邊：幾步連結之內（不論方向）的筆記、各自相隔幾步，以及它們之間的連結。指向不存在筆記的 [[連結]] 記為 missing。
<!-- /ai-tools -->
