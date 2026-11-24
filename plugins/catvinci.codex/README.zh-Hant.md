# Codex

在 Textus AI 裡和 Codex 對話。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org)，請先安裝。
2. 第一次使用時會開啟瀏覽器，以 ChatGPT 登入；也可以在終端機裡登入一次：`npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`。
3. 點視窗右上角 Textus AI 旁邊的 Codex 按鈕，或在 Textus AI 的模型選單裡選 **Codex**。

Textus 用 `npx` 執行 Agent Client Protocol 轉接程式 `@agentclientprotocol/codex-acp`，啟動 OpenAI 的 Codex。帳號和用量都屬於 Codex，Textus 不保存它的金鑰。

它從 **Read-only** 模式開始，這個模式每次修改檔案、執行指令前都會先問你；其他模式在模型旁邊的選單裡選。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
