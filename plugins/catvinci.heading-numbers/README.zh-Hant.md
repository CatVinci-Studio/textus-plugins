# 標題編號

寫作時在標題前顯示編號（1、1.1、1.2），不改動原文。

- 寫作時，每個標題前都會顯示它的編號：1、1.1、1.2、2…… 編號只是顯示出來，文件裡的文字維持原樣。
- 編號從文件最高一層的標題開始；如果這一層只有一個總標題，就從下一層開始。
- 文件已經手動替標題編號時，不會再加編號。判斷方式是：大部分頂層標題以 `1.`、`1.2`、`一、`、`第一章`、`(一)` 這類編號開頭。
- Obsidian：在文件開頭屬性寫上 `number headings: off`（Obsidian 的 Number Headings 外掛使用的設定），這份文件就不顯示編號。
- **匯出時帶編號**（**設定 › 擴充功能 › 外掛程式 › 標題編號**，預設開啟）：匯出 HTML 和 PDF 時顯示相同的編號。

外掛會讀取目前文件的標題（讀取編輯器的權限），並為 Textus AI 提供下方的 `number_headings` 工具（AI 工具權限）。這個工具回傳寫入或拿掉編號後的文字，不會修改任何檔案。

## 更新紀錄

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `number_headings`：把編號寫進一段 Markdown 的標題裡（1、1.1、1.2），編號方式與編輯器中顯示的一致（單獨的總標題不編號），已有的編號會被取代；設 remove 時則移除編號。回傳處理後的文字，不寫入任何檔案。
<!-- /ai-tools -->
