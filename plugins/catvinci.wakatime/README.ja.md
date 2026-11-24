# WakaTime

Textus で書いている時間を [WakaTime](https://wakatime.com) のアカウントに送り、ダッシュボードでコーディングの時間と並べて表示します。

1. [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key) から API キーをコピーします。
2. Textus の設定にある WakaTime のページで **API キーを設定…** をクリックし、貼り付けます。キーは Textus の安全な保管場所に保存されます。

プラグインメニューとコマンドパレットには、**WakaTime：API キーを設定…**、WakaTime が数えた今日の合計を表示する **WakaTime：今日の執筆時間**、**WakaTime：ダッシュボードを開く** があります。

## 数えるものと送るもの

- 数えるのは、前面にある Textus のウィンドウでの自分の作業だけです：入力、カーソルの移動、文書の切り替え、保存。Textus がバックグラウンドにある時間や、ディスク上やプラグインによる変更は数えません。Textus AI で書いた分は AI コーディングとして数えます。
- 作業のたびに、文書のパス、言語（Markdown）、行数、プロジェクト、Git のブランチを WakaTime に伝えます。プロジェクトは開いているフォルダの `.wakatime-project` ファイルの 1 行目で、なければ開いているフォルダの名前です。
- WakaTime 自身のプラグインと同じく、同じ文書については 2 分に 1 回まで送り、保存したときは必ず送ります。
- オフラインのときは時間を順番待ちにためておき、あとでまとめて送ります。
- キーを設定するまでは何も送らず、保存していない文書も送りません。止めるには、キーを空にします。

Textus 1.3.0 以降が必要です。求める権限は、エディタと開いているフォルダのファイルを読むこと（文書、その行数、`.wakatime-project`、`.git/HEAD` のため）と、`api.wakatime.com` に接続することだけで、ほかのネットワークは使いません。

## 更新履歴

- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
