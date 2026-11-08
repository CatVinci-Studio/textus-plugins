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

- **0.4.1** - 도구 막대, 목록, 컨트롤을 Textus 자체의 것으로 바꿨습니다. 인터페이스와 함께 커지고 모든 테마를 따릅니다. Textus 1.3.12가 필요합니다.
- **0.4.0** - Textus 1.3.10에 들어 있는 날짜 기능을 씁니다. 그래서 Textus 1.3.10이 필요합니다.
- **0.3.1** - 업데이트된 공용 날짜 코드를 함께 담음. 다른 변경은 없습니다.
- **0.3.0** - Obsidian Tasks 지원: `[/]`와 `[-]`, 할 일 필드, 완료일, 반복 할 일, `tasks` 쿼리 블록. `kanban-plugin`이 붙은 보드는 목록에서 뺍니다.
- **0.2.1** - 칸반 보드(`이름.kanban.md`)의 카드를 더는 목록에 넣지 않습니다.
- **0.2.0** - Textus AI가 할 일을 나열하고, 추가하고, 체크할 수 있습니다.
- **0.1.3** - 인터페이스 언어가 바뀌면 목록도 따라 바뀝니다.
- **0.1.2** - 마감일을 현지 시간으로 다루고, 개수를 각 언어의 복수형으로 보여 줍니다.
- **0.1.0-0.1.1** - 첫 버전들: 폴더의 모든 할 일을 사이드바 목록에 보여 주고 거기서 체크하거나 이동, 필터, 마감일, '곧 마감'.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_tasks`: 열린 폴더의 문서에 있는 Markdown 작업(- [ ] ...)을 나열합니다. 기본으로 미완료 작업만 보여 주며, 각각 내용·마감일·문서 경로·줄 번호가 붙습니다. 상태·문서·태그·마감일·단어로 거를 수 있습니다. 칸반 카드(read_board)와 시각 알림(list_reminders)은 포함하지 않습니다.
- `add_task`: 열린 폴더의 문서에 작업(- [ ] ...)을 추가합니다. 문서 끝이나 제목 아래 구역의 끝에 넣고, 마감일이 있으면 붙입니다. 문서가 없으면 만듭니다. 추가된 위치를 돌려줍니다. 정해진 시각에 알려야 하면 add_reminder, 보드 카드는 add_card, 데이터베이스 행은 add_row, 오늘 일지에 쓰려면 append_to_daily_note를 쓰세요.
- `complete_task`: list_tasks가 알려 준 문서 경로와 줄 번호로 작업을 완료(- [x])로 표시합니다. done을 false로 하면 다시 미완료로 돌립니다. Obsidian Tasks처럼 완료 날짜(✅ YYYY-MM-DD)를 쓰고, 반복 작업(🔁 every …)은 다음 차례를 윗줄에 추가합니다.
<!-- /ai-tools -->
