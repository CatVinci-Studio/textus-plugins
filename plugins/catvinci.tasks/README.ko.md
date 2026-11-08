# 할 일

폴더 안의 모든 할 일을 한 목록에 모읍니다.

- 어디서든 `- [ ] 할 일`이라고 쓰면 할 일이 됩니다.
- 사이드바의 **할 일** 탭에 연 폴더 안 모든 문서의 할 일이 나옵니다.
- 거기서 바로 체크해 끝내거나, 클릭해서 그 문서의 해당 위치로 이동합니다.
- 끝난 할 일을 보일지는 플러그인 설정에서 바꿀 수 있습니다.
- 할 일에 날짜(`📅 2026-11-01` 또는 `due:2026-11-01`)를 적으면 배지로 표시되고, 기한이 지났거나 일주일 안에 다가온 할 일은 맨 위의 **곧 마감**에 먼저 나옵니다.
- 맨 위의 입력란으로 단어, 문서 이름, 제목에 따라 목록을 걸러 낼 수 있습니다.
- 칸반 보드(front matter에 `kanban-plugin`이 있는 문서, 또는 `이름.kanban.md`)의 카드는 보드에 맡기고 목록에 넣지 않습니다.

## Obsidian에서 쓴 할 일

Obsidian의 Tasks 플러그인으로 쓴 할 일도 여기서 똑같이 다룹니다.

- `[/]`는 진행 중으로 아직 남은 일, `[-]`는 취소로 끝난 일입니다.
- 할 일 끝의 필드(📅 마감, ⏳ 예정, 🛫 시작, ➕ 생성, ✅ 완료, ❌ 취소, 우선순위 🔺 ⏫ 🔼 🔽 ⏬, 🔁 반복)는 파일에 그대로 두고 목록에는 보이지 않습니다.
- 체크하면 ✅와 그날 날짜를 쓰고, 체크를 풀면 지웁니다.
- 반복하는 할 일(`🔁 every day`, `every 2 weeks`, `every weekday`, `every Monday`, `every month on the 15th`, `every year`, `… when done`)을 체크하면 날짜를 옮긴 다음 차례를 윗줄에 추가합니다.

## 할 일 쿼리

`tasks` 코드 블록은 한 줄에 조건 하나씩, Obsidian과 같은 방식으로 할 일을 나열합니다.

````markdown
```tasks
not done
due before next week
path includes Projects
sort by due
```
````

읽을 수 있는 조건: `not done`과 `done`, `due`·`scheduled`·`starts`·`done`·`created`에 `before`·`after`·`on`·`on or before`·`on or after`와 날짜(2026-11-01, today, tomorrow, yesterday, this/next/last week·month·year), `no due date`와 `has due date`, `path`·`filename`·`description`·`heading`의 `includes`와 `does not include`, `tag includes`, `priority is`, `is recurring`, `sort by`, `group by`(path, folder, filename, heading, due, priority, status), `limit`. 보이는 방식에 관한 줄(`hide …`, `show …`)은 건너뛰고, 그 밖에 읽지 못한 줄은 개수 아래에 알려 줍니다. 블록에서 체크하면 파일의 할 일이 체크되고, 클릭하면 그 자리로 갑니다.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_tasks`: 열린 폴더의 문서에 있는 Markdown 작업(- [ ] ...)을 나열합니다. 기본으로 미완료 작업만 보여 주며, 각각 내용·마감일·문서 경로·줄 번호가 붙습니다. 상태·문서·태그·마감일·단어로 거를 수 있습니다. 칸반 카드(read_board)와 시각 알림(list_reminders)은 포함하지 않습니다.
- `add_task`: 열린 폴더의 문서에 작업(- [ ] ...)을 추가합니다. 문서 끝이나 제목 아래 구역의 끝에 넣고, 마감일이 있으면 붙입니다. 문서가 없으면 만듭니다. 추가된 위치를 돌려줍니다. 정해진 시각에 알려야 하면 add_reminder, 보드 카드는 add_card, 데이터베이스 행은 add_row, 오늘 일지에 쓰려면 append_to_daily_note를 쓰세요.
- `complete_task`: list_tasks가 알려 준 문서 경로와 줄 번호로 작업을 완료(- [x])로 표시합니다. done을 false로 하면 다시 미완료로 돌립니다. Obsidian Tasks처럼 완료 날짜(✅ YYYY-MM-DD)를 쓰고, 반복 작업(🔁 every …)은 다음 차례를 윗줄에 추가합니다.
<!-- /ai-tools -->
