# 빠른 삽입

`/`로 제목, 목록, 표 같은 블록을, `:`로 이모지를, `@`로 날짜를 넣습니다.

## / 메뉴

줄 맨 앞이나 공백 뒤에서 `/`를 입력하고 넣을 것을 고릅니다. 서식 메뉴와 같은 Textus 자체 블록입니다.

- **본문, 제목 1–3**, 그리고 **글머리 기호 목록, 번호 매기기 목록, 할 일 목록**
- **인용, 콜아웃, 코드 블록, 수식, 표, 구분선**

하나를 고르면 지금 줄이 그 블록으로 바뀝니다. 다른 플러그인도 메뉴에 자기 블록을 더합니다(데이터베이스, 링크 카드, 알림, 템플릿).

계속 입력하면 목록이 좁혀집니다: `/table`, `/tab`. 어느 언어로든 되고, 중국어 이름은 병음으로도 찾습니다(`/biaoge`).

## 이모지

`:`와 낱말을 입력하면 이모지가 나옵니다: `:tada`는 🎉, `:+1`은 👍, `:笑`는 😄.

## 날짜

`@`와 날을 입력하고, 그 날짜를 고릅니다.

- English: `@today`, `@tomorrow`, `@yesterday`, `@friday`, `@next friday`, `@in 3 days`, `@next week`
- 中文: `@今天`、`@明天`、`@后天`、`@周五`、`@下周五`、`@星期三`、`@3天后`、`@下周` (or `@後天`、`@下週五`、`@禮拜三`、`@3天後`)
- 日本語: `@今日`、`@明日`、`@明後日`、`@金曜日`、`@来週金曜日`、`@3日後`

한 주는 월요일에 시작하고, 요일만 쓰면 다가오는 그 요일입니다.

날짜는 `2026-11-06`으로 써집니다. 플러그인 설정의 **넣을 형식**을 **그날 노트 링크**로 바꾸면, 그날 일간 노트로 가는 링크를 폴더의 링크 방식대로 씁니다. `[2026-11-06](Daily/2026-11-06.md)` 같은 표준 링크, 또는 Obsidian 보관소나 노트가 위키 링크를 쓰는 폴더에서는 일간 노트 설정에 맞는 이름과 폴더로 `[[2026-11-06]]`, `[[November 6th, 2026]]`, `[[Journal/2026/11/2026-11-06]]` 같은 링크입니다. 그런 설정이 없는 폴더에서는 `Daily/`에서 일간 노트를 찾습니다.

목록은 공백 뒤, 줄 맨 앞, 괄호 뒤에서 열립니다. `me@example.com` 같은 주소나 `[@key]` 같은 인용에서는 열리지 않습니다. `(` 뒤에서는 `@`가 남으므로 `(@tomorrow`는 알림 `(@2026-11-06`이 됩니다.

넣는 내용은 모두 일반 Markdown입니다.

## 권한

- **문서 읽기와 편집**: 블록, 이모지, 날짜를 넣기 위해.
- **파일 읽기**: 날짜 링크를 위해 보관소의 일간 노트 설정을 읽기 위해.
- **Textus AI 도구**: Textus AI가 말로 쓴 날을 날짜로 바꿀 수 있도록.

## 변경 내역

- **0.5.1** - Its page is in every language Textus speaks. Needs Textus 1.4.4 itself, not a test version of it.
- **0.5.0** - The `/` menu lists Textus's own blocks, the Format menu's, so it always matches the app; Turn into… is gone from it, since picking a block turns the line you're on (the block handle's ⋮⋮ also has Turn Into). Needs Textus 1.4.4
- **0.4.3** - Dates in Traditional Chinese like 後天, 3天後 and 下週五 now work. A bare @ lists your app language's dates first, and day links are right relative to the note.
- **0.4.2** - Shares Two-way Links' fix for working out how a note links.
- **0.4.1** - a day's link is a standard link, [2026-11-08](Journal/2026-11-08.md), unless the folder or the note already uses [[wiki links]]
- **0.4.0** - day links are written the way the folder writes links, on Textus 1.3.10's dates; needs Textus 1.3.10
- **0.3.1** - carries the updated shared date code
- **0.3.0** - Natural Dates merged in: `@` dates in English, Chinese and Japanese, links to daily notes, and the `parse_date` tool for Textus AI
- **0.2.0** - **Today's date** leaves the `/` menu for `@today`
- **0.1.0-0.1.1** - first versions: the `/` menu, **Turn into…**, emoji after `:`

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `parse_date`: 말로 쓴 날(영어·중국어·일본어, 플러그인의 @ 자동 완성이 아는 것: tomorrow, next wednesday, in 3 days, 下周五, 明後日)을 오늘부터 센 날짜 YYYY-MM-DD로 바꿉니다. 한 주는 월요일에 시작하고, 요일만 쓰면 다음 그 요일입니다.
<!-- /ai-tools -->
