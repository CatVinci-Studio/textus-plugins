# Marp

문서를 [Marp](https://marp.app) 방식으로 쓴 슬라이드로 보여 줍니다.

## 슬라이드 만들기

- `---`마다 새 슬라이드가 시작됩니다.
- **플러그인 › 슬라이드로 발표**는 문서 옆 탭에 슬라이드를 보여 주며, 쓰는 대로 따라 바뀝니다. ← →(또는 ↑ ↓, Page Up, Page Down)와 Space로 슬라이드를 넘기고, **전체 화면**(또는 F)으로 발표합니다. 발표 중에는 슬라이드 왼쪽 3분의 1을 탭하거나 클릭하면 뒤로, 다른 곳은 앞으로 갑니다. 쓸어 넘겨도 됩니다. 슬라이드를 터치하거나 포인터를 움직이면 **발표 종료**가 나오고, Esc를 눌러도 됩니다.
- Marp 지시어로 테마와 배치를 고릅니다. 예를 들어 맨 위에:

```markdown
---
theme: gaia
paginate: true
---
```

- 그림도 슬라이드에 보이며, Obsidian의 `![[photo.png]]`도 됩니다. `![[photo.png|300]]`은 너비를 정합니다(`300x200`은 두 크기 모두).

## 슬라이드 저장하기

**플러그인 › 슬라이드를 HTML로 내보내기**(또는 슬라이드의 **HTML 저장**)는 문서 옆에 `name.slides.html`을 저장합니다. 어떤 브라우저에서든 같은 키로 발표할 수 있는 파일 하나입니다. 그림은 문서 폴더에서 링크하므로, 파일을 그림 옆에 두세요. 먼저 문서를 저장해야 합니다.

[Marp Core](https://github.com/marp-team/marp-core)(MIT) 위에 만들었습니다. 테마(default, gaia, uncover), 수식, 코드 강조가 Marp Core에서 오며, 그 때문에 플러그인 크기가 약 4MB입니다.

## 권한

- **문서 읽기**: 쓰는 대로 슬라이드를 그리기 위해.
- **파일 읽기와 쓰기**: 보여 줄 그림을 찾고, HTML 슬라이드를 문서 옆에 저장하기 위해.
- **Textus AI 도구**: Textus AI가 슬라이드를 저장해 줄 수 있도록.

## 변경 내역

- **0.3.12** - Presenting on a phone or tablet: tap or swipe to move between slides, and Exit to stop - no keyboard needed. A click moves on in full screen too, as in a saved deck. In a narrow tab, Save HTML goes into the ⋯ menu instead of pushing Full Screen onto a second row. Its page is in every language Textus speaks.
- **0.3.11** - Its package lists the libraries it carries, with their licenses.
- **0.3.10** - Code kept for Textus versions it no longer runs on is gone. From Textus 1.4.4 the deck is also in File › Export, as Slides (HTML).
- **0.3.9** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.3.8** - Present as Slides draws the deck on a phone, where its tab comes to the front alone.
- **0.3.7** - Formulas use KaTeX's own fonts from Textus 1.4.2 on, in the tab and in a saved HTML file; earlier versions keep the system's fonts.
- **0.3.6** - A deck needs nothing from the web: emoji show as text instead of pictures from a CDN, formulas use the system's fonts, and the Gaia theme no longer loads a web font, in the tab and in a saved HTML file.
- **0.3.5** - Writing a deck with many pictures is lighter: the slides are made again only when the text changed, and pictures it no longer shows are let go.
- **0.3.4** - Full Screen works in the tab (presenting in place where the window can't go full screen); the deck renders only while its tab is open; shortcuts leave Cmd/Ctrl/Alt keys alone.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - pictures in the deck, including Obsidian's `![[picture]]` embeds with a width
- **0.3.0** - a tool for Textus AI, `export_slides`
- **0.2.0** - named Marp in every language; Textus's own buttons and colors; labels follow the interface language
- **0.1.0-0.1.1** - first versions: a live deck beside the document, full screen, and a self-presenting HTML file

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `export_slides`: 앞에 열린 문서를 Marp 슬라이드(--- 줄마다 한 장)로, 옆에 HTML 파일 하나(name.slides.html)로 저장합니다. 어느 브라우저에서나 발표할 수 있습니다. 경로와 슬라이드 수를 돌려줍니다.
<!-- /ai-tools -->
