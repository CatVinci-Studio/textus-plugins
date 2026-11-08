# 範本

用自己的範本新增文件或插入片段，自動填好日期、時間和標題。

- 範本就是打開的資料夾裡 **Templates** 資料夾中的 Markdown 檔案（在 Obsidian 庫裡，是庫的範本設定指定的資料夾），筆記到哪裡，範本就跟到哪裡。舊版本存的範本會自動移過去一次；重名的加上編號，不會覆蓋任何檔案。`{{date:YYYY-MM-DD}}`、`{{time:HH:mm}}` 可以指定格式，和 Obsidian 一樣。
- **從範本新增…** 在打開的資料夾裡用範本新增文件；**插入範本…**（或在內文輸入 `/`）把範本插到游標處。
- **存為範本…** 把目前的文件存成範本。
- 範本裡的 `{{date}}`、`{{time}}`、`{{title}}` 使用時會自動填好。一開始內建一個「會議記錄」範本。
- 在 Obsidian 庫裡，`{{date}}`、`{{time}}` 依庫的範本設定裡的日期、時間格式來寫。Templater 的常用標籤也會填好：`<% tp.date.now("YYYY-MM-DD") %>`（可以加天數偏移，如 `-1`，或 `"P1W"`）、`tp.date.today`、`tomorrow`、`yesterday`、`<% tp.file.title %>`、`tp.file.creation_date()` 和 `tp.file.folder()`；`<% tp.file.cursor() %>` 處會放游標。指令碼和其他標籤一律不執行，保持原樣，並用一則提示列出來。

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_templates`：列出使用者的文件範本，每個附名稱和 Markdown 內容；使用時其中的 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 標籤會被填入。
- `create_from_template`：用使用者的某個範本在開啟的資料夾中新建一份文件，並填入 {{date}}、{{time}}、{{title}} 以及 Templater 的 tp.date、tp.file 標籤。回傳它的路徑；notRun 列出保持原樣的標籤。
<!-- /ai-tools -->
