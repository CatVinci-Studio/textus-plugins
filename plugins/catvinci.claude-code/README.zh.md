# Claude Code

在 Textus AI 里和 Claude Code 对话。它会读打开的文件夹，写和修改你的笔记；改动前会先问你：它的修改以 Textus 自己的修改提议出现，由你接受或拒绝。

1. 如果电脑上还没有 [Node.js](https://nodejs.org)，先装上。
2. 先登录一次 Claude Code：在终端运行 `claude` 并登录。
3. 点窗口右上角 Textus AI 旁边的 Claude Code 按钮，或在 Textus AI 的模型菜单里选 **Claude Code**。

Textus 用 `npx` 运行 Agent Client Protocol 适配器 `@agentclientprotocol/claude-agent-acp`，启动 Anthropic 的 Claude Code。账号和用量都是 Claude Code 自己的，Textus 不保存它的密钥。

只在电脑上可用，需要 Textus 1.3.13 或更新。只请求一项权限：在这台电脑上启动这个 Agent。

## 更新日志

- **0.1.0** - 第一版：在 Textus AI 里用 Claude Code。
