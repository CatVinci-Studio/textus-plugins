# Openverse の画像

Textus AI が、文書に使える自由ライセンスの画像を [Openverse](https://openverse.org) で探せるようにします。

## 使い方

- 「夕暮れの灯台の写真」のように、何かの実際の写真や絵を Textus AI に頼みます。Openverse（Flickr や美術館など）を検索し、画像を置いて、その下にクレジットを付けます。
- クレジットには作者、ライセンス、出典が入り、画像を取ってきたページにリンクします。
- 使うのは CC BY、CC BY-SA、CC0、パブリックドメインの画像だけです。Openverse は各出典の申告をそのまま伝えるので、画像を出す前にライセンスをもう一度確かめます。
- 英語で検索すると、いちばん多く見つかります。
- このプラグインには独自のメニューや設定はなく、Textus AI にツールを 1 つ加えるだけです。

## 権限

- **ネットワーク（api.openverse.org のみ）**：Openverse を検索するため。アカウントやキーは要りません。Openverse は 1 つのアドレスが 1 日に検索できる回数を制限しています。
- **Textus AI のツール**：Textus AI が画像を探せるようにするため。

## 更新履歴

- **0.1.3** - Its page is in every language Textus speaks. It no longer gives a number for Openverse's daily limit, which can change.
- **0.1.2** - The store description now opens with what the plugin does.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - first version: openly licensed pictures from Openverse for Textus AI, each with its credit line

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `find_open_pictures`：説明に合う自由ライセンスの画像（CC BY、CC BY-SA、CC0、パブリックドメイン）を Openverse で探し、それぞれの URL と、画像の下に置くクレジットを返します。生成した画像ではなく実際の写真や絵が欲しいときに使います。
<!-- /ai-tools -->
