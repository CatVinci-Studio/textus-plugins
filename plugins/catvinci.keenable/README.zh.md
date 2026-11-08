# Keenable 搜索

让 Textus AI 用 [Keenable](https://keenable.ai) 搜索网页。

- 你在对话中点名要用 Keenable，或者 Textus AI 自带的网页搜索没有设置时，它就会用这个工具。默认取 5 条结果（最多 10 条），每条有标题、网址、一段简短文字和日期。
- 不需要密钥，默认用 Keenable 的公开搜索。要用 Keenable 的完整搜索，打开命令面板（**Ctrl+Shift+P**，Mac 上 **⌘⇧P**），运行 **Keenable：设置 API 密钥…**，粘贴你的密钥。再次运行并留空，就会删除密钥，回到公开搜索。密钥保存在本机 Textus 的密钥存储里。
- 只有 Textus AI 在对话中调用这个工具时，你问的内容才会发给 Keenable。

插件申请两项权限：AI 工具，用来给 Textus AI 提供下面的搜索工具；网络访问，只连接 `api.keenable.ai` 进行搜索。电脑、iPhone 和 iPad 上都能用。

## 更新日志

- **0.1.1** - 介绍页重写：一句话说明它做什么，再讲它能做的事，并列出每个版本的更新。
- **0.1.0** - 第一个版本：Textus AI 通过 Keenable 搜索网页，有没有 API 密钥都能用。

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `keenable_search`：用 Keenable 搜索网页，返回每条结果的标题、网址、一段简短文字和日期。用户点名要用 Keenable，或者 Textus AI 自带的网页搜索没有设置时使用。
<!-- /ai-tools -->
