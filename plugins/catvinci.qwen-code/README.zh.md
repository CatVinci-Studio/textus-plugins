# Qwen Code

在 Textus AI 里和 Qwen Code 对话，用阿里的通义千问模型。它会读打开的文件夹、写和改笔记，每次改动前先问你：Textus 会显示它想做什么，由你决定是否允许。它改过的地方在文档里有标记，一步就能撤销。它的模式（先询问、自动接受修改、自己判断、全部接受、计划）、模型和思考强度在 Textus AI 模型菜单旁边的菜单里。

1. 如果电脑上没有，先安装 [Node.js](https://nodejs.org) 22 或更新版本。
2. 给它一次 API 密钥：在 `~/.qwen/.env` 里写 `OPENAI_API_KEY`、`OPENAI_BASE_URL` 和 `OPENAI_MODEL`（用 OpenRouter 时地址是 `https://openrouter.ai/api/v1`），或在终端运行 `npx @qwen-code/qwen-code` 再用 `/auth`（阿里云百炼，或任何兼容 OpenAI 的服务）。
3. 点窗口右上角 Textus AI 按钮旁边的 Qwen Code 按钮。

Textus 用 `npx` 运行 [Qwen Code](https://github.com/QwenLM/qwen-code) 的 `qwen --acp`（它的 Agent Client Protocol 服务）。密钥和用量都归你的服务商；Textus 不保存它的密钥。

它从「先询问」开始。对命令选「总是允许」后，Qwen Code 会永久记住（按项目或按你）。

需要 Textus 1.4.3 或更新版本。它只要一个权限：在这台电脑上启动这个助手。

## 更新日志

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
