# DeepSeek Harness

DeepSeek 公式のエージェント DeepSeek Harness と、Textus AI で話せます。開いているフォルダを読み、ノートを書いて直し、変更の前には毎回確認します。Textus がしようとしていることを示し、あなたが許可するかどうかを決めます。変えたところは文書に印が付き、一度の取り消しで戻せます。

1. このコンピュータに [Node.js](https://nodejs.org) 24.9 以降がなければ入れます。
2. DeepSeek の API キーを一度だけ渡します：ターミナルで `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web` を実行し、その Models ページでキーを追加します。
3. ウインドウ右上、Textus AI のボタンの隣にある DeepSeek Harness のボタンをクリックします。

Textus は [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) を、その Agent Client Protocol サーバーである `dsh --profile acp` で、`npx` を使って起動します。キーと利用量は DeepSeek のもので、Textus はそのためのキーを保存しません。DeepSeek Harness はプレビュー版なので、動きが変わることがあります。

Textus は読み取り専用のサンドボックスで起動します。自由に読んで検索し、ファイルを書いたり何かを変えるコマンドを実行したりする前には確認します。

DeepSeek Harness は既定でセッションのログを DeepSeek に送ります。`dsh web` の Settings › General でオフにできます。利用状況の報告は Textus がオフにします。

Textus 1.4.3 以降が必要です。求める権限は一つだけで、このコンピュータでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
