# OpenCode

在 Textus AI 里和 OpenCode 对话，用你给它配置的任意模型。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。

1. 如果这台电脑还没有 [Node.js](https://nodejs.org)，先安装。
2. 在 OpenCode 里登录一次模型服务：在终端运行 `opencode auth login`。
3. 点窗口右上角 Textus AI 旁边的 OpenCode 按钮。

Textus 用 `npx` 运行 [OpenCode](https://opencode.ai) 的 `opencode acp`（它的 Agent Client Protocol 服务）。账号和用量都是 OpenCode 自己的，Textus 不保存它的 key。

只在桌面版可用，需要 Textus 1.4 或更新版本。它只申请一项权限：在这台电脑上启动这个 agent。

## 更新

- **0.1.0** - 第一个版本：在 Textus AI 里用 OpenCode。
