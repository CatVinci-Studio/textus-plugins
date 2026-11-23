# 版本紀錄

把文件每次儲存的內容留作一個版本，可以查看改了什麼，也能把舊版本找回來。

- 每次儲存，文件的文字都會留作一個版本。間隔很近的儲存（例如自動儲存每隔幾秒一次）算作同一個版本，最多每 15 分鐘產生一個新版本。最近一天的全部保留，一週內每小時留一個，三個月內每天留一個，更早的每週留一個。
- 側欄的 **紀錄** 分頁列出目前文件的各個版本，最新的在最上面，依日期分組：今天、昨天，然後是日期。
- 選一個版本，可以逐行看到從那之後改了什麼。
- 可以和現在的文件或任意另一個版本比較，修改的字詞會標出來。修改旁的「還原」只拿回這一處；「更多」裡可以為版本命名或釘選（之後一直保留），或另開為新文件。在 Textus 之外的修改（其他 App、同步、git）也會留下修改前後的版本。
- **還原** 會把舊內容當作一次修改交給文件，你可以像其他修改一樣接受或拒絕。**以新文件開啟** 則在旁邊開啟它。
- 版本存在 Textus 裡，不在你的資料夾中。超過 2 MB 的文件不保留版本；儲存空間滿了時，會先刪掉最舊的版本。

## 權限

- 讀取檔案和文件：保存每個版本，並和目前的內容比較。
- 提出修改：把舊版本當作一次修改送回文件，由你接受或拒絕。
- Textus AI 工具：讓 Textus AI 能列出文件的版本並比較。

## 更新紀錄

- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_versions`：列出一份文件（預設目前文件）儲存過的各個版本，最新的在前，從 1 開始編號，每個版本附儲存時間和大小。
- `diff_versions`：逐行顯示一份文件兩個版本之間、或某個版本與目前內容之間的改動：+ 表示新增，- 表示刪除，並附少量上下文。
<!-- /ai-tools -->
