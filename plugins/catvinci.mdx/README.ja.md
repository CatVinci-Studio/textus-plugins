# MDX

MDX 文書のためのプラグインです。MDX は、Docusaurus や Nextra などのサイト作成ツールが使う、コンポーネント入りの Markdown です。Textus は `.mdx` ファイルを標準で開き、import、`{式}`、コンポーネントを書かれたまま残します。このプラグインが加えるのは次のものです：

- **問題に下線。** 書いているあいだ MDX 公式のコンパイラが文書を検査し、最初に見つけた問題の場所に、行番号と何が違うかを添えて下線を引きます。
- **MDX をプレビュー。** 文書の隣に描画します。タブ、コールアウト（`<Callout>`、`<Admonition>`、`:::tip`）、`<details>` は Textus の見た目で、ほかのコンポーネントは名前と属性を示すカードで表示します。文書のコードは何も実行しません。
- **Markdown として保存 / MDX として保存。** 文書の隣にコピーを作ります。コールアウトは GitHub のアラートに、タブは見出しのある部分になり、中身のないコンポーネントはコメントとして残ります。逆方向では、波かっこと `<` をエスケープし、コメントと `<br>` を MDX の求める形で書きます。

これらは「プラグイン」メニューか、`.mdx` 文書の右クリックから使えます。

## 権限

- **文書の読み取り**：書いているあいだに検査して描画するため。
- **ファイルの読み書き**：Textus AI が指定した .mdx ファイルを検査し、変換したコピーを文書の隣に保存するため。
- **Textus AI のツール**：Textus AI が書いた MDX を検査できるようにするため。

## 更新履歴

- **0.1.3** - Its page is in every language Textus speaks.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Textus AI のツール

このプラグインを入れると、Textus AI が会話の中で使えます：

- `check_mdx`：MDX 公式のコンパイラで MDX を検査し、最初の問題とその行・列を返します。.mdx 文書を書いたり変えたりしたあと、動くと言う前に使ってください。
<!-- /ai-tools -->
