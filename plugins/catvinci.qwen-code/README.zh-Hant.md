# Qwen Code

在 Textus AI 裡和 Qwen Code 對話，使用阿里巴巴的通義千問模型。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。它的模式（先詢問、接受修改、自行判斷、全部接受、計畫）、模型和思考程度，在 Textus AI 模型選單旁邊的選單裡。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org) 22 或更新版本，請先安裝。
2. 給它一次 API 金鑰：在 `~/.qwen/.env` 裡寫上 `OPENAI_API_KEY`、`OPENAI_BASE_URL` 和 `OPENAI_MODEL`（用 OpenRouter 時，網址是 `https://openrouter.ai/api/v1`），或在終端機裡執行 `npx @qwen-code/qwen-code` 再用 `/auth` 設定（阿里雲百煉，或任何相容 OpenAI 的服務）。
3. 點視窗右上角 Textus AI 旁邊的 Qwen Code 按鈕。

Textus 用 `npx` 執行 `qwen --acp`（它的 Agent Client Protocol 伺服器），啟動 [Qwen Code](https://github.com/QwenLM/qwen-code)。金鑰和用量都屬於你的服務商，Textus 不保存它的金鑰。

它從「先詢問」開始。對指令選了「Always allow」之後，Qwen Code 會永久記住，存在專案裡或你自己的設定裡。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.2** - Its icon is Qwen Code's own logo.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
