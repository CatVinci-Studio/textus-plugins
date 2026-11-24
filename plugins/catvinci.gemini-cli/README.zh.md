# Gemini CLI

在 Textus AI 里和 Gemini CLI 对话，用 Google 的 Gemini 模型。它会读打开的文件夹，写和改你的笔记，每次改动前先问你：Textus 会给你看它想做什么，由你决定是否允许。它改过的地方会在文档里标出来，撤销一次就能还原。它的模式（先问、自动改文件、全部自动、只做计划）和模型，在 Textus AI 模型菜单旁边的菜单里选。

1. 如果这台电脑还没有 [Node.js](https://nodejs.org)，先装上。
2. 点窗口右上角 Textus AI 旁边的 Gemini CLI 按钮。第一次会打开浏览器，用 Google 账号登录。想用 Gemini API 密钥或 Vertex AI，在终端运行一次 `npx @google/gemini-cli`，用 `/auth` 选择（从 Dock 打开的 Textus 读不到在终端里设的变量）。

Textus 用 `gemini --acp`（它的 Agent Client Protocol 服务）通过 `npx` 启动 [Gemini CLI](https://github.com/google-gemini/gemini-cli)。账号和用量都是 Google 那边的，Textus 不保存它的密钥。

「自动改文件」和「全部自动」只在你在 Gemini CLI 里信任过的文件夹可用，其他文件夹里会留在「先问」。

需要 Textus 1.4.3 或更新版本。它只申请一个权限：在这台电脑上启动这个 AI 程序。

## 更新日志

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
