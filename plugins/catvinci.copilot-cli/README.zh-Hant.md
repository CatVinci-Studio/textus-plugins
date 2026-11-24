# GitHub Copilot CLI

在 Textus AI 裡和 GitHub Copilot CLI 對話，使用你 Copilot 訂閱方案裡的模型。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。它的模式（agent、plan、autopilot）、模型和「全部允許」開關，在 Textus AI 模型選單旁邊的選單裡；「全部允許」預設是關閉的。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org)，請先安裝。你需要 GitHub Copilot 訂閱方案。
2. 在終端機裡執行一次：`npx @github/copilot login`。
3. 點視窗右上角 Textus AI 旁邊的 GitHub Copilot CLI 按鈕。

Textus 用 `npx` 執行 `copilot --acp`（它的 Agent Client Protocol 伺服器），啟動 [GitHub Copilot CLI](https://github.com/github/copilot-cli)。Copilot CLI 是 GitHub 自己的軟體，採用它自己的授權；帳號和用量都屬於 GitHub，Textus 不保存它的權杖。

Autopilot 會自己一直做下去，用掉更多進階請求次數。Textus 固定使用它啟動的版本：Copilot 在這裡不會自行更新。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
