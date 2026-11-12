# DeepSeek Harness

在 Textus AI 里和 DeepSeek 官方的 agent DeepSeek Harness 对话。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。

1. 如果这台电脑还没有 [Node.js](https://nodejs.org) 24 或更新版本，先安装。
2. 先给它一次 DeepSeek API key：在终端运行 `npx @deepseek-ai/dsh web`，在打开的页面里填好 key（也可以设置 `DEEPSEEK_API_KEY`）。
3. 点窗口右上角 Textus AI 旁边的 DeepSeek Harness 按钮。

Textus 用 `npx` 运行 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 `dsh --profile acp`（它的 Agent Client Protocol 服务）。key 和用量都是 DeepSeek 的，Textus 不保存它的 key。DeepSeek Harness 还是预览版，行为可能会变。

只在桌面版可用，需要 Textus 1.4 或更新版本。它只申请一项权限：在这台电脑上启动这个 agent。

## 更新

- **0.1.0** - 第一个版本：在 Textus AI 里用 DeepSeek Harness。
