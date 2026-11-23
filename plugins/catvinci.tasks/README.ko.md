# 할 일

폴더의 모든 할 일을 한 목록에 모아 거기서 끝내고, Obsidian Tasks처럼 쿼리로 찾아봅니다.

- 어디에든 `- [ ] 할 일`이라고 쓰면 할 일이 됩니다.
- 사이드바의 **할 일** 탭에 연 폴더의 모든 문서에 있는 할 일이 문서별로, 각자 속한 제목과 함께 나옵니다.
- 거기서 체크해 끝내거나, 클릭해서 그 문서의 해당 위치로 갑니다.
- 할 일에 날짜(`📅 2026-11-01`, `due:2026-11-01`, `[due:: 2026-11-01]`)를 쓰면 배지로 보입니다. 기한이 지났거나 일주일 안에 다가온 할 일은 맨 위 **곧 마감**에 먼저 나옵니다.
- 위쪽 입력란으로 낱말, 문서 이름, 제목으로 목록을 거릅니다.
- 끝난 할 일은 기본적으로 숨겨집니다. **설정 › 확장 › 플러그인 › 할 일**에서 **끝난 할 일도 보기**를 켜면 보입니다.
- 칸반 보드(머리말에 `kanban-plugin`이 있는 문서나 `이름.kanban.md`)의 카드는 보드의 것이라 사이드바 목록에 넣지 않습니다.

## Obsidian에서 쓴 할 일

Obsidian의 Tasks 플러그인으로 쓴 할 일도 여기서 똑같이 다룹니다.

- `[/]`는 진행 중으로 아직 열린 것이고, `[-]`는 취소로 끝난 것입니다.
- 할 일 끝의 필드(📅 마감, ⏳ 예정, 🛫 시작, ➕ 생성, ✅ 완료, ❌ 취소, 우선순위 🔺 ⏫ 🔼 🔽 ⏬, 🔁 반복)는 파일에 그대로 두고 목록에는 보이지 않습니다.
- 체크하면 ✅와 그날 날짜를 쓰고, 체크를 풀면 완료일이나 취소일을 지웁니다.
- 반복하는 할 일을 체크하면 날짜를 넘긴 다음 회차를 바로 윗줄에 넣습니다. `🔁 every day`, `every 2 weeks`, `every weekday`, `every weekend`, `every Monday`, `every month on the 15th`, `every month on the last`, `every year`, `… when done` 등을 알아듣습니다.

## 할 일 쿼리

`tasks` 코드 블록은 한 줄에 규칙 하나씩, Obsidian과 같은 방식으로 원하는 할 일을 보여 줍니다.

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

- **상태**: `done`, `not done`, `status.type is`(`todo`, `in_progress`, `done`, `cancelled`).
- **날짜**: `due`, `scheduled`, `starts`, `done`, `created`, `cancelled`, `happens`에 `before`, `after`, `on`, `in`, `on or before`, `on or after`와 날짜(2026-11-01, today, tomorrow, yesterday, 또는 this/next/last와 week, month, year). `no due date`와 `has due date`도 됩니다(다른 날짜도 마찬가지).
- **텍스트**: `path`, `folder`, `filename`, `description`, `heading`에 `includes`나 `does not include`. `tag includes`, `tag does not include`, `has tags`, `no tags`.
- **기타**: `priority is`(`above`, `below`, `not`도 가능), `is recurring`, `is not recurring`.
- **순서**: `sort by`와 `group by`(status, due, scheduled, start, done, created, priority, path, folder, filename, heading, description. `reverse`를 붙일 수 있음), `limit`. `sort by`가 없으면 Obsidian Tasks처럼 상태, 마감일, 우선순위, 경로 순입니다.

보이는 방식에 관한 줄(`hide …`, `show …`)은 건너뛰고, 그 밖에 읽지 못한 줄은 개수 아래에 적어 줍니다. 쿼리 블록에는 보드의 카드도 나옵니다. 블록에서 체크하면 파일의 할 일이 체크되고, 클릭하면 그 자리로 갑니다.

## 권한

이 플러그인은 할 일을 찾으려고 폴더의 문서를 읽고, 할 일을 체크하거나 추가할 때만 문서에 씁니다. 아래 도구를 Textus AI에도 줍니다. 데스크톱과 iPhone, iPad에서 쓸 수 있습니다.

## 변경 내역

- **0.4.7** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.6** - The tasks block keeps a gap inside its frame, as other blocks do.
- **0.4.5** - The AI's new task under a heading never lands inside a code block, and **Move finished tasks to the end of their list** works in Windows (CRLF) notes.
- **0.4.4** - A task query in a document draws at the interface's text size, so a wider column shows more of it rather than larger text (Textus 1.4.1).
- **0.4.3** - Ticking a task with an HTML comment in it now works, and a refused tick tells you why. `group by status` sorts in the right order, task blocks fit narrow panes, due dates look like the sidebar's, and typing stays lighter.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12. A new setting, **Move finished tasks to the end of their list**: a task ticked in a document or in the list goes after the open ones (it asks once to read and edit the document in front).
- **0.4.0** - Uses the dates built into Textus 1.3.10, which it now needs.
- **0.3.1** - Ships the updated shared date code; nothing else changed.
- **0.3.0** - Obsidian Tasks: `[/]` and `[-]`, the task fields, done dates, repeating tasks and `tasks` query blocks; boards marked with `kanban-plugin` are left out of the list.
- **0.2.1** - Cards on a Kanban board (`name.kanban.md`) are no longer listed.
- **0.2.0** - Textus AI can list, add and tick off tasks.
- **0.1.3** - The list follows the interface language when it changes.
- **0.1.2** - Due dates in local time; counts in each language's plural forms.
- **0.1.0-0.1.1** - First versions: every task in the folder in a sidebar list, ticked off or opened from there, with a filter, due dates and Due soon.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_tasks`: 열린 폴더의 문서에 있는 Markdown 작업(- [ ] ...)을 나열합니다. 기본으로 미완료 작업만 보여 주며, 각각 내용·마감일·문서 경로·줄 번호가 붙습니다. 상태·문서·태그·마감일·단어로 거를 수 있습니다. 칸반 카드(read_board)와 시각 알림(list_reminders)은 포함하지 않습니다.
- `add_task`: 열린 폴더의 문서에 작업(- [ ] ...)을 추가합니다. 문서 끝이나 제목 아래 구역의 끝에 넣고, 마감일이 있으면 붙입니다. 문서가 없으면 만듭니다. 추가된 위치를 돌려줍니다. 정해진 시각에 알려야 하면 add_reminder, 보드 카드는 add_card, 데이터베이스 행은 add_row, 오늘 일지에 쓰려면 append_to_daily_note를 쓰세요.
- `complete_task`: list_tasks가 알려 준 문서 경로와 줄 번호로 작업을 완료(- [x])로 표시합니다. done을 false로 하면 다시 미완료로 돌립니다. Obsidian Tasks처럼 완료 날짜(✅ YYYY-MM-DD)를 쓰고, 반복 작업(🔁 every …)은 다음 차례를 윗줄에 추가합니다.
<!-- /ai-tools -->
