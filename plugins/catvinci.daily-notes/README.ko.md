# 달력과 데일리 노트

연 폴더 안에 하루에 한 편씩 노트를 보관하고, 사이드바의 달력으로 어느 날이든 찾아갑니다.

- **Ctrl+Alt+J**(Mac에서는 **⌘⌥J**)를 누르거나 **플러그인 › 오늘의 노트 열기**를 고르면 오늘의 노트가 열립니다. 처음에는 자동으로 만들어집니다.
- **플러그인 › 전날 노트 열기**와 **플러그인 › 다음 날 노트 열기**로 지금 보고 있는 날의 노트에서 앞뒤 날로 이동합니다.
- 사이드바의 **달력** 탭에 한 달이 표시되고, 노트가 있는 날에는 표시가 붙습니다. 날짜를 클릭하면 그날의 노트가, **오늘**을 클릭하면 오늘의 노트가 열립니다. 한 주의 시작 요일은 Textus 언어를 따르며 주 번호와 맞습니다.
- 이미 있는 노트는 절대 덮어쓰지 않습니다.

## 설정

- **데일리 노트 폴더**: 연 폴더 안의 폴더로, 기본값은 `Daily`입니다.
- **새 날의 노트**: 새 노트가 시작하는 내용으로, 기본값은 `# {{date}}`입니다. `{{date}}`, `{{weekday}}`, `{{yesterday}}`와 `{{tomorrow}}`(`[[{{yesterday}}]]` 같은 링크에 씁니다), `{{time}}`, `{{title}}`, `{{date:형식}}`, `{{date+1d}}`를 쓸 수 있고 `\n`은 줄을 바꿉니다. Templates 폴더에 있는 템플릿 이름(예: `Daily`)을 써도 됩니다.
- **주간 노트**와 **월간 노트**: 기본은 꺼져 있습니다. 켜면 **플러그인 › 이번 주 노트 열기**와 **이번 달 노트 열기**, 또는 달력의 주 번호와 달 이름으로 엽니다. 각각 폴더(`Weekly`, `Monthly`), 이름 형식(`gggg-[W]ww`는 `2026-W45`, `YYYY-MM`은 `2026-11`), 템플릿이 따로 있습니다. 주간 템플릿에는 `{{monday:YYYY-MM-DD}}` … `{{sunday}}`로 그 주의 날짜를 쓸 수 있습니다.

## Obsidian 보관함

Obsidian 보관함에서는 보관함의 데일리 노트 설정을 따릅니다: 폴더, 이름 형식(`YYYY/MM/YYYY-MM-DD`나 `MMMM Do, YYYY` 등), 템플릿. Textus는 그 설정을 바꾸지 않습니다. 설정이 없는 보관함에서는 Obsidian처럼 노트를 보관함 맨 위에 둡니다. `{{date}}`, `{{yesterday}}`, `{{tomorrow}}`는 노트 이름 형식으로 쓰입니다. Periodic Notes 플러그인이 있는 보관함에서는 주간과 월간 노트가 그 설정을 따릅니다.

## 권한

노트를 찾고 만들기 위해 연 폴더의 파일을 읽고 씁니다. 앞뒤 날을 알기 위해 지금 앞에 있는 문서가 무엇인지 읽습니다. 또 Textus AI에 아래 두 도구를 줍니다. 데스크톱과 iPhone에서 쓸 수 있고 Textus 1.3.10 이상이 필요합니다.

## 변경 내역

- **0.7.9** - Its page no longer says which devices it runs on: the store shows that. It names the Textus it needs, 1.4.3.
- **0.7.8** - Where the bar is too narrow for even the short month name (a phone's sidebar), the month goes on a row of its own above the buttons instead of losing its year. The calendar writes dates with Textus's own, so the package is smaller.
- **0.7.7** - Weeks start as Textus's language has them, not the device's region, so they agree with the week numbers.
- **0.7.6** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.7.5** - The Calendar's month title starts at the left and ends in an ellipsis in a narrow sidebar, instead of being cut at both ends.
- **0.7.4** - In a narrow panel, such as on a phone, the calendar shows the month's short name instead of cutting the long one off.
- **0.7.3** - Impossible dates such as February 30 are refused, the calendar stays a comfortable width in wide panels and redraws when folder settings change, and weekly and monthly settings show only when those notes are on.
- **0.7.2** - Shorter help and empty-state text.
- **0.7.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.7.0** - Dates and templates are filled in by Textus itself, the same way as in the Templates plugin; needs Textus 1.3.10.
- **0.6.0** - Weekly and monthly notes, with their own settings, the calendar's week numbers and month name, and a vault's Periodic Notes settings.
- **0.5.0** - A vault without daily notes settings keeps its notes at its top; `{{date}}`, `{{yesterday}}` and `{{tomorrow}}` follow the notes' name format, `MMMM Do, YYYY` included.
- **0.4.0** - Follows an Obsidian vault's daily notes settings; the starting text can name a template in the Templates folder; `{{date:FORMAT}}` and `{{title}}`.
- **0.3.0** - Textus AI can read a day's note and add to it.
- **0.2.0** - The calendar uses Textus's own controls and follows the interface language when it changes; needs Textus 1.3.2.
- **0.1.3** - Textus 1.3's colors and type.
- **0.1.2** - Weeks start as your region has them; a day's note is never written over.
- **0.1.0-0.1.1** - First versions: today's note with a shortcut, the calendar, the day before and after, `{{weekday}}`, `{{yesterday}}`, `{{tomorrow}}` and `{{time}}` in the template.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `read_daily_note`: 어느 날의 데일리 노트(날짜가 없으면 오늘)를 데일리 노트 폴더에서 읽습니다. 경로, 있는지 여부, 본문을 돌려줍니다.
- `append_to_daily_note`: 어느 날의 데일리 노트(날짜가 없으면 오늘) 끝에 Markdown을 덧붙입니다. 노트가 없으면 먼저 템플릿으로 만듭니다. 나중에 쓰려고 사이드바에 두는 메모는 add_note, 날짜가 있는 할 일은 add_task입니다.
<!-- /ai-tools -->
