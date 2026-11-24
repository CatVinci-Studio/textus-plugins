# クラウド同期

自分の S3 互換ストレージ、Qiniu Kodo、WebDAV、Nutstore を通して、フォルダを複数のコンピュータで同じ状態に保ちます。以前の版はクラウドに残り、選べば各端末を出る前に暗号化されます。

エンドツーエンド暗号化をオンにすると、ストレージサービスにはファイルの中身も名前も見えません。
クラウド同期には Textus 1.4.1 以降が必要です。

## はじめに

1. 同期するフォルダを Textus で開き、**プラグイン › クラウド同期** を選びます（またはサイドバーのタブで **接続設定…**）。
2. ストレージサービスを選び、サーバーアドレスとサインイン情報を入力します。Nutstore に必要なのは、メールアドレスと、アカウント › セキュリティで作るアプリパスワードだけです。
3. 暗号化するには **エンドツーエンド暗号化** をオンにし、12 文字以上の **同期パスワード** を設定します。リセットできないので、パスワードマネージャーに保存してください。これはリモートフォルダごとに一度決めます。後で切り替えるには、新しい空のフォルダが必要です。
4. **接続を保存** を選び、**今すぐ同期** を選びます。

ほかの端末では、対応するフォルダを開き、同じサービスと同じリモートフォルダ（暗号化しているなら同じ同期パスワードも）を入力します。**自動で同期** をオンにすると（Textus が開いているあいだ）、ファイルを保存したり名前を変えたりした数秒後に同期し、何もきっかけがなくても 5 分ごとに同期します（**同期の間隔**：5〜60 分）。削除したファイルは次の同期で反映されます。**プラグイン › 今すぐ同期** でいつでも同期できます。

接続を保存すると、ステータスバーに同期の状態が表示されます：**同期済み · 2 分前**、**同期中…**、**同期の競合**、**同期エラー**。クリックするとパネルが開きます。

両方の端末で同じファイルを変えたときは、どちらの版も残ります。自分の版はその場所に、もう一方の端末の版は `Sync conflicts/` に入ります。

## クラウドの履歴

同期でファイルが置き換えられたり削除されたりするたびに、以前の内容はリモートフォルダに残ります。ファイルを右クリックして **クラウドの履歴…** を選ぶと、その版の一覧（いつ、どの端末から、どの大きさか）が表示され、版を読んで **この版を復元** できます。復元した版が現在のファイルになって同期され、置き換えられた版は履歴に残ります。そのファイルにまだ同期していない編集があるときや、ファイルが開いているときは、版を隣に書き出します（`Note (3f2a9c1b).md`）。**プラグイン › クラウドの履歴…** はフォルダから削除したファイルを一覧にし、開くと元に戻せます。

**クラウドの履歴を残す期間** は、版が置き換えられたときから数えて、30 日、90 日（既定）、365 日、無期限から選びます。設定はフォルダに一つで、どの端末からでも最後に同期したものが使われ、ほかの端末にもそれが表示されます。最初の 1 日は 1 時間に 1 つ、その後は 1 日に 1 つの版を残し、1 ファイル最大 200 個です。履歴の記録が 8 MB を超えると、古い版から消えます。何かが変わる同期のたび、またそれ以外でも 1 日に一度、期限切れの版を手放し、それだけが使っていたブロックを削除します。0.5 より前に使われた容量（古いスナップショット）は取り戻されません。すべての端末を 0.5 に更新してください。0.4 の端末が変えた内容は次の 0.5 の同期で初めて履歴に入り、その端末での削除もそれまでは一覧に出ません。

**権限：** 開いているフォルダの読み書き（フォルダを調べ、届いた変更を反映するため）と、任意のウェブサイトへの接続（入力した HTTPS サーバーだけ）。テレメトリ、分析、リモートコード、自動更新はありません。

## 詳細

S3 では、カスタムエンドポイント（空なら AWS）、リージョン、バケット、パス形式または仮想ホスト形式のアドレス、そして **その他のオプション** にある任意のセッショントークンを指定できます。リモートフォルダにはプラグイン独自の保存形式でデータが入り、ファイルをそのまま映したものではありません。ワークスペースごとに別のフォルダを使ってください。

認証情報は同期の状態とは別に `ctx.secrets` を通して保存されます。設定ページに送り返されることも、リモートのマニフェストにコピーされることもありません。認証情報の欄を空にしておくと、既存の接続の認証情報がそのまま使われます。エンドポイント、リモートフォルダ、アカウントを変えるには、それに合った認証情報が必要です。同期パスワードも自動同期のために `ctx.secrets` を通してローカルに保存され、設定ページに返されることも、ストレージサービスに送られることもありません。パスワードの欄を空にしておくと、保存済みのものが使われます。ここで別のパスワードを入力しても、既存のリポジトリが暗号化し直されることはありません。そのリモートフォルダを初期化したときのパスワードと一致している必要があります。

## 同期されるもの

- 保存済みの `.md`、`.markdown`、`.mdown`、`.mkd`、`.txt`、`.csv` 文書と、Obsidian のデータベース（`.base`）とキャンバス（`.canvas`）。
- 画像、PDF、Office/OpenDocument ファイル、音声、動画。正確な許可リストは、プラグインのリポジトリの `development/cloud-sync/src/config.ts` にあります。
- Textus のプロジェクトデータ：`.textus/agent.md`、`style.md`、`style.previous.md`、そして `.textus/library/`、`memory/`、`skills/` の中の Markdown。

全体の設定、チャット履歴、下書き、保存していない編集、認証情報、ほかのプラグインのデータ、任意のドットファイル、ビルドや依存関係のフォルダは除外されます。アクセスできるのは開いているワークスペースの中のファイルだけです。その外にあるファイルは、フォルダ外にあるリンク先の添付ファイルも含め、アップロードされません。

設定では、さらに除外するものを指定できます。1 行に 1 つ、`.gitignore` と同じ書き方です（`drafts/`、`*.pdf`、`!keep.pdf`）。スイッチをオンにすると、フォルダ自身の `.gitignore` にも従います。除外したファイルはどの端末でもそのままで、アップロードもダウンロードも削除もされません。別のスイッチで、Obsidian の共有設定（`.obsidian/app.json`、`appearance.json`、`hotkeys.json`、`bookmarks.json`、`graph.json`、`core-plugins.json`、`types.json`）も同期できます。`workspace.json` のような端末ごとのファイルはローカルに残ります。

現在の上限は、1 ファイル 128 MiB、たどるファイルとフォルダが 20,000 個、フォルダの階層が 48、マニフェストが 8 MiB です。空のフォルダは同期されません。対応するプラットフォームで安全でないパスや、大文字と小文字または Unicode の正規化だけが異なるパスがあると、黙って名前を変えるのではなく、同期を止めます。

## 変更と競合

どちらの側が変わったかは、SHA-256 ハッシュと最後に成功した同期から判断します。転送するのは変わった内容だけです。ファイルは 2 MiB のブロックに分けて保存され、共通のブロックは使い回されます。ETag は内容のハッシュとして扱いません。

- 別々の編集は、もう一方の端末にコピーされます。
- 同時の編集では、ローカルのファイルを残し、リモートの版を `Sync conflicts/` に保存します。どちらの版もほかの端末に公開されます。
- 保存先のファイルが開いているときは後回しにします。保存して閉じてから、もう一度同期してください。
- 既存のテキストファイルは、Textus の版を確かめる `files.process` API で更新します。既存のバイナリファイルは決して上書きしません。違いのある添付ファイルは、片方だけが変わったときでも両方の版を残します。今のプラグイン API には、条件付きでバイナリを置き換える操作がないためです。
- ある端末で削除したファイルは、ほかの端末でも次の同期で削除され、システムのゴミ箱に移るので、そこから戻せます。削除したファイルは、版を残す期間のあいだクラウドの履歴に残ります。名前の変更は、ほかの端末にも名前の変更として届きます。
- 内容がサーバーから消えるのは、履歴がそれを手放したときだけです。それまでは、削除したファイルも、リモートフォルダを読める人なら（暗号化していれば、同期パスワードを知っている人なら）読めます。内容を完全に消すには、整理したワークスペースに新しいリモートフォルダを使ってください。
- 編集は削除に勝ちます。前回の同期以降、一方の端末が削除し、もう一方が編集したファイルは、どこでも編集した版が戻ってきます。
- 初めてフォルダを同期する端末は、何も削除しません。片方にしかないファイルは、もう一方にコピーされます。
- クラウドから多くのファイル（10 件を超え、かつ同期したファイルの 30% を超える）を削除することになる同期は、何も削除せずに止まって確認します。自動で始まった同期は一度だけ確認し、**今すぐ同期** でもう一度確認します。名前の変更や移動は数に入りません。以前は多くのファイルを同期していたのに何も見つからないフォルダは、読めない状態（アクセスを失った、ファイルがダウンロードされていない）とみなし、何も削除せずに同期を止めます。
- 別の端末で削除されたファイルをシステムのゴミ箱が受け付けないときは、そのまま残し、パネルに一覧にして、次の同期でもう一度試します。同期のほかの部分は続きます。
- タブで開いているファイルは、削除も名前の変更もしません。閉じてからもう一度同期してください。
- 削除を頼りにする前に、すべての端末を 0.4 に更新してください。古い端末は、別の場所で削除されたファイルを元に戻してしまいます。

**エンドツーエンド暗号化** がオンなら、内容とファイル名はアップロードの前に暗号化されます。どちらの場合も、すべて HTTPS で送られます。非公開の S3 バケットか WebDAV フォルダを使ってください。サービスのアカウントには、専用のリモートフォルダでの読み取り、書き込み、削除の権限が必要です（削除は一時オブジェクトとロックに使います）。

## 同期ごとのリクエスト数

小さな文書について、セッションの最初の同期の後に、テストで HTTP 越しに測った数です（最初の同期ではサーバーの排他書き込みも確かめるので、S3 では 4 リクエスト多くなります）：

| 同期                                  | S3  | WebDAV / Nutstore |
| ------------------------------------- | --- | ----------------- |
| 変更なし                              | 3   | 3                 |
| 文書を 1 つ編集（2 MiB のブロック 1 つ） | 18  | 20                |
| ファイルを 1 つ削除                    | 20  | 22                |

どちらの側にも変更がなければ、同期はフォルダの現在のリビジョンを読むだけで、ロックも取りません。変わったブロックが 1 つ増えるごとに 1 リクエスト増えます。ブロックは、すでにあるかを先に尋ねたり読み返したりせずに一度だけ送ります（ブロックは内容で名前が付き、ダウンロードのたびにすべて検証されます）。WebDAV では、まだないフォルダにブロックを入れると 2 リクエスト増えます（拒否されたアップロードと、フォルダの作成）。ロックを取るにはアップロードと `MOVE` が 1 回ずつかかります。保存の後の同期は、保存が落ち着くまで（5 秒）待ち、さらに **同期の遅延**（なし〜10 分）だけ待ちます。Nutstore はアカウントごとのリクエスト数に上限があるので、新しい Nutstore の接続では 3 分、S3 と WebDAV では 0 です。サーバーが混んでいるという応答（429、503）があると、すべてのリクエストを一時停止します。待つよう求められたときは、状態に「サーバーの応答を待っています」と秒数を最大 60 秒まで表示します。それより長く求められると、その同期は止まって後でもう一度試すよう伝えます。送った分は次の同期のために残ります。

## エンドツーエンド暗号化

**エンドツーエンド暗号化** をオンにすると、ファイルの内容、パス、内容のハッシュ、スナップショットは、Web Crypto による AES-256-GCM で認証付きで暗号化されます。暗号化のたびに新しい 96 ビットのナンスと 128 ビットのタグを使います。認証はリポジトリの暗号化ヘッダーと論理オブジェクトキーに結び付いているので、ブロック、マニフェスト、スナップショットのあいだで差し替えることはできません。

256 ビットのルートキーは、PBKDF2-HMAC-SHA-256、600,000 回の反復、ランダムな 256 ビットのリポジトリソルトでローカルに導出されます。HKDF-SHA-256 で、AES 用と HMAC-SHA-256 によるオブジェクト命名用に別々のキーを導出します。内容ブロックの名前はキー付きの HMAC で、公開された平文のハッシュではありません。同じブロックはリポジトリの中で使い回され、関係のないリポジトリは別のソルトとキーを使います。復号ではファイルに反映する前にバイト列を認証します。

暗号化記述子に保存されるのは、公開の KDF パラメーター、リポジトリ ID、暗号化した固定の検証メッセージだけです。端末は最初にロック解除に成功した後、記述子のフィンガープリントを固定し、それが変わったり消えたりすると止まります。パスワードの誤り、不正な記述子、改ざんされた暗号文があると同期は止まります。

それでもプロバイダーには、選んだリモートのプレフィックス、オブジェクトの大きさと数、一つのリポジトリ内でのブロックの使い回し、リクエストのタイミング、匿名のロック所有者と時刻は見えます。このプロトコルは、悪意のあるサーバーが以前の正しい暗号化状態を再送してきても、それを検出できるとは保証しません。リモートの暗号文があればオフラインでパスワードを推測できるので、強いパスワードが大切です。KDF は推測の手間を増やしますが、弱いパスワードを強くはできません。この実装には相互運用性と改ざんの自動テストがありますが、独立したセキュリティ監査は受けていません。

ローカルのファイルは読めるままです。パスワードはリモートのリポジトリではなく、ユーザーごとの Textus のローカルの安全な保管場所に保存されます。これは乗っ取られたクライアントやロックされていないクライアントは守りません。パスワードか元の暗号化記述子を失うと、リモートからは復元できません。完全なバックアップには、記述子と暗号化オブジェクトを含める必要があります。

### リモートの形式

- `v1/head.json`：公開の暗号化記述子（`textus-cloud-sync-e2ee/1`）。古いパスは意図的なもので、v0.1 のクライアントはファイルをアップロードする前にこの形式を拒否します。
- `v1/lock.json`：古いクライアントと新しいクライアントで共有する排他ロック。文書のデータは入りません。
- `v2/head.bin`：暗号化した現在のマニフェスト。
- `v2/history.bin`：暗号化した履歴（各ファイルの以前の版とその出どころ）。
- `v2/blocks/<prefix>/<HMAC>`：暗号化した内容ブロック。
- `v2/snapshots/<revision>.bin`：現在と一つ前のリビジョンの、暗号化したマニフェスト。

暗号化しない場合は、同じオブジェクトが JSON とそのままのブロックで保存されます：`v1/head.json`、`v1/history.json`、`v1/blocks/<prefix>/<SHA-256>`、`v1/snapshots/<revision>.json`。一つのリモートフォルダは暗号化するかしないかのどちらかで、プラグインは両者を混ぜることを拒否します。

暗号化オブジェクトには、`TCS2`、12 バイトのナンス、暗号文とその 16 バイトの GCM タグが入ります。AAD は、正規化した JSON ヘッダー（`format`、`repositoryId`、`kdf`、`iterations`、`salt` の順）の UTF-8、改行、論理 v1 オブジェクトキーです。パスワードは正規化しない UTF-8 です。HKDF は UTF-8 のリポジトリ ID をソルトに、`textus-cloud-sync-e2ee/1/content` または `/names` を info に使います。ブロックの HMAC の入力は、UTF-8 の論理キー `v1/blocks/<hash-prefix>/<SHA-256>` です。検証用の平文は `Textus encrypted workspace key check` で、論理キーは `key-check`、その封筒は `verifier` に 16 進数で入ります。これらの選択は、テストで Node の独立した PBKDF2、HKDF、HMAC、AES-GCM の API と照らし合わせて検証しています。

### フォルダを暗号化に移す

リモートフォルダはその場で変換されません。まず、必要なすべてのファイルと競合コピーが一つのローカルワークスペースにそろっていることを確かめ、**新しい空のリモートフォルダ** を選び、暗号化をオンにして同期パスワードを設定します。最初にそのそろったワークスペースを同期してください。その後、ほかの端末は同じパスワードとリモートフォルダで参加できます。

古いリモートデータは、プロバイダー自身の版の履歴やバックアップも含め、暗号化されないまま残ります。暗号化したワークスペースを確かめた後、古いコピーはプロバイダー側で管理してください。パスワードをその場で変えることはできません。パスワードを変えるには、別の新しいリモートフォルダを使ってください。

## 中断した同期

リモートのロックで、端末が一台ずつ同期するようにします。S3 は `If-None-Match: *` を使います。Qiniu Kodo の S3 アドレスは既存のロックを上書きしてしまうため、Kodo では Qiniu のアップロードホストに `insertOnly` 付きのアップロードトークンでロックを作り、二つ目は拒否されます（614）。読み取りと削除は S3 アドレスのままです。WebDAV は一時的なアップロードに続けて `Overwrite: F` 付きの `MOVE` を使います。既存の対象に対する Nutstore の 409 応答も扱います。接続テストは、同期がワークスペースのデータに触れる前に、排他が効くことを確かめます。一覧 API や上限のないフォルダ一覧は必要ありません。

暗号化したブロックと変更できないスナップショットを書いてから、`v2/head.bin` を公開します。ローカルの基準が進むのは、公開に成功した後だけです。再試行では、完了したブロックを使い回します。再起動の後も同じで、止まった同期が保存したブロックはローカルに記録され、その間にほかの端末が公開していなければ、もう一度確かめることはありません。キャンセルすると、今のネットワークリクエストが終わった後に止まり、できればロックを解除します。Textus のネットワーク API はリクエストを 60 秒に制限しており、リクエスト単位のキャンセルはできません。

新しくバイナリをダウンロードするときは、ローカルのプラグインストレージに記録した一意の印でパスを確保します。書き込みが中断した場合、次の同期はその印をファイルの内容としてアップロードせず、その印から再開します。ほかのアプリがファイルを変えた場合は、その内容を残します。再試行するときは、プラグインのローカルデータを残しておいてください。

Textus を閉じたときや同期の途中で止まったときにこの端末が残したロックは、次の同期が確認なしで取り戻します。実行中の同期は 10 秒ごとにロックのメモを更新します。次の同期はメモが 30 秒経ったところでロックを取り戻し、それより早く始まったら残りの時間を待ち、その間にメモが更新されたら（別のウインドウでまだ同期が動いているとき）手を出しません。ほかの端末のロックを取ることはありません。そちらでクラッシュしたときは、**復旧 › 残ったロックを解除** が確認のうえでだけ取り除きます。先に、ほかのすべての端末が同期を止めていることを確かめてください。リモートのロックに期限はないので、遅い端末がタイマー切れだけで書き込みの権利を失うことはありません。

同期が各ファイルについて調べたこと（大きさ、時刻、ハッシュ）は起動をまたいでローカルに残るので、再起動後の最初の同期は、その間に変わったファイルだけを読み直します。記述子や現在のマニフェストがうっかり削除されると、以前に参加していた端末は止まります。元の記述子を含む完全なリモートバックアップを復元してください。暗号化したスナップショットは自身のオブジェクト名に結び付いているので、`v2/head.bin` に直接コピーすることはできません。一つのスナップショットを復元するには、それを復号し、その論理キー用に暗号化し直す必要があります。今のところ、一つのスナップショットを復元する画面はありません。同期の実行中は、リモートのファイルを変えないでください。

## コミュニティ版プラグインからの移行

公式のプラグインは `catvinci.cloud-sync` です。以前のコミュニティ版プラグイン `ciao1019.cloud-sync` は、ローカルの設定、シークレット、同期の状態を別に持っています。切り替える前に、中断した同期があれば古いプラグインで終わらせるか復旧し、その自動同期をオフにしてプラグインを無効にしてください。ワークスペースのバックアップも残しておいてください。

公式のプラグインを入れ、同じストレージの接続、まったく同じリモートフォルダ、同期パスワードを入力します。暗号化したリモートの形式は変わっていないので、既存の v0.2/v0.3 のリモートデータは、移動も暗号化し直しもせずに読めます。ローカルの認証情報、記述子の固定、基準はプラグイン ID をまたいでコピーされません。最初の実行は新しい端末として既存のリモートに参加し、ファイルに違いがあれば競合コピーを残すことがあります。同じワークスペースで両方のプラグインの自動同期を動かさないでください。平文の v0.1 のデータには、上で説明した別のアップグレード手順が必要です。

## 開発とクレジット

ソース、プロトコルのテスト、ビルド手順は [development/cloud-sync](https://github.com/CatVinci-Studio/textus-plugins/tree/main/development/cloud-sync) にあります。カタログは `plugins/catvinci.cloud-sync/` の読めるファイルを、コンパイルせずにパッケージにします。リリースはこのリポジトリの公式プラグインの手順に従い、`catvinci.cloud-sync-v0.3.0` のようなタグを付けます。

最初の開発は Ciao1019 によるもので、0.3.0 の画面と設定の改善は ChengAo Shen が貢献しました。MIT の表示は `LICENSE` と `THIRD_PARTY_NOTICES.md` に残しています。保存の設計は Petrichor/Sylva の `apps/api/internal/cloudsync/` を参考にしました。Go のソースや PostgreSQL のバックアップ形式はコピーしていません。

## 更新履歴

- **0.9.0** - Sync through Qiniu Kodo: pick **Qiniu Kodo**, then your bucket's region from the list, and enter the bucket and an access key. As with the other services, two devices never sync into it at once. Thanks to @phonedu.
- **0.8.1** - A file over 128 MiB no longer stops the whole sync: it stays where it is on every device and is listed under the status. A conflict copy opens from the page with a click. Ready for phones, not offered there yet: a sync when a folder opens and when you come back to Textus, none in the background; settings that survive an iPhone update; a smaller largest file and fewer transfers at once; deleted files kept in "Sync trash/" where there is no system Trash.
- **0.8.0** - Safer when a sync is cut short: a lock this device left (Textus closed or stopped mid-sync) is taken back by its next sync without asking; another device's lock still needs **Recover stale lock**. A sync that would delete many files from the cloud stops and asks first, and a folder where suddenly nothing is found is taken as unreadable, not emptied. A file the system Trash refuses no longer stops the whole sync: it stays in place and is tried again. The first sync after a restart reads only the files changed meanwhile, not the whole folder. Its page is in every language Textus speaks. Its pickers keep Textus's own height.
- **0.7.0** - Faster syncs with fewer requests: with nothing changed, a sync asks the service once instead of 8 to 16 times; a changed file's blocks are sent in one request each, without checking first or reading them back; on WebDAV folders are made only when one is missing. A busy service is waited for (up to a minute, shown in the status) instead of stopping the sync, and requests that got no answer are sent again. The progress counts files that are done. From Textus 1.4.4 the versions it keeps of a document show in Version History too.
- **0.6.1** - A big first sync that stops halfway (cancelled, offline, or slowed by the service) goes on where it stopped next time, instead of checking every file it already sent; on Nutstore that saves most of the requests.
- **0.6.0** - Sync settings rearranged: sync options sit at the top and apply as you pick them, with no Save button. **Sync interval**, **Sync delay**, and **Keep cloud history** are pickers. Files now go up and down several at a time: **Transfers at once** sets how many (S3 8, WebDAV 4, Nutstore 2 to start), and blocks the cloud already holds are no longer checked again. A connected service shows as a card with the account masked and **Test connection**, **Edit** and **Disconnect**; the encryption switch and password are part of the connection. **Test connection** works before saving, and names the missing permission (write, read or delete) when a check fails.
- **0.5.3** - One set of rules for every service: the automatic interval can be 1 to 1,440 minutes, and **After a save, wait** sets how long a sync waits after saving (Nutstore starts at 3 minutes, S3 and WebDAV at 0; WebDAV no longer waits 30 s).
- **0.5.2** - The plugin no longer caps its own requests: a first Nutstore sync of a folder with many files no longer stops at "The service request limit was reached".
- **0.5.1** - A sync interrupted after it wrote the history but before the new state no longer leaves versions in the history that were never synced. Trash and old versions age by the storage server's clock, so a device whose clock is wrong no longer drops what the others keep.
- **0.5.0** - Older versions stay in the cloud: right-click a file › **Cloud History…** to read and restore one, and **Plugins › Cloud History…** brings back deleted files. **Keep cloud history** sets 30, 90 or 365 days, or always, and old versions are cleaned up by themselves. End-to-end encryption is now a switch, off for new connections; connections set up before keep it. Also brings 0.4.7's changes. Needs Textus 1.4.1.
- **0.4.7** - A sync reads again only the files whose size or time changed since the last one, so syncing a big folder while you write takes far less work. Your own rules can leave out more files (written as in a `.gitignore`), the folder's `.gitignore` can count too, and Obsidian's shared settings can sync. A picture or other attachment changed on another device now replaces the one here instead of being kept twice. Needs Textus 1.4.1.
- **0.4.6** - Every language now has the whole page translated, not just a few lines. In a narrow panel the status and the connection hint keep a readable width and the buttons move to their own line.
- **0.4.5** - The sidebar keeps to the sync status and **Sync now**; **Connection settings…** there opens the plugin's own page, where the connection is set up. The sidebar page draws no title of its own, as the sidebar's other tabs. Needs Textus 1.3.13. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.4** - A Cloud Sync tab in the sidebar shows at a glance how sync stands - connected or not, the last sync, any error, which service and remote folder - with the whole connection form below; Settings shows the same page. The service is picked from a dropdown, and a long name, path or error wraps inside the page.
- **0.4.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.1** - Obsidian bases (`.base`) and canvases (`.canvas`) sync too.
- **0.4.0** - Deletions and renames reach your other devices (deleted files go to the system Trash there); automatic sync runs a few seconds after you save; the status bar shows how sync stands; syncs are paced to stay within WebDAV and Nutstore request limits.
- **0.3.1** - Nutstore: a remote folder that already exists no longer stops the sync.
- **0.3.0** - First official version: end-to-end encrypted sync through S3, WebDAV or Nutstore, with conflict copies when both sides changed a file.
