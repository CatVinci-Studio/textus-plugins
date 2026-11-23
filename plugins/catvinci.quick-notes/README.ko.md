# 빠른 메모

문서를 떠나지 않고 바로 메모합니다. 메모는 폴더의 받은 편지함 파일이나 오늘의 일일 노트에 들어갑니다.

- **Ctrl+Alt+N**(Mac에서는 **⌘⌥N**) 또는 **플러그인 › 새 빠른 메모…**로 메모를 입력해 저장합니다.
- 데스크톱에서는 트레이나 메뉴 막대 아이콘에도 **새 빠른 메모…**가 있습니다. 플러그인이 Textus에 백그라운드 실행을 요청하므로, 창을 모두 닫아도 쓸 수 있습니다.
- 사이드바의 **빠른 메모** 탭에 메모가 최신순으로 나열됩니다. **새로 만들기**로 그 자리에서 쓰거나, 목록에서 바로 고칠 수 있습니다.
- 각 메모의 작업 메뉴(더 보기 버튼 또는 오른쪽 클릭)에는 **넣기**(문서의 커서 위치에), **열기**, **삭제**가 있습니다. 문서에 저장된 메모는 그 문서의 해당 줄에서 열립니다.
- 실수로 지웠다면 아래쪽 **실행 취소**로 몇 초 안에 되살릴 수 있습니다. 새로 만들고 비워 둔 메모는 저절로 사라집니다.
- 메모가 6개 이상이면 위쪽에 검색 칸이 나타납니다.

## 메모를 보관하는 곳

메모는 열린 폴더의 문서에 보관되므로 Obsidian과 Cloud Sync에서도 보입니다. 플러그인 설정의 **메모 저장 위치**에서 고릅니다.

- **받은 편지함 파일**(기본값): 폴더 맨 위의 `Inbox.md`, 또는 **받은 편지함 파일**에 지정한 다른 문서. 메모는 끝에 목록 항목으로, 날짜와 시간과 함께 붙습니다(예: `- 2026-11-08 14:05 안나에게 전화`).
- **오늘의 일일 노트**: `## 빠른 메모` 제목(인터페이스 언어로) 아래에 들어가며, 없으면 만듭니다. 메모에는 시간이 붙습니다(예: `- 14:05 안나에게 전화`). 일일 노트의 폴더, 이름, 템플릿은 Obsidian 등 폴더의 일일 노트 설정을 따르고, 설정이 없으면 `Daily/YYYY-MM-DD.md`입니다.

파일을 고치면 사이드바도 따라 바뀝니다. 이전 버전의 메모는 한 번만, 오래된 것부터 그 파일로 옮겨집니다. 폴더를 열지 않았을 때는 메모가 Textus 안에 보관됩니다.

휴대폰에서는 **새 빠른 메모…**가 제목 줄 메뉴의 **플러그인**에 있고, 각 메모의 작업은 더 보기 버튼에 있습니다. 트레이가 없으므로 백그라운드 실행을 요청하지 않습니다.

## 권한

- 파일 읽기와 쓰기: 받은 편지함 파일이나 일일 노트를 위해.
- 문서 편집: 커서 위치에 메모를 넣기 위해.
- Textus AI 도구: Textus AI가 빠른 메모를 추가할 수 있도록.

## 변경 내역

- **0.6.0** - On iPhone, iPad and Android too: **New Quick Note…** under Plugins and the sidebar tab, with New and each note's more button easy to tap. Only the desktop asks to keep Textus running in the background. Needs Textus 1.4.7. Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.5.5** - Its buttons' names and tooltips come from Textus, as on its other pages.
- **0.5.4** - The page follows Textus's language by itself. Needs Textus 1.4.3.
- **0.5.3** - New while searching clears the search, so the new note shows; right-clicking a note's text also offers undo, cut, copy and paste; a search with no match says so.
- **0.5.2** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout. An empty list says what Quick Notes is for and offers New; a note's box grows with its text.
- **0.5.1** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.5.0** - Dates and the daily note's template are filled by Textus itself, the same way as in Calendar & Daily Notes and Templates. Needs Textus 1.3.10.
- **0.4.0** - Notes are kept in a document of the folder: `Inbox.md` or today's daily note. Notes from older versions move in once.
- **0.3.1** - Textus AI tells quick notes apart from the daily journal and to-dos.
- **0.3.0** - Textus AI can add a quick note (`add_note`).
- **0.2.0** - Textus's own controls, and an actions menu for each note.
- **0.1.0-0.1.4** - First versions: the shortcut and the tray, the sidebar list, insert, open, delete with Undo, search once there are many, dates on a line of their own; desktop only.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `add_note`: 사이드바의 빠른 메모 목록 맨 위에 메모를 추가합니다. 나중에 문서에 넣거나 문서로 열 수 있습니다. 오늘 일지는 append_to_daily_note, 할 일은 add_task입니다.
<!-- /ai-tools -->
