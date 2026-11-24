# Keenable 搜尋

讓 Textus AI 用 [Keenable](https://keenable.ai) 搜尋網頁。

- 在對話中，你要求用 Keenable，或 Textus AI 自己的網頁搜尋沒有設定時，Textus AI 就會用它。預設取得 5 筆結果（最多 10 筆），每筆都有標題、網址、一段簡短文字和日期。
- 不需要金鑰也能用，走的是 Keenable 的公開搜尋。要使用 Keenable 的完整搜尋，請在 Textus 設定裡它的頁面上點 **設定 API 金鑰…**（或從命令面板執行 **Keenable：設定 API 金鑰…**），貼上你的金鑰。再做一次並留空，就會移除金鑰、改回公開搜尋。金鑰保存在這台裝置上 Textus 的安全儲存空間裡。
- 只有 Textus AI 在對話中使用這個工具時，你問的內容才會傳給 Keenable。

外掛要求兩項權限：AI 工具，為 Textus AI 提供下方的搜尋工具；以及只連線到 `api.keenable.ai` 的網路權限，用來執行搜尋。

## 更新紀錄

- **0.1.4** - A simpler icon, drawn in the text colour.
- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `keenable_search`：用 Keenable 搜尋網頁，回傳每筆結果的標題、網址、一段簡短文字和日期。使用者指定要用 Keenable，或 Textus AI 內建的網頁搜尋沒有設定時使用。
<!-- /ai-tools -->
