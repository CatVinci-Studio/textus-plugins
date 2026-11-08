# 템플릿

내 템플릿으로 새 문서나 조각을 만들고, 날짜·시간·제목을 채워 넣습니다.

- 템플릿은 열린 폴더의 **Templates** 폴더에 있는 Markdown 파일입니다(Obsidian 보관함에서는 템플릿 설정이 지정한 폴더). 노트가 가는 곳에 함께 갑니다. 이전 버전이 보관하던 템플릿은 한 번 그리로 옮깁니다. 이름이 겹치면 번호를 붙이고, 아무것도 덮어쓰지 않습니다. `{{date:YYYY-MM-DD}}`, `{{time:HH:mm}}`처럼 형식을 줄 수 있습니다(Obsidian과 같음).
- **템플릿으로 새로 만들기…**는 열린 폴더에 템플릿으로 문서를 만들고, **템플릿 넣기…**(본문에서 `/`도 가능)는 커서 위치에 넣습니다.
- **템플릿으로 저장…**은 앞에 있는 문서를 템플릿으로 저장합니다.
- 템플릿의 `{{date}}`, `{{time}}`, `{{title}}`은 쓸 때 채워집니다. 처음에는 회의록 템플릿이 있습니다.
- Obsidian 보관함에서는 `{{date}}`, `{{time}}`이 템플릿 설정의 날짜·시간 형식을 따릅니다. Templater의 자주 쓰는 태그도 채웁니다: `<% tp.date.now("YYYY-MM-DD") %>`(`-1` 같은 날짜 수나 `"P1W"`로 옮길 수 있음), `tp.date.today`, `tomorrow`, `yesterday`, `<% tp.file.title %>`, `tp.file.creation_date()`, `tp.file.folder()`. `<% tp.file.cursor() %>` 자리에 커서를 둡니다. 스크립트와 다른 태그는 실행하지 않고 그대로 두며, 알림으로 알려 줍니다.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_templates`: 사용자의 문서 템플릿을 이름과 Markdown과 함께 나열합니다. 쓸 때 {{date}}, {{time}}, {{title}}과 Templater의 tp.date, tp.file 태그가 채워집니다.
- `create_from_template`: 사용자의 템플릿으로 열린 폴더에 새 문서를 만들고 {{date}}, {{time}}, {{title}}과 Templater의 tp.date, tp.file 태그를 채웁니다. 경로와, 그대로 둔 태그(notRun)를 돌려줍니다.
<!-- /ai-tools -->
