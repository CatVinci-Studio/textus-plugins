# 書籤

為一段文字加書籤，之後從側欄點一下就能跳回去，不限文件。

選取一些文字，選擇 **為選取文字加書籤**：在選取的文字上按右鍵，或使用 **外掛 › 為選取文字加書籤**。文件要先儲存，因為書籤要記住它所在的檔案。

側欄的 **書籤** 分頁依文件列出所有書籤，點一下就會開啟文件並跳到那段文字。在書籤上按右鍵，選 **刪除書籤** 即可刪除。文件改名或搬移後，書籤會跟著走。

## Obsidian 儲存庫

開啟的資料夾是 Obsidian 儲存庫（裡面有 `.obsidian` 資料夾）時：

- Obsidian 自己的書籤（`.obsidian/bookmarks.json`）也會列在這個分頁裡，放在 **Obsidian 書籤** 底下，保留 Obsidian 的群組。只列出筆記、標題和區塊的書籤，搜尋、資料夾等不列出。

## 權限

- 讀取文件：讀取選取的文字。
- 讀取檔案：用於 Obsidian 的 `bookmarks.json`。
- Textus AI 工具：讓 Textus AI 能列出你的書籤。

## 更新紀錄

- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `list_bookmarks`：列出使用者的書籤：每份文件中加了書籤的文字，以及該文件在開啟的資料夾中的路徑。
<!-- /ai-tools -->
