# 링크 카드

링크를 페이지의 제목·설명·그림이 있는 카드로 보여 주거나, Bilibili 동영상을 그 자리에서 재생합니다.

## 카드 만들기

- `/`를 입력해 **링크 카드 넣기…**를 고른 뒤 링크를 붙여 넣습니다. 또는 글 속 링크를 선택하고 오른쪽 클릭해 **링크 카드 넣기…**를 고르면 카드로 바뀝니다.
- 카드에는 페이지의 제목, 설명, 그림, 사이트 이름이 나옵니다. 누르면 브라우저에서 페이지가 열립니다.
- Bilibili 링크는 카드 안에서 동영상을 재생합니다. YouTube 링크는 동영상 정지 화면이 있는 카드로 보이고 브라우저에서 열립니다.
- 페이지를 읽을 수 없으면(오프라인이거나 웹 페이지가 아닐 때) 카드에는 주소만 담깁니다.

## 저장되는 내용

카드는 페이지의 내용을 담은 `card` 블록이라, 네트워크 없이도 보이고 어떤 Markdown 앱에서도 텍스트로 읽힙니다.

````markdown
```card
url: https://textus.md
title: Textus
description: A Markdown editor with AI that writes with you.
image: https://textus.md/og.png
```
````

- 카드의 오른쪽 클릭 메뉴에 있는 **다시 가져오기**는 페이지의 최신 제목과 그림을 가져옵니다.
- Obsidian에서 만든 카드도 보입니다. Auto Card Link의 `cardlink` 블록과 Link Embed의 `embed` 블록을 카드로 그리며, 쓰인 내용은 그대로 둡니다.

## 권한

- **네트워크, 모든 주소**: 카드로 만들 페이지를 읽기 위해. 그 링크만 가져옵니다.
- **문서 읽기와 편집**: 선택한 링크를 읽고 카드를 넣기 위해.
- **Textus AI 도구**: Textus AI가 링크로 카드를 만들 수 있도록.

## 변경 내역

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it. Its page receives Textus's messages by the API's current name.
- **0.5.0** - Right-click a selected web address for Turn into a Link Card; the item no longer shows for other selections. Needs Textus 1.4.4.
- **0.4.3** - Pictures and site icons show again; titles with an apostrophe are kept whole; **Fetch again** moved into the card's right-click menu; YouTube links show as cards with the video's still.
- **0.4.2** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - Obsidian's `cardlink` (Auto Card Link) and `embed` (Link Embed) blocks are drawn as cards
- **0.3.1** - the README's example links to textus.md
- **0.3.0** - a tool for Textus AI, `fetch_link_card`
- **0.2.0** - Textus's own buttons and colors (Textus 1.3.2)
- **0.1.0-0.1.1** - first versions: link cards kept in a `card` block, video players, **Fetch again**

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `fetch_link_card`: 웹 페이지의 제목·설명·그림·사이트 이름을 가져와, 링크를 카드로 보여 주는 ```card 블록과 함께 돌려줍니다. 사용자가 원하는 곳에 넣으면 됩니다.
<!-- /ai-tools -->
