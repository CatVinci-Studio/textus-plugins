# Claude Code

在 Textus AI 里和 Claude Code 对话。它会读打开的文件夹，写和修改你的笔记；每次改动前都会先问你：Textus 列出它要做的事，由你允许或拒绝。改过的地方会在文档里标出来，撤销一步就能回去。

1. 如果电脑上还没有 [Node.js](https://nodejs.org)，先装上。
2. 先登录一次 Claude Code：在终端运行 `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai`（已装 Claude Code 的话也可以运行 `claude`）。
3. 点窗口右上角 Textus AI 旁边的 Claude Code 按钮，或在 Textus AI 的模型菜单里选 **Claude Code**。

Textus 用 `npx` 运行 Agent Client Protocol 适配器 `@agentclientprotocol/claude-agent-acp`，启动 Anthropic 的 Claude Code。账号和用量都是 Claude Code 自己的，Textus 不保存它的密钥。

它从 Claude Code 的 **Manual** 模式开始，每次改文件、跑命令前都会问你；别的模式在模型旁的菜单里选。想通过 OpenRouter 用，把 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 和留空的 `ANTHROPIC_API_KEY` 写进 `~/.claude/settings.json` 的 `env`：从 Dock 打开的 Textus 读不到在终端里设的变量。

只在电脑上可用，需要 Textus 1.4.3 或更新。只请求一项权限：在这台电脑上启动这个 Agent。

## 更新日志

- **0.1.3** - 由插件指定从 Manual 模式开始；登录命令不用另装 Claude Code。需要 Textus 1.4.3，Claude Code 自己写进文件的改动也会标出来。
- **0.1.2** - 改用 Claude Code 的 ACP 适配器 0.107.0；需要 Textus 1.4.2 或更新版本，以使用新的助手界面。
- **0.1.1** - Claude Code 回答时，其他插件（比如桌宠）能知道是哪个 AI 在工作。
- **0.1.0** - 第一版：在 Textus AI 里用 Claude Code。
