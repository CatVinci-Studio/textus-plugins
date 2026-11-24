# クイック挿入

`/` で見出し・リスト・表などのブロック、`:` で絵文字、`@` で日付を入力します。

## / メニュー

行の先頭かスペースの後で `/` と入力し、入れたいものを選びます。並ぶのは Textus 自身のブロックで、書式メニューと同じものです：

- **段落、見出し 1〜3**、**箇条書き、番号付きリスト、タスクリスト**
- **引用、コールアウト、コードブロック、数式ブロック、表、区切り線**

選ぶと、今いる行がそのブロックに変わります。ほかのプラグインも自分のブロックをメニューに加えます（データベース、リンクカード、リマインダー、テンプレート）。

続けて入力すると一覧を絞り込めます：`/table`、`/tab`。どの言語でも使え、中国語の名前はピンインでも探せます（`/biaoge`）。

## 絵文字

`:` と言葉を入力すると絵文字になります：`:tada` で 🎉、`:+1` で 👍、`:笑` で 😄。

## 日付

`@` と日を入力し、その日付を選びます：

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (or `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

週は月曜始まりで、曜日だけなら次のその曜日です。

日付は `2026-11-06` の形で書かれます。プラグインの設定で **挿入する形** を **その日のノートへのリンク** にすると、代わりにその日のデイリーノートへのリンクを、フォルダのリンクの書き方で書きます。標準リンクなら `[2026-11-06](Daily/2026-11-06.md)`、Obsidian の保管庫やノートがウィキリンクを使うフォルダなら、デイリーノートの設定にある名前とフォルダで `[[2026-11-06]]`（`[[November 6th, 2026]]` や `[[Journal/2026/11/2026-11-06]]` など）です。そうした設定のないフォルダでは、デイリーノートを `Daily/` で探します。

一覧が開くのはスペースの後、行の先頭、括弧の後です。`me@example.com` のようなアドレスや `[@key]` のような引用では開きません。`(` の後では `@` が残るので、`(@tomorrow` は `(@2026-11-06` というリマインダーになります。

入れるものはすべて普通の Markdown です。

## 権限

- **文書の読み取りと編集**：ブロック、絵文字、日付を入れるため。
- **ファイルの読み取り**：日のリンクのために、保管庫のデイリーノートの設定を読むため。
- **Textus AI のツール**：Textus AI が言葉で書いた日を日付にできるようにするため。

## 更新履歴

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `parse_date`：言葉で書いた日（英語・中国語・日本語。プラグインの @ 補完が分かるもの：tomorrow、next wednesday、in 3 days、下周五、明後日）を、今日から数えた日付 YYYY-MM-DD にします。週は月曜始まりで、曜日だけなら次のその曜日です。
<!-- /ai-tools -->
