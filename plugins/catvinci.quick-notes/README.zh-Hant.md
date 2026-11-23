# 快速筆記

不離開目前的文件就能隨手記一筆，記下的內容會存進資料夾裡的收件匣檔案或今天的日記。

- 按 **Ctrl+Alt+N**（Mac 上是 **⌘⌥N**），或使用 **外掛 › 新增快速筆記…**，輸入一則筆記即可儲存。
- 在桌面版上，系統匣或選單列圖示裡也有 **新增快速筆記…**。外掛會請 Textus 在背景繼續執行，所以關掉所有視窗後也能用。
- 側欄的 **快速筆記** 分頁列出所有筆記，最新的在最上面。按 **新增** 直接在這裡寫一則，也可以在列表裡直接修改。
- 每則筆記的操作選單（按「更多」按鈕或右鍵）裡有 **插入**（插到文件的游標處）、**開啟** 和 **刪除**。存在文件裡的筆記，會在那份文件裡開啟並跳到它所在的行。
- 刪錯了？底部的 **復原** 能在幾秒內把它找回來。新增後什麼都沒寫的筆記會自動移除。
- 筆記有 6 則以上時，頂端會出現搜尋欄。

## 筆記存在哪裡

筆記存在開啟的資料夾裡的一份文件中，所以 Obsidian 和 Cloud Sync 都看得到。在外掛設定的 **筆記存到** 裡選擇位置：

- **收件匣檔案**（預設）：資料夾最上層的 `Inbox.md`，或在 **收件匣檔案** 裡設定的其他文件。每則筆記會以清單項目加在結尾，附上日期和時間，例如 `- 2026-11-08 14:05 打電話給安娜`。
- **今天的日記**：放在 `## 快速筆記` 標題下（標題使用介面語言），沒有的話會自動加上。每則筆記附上時間，例如 `- 14:05 打電話給安娜`。日記的資料夾、檔名和範本沿用資料夾的日記設定（例如 Obsidian 的）；沒有設定時是 `Daily/YYYY-MM-DD.md`。

直接修改這個檔案，側欄也會跟著變。舊版本存的筆記會一次搬進來，從舊到新排列。沒有開啟資料夾時，筆記存在 Textus 裡。

支援桌面版、iPhone、iPad 和 Android。在手機上，**新增快速筆記…** 在標題列選單的 **外掛** 裡，每則筆記的操作在它的「更多」按鈕裡。手機上沒有系統匣，所以不會請你讓 Textus 在背景執行。

## 權限

- 讀寫檔案：用於收件匣檔案或日記。
- 修改文件：把筆記插到游標處。
- Textus AI 工具：讓 Textus AI 能新增快速筆記。

## 更新紀錄

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `add_note`：在側邊欄的快速筆記列表頂端新增一則筆記，之後可以插入文件，或單獨開成一份文件。 寫今天的日記用 append_to_daily_note；待辦用 add_task。
<!-- /ai-tools -->
