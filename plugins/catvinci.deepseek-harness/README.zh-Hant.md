# DeepSeek Harness

在 Textus AI 裡和 DeepSeek 官方的 Agent：DeepSeek Harness 對話。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org) 24.9 或更新版本，請先安裝。
2. 給它一次你的 DeepSeek API 金鑰：在終端機裡執行 `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web`，在它的 Models 頁面加入金鑰。
3. 點視窗右上角 Textus AI 旁邊的 DeepSeek Harness 按鈕。

Textus 用 `npx` 執行 `dsh --profile acp`（它的 Agent Client Protocol 伺服器），啟動 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。金鑰和用量都屬於 DeepSeek，Textus 不保存它的金鑰。DeepSeek Harness 還是預覽版，行為可能會改變。

Textus 會在它的唯讀沙盒裡啟動它：它可以自由讀取和搜尋，但寫入檔案或執行會改變東西的指令前，都會先問你。

DeepSeek Harness 預設會把工作階段紀錄傳給 DeepSeek；可以在 `dsh web` 的 Settings › General 裡關掉。Textus 會關掉它的用量回報。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
