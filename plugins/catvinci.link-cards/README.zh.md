# 链接卡片

把链接显示成卡片，带网页的标题、简介和图片；YouTube 或 B 站视频直接在卡片里播放。

## 做一张卡片

- 输入 `/` 选 **插入链接卡片…**，再粘贴链接。也可以在正文里选中一个链接，右键选 **插入链接卡片…**，把它变成卡片。
- 卡片显示网页的标题、简介、图片和网站名。点一下在浏览器里打开网页。
- YouTube 或 B 站的链接会直接在卡片里播放视频。
- 网页读不到时（没联网，或者不是网页），卡片只保存这个网址。

## 保存的内容

卡片是一个 `card` 代码块，里面存着网页的信息，所以没有网络也能显示，在任何 Markdown 软件里都能当文本读：

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- 卡片下方的 **重新获取** 会拿到网页最新的标题和图片。
- Obsidian 里的卡片也能显示：Auto Card Link 的 `cardlink` 块和 Link Embed 的 `embed` 块都画成卡片，块里的内容保持原样。

## 权限

- **网络，任意网址**：读取你要做成卡片的网页。只会访问这些链接。
- **读取和编辑文档**：读取选中的链接，插入卡片。
- **Textus AI 工具**：让 Textus AI 能为链接做卡片。

桌面版和 iOS 都能用。

## 更新日志

- **0.4.0** - Obsidian 的 `cardlink`（Auto Card Link）和 `embed`（Link Embed）块也画成卡片
- **0.3.1** - 说明里的示例链接改为 textus.md
- **0.3.0** - 新增 Textus AI 工具 `fetch_link_card`
- **0.2.0** - 使用 Textus 自己的按钮和颜色（Textus 1.3.2）
- **0.1.0-0.1.1** - 最初版本：链接卡片存在 `card` 代码块里，视频播放器，**重新获取**

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `fetch_link_card`：抓取网页的标题、简介、配图和网站名，连同一个把链接显示成卡片的 ```card 块一起返回，可插入到用户想要的位置。
<!-- /ai-tools -->
