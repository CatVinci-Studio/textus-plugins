# デスクペット

書いているあいだそばにいて、あなたのすることに反応してくれるちびキャラの相棒です。

**プラグイン › デスクペットを表示/非表示**、またはコマンドパレットから表示と非表示を切り替えます。プラグインを初めてオンにしたときは、自分から出てきます。

- **誰が**：Textus の猫娘、墨羽です。Textus AI が働いていてそのパネルが開いているあいだは、使っているモデルの LLM ちゃんが遊びに来ます：Claude ちゃん、GPT ちゃん、Gemini ちゃん、DeepSeek ちゃん、Kimi ちゃん、Qwen ちゃん、Doubao ちゃん、GLM ちゃん、MiniMax ちゃん、Grok ちゃん、ERNIE ちゃん。お客さんは Textus AI の作業が終わってから 1 分半ほどいて、AI パネルを閉じると帰ります。いつも同じキャラクターにしたいときは、プラグインの設定か、右クリックメニューの **キャラクターを切り替え…** で選びます。
- **どこに**：最初は Textus のウインドウの中です。どこへでもドラッグできます。右クリックすると、キャラクターの切り替え、デスクトップへの移動（すべてのウインドウの上）、点への折りたたみ、閉じるができます。デスクトップにいるときは、メニューから Textus や Textus AI も開けます。前に置いた場所に現れ、左右どちらにいても真ん中のほうを向きます。
- **何をするか**：入力中は書き物をし、手を止めるとぼんやりしてからうたた寝し、保存すると喜び、Textus AI が働いているとのぞき込み、Textus が裏にあるあいだは眠ります。クリックすると返事をし、何度かクリックするとなでられ、運ぶとびっくりします。一日に一度あいさつし、長い休みのあとはおかえりと言い、長く書き続けると応援してから休むよう勧め、深夜には寝るよう声をかけ、Textus AI に確認してほしい編集があると知らせます。
- **何を言うか**：キャラクターごとに自分の口調で話し、場面ごとにいくつかのせりふから選びます。Textus が話すすべての言語に対応しています（`lines/`）。

## 設定

- **そばにいるのは**：Textus AI のモデルに合わせる（既定）か、いつも同じキャラクターか。
- **吹き出し**：オフにすると静かにしています。
- **深夜は休むよう知らせる**：午後 11 時から午前 5 時のあいだに書いていると、その夜に一度、寝るよう声をかけます。

彼女にわかるのは何かが *起きた* ことだけです（入力した、保存した、Textus AI が考えている）。文書や会話の言葉は一つも知らないので、このプラグインは権限を求めません。

## クレジット

墨羽は CatVinci Studio のオリジナルキャラクターです。LLM ちゃんはコミュニティが生んだ AI モデルの擬人化キャラクターで、[ZipZipPipe](https://space.bilibili.com/4168597) をはじめとする作者たちがデザインし、CatVinci Studio がちびキャラとして描き直しました。[LLM-chan stickers](https://github.com/ChengAoShen/LLM-chan-stickers) をご覧ください。これはファン作品で、どの AI 企業とも関係ありません。

## 更新履歴

- **0.1.10** - Its page is in every language Textus speaks. Its description begins with what she does, and no longer counts the characters or languages.
- **0.1.9** - Code kept for Textus versions it no longer runs on is gone.
- **0.1.8** - What she says sits above her, two lines at most, and never covers her face.
- **0.1.7** - A visiting LLM-chan keeps her pose and greeting when a new page opens, and stays still while Textus is in the background. Her hop is gentler, and the bubble's tail points at her middle.
- **0.1.6** - The speech bubble's tail joins its box with no line between them.
- **0.1.5** - started on the left, she faces the middle from the first frame; her speech bubble is Textus's own, and when she is small its words shrink with her (to a readable floor) and wrap into even lines; needs Textus 1.3.12
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - The model's LLM-chan visits only while the Textus AI panel is open, and goes home when it closes.
- **0.1.2** - Every character redrawn; she sits at either side and turns to face the middle.
- **0.1.1** - Moyu speaks for herself when Textus AI works ("I'm here to help"), and cheers on fluent writing.
- **0.1.0** - First version: Moyu and the LLM-chan in a floating view, in the window or on the desktop, with lines in every language Textus speaks.
