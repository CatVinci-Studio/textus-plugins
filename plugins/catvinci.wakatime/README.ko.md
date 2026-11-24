# WakaTime

Textus에서 글 쓴 시간을 [WakaTime](https://wakatime.com) 계정에 보내, 대시보드에서 코딩 시간 옆에 보이게 합니다.

1. [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key)에서 API 키를 복사합니다.
2. Textus 설정의 WakaTime 페이지에서 **API 키 설정…**을 누르고 붙여 넣습니다. 키는 Textus 비밀 저장소에 보관됩니다.

플러그인 메뉴와 명령 팔레트에는 **WakaTime: API 키 설정…**, WakaTime이 센 오늘 합계를 보여 주는 **WakaTime: 오늘 글쓰기 시간**, **WakaTime: 대시보드 열기**가 있습니다.

## 무엇을 세고 무엇을 보내는지

- 앞에 있는 Textus 창에서 직접 한 작업만 셉니다. 입력, 커서 이동, 문서 전환, 저장. Textus가 뒤에 있는 시간이나 디스크에서, 또는 플러그인이 바꾼 내용은 세지 않습니다. Textus AI와 함께 쓴 글은 AI 코딩으로 셉니다.
- 작업할 때마다 WakaTime에 문서 경로, 언어(Markdown), 줄 수, 프로젝트, Git 브랜치를 알립니다. 프로젝트는 열린 폴더에 있는 `.wakatime-project` 파일의 첫 줄이고, 없으면 열린 폴더의 이름입니다.
- WakaTime의 공식 플러그인처럼, 같은 문서에 대해서는 2분에 많아야 한 번 보내고 저장할 때는 늘 보냅니다.
- 오프라인일 때는 시간이 대기열에 쌓였다가 나중에 묶어서 보내집니다.
- 키를 설정하기 전에는 아무것도 보내지 않고, 저장하지 않은 문서는 보내지 않습니다. 그만두려면 키를 비워 두세요.

Textus 1.3.0 이상이 필요합니다. 편집기와 열린 폴더의 파일 읽기(문서, 줄 수, `.wakatime-project`, `.git/HEAD`를 위해)와 `api.wakatime.com` 접속을 요청하며, 그 밖의 네트워크에는 접속하지 않습니다.

## 변경 내역

- **0.2.6** - Its icon is WakaTime's own logo.
- **0.2.5** - Set the API key with a button on its page in Settings, and find its commands in the Plugins menu: on a phone, with no command palette, too. Its page is in every language Textus speaks.
- **0.2.4** - Leaving the key empty now really turns it off; a garbled reply to Today's Writing Time shows the usual message.
- **0.2.3** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.2.2** - Finds `.wakatime-project` and the Git branch the same way on every system.
- **0.2.1** - Says where it runs: desktop and iPhone.
- **0.2.0** - Only your own work in a window in front counts; an offline queue sent in batches; project, branch and lines; Today's Writing Time.
- **0.1.0** - First version: writing time in Textus on your WakaTime dashboard.
