# Openverse 图片

让 Textus AI 在 [Openverse](https://openverse.org) 为你的文档找开放授权的图片。

## 怎么用

- 让 Textus AI 找某样东西的真实照片或图画，比如“一张黄昏时灯塔的照片”。它会在 Openverse（Flickr、博物馆等）搜索，并把图片和署名一起放进文档，署名在图片下方。
- 每条署名写明作者、授权和来源，并链接到图片所在的网页。
- 只用 CC BY、CC BY-SA、CC0 和公有领域的图片。Openverse 转述的是各来源自己标注的授权，所以每张图片在提供前都会再核对一次授权。
- 用英文搜索能找到最多的结果。
- 插件没有自己的菜单或设置，只是给 Textus AI 加了一个工具。

## 权限

- **网络，仅限 api.openverse.org**：在 Openverse 搜索。不需要账号或密钥；Openverse 限制每个地址每天的搜索次数。
- **Textus AI 工具**：让 Textus AI 能搜索图片。

## 更新日志

- **0.1.4** - Its icon is Openverse's own logo.
- **0.1.3** - Its page is in every language Textus speaks. It no longer gives a number for Openverse's daily limit, which can change.
- **0.1.2** - The store description now opens with what the plugin does.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - first version: openly licensed pictures from Openverse for Textus AI, each with its credit line

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `find_open_pictures`：按描述在 Openverse 找开放授权的图片（CC BY、CC BY-SA、CC0、公有领域），每张都有图片地址和授权要求的署名，署名放在图片下方。用户要真实的照片或图画、而不是生成的图片时用它。
<!-- /ai-tools -->
