# 链接卡片

把链接显示成卡片，带网页的标题、简介和图片；B 站视频直接在卡片里播放。

## 做一张卡片

- 输入 `/` 选 **插入链接卡片…**，再粘贴链接。也可以在正文里选中一个链接，右键选 **插入链接卡片…**，把它变成卡片。
- 卡片显示网页的标题、简介、图片和网站名。点一下在浏览器里打开网页。
- B 站的链接会直接在卡片里播放视频。YouTube 链接显示成带视频封面的卡片，点开在浏览器里看。
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

- 在卡片上右键选 **重新获取**，会拿到网页最新的标题和图片。
- Obsidian 里的卡片也能显示：Auto Card Link 的 `cardlink` 块和 Link Embed 的 `embed` 块都画成卡片，块里的内容保持原样。

## 权限

- **网络，任意网址**：读取你要做成卡片的网页。只会访问这些链接。
- **读取和编辑文档**：读取选中的链接，插入卡片。
- **Textus AI 工具**：让 Textus AI 能为链接做卡片。

## 更新日志

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it. Its page receives Textus's messages by the API's current name.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Textus AI 工具

装上这个插件后，Textus AI 在对话中可以使用：

- `fetch_link_card`：抓取网页的标题、简介、配图和网站名，连同一个把链接显示成卡片的 ```card 块一起返回，可插入到用户想要的位置。
<!-- /ai-tools -->
