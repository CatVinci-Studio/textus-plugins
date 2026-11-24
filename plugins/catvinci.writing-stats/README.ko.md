# 글쓰기 통계

단어 수, 읽는 시간, 하루 쓰기 목표를 사이드바에 보여 줍니다.

사이드바에서 **글쓰기 통계** 탭을 엽니다.

- **이 문서**: 단어 수, 글자 수, 읽는 시간.
- **선택 영역**: 선택한 부분의 단어 수와 글자 수.
- **오늘**: 오늘 모든 문서에 더한 단어 수와 하루 목표 대비 진행, 그리고 목표를 연속으로 달성한 날수. 목표는 플러그인 설정의 **하루 목표**에서 정합니다. 바꾸지 않으면 500이고, 0이면 목표가 없습니다.
- **폴더 전체**: 펼치면 열린 폴더 전체의 단어 수, 글자 수, 문서 수를 셉니다.

중국어, 일본어, 한국어는 글자 단위로, 다른 문자는 단어 단위로 셉니다. `#`, `*`, 링크 주소, front matter 같은 Markdown 기호는 세지 않습니다. 읽는 시간은 1분에 230단어 또는 한중일 문자 400자로 잡습니다.

Textus 1.4.3 이상이 필요합니다. 세기 위해 편집기와 열린 폴더의 파일 읽기를 요청하고, Textus AI에 아래 도구를 줍니다.

## 변경 내역

- **0.2.8** - Its page is in every language Textus speaks. It names the Textus it needs, 1.4.3.
- **0.2.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.2.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.2.5** - Words and characters are counted as the status bar counts them (from Textus 1.4.3), and a Windows file's front matter is left out of the count.
- **0.2.4** - The store description now opens with what the plugin does.
- **0.2.3** - Today now counts only the words you type yourself, not changes from sync or AI, and stays quick in large folders. A negative daily goal is no longer shown as met.
- **0.2.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.1** - Updated shared path code.
- **0.2.0** - Textus AI can count the words of a document or a folder.
- **0.1.1** - Says where it runs: desktop and iPhone.
- **0.1.0** - First version: the document, the selection, today against a goal, the streak and the whole folder.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `count_words`: 문서 하나, 폴더 안의 모든 문서, 또는 앞에 열린 문서의 단어 수·글자 수·읽는 시간(분)을 셉니다. 한중일 문자는 한 글자를 한 단어로 세고, Markdown 기호는 세지 않습니다.
<!-- /ai-tools -->
