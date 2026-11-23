# 제목 번호

글을 쓰는 동안 제목 앞에 번호(1, 1.1, 1.2)를 보여 주며, 원문은 바꾸지 않습니다.

- 글을 쓰는 동안 각 제목 앞에 번호가 표시됩니다: 1, 1.1, 1.2, 2… 번호는 화면에만 그려지고 문서의 텍스트는 그대로입니다.
- 번호는 문서에서 가장 높은 수준의 제목부터 붙습니다. 그 수준에 제목 하나뿐이면 한 단계 아래부터 붙습니다.
- 제목에 이미 손으로 번호를 붙인 문서에는 번호를 더하지 않습니다. 최상위 제목 대부분이 `1.`, `1.2`, `一、`, `第一章`, `(一)` 같은 번호로 시작하는 경우입니다.
- Obsidian: 문서 머리말에 `number headings: off`(Obsidian의 Number Headings 플러그인이 쓰는 설정)를 쓰면 그 문서에서는 번호가 나오지 않습니다.
- **내보낼 때 번호 넣기**(**설정 › 확장 › 플러그인 › 제목 번호**, 기본값 켬): HTML과 PDF로 내보낼 때도 같은 번호가 나옵니다.

이 플러그인은 열린 문서의 제목을 읽고(편집기 읽기 권한), 아래의 `number_headings` 도구를 Textus AI에 줍니다(AI 도구 권한). 이 도구는 번호를 넣거나 뺀 텍스트를 돌려줄 뿐 파일은 바꾸지 않습니다. 데스크톱과 iPhone, iPad에서 쓸 수 있습니다.

## 변경 내역

- **0.2.5** - Its page no longer says which devices it runs on: the store shows that.
- **0.2.4** - With two documents open side by side, both show their heading numbers, not only the one you are typing in.
- **0.2.3** - Front matter and code blocks no longer get numbers by mistake, and exports number only top-level headings, like the editor.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - No numbers on a document numbered by hand, or one whose front matter says `number headings: off`.
- **0.2.0** - Textus AI can write heading numbers into Markdown, or take them out.
- **0.1.3** - Says where it runs: the desktop, iPhone and iPad.
- **0.1.2** - Numbering starts at the document's own top heading level instead of a setting.
- **0.1.0-0.1.1** - First versions: numbers before headings while writing, and in HTML and PDF exports.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `number_headings`: Markdown의 제목에 번호(1, 1.1, 1.2)를 써 넣습니다. 번호는 편집기에 보이는 것과 같이 매기며(하나뿐인 표제는 제외), 이미 있는 번호는 바꿉니다. remove를 주면 번호를 뺍니다. 글을 돌려주고 아무것도 쓰지 않습니다.
<!-- /ai-tools -->
