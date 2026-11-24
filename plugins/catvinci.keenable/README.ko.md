# Keenable 검색

Textus AI가 [Keenable](https://keenable.ai)로 웹을 검색하게 합니다.

- 대화에서 Keenable을 쓰라고 하거나 Textus AI 자체 웹 검색이 설정되어 있지 않을 때 Textus AI가 이 도구를 씁니다. 기본으로 결과 5개(최대 10개)를 가져오며, 각 결과에는 제목, 주소, 짧은 글, 날짜가 있습니다.
- 키 없이도 Keenable의 공개 검색으로 동작합니다. Keenable의 전체 검색을 쓰려면 Textus 설정의 이 플러그인 페이지에서 **API 키 설정…**을 누르고(또는 명령 팔레트에서 **Keenable: API 키 설정…** 실행) 키를 붙여 넣습니다. 다시 열어 칸을 비워 두면 키를 지우고 공개 검색으로 돌아갑니다. 키는 이 기기의 Textus 비밀 저장소에 보관됩니다.
- 묻는 내용은 Textus AI가 대화에서 이 도구를 쓸 때만 Keenable로 보내집니다.

이 플러그인은 권한 두 가지를 요청합니다. 아래의 검색 도구를 Textus AI에 주기 위한 AI 도구 권한과, 검색을 위해 `api.keenable.ai`에만 접속하는 네트워크 권한입니다.

## 변경 내역

- **0.1.4** - A simpler icon, drawn in the text colour.
- **0.1.3** - Set the API key with a button on its page in Settings: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.1.2** - Removing the API key really removes it, so search goes back to the public search; an unreadable answer gets a plain message.
- **0.1.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.0** - First version: web search for Textus AI through Keenable, with or without an API key.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `keenable_search`: Keenable로 웹을 검색해 각 결과의 제목, URL, 짧은 글, 날짜를 돌려줍니다. 사용자가 Keenable을 지정하거나 Textus AI 자체 웹 검색이 설정되지 않았을 때 씁니다.
<!-- /ai-tools -->
