# OpenCode

在 Textus AI 里和 OpenCode 对话，用你给它配置的任意模型。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。想让它不再询问，可在模型旁的菜单里选「全部允许」（需 Textus 1.4.3 或更新）。

1. 如果这台电脑还没有 [Node.js](https://nodejs.org)，先安装。
2. 直接就能用 OpenCode 的免费模型。要用自己的服务商（包括 OpenRouter），在终端登录一次：`npx -y opencode-ai@1.19.5 auth login`。
3. 点窗口右上角 Textus AI 旁边的 OpenCode 按钮。

Textus 用 `npx` 运行 [OpenCode](https://opencode.ai) 的 `opencode acp`（它的 Agent Client Protocol 服务）。账号和用量都是 OpenCode 自己的，Textus 不保存它的 key。

改文件、跑命令、上网读取前都会问你；计划模式下不改文件。子 agent 暂时关闭：OpenCode 不会把它们的询问传过来，这一轮会一直等下去。

只在桌面版可用，需要 Textus 1.4.3 或更新版本。它只申请一项权限：在这台电脑上启动这个 agent。

## 更新

- **0.1.3** - 上网读取前也会问你；计划模式不再改文件；子 agent 关闭（它们的询问传不过来，会卡住这一轮）。需要 Textus 1.4.3。
- **0.1.2** - 每次修改和运行命令前都会先问你，与说明一致：OpenCode 默认不询问就执行。
- **0.1.1** - 需要 Textus 1.4.2 或更新版本，以使用新的助手界面。
- **0.1.0** - 第一个版本：在 Textus AI 里用 OpenCode。
