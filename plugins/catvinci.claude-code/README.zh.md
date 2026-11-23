# Claude Code

在 Textus AI 里和 Claude Code 对话。它会读打开的文件夹，写和修改你的笔记；每次改动前都会先问你：Textus 列出它要做的事，由你允许或拒绝。改过的地方会在文档里标出来，撤销一步就能回去。

1. 如果电脑上还没有 [Node.js](https://nodejs.org)，先装上。
2. 先登录一次 Claude Code：在终端运行 `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai`（已装 Claude Code 的话也可以运行 `claude`）。
3. 点窗口右上角 Textus AI 旁边的 Claude Code 按钮，或在 Textus AI 的模型菜单里选 **Claude Code**。

Textus 用 `npx` 运行 Agent Client Protocol 适配器 `@agentclientprotocol/claude-agent-acp`，启动 Anthropic 的 Claude Code。账号和用量都是 Claude Code 自己的，Textus 不保存它的密钥。

它从 Claude Code 的 **Manual** 模式开始，每次改文件、跑命令前都会问你；别的模式在模型旁的菜单里选。想通过 OpenRouter 用，把 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 和留空的 `ANTHROPIC_API_KEY` 写进 `~/.claude/settings.json` 的 `env`：从 Dock 打开的 Textus 读不到在终端里设的变量。

只在电脑上可用，需要 Textus 1.4.3 或更新。只请求一项权限：在这台电脑上启动这个 Agent。

## 更新日志

- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
