# 寫作統計

在側邊欄顯示字數、閱讀時間和每日寫作目標。

開啟側邊欄的 **寫作統計** 分頁：

- **目前文件**：字數、字元數和閱讀時間。
- **選取內容**：選取部分的字數和字元數。
- **今天**：你今天在所有文件裡新增的字數、對照每日目標的進度，以及連續達成目標的天數。在外掛設定的 **每日目標** 裡設定目標：沒改的話是 500，設為 0 就不設目標。
- **整個資料夾**：展開後統計開啟的資料夾裡的字數、字元數和文件數。

中文、日文和韓文按字計數，其他文字按詞計數。Markdown 本身的符號（`#`、`*`、連結網址、front matter）都不計。閱讀時間以每分鐘 230 個詞或 400 個中日韓文字估算。

需要 Textus 1.4.3 以上版本。外掛要求讀取編輯器和開啟的資料夾中的檔案，用來計數，並為 Textus AI 提供下方的工具。

## 更新紀錄

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Textus AI 工具

裝上這個外掛後，Textus AI 在對話中可以使用：

- `count_words`：統計一份文件、某個資料夾裡所有文件或目前文件的字數、字元數和閱讀時間（分鐘）；每個中日韓文字算一個詞，Markdown 標記不計。
<!-- /ai-tools -->
