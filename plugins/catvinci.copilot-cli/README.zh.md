# GitHub Copilot CLI

在 Textus AI 里和 GitHub Copilot CLI 对话，用你 Copilot 订阅里的模型。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。它的模式（agent、计划、autopilot）、模型和「全部允许」开关在 Textus AI 模型菜单旁边的菜单里；「全部允许」默认关闭。

1. 如果电脑上没有，先安装 [Node.js](https://nodejs.org)。需要 GitHub Copilot 订阅。
2. 在终端里运行一次：`npx @github/copilot login`。
3. 点窗口右上角 Textus AI 按钮旁边的 GitHub Copilot CLI 按钮。

Textus 用 `npx` 运行 [GitHub Copilot CLI](https://github.com/github/copilot-cli) 的 `copilot --acp`（它的 Agent Client Protocol 服务）。Copilot CLI 是 GitHub 自己的软件，用它自己的许可；账号和用量都归 GitHub，Textus 不保存它的令牌。

Autopilot 会自己一直做下去，用掉更多高级请求次数。Textus 固定它启动的版本：Copilot 在这里不会自己更新。

只在电脑上可用，需要 Textus 1.4.3 或更新版本。它只要一个权限：在这台电脑上启动这个助手。

## 更新

- **0.1.0** - 第一个版本：在 Textus AI 里用 GitHub Copilot CLI。
