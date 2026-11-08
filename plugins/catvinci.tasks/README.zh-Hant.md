# 任務

把資料夾裡所有任務集中到一份清單。

- 在任何地方寫下 `- [ ] 要做的事`，就是一項任務。
- 側邊欄的 **任務** 分頁會列出開啟的資料夾中所有文件的任務。
- 直接在那裡勾選完成，或點一下跳到它所在的文件。
- 是否顯示已完成的任務，可以在外掛程式的設定中修改。
- 給任務加上日期（`📅 2026-11-01` 或 `due:2026-11-01`），旁邊就會顯示日期標籤；已過期和 7 天內到期的任務會集中列在最上面的 **即將到期** 裡。
- 頂端的輸入框可依文字、文件名稱或所在標題篩選任務。
- 看板上的卡片（front matter 裡有 `kanban-plugin` 的文件，或 `名稱.kanban.md`）交給看板，不列在這裡。

## Obsidian 寫的任務

Obsidian 的 Tasks 外掛寫的任務，在這裡也一樣：

- `[/]` 是進行中，仍算待辦；`[-]` 是已取消，算已結束。
- 任務末尾的欄位——📅 截止、⏳ 排定、🛫 開始、➕ 建立、✅ 完成、❌ 取消、優先順序（🔺 ⏫ 🔼 🔽 ⏬）和 🔁 重複——留在檔案裡，清單裡不顯示。
- 勾選任務時寫上 ✅ 和當天日期；取消勾選時拿掉。
- 勾選重複任務（`🔁 every day`、`every 2 weeks`、`every weekday`、`every Monday`、`every month on the 15th`、`every year`、`… when done`）時，會在上一行加上下一次，日期順延。

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

能讀的規則：`not done` 和 `done`；`due`、`scheduled`、`starts`、`done`、`created` 加 `before`、`after`、`on`、`on or before`、`on or after` 和日期（2026-11-01、today、tomorrow、yesterday、this／next／last week、month、year）；`no due date` 和 `has due date`；`path`、`filename`、`description`、`heading` 加 `includes` 或 `does not include`；`tag includes`；`priority is`；`is recurring`；`sort by`、`group by`（path、folder、filename、heading、due、priority、status）和 `limit`。關於顯示的行（`hide …`、`show …`）會略過；其他讀不懂的行會列在數量下面。在區塊裡勾選任務，就會勾選它所在檔案裡的那一行；點一下跳到它那裡。

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_tasks`：列出開啟的資料夾中各文件裡的 Markdown 任務（- [ ] ...），預設只列未完成的；每項附文字、截止日期、文件路徑和行號。可依狀態、文件、標籤、截止日期和關鍵字篩選。 不含看板卡片（用 read_board）和定時提醒（用 list_reminders）。
- `add_task`：在開啟的資料夾中的某份文件裡新增一條任務（- [ ] ...）：加在文末，或某個標題下那一節的末尾；可附截止日期。文件不存在時會新建。回傳任務所在位置。 要到點通知的用 add_reminder；看板上的卡片用 add_card，資料庫的一列用 add_row，寫進今天日記的用 append_to_daily_note。
- `complete_task`：依 list_tasks 給出的文件路徑和行號，把一條任務勾為完成（- [x]）；done 為 false 時則改回未完成。會像 Obsidian Tasks 一樣寫上完成日期（✅ YYYY-MM-DD）；重複任務（🔁 every …）會在上一行加上下一次。
<!-- /ai-tools -->
