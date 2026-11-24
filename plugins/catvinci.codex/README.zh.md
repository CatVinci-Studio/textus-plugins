# Codex

在 Textus AI 里和 Codex 对话。它会读打开的文件夹，写和修改你的笔记；每次改动前都会先问你：Textus 列出它要做的事，由你允许或拒绝。改过的地方会在文档里标出来，撤销一步就能回去。

1. 如果电脑上还没有 [Node.js](https://nodejs.org)，先装上。
2. 第一次会打开浏览器用 ChatGPT 登录；也可以在终端登录一次：`npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`。
3. 点窗口右上角 Textus AI 旁边的 Codex 按钮，或在 Textus AI 的模型菜单里选 **Codex**。

Textus 用 `npx` 运行 Agent Client Protocol 适配器 `@agentclientprotocol/codex-acp`，启动 OpenAI 的 Codex。账号和用量都是 Codex 自己的，Textus 不保存它的密钥。

它从 **Read-only** 模式开始，每次改文件、跑命令前都会问你；别的模式在模型旁的菜单里选。

需要 Textus 1.4.3 或更新版本。只请求一项权限：在这台电脑上启动这个 Agent。

## 更新日志

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
