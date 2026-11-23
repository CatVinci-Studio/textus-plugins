# 마인드맵

제목과 목록으로 된 Markdown 개요를 코드 블록 안에서 마인드맵으로 그립니다.

언어를 `markmap`으로 한 코드 블록에 개요를 씁니다. 제목(`#`, `##`)과 목록 항목이 맵의 가지가 됩니다. 맵은 블록 아래에 그려지고, 블록을 클릭하면 소스를 다시 보고 고칠 수 있습니다.

- 맵을 끌어서 옮기고 확대·축소할 수 있습니다. 가지의 점을 클릭하면 그 가지를 접거나 펼칩니다.
- 언어 뒤에 `height=400`처럼 쓰면 맵 높이를 픽셀로 정합니다(기본값 360).
- 가지 색은 테마를 따르고, 테마를 바꾸면 다시 그려집니다.
- HTML, PDF, Word로 내보내면 맵이 그림으로 들어갑니다. 스크롤해서 보이지 않는 맵도 마찬가지입니다.

그리기에는 [markmap](https://markmap.js.org)을 씁니다. 요청하는 권한은 하나로, 아래에 있는 `check_markmap` 도구를 Textus AI에 주어 문서에 블록을 쓰기 전에 확인하게 하기 위해서입니다. 데스크톱과 iPhone, iPad에서 쓸 수 있습니다.

## 예시

```markmap
# Project
## Goals
- Ship 1.3
- Write the guide
## People
- Writers
- Reviewers
```

## 변경 내역

- **0.3.8** - The mind map fills its block: a small one grows (up to twice its size) to the block's width and the height you give it, and it follows the note's zoom instead of being cut off on the right.
- **0.3.7** - Its package lists the libraries it carries, with their licenses.
- **0.3.6** - A mind map drawn before its note was laid out no longer shows an error.
- **0.3.5** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.4** - Editing a mind map for a long time no longer makes Textus use more and more memory.
- **0.3.3** - Scrolling over a mind map now scrolls the note; pinch or Ctrl-scroll to zoom. The map uses your theme's font and colors, in dark mode too, and opens fully fitted.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - A mind map scrolled out of sight exports as its picture instead of its source.
- **0.3.0** - Textus AI can check a `markmap` block before it writes one.
- **0.2.0** - Branch colors come from the theme's tones. Needs Textus 1.3.2.
- **0.1.3** - Uses the theme's document text color and footnote size under their Textus 1.3 names.
- **0.1.0-0.1.2** - First versions: `markmap` code blocks drawn in the document, `height=`, and exports as a picture in the export's colors.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_markmap`: ```markmap 블록의 소스(제목과 목록 항목이 마인드맵의 가지가 되는 Markdown 개요)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
