# OpenCode

在 Textus AI 裡和 OpenCode 對話，使用你替它設定好的任何模型。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。想讓它不必詢問就動手，請在模型旁邊的選單裡選「全部允許」（需要 Textus 1.4.3 以上版本）。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org)，請先安裝。
2. 用 OpenCode 的免費模型，馬上就能使用。要用自己的服務商（包括 OpenRouter），請在終端機裡登入一次：`npx -y opencode-ai@1.19.5 auth login`。
3. 點視窗右上角 Textus AI 旁邊的 OpenCode 按鈕。

Textus 用 `npx` 執行 `opencode acp`（它的 Agent Client Protocol 伺服器），啟動 [OpenCode](https://opencode.ai)。帳號和用量都屬於 OpenCode，Textus 不保存它的金鑰。

修改檔案、執行指令和抓取網頁前，它都會先問你；在計畫模式裡它不會修改檔案。它的子 Agent 目前是關閉的：OpenCode 不會把子 Agent 的問題轉過來，那一輪就會一直等下去。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
