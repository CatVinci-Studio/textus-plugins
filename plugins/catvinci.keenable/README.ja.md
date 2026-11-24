# Keenable 検索

Textus AI が [Keenable](https://keenable.ai) でウェブを検索できるようにします。

- Keenable を使うよう頼んだときや、Textus AI 自体のウェブ検索が設定されていないとき、Textus AI が会話の中で使います。結果は既定で 5 件（最大 10 件）で、それぞれタイトル、アドレス、短い本文、日付が付きます。
- キーがなくても、Keenable の公開検索で使えます。Keenable の完全な検索を使うには、Textus の設定にあるこのプラグインのページで **API キーを設定…** をクリックし（またはコマンドパレットから **Keenable：API キーを設定…** を実行し）、キーを貼り付けます。もう一度開いて欄を空のままにすると、キーを削除して公開検索に戻ります。キーはこの端末の Textus の安全な保管場所に保存されます。
- 質問の内容が Keenable に送られるのは、Textus AI が会話の中でこのツールを使うときだけです。

このプラグインが求める権限は二つです。下の検索ツールを Textus AI に渡すための AI ツールと、検索を行うための `api.keenable.ai` だけへのネットワーク接続です。

## 更新履歴

- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `keenable_search`：Keenable でウェブを検索し、各結果のタイトル、URL、短い本文、日付を返します。ユーザーが Keenable を指定したときや、Textus AI 自体のウェブ検索が設定されていないときに使います。
<!-- /ai-tools -->
