# 日曆與每日筆記

在開啟的資料夾裡為每一天保存一篇筆記，側邊欄的日曆能帶你回到任何一天。

- 按 **Ctrl+Alt+J**（Mac 上為 **⌘⌥J**），或選擇 **外掛程式 › 開啟今天的筆記**，就會開啟今天的筆記；第一次開啟時會自動建立。
- **外掛程式 › 開啟前一天的筆記** 和 **外掛程式 › 開啟後一天的筆記**，從目前這天的筆記跳到前後一天。
- 側邊欄的 **日曆** 分頁會顯示一個月，有筆記的日子會標示出來。點選某一天開啟那天的筆記，點 **今天** 回到今天。每週從哪天開始依 Textus 的語言而定，與週數一致。
- 已經存在的筆記不會被覆寫。

## 設定

- **每日筆記資料夾**：開啟的資料夾裡的一個子資料夾，預設為 `Daily`。
- **新一天筆記的開頭**：新筆記一開始的內容，預設為 `# {{date}}`。可以使用 `{{date}}`、`{{weekday}}`、`{{yesterday}}` 和 `{{tomorrow}}`（可寫成 `[[{{yesterday}}]]` 這樣的連結）、`{{time}}`、`{{title}}`、`{{date:格式}}` 和 `{{date+1d}}`；`\n` 表示換行。也可以直接寫 Templates 資料夾裡某個範本的名稱，例如 `Daily`。
- **每週筆記** 和 **每月筆記**：預設關閉。開啟後，使用 **外掛程式 › 開啟本週筆記** 和 **開啟本月筆記**，或點選日曆裡的週數和月份名稱，就能開啟它們。各自有自己的資料夾（`Weekly`、`Monthly`）、命名格式（`gggg-[W]ww` 會得到 `2026-W45`，`YYYY-MM` 會得到 `2026-11`）和範本。每週範本可以用 `{{monday:YYYY-MM-DD}}` … `{{sunday}}` 寫出這一週的每一天。

## Obsidian 儲存庫

在 Obsidian 儲存庫裡，改依儲存庫自己的每日筆記設定：資料夾、命名格式（例如 `YYYY/MM/YYYY-MM-DD` 或 `MMMM Do, YYYY`）和範本。Textus 不會更動這些設定。儲存庫沒有每日筆記設定時，筆記會放在最上層，和 Obsidian 一樣。`{{date}}`、`{{yesterday}}` 和 `{{tomorrow}}` 會依筆記的命名格式寫出。儲存庫裝了 Periodic Notes 外掛時，每週和每月筆記依它的設定。

## 權限

外掛需要讀寫開啟的資料夾裡的檔案，用來尋找和建立筆記；也需要讀取目前開啟的是哪份文件，才能找到前一天和後一天。它還為 Textus AI 提供兩項工具，請見下方。需要 Textus 1.4.3 以上版本。

## 更新紀錄

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `read_daily_note`：讀取某一天的日記（預設今天）：從日記資料夾中給出它的路徑、是否存在以及全文。
- `append_to_daily_note`：在某一天的日記（預設今天）末尾附加 Markdown 內容；如果還沒有這篇日記，先依範本新建。 想先放在側邊欄、之後再用的筆記用 add_note；帶日期的待辦用 add_task。
<!-- /ai-tools -->
