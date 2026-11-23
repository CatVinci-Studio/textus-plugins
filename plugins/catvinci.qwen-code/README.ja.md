# Qwen Code

Textus AI で Qwen Code と話せます。使うのは Alibaba の Qwen モデルです。開いているフォルダを読み、ノートを書いたり直したりし、変更のたびに先に確認します。Textus が何をしようとしているかを見せるので、許可するかどうかを選びます。変更したところは文書に印が付き、一度の取り消しで戻せます。モード（先に確認、編集を受け入れる、自分で判断、すべて受け入れる、プラン）、モデル、思考は、Textus AI のモデルメニューの隣のメニューにあります。

1. このコンピューターに [Node.js](https://nodejs.org) 22 以降がなければインストールします。
2. 一度だけ API キーを渡します。`~/.qwen/.env` に `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL` を書くか（OpenRouter ならベース URL は `https://openrouter.ai/api/v1`）、ターミナルで `npx @qwen-code/qwen-code` を実行して `/auth` を使います（Alibaba Cloud Model Studio や、OpenAI 互換のサービス）。
3. ウィンドウ右上、Textus AI のボタンの隣にある Qwen Code のボタンをクリックします。

Textus は [Qwen Code](https://github.com/QwenLM/qwen-code) を、その Agent Client Protocol サーバーである `qwen --acp` として `npx` で起動します。キーと使用量はプロバイダーのもので、Textus はそのためのキーを保存しません。

最初は「先に確認」で始まります。コマンドに対する「常に許可」の選択は、Qwen Code がプロジェクトごと、または自分用にずっと保存します。

Textus 1.4.3 以降が必要です。求める権限は 1 つだけで、このコンピューターでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
