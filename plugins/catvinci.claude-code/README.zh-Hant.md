# Claude Code

在 Textus AI 裡和 Claude Code 對話。它會讀取開啟的資料夾，撰寫和修改你的筆記，每次改動前都會先問你：Textus 顯示它想做什麼，由你決定是否允許。它改過的地方會在文件裡標出來，復原一次就能回去。

1. 如果這台電腦還沒有 [Node.js](https://nodejs.org)，請先安裝。
2. 在終端機裡登入一次 Claude Code：`npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai`（如果已經安裝了 Claude Code，也可以執行 `claude`）。
3. 點視窗右上角 Textus AI 旁邊的 Claude Code 按鈕，或在 Textus AI 的模型選單裡選 **Claude Code**。

Textus 用 `npx` 執行 Agent Client Protocol 轉接程式 `@agentclientprotocol/claude-agent-acp`，啟動 Anthropic 的 Claude Code。帳號和用量都屬於 Claude Code，Textus 不保存它的金鑰。

它從 Claude Code 的 **Manual** 模式開始，每次修改檔案、執行指令前都會先問你；其他模式在模型旁邊的選單裡選。想透過 OpenRouter 使用，請把 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 和留空的 `ANTHROPIC_API_KEY` 寫進 `~/.claude/settings.json` 的 `env` 區塊：從 Dock 開啟的 Textus 讀不到在終端機裡設定的變數。

需要 Textus 1.4.3 以上版本。外掛只要求一項權限：在這台電腦上啟動這個 Agent。

## 更新紀錄

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
