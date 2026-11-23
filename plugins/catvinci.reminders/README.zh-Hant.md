# 提醒

在一行裡寫上時間，例如 `(@2026-11-02 09:00)`，到時就會用系統通知提醒你這一行。

標記可以寫在任何一行：任務、標題，任何一行都行。時間到了，通知會顯示那一行的文字和所在的文件；點一下就會開啟那一行。

- 只寫 `(@2026-11-02)` 時，會在那天早上九點提醒你。
- **外掛程式 › 提醒我…**，或斜線選單裡的 **提醒我…**，會幫你在游標處寫上標記：一小時後、今晚 8 點、明天 9 點、下週一 9 點，或你輸入的日期和時間。
- 已勾選的任務（`- [x] …`）表示已完成，不會提醒。
- 側邊欄的 **提醒** 分頁列出即將到來的提醒，最近的排在前面；點一下就會開啟那一行。
- 提醒由 Textus 自己保存：有視窗開著時會提醒；開啟 **在背景持續執行**（**設定 › 一般**）時，關掉所有視窗也會提醒。Textus 沒在執行時錯過的提醒，會在下次啟動時跳出來。

標記的寫法和 Obsidian 的 Reminder 外掛相同，所以同樣的筆記在那裡也會提醒你。

需要 Textus 1.4.3 以上版本。外掛需要讀取開啟的資料夾中的檔案，用來找出標記；在編輯器裡寫入，用來加上標記；顯示通知；並為 Textus AI 提供下方兩項工具。

## 更新紀錄

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_reminders`：列出即將到來的提醒（開啟的資料夾中各文件裡的 (@2026-11-02 09:00) 標記），依時間先後排列，每條附時間、文字、文件路徑和行號。 依截止日期列任務用 list_tasks。
- `add_reminder`：在目前文件末尾新增一條提醒，寫成附時間的任務行：- [ ] 文字 (@2026-11-02 09:00)；到時會跳出通知。 使用者要在某個時間被提醒時用它；只有截止日期的待辦用 add_task。
<!-- /ai-tools -->
