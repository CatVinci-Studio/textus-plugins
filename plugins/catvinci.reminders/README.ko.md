# 알림

줄에 `(@2026-11-02 09:00)`처럼 시각을 적어 두면, 그 시각에 시스템 알림으로 그 줄을 알려 줍니다.

표시는 어느 줄에나 쓸 수 있습니다. 할 일, 제목, 어떤 줄이든 됩니다. 그 시각이 되면 줄의 내용과 문서가 알림으로 나오고, 누르면 그 줄이 열립니다.

- `(@2026-11-02)`처럼 날짜만 쓰면 그날 아침 9시에 알려 줍니다.
- **플러그인 › 알림 설정…** 또는 슬래시 메뉴의 **알림 설정…**은 커서 위치에 표시를 넣어 줍니다: 1시간 후, 오늘 밤 8시, 내일 9시, 다음 주 월요일 9시, 또는 직접 입력한 날짜와 시간.
- 체크한 할 일(`- [x] …`)은 끝난 것이라 알리지 않습니다.
- 사이드바의 **알림** 탭에 다가오는 알림이 가까운 순서로 나옵니다. 누르면 그 줄이 열립니다.
- 알림은 Textus가 직접 관리합니다. 창이 열려 있을 때 오고, **백그라운드에서 계속 실행**(**설정 › 일반**)이 켜져 있으면 창을 모두 닫아도 옵니다. Textus가 꺼져 있는 동안 놓친 알림은 다음에 시작할 때 옵니다.

표시는 Obsidian의 Reminder 플러그인과 같은 방식으로 쓰므로, 같은 노트로 Obsidian에서도 알림을 받습니다.

Textus 1.4.3 이상이 필요합니다. 표시를 찾기 위해 열린 폴더의 파일 읽기를, 표시를 넣기 위해 편집기 쓰기를, 알림 보이기를 요청하고, Textus AI에 아래 두 도구를 줍니다.

## 변경 내역

- **0.3.6** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Opening a folder reads only the documents Textus finds a reminder mark in, not every document.
- **0.3.3** - The store description now opens with what the plugin does.
- **0.3.2** - Two open windows no longer clear each other's reminders, and the list empties when you close the folder. A mistyped time is refused instead of inserting a broken mark.
- **0.3.1** - Shorter help and empty-state text.
- **0.3.0** - Marks written with Textus's own dates; needs Textus 1.3.10.
- **0.2.2-0.2.3** - Updated shared date code.
- **0.2.1** - Textus AI is told when a due date belongs in Tasks instead.
- **0.2.0** - Textus AI can list the coming reminders and add one.
- **0.1.1** - Desktop only, since it runs in the background.
- **0.1.0** - First version: `(@date time)` marks as notifications Textus keeps, even in the background; Remind Me… and the sidebar list.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_reminders`: 다가오는 알림(열린 폴더의 문서에 있는 (@2026-11-02 09:00) 표시)을 가까운 순서로, 시각·내용·문서 경로·줄 번호와 함께 나열합니다. 마감일별 할 일은 list_tasks입니다.
- `add_reminder`: 앞에 열린 문서 끝에 시각이 붙은 작업 줄 - [ ] 내용 (@2026-11-02 09:00) 로 알림을 추가합니다. 그 시각에 알림이 옵니다. 정해진 시각에 알림을 받고 싶을 때 씁니다. 마감일만 있는 할 일은 add_task입니다.
<!-- /ai-tools -->
