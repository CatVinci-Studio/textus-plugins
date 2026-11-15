# Codex

在 Textus AI 里和 Codex 对话。它会读打开的文件夹，写和修改你的笔记；每次改动前都会先问你：Textus 列出它要做的事，由你允许或拒绝。改过的地方会在文档里标出来，撤销一步就能回去。

1. 如果电脑上还没有 [Node.js](https://nodejs.org)，先装上。
2. 第一次会打开浏览器用 ChatGPT 登录；也可以在终端登录一次：`npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`。
3. 点窗口右上角 Textus AI 旁边的 Codex 按钮，或在 Textus AI 的模型菜单里选 **Codex**。

Textus 用 `npx` 运行 Agent Client Protocol 适配器 `@agentclientprotocol/codex-acp`，启动 OpenAI 的 Codex。账号和用量都是 Codex 自己的，Textus 不保存它的密钥。

它从 **Read-only** 模式开始，每次改文件、跑命令前都会问你；别的模式在模型旁的菜单里选。

只在电脑上可用，需要 Textus 1.4.3 或更新。只请求一项权限：在这台电脑上启动这个 Agent。

## 更新日志

- **0.1.3** - 在浏览器里用 ChatGPT 登录（以前会先试 API key，然后停在那里），从 Read-only 模式开始。需要 Textus 1.4.3，Codex 自己写进文件的改动也会标出来。
- **0.1.2** - 需要 Textus 1.4.2 或更新版本，以使用新的助手界面。
- **0.1.1** - Codex 回答时，其他插件（比如桌宠）能知道是哪个 AI 在工作。
- **0.1.0** - 第一版：在 Textus AI 里用 Codex。
