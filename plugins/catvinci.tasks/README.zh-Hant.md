# 任務

把資料夾裡所有任務彙整成一個清單，在那裡勾選完成，也能像 Obsidian Tasks 一樣查詢任務。

- 在任何文件裡寫 `- [ ] 要做的事` 就是一則任務。
- 側邊欄的 **任務** 分頁列出目前資料夾所有文件裡的任務，依文件分組，並顯示每則任務所在的標題。
- 在那裡直接勾選完成，或點一下跳到它所在的文件。
- 替任務寫上日期（`📅 2026-11-01`、`due:2026-11-01` 或 `[due:: 2026-11-01]`），旁邊會顯示日期標籤；已過期和 7 天內到期的任務會集中列在最上面的 **即將到期** 裡。
- 上方的輸入框可依文字、文件名稱或所在標題篩選任務。
- 已完成的任務預設不顯示，可以在 **設定 › 擴充功能 › 外掛程式 › 任務** 裡開啟 **顯示已完成的任務**。
- 看板上的卡片（開頭屬性裡有 `kanban-plugin` 的文件，或 `名稱.kanban.md`）屬於看板，不列在側邊欄裡。

## Obsidian 寫的任務

Obsidian 的 Tasks 外掛寫的任務，在這裡也一樣：

- `[/]` 是進行中，仍算待辦；`[-]` 是已取消，算已結束。
- 任務結尾的欄位（📅 截止、⏳ 排定、🛫 開始、➕ 建立、✅ 完成、❌ 取消、優先順序 🔺 ⏫ 🔼 🔽 ⏬ 和 🔁 重複）留在檔案裡，清單裡不顯示。
- 勾選任務時寫上 ✅ 和當天日期；取消勾選時拿掉完成或取消日期。
- 勾選重複任務時，會在上一行加上下一次，日期往後順延。看得懂的重複規則有 `🔁 every day`、`every 2 weeks`、`every weekday`、`every weekend`、`every Monday`、`every month on the 15th`、`every month on the last`、`every year` 和 `… when done` 等。

## 任務查詢

`tasks` 程式碼區塊依條件列出任務，一行一條規則，寫法和 Obsidian 一樣：

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **狀態**：`done`、`not done`，以及 `status.type is`（`todo`、`in_progress`、`done` 或 `cancelled`）。
- **日期**：`due`、`scheduled`、`starts`、`done`、`created`、`cancelled` 或 `happens`，加上 `before`、`after`、`on`、`in`、`on or before` 或 `on or after` 和日期：2026-11-01、today、tomorrow、yesterday，或 this／next／last 加 week、month、year。還有 `no due date` 和 `has due date`（其他日期同理）。
- **文字**：`path`、`folder`、`filename`、`description` 或 `heading` 加上 `includes` 或 `does not include`；`tag includes`、`tag does not include`、`has tags` 和 `no tags`。
- **其他**：`priority is`（也可加 `above`、`below`、`not`）、`is recurring` 和 `is not recurring`。
- **排序**：`sort by` 和 `group by`（status、due、scheduled、start、done、created、priority、path、folder、filename、heading 或 description，可加 `reverse`）以及 `limit`。沒寫 `sort by` 時，依 Obsidian Tasks 的順序：狀態、截止日期、優先順序、路徑。

跟顯示有關的行（`hide …`、`show …`）會略過；其他看不懂的行會列在數量下方。查詢區塊也會列出看板上的卡片。在區塊裡勾選任務，就會勾選它所在檔案裡的那一行；點一下跳到它那裡。

## 權限

外掛讀取資料夾裡的文件來找出任務，只在勾選或新增任務時寫入文件。它也為 Textus AI 提供下方的工具。電腦、iPhone 和 iPad 上都能使用。

## 更新紀錄

- **0.4.3** - 帶 HTML 註解的待辦現在也能勾選，勾選不成時會提示原因。`group by status` 分組順序正確，任務區塊在窄面板裡自動換行，截止日期樣式與側欄一致，打字更順暢。
- **0.4.2** - 說明和空狀態文字更簡短。
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - 使用 Textus 1.3.10 內建的日期功能，因此需要 Textus 1.3.10。
- **0.3.1** - 打包更新後的共用日期程式碼，其他沒有變動。
- **0.3.0** - 支援 Obsidian Tasks：`[/]` 和 `[-]`、任務欄位、完成日期、重複任務和 `tasks` 查詢區塊；開頭屬性標了 `kanban-plugin` 的看板不列入清單。
- **0.2.1** - 看板（`名稱.kanban.md`）上的卡片不再列出。
- **0.2.0** - Textus AI 可以列出、新增和勾選任務。
- **0.1.3** - 介面語言改變時，清單跟著切換。
- **0.1.2** - 截止日期依本地時間計算；數量依各語言的複數形式顯示。
- **0.1.0-0.1.1** - 最初的版本：把資料夾裡所有任務列在側邊欄，可以勾選或跳轉，附篩選、截止日期和「即將到期」。

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_tasks`：列出開啟的資料夾中各文件裡的 Markdown 任務（- [ ] ...），預設只列未完成的；每項附文字、截止日期、文件路徑和行號。可依狀態、文件、標籤、截止日期和關鍵字篩選。不含看板卡片（用 read_board）和定時提醒（用 list_reminders）。
- `add_task`：在開啟的資料夾中的某份文件裡新增一條任務（- [ ] ...）：加在文末，或某個標題下那一節的末尾；可附截止日期。文件不存在時會新建。回傳任務所在位置。要到點通知的用 add_reminder；看板上的卡片用 add_card，資料庫的一列用 add_row，寫進今天日記的用 append_to_daily_note。
- `complete_task`：依 list_tasks 給出的文件路徑和行號，把一條任務勾為完成（- [x]）；done 為 false 時則改回未完成。會像 Obsidian Tasks 一樣寫上完成日期（✅ YYYY-MM-DD）；重複任務（🔁 every …）會在上一行加上下一次。
<!-- /ai-tools -->
