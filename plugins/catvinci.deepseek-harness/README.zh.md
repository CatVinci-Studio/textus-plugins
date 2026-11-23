# DeepSeek Harness

在 Textus AI 里和 DeepSeek 官方的 agent DeepSeek Harness 对话。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。

1. 如果这台电脑还没有 [Node.js](https://nodejs.org) 24.9 或更新版本，先安装。
2. 先给它一次 DeepSeek API key：在终端运行 `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web`，在它的 Models 页面填好 key。
3. 点窗口右上角 Textus AI 旁边的 DeepSeek Harness 按钮。

Textus 用 `npx` 运行 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 `dsh --profile acp`（它的 Agent Client Protocol 服务）。key 和用量都是 DeepSeek 的，Textus 不保存它的 key。DeepSeek Harness 还是预览版，行为可能会变。

Textus 让它在只读沙盒里运行：读文件、搜索不问，写文件或跑会改东西的命令前先问你。

DeepSeek Harness 默认会把会话记录发给 DeepSeek；可以在 `dsh web` 的 Settings › General 里关掉。Textus 关掉了它的使用统计。

只在桌面版可用，需要 Textus 1.4.3 或更新版本。它只申请一项权限：在这台电脑上启动这个 agent。

## 更新日志

- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
