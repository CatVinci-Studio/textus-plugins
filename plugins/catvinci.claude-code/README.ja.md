# Claude Code

Textus AI で Claude Code と話せます。開いているフォルダを読み、ノートを書いて直し、変更の前には毎回確認します。Textus がしようとしていることを示し、あなたが許可するかどうかを決めます。変えたところは文書に印が付き、一度の取り消しで戻せます。

1. このコンピュータに [Node.js](https://nodejs.org) がなければ入れます。
2. ターミナルで一度だけ Claude Code にサインインします：`npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai`（`claude` が入っていればそれを実行しても構いません）。
3. ウインドウ右上、Textus AI のボタンの隣にある Claude Code のボタンをクリックするか、Textus AI のモデルメニューで **Claude Code** を選びます。

Textus は Anthropic の Claude Code を、Agent Client Protocol のアダプター `@agentclientprotocol/claude-agent-acp` を通して `npx` で起動します。アカウントと利用量は Claude Code のもので、Textus はそのためのキーを保存しません。

最初は Claude Code の **Manual** モードで始まり、編集やコマンドの前に毎回確認します。別のモードはモデルの隣のメニューで選べます。OpenRouter 経由で使うには、`~/.claude/settings.json` の `env` ブロックに `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN`、空の `ANTHROPIC_API_KEY` を書きます。Dock から開いた Textus には、ターミナルで設定した変数が見えないためです。

Textus 1.4.3 以降が必要です。求める権限は一つだけで、このコンピュータでこのエージェントを起動するためのものです。

## 更新履歴

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
