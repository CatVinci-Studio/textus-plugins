# タグ

開いているフォルダのすべての `#タグ` を、使っているノートの数とともにサイドバーに一覧にします。

- **タグ** タブには、よく使うものから順にタグが並びます。入れ子のタグ（`#project/alpha`）は Obsidian と同じようにツリーになり、タグの数にはその下のタグのノートも含まれます。絞り込み欄に入力すると一覧を絞れます。
- タグを開くとそのノートが表示され、クリックするとノートが開きます。
- タグを右クリックして **名前を変更…** を選ぶと、すべてのノートでそのタグの名前を変えます。中に入れ子になったタグも一緒に変わります（`#project/alpha` は `#new/alpha` に）。大文字と小文字は区別しません。すでにあるタグの名前に変えると、2 つが 1 つにまとまります。タグに使えるのは文字、数字、`_`、`-`、`/` で、数字だけにはできません。
- front matter のタグ（`tags: [a, b]` や `tags:` の下のリスト）も名前が変わります。コード、インラインコード、リンクのアドレス、同じ文字で始まる長いタグ（`#draft` を変えるときの `#drafts`）はそのままです。

## 権限

- ファイルの読み取り：フォルダのタグを探すため。
- ファイルの書き込み：タグを持つノートでその名前を変えるため。
- Textus AI のツール：Textus AI がタグと、あるタグを持つノートを一覧できるようにするため。

## 更新履歴

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `list_tags`：開いているフォルダの文書で使われている #タグをすべて、使っている文書の数とともに、多い順に一覧にします。
- `notes_with_tag`：開いているフォルダで、ある #タグを持つ文書を、タイトル・パス・タグとともに一覧にします。
<!-- /ai-tools -->
