# リンクカード

リンクを、ページのタイトル・説明・画像つきのカードとして表示します。Bilibili の動画はその場で再生します。

## カードを作る

- `/` と入力して **リンクカードを挿入…** を選び、リンクを貼り付けます。または本文のリンクを選択して右クリックし、**リンクカードを挿入…** を選ぶとカードになります。
- カードにはページのタイトル、説明、画像、サイト名が表示されます。クリックするとブラウザでページを開きます。
- Bilibili のリンクは、カードの中で動画を再生します。YouTube のリンクは動画の静止画つきのカードになり、ブラウザで開きます。
- ページを読めないとき（オフラインやウェブページでないとき）は、カードにアドレスだけが入ります。

## 保存される内容

カードはページの内容を入れた `card` ブロックなので、ネットワークなしでも表示でき、どの Markdown アプリでもテキストとして読めます：

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- カードの右クリックメニューの **再取得** で、ページの最新のタイトルと画像を取り込みます。
- Obsidian のカードも表示されます。Auto Card Link の `cardlink` ブロックと Link Embed の `embed` ブロックはカードとして描かれ、書かれたまま残ります。

## 権限

- **ネットワーク（すべてのアドレス）**：カードにするページを読むため。取得するのはそのリンクだけです。
- **文書の読み取りと編集**：選択したリンクを読み、カードを挿入するため。
- **Textus AI のツール**：Textus AI がリンクのカードを作れるようにするため。

## 更新履歴

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
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `fetch_link_card`：ウェブページのタイトル・説明・画像・サイト名を取得し、リンクをカードとして表示する ```card ブロックと一緒に返します。ユーザーが望む場所に挿入できます。
<!-- /ai-tools -->
