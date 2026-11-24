# Gemini CLI

在 Textus AI 裡和 Gemini CLI 對話，使用 Google 的 Gemini 模型。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。它的模式（先詢問、接受修改、全部接受、計畫）和模型，在 Textus AI 模型選單旁邊的選單裡。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org)，請先安裝。
2. 點視窗右上角 Textus AI 旁邊的 Gemini CLI 按鈕。第一次使用時會開啟瀏覽器，以你的 Google 帳號登入。要使用 Gemini API 金鑰或 Vertex AI，請在終端機裡執行一次 `npx @google/gemini-cli`，再用 `/auth` 選擇（從 Dock 開啟的 Textus 讀不到在終端機裡設定的變數）。

Textus 用 `npx` 執行 `gemini --acp`（它的 Agent Client Protocol 伺服器），啟動 [Gemini CLI](https://github.com/google-gemini/gemini-cli)。帳號和用量都屬於 Google，Textus 不保存它的金鑰。

「接受修改」和「全部接受」只在你於 Gemini CLI 裡信任過的資料夾中有效；在其他資料夾裡會維持「先詢問」。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
