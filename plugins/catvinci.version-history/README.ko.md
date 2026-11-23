# 버전 기록

문서를 저장할 때마다 내용을 버전으로 남겨, 무엇이 바뀌었는지 보고 예전 버전을 되살릴 수 있습니다.

- 저장할 때마다 문서의 글이 버전으로 남습니다. 간격이 짧은 저장(몇 초마다 하는 자동 저장 등)은 하나로 묶이며, 새 버전은 많아야 15분마다 생깁니다. 최근 하루치는 모두, 일주일까지는 한 시간에 하나, 석 달까지는 하루에 하나, 그 이전은 일주일에 하나를 보관합니다.
- 사이드바의 **기록** 탭에 지금 연 문서의 버전이 최신순으로, 날짜별로 묶여 나옵니다(오늘, 어제, 그다음은 날짜).
- 버전을 고르면 그 뒤로 바뀐 내용을 줄 단위로 보여 줍니다.
- 지금 문서나 다른 아무 버전과 비교할 수 있고, 바뀐 단어가 표시됩니다. 변경 옆의 "되돌리기"는 그 변경만 되돌립니다. "더 보기"에서 버전에 이름을 붙이거나 고정하고(이후 계속 보관), 새 문서로 열 수 있습니다. Textus 밖에서 바뀐 내용(다른 앱, 동기화, git)도 바뀌기 전과 후의 버전이 남습니다.
- **되돌리기**는 예전 글을 문서에 대한 수정으로 제안하며, 다른 수정처럼 수락하거나 거절할 수 있습니다. **새 문서로 열기**는 옆에 엽니다.
- 버전은 폴더가 아니라 Textus 안에 보관됩니다. 2MB가 넘는 문서는 보관하지 않으며, 저장 공간이 가득 차면 가장 오래된 버전부터 지웁니다.

## 권한

- 파일과 문서 읽기: 저장한 버전을 남기고 지금 내용과 비교하기 위해.
- 수정 제안: 예전 버전을 수락하거나 거절할 수 있는 수정으로 되돌리기 위해.
- Textus AI 도구: Textus AI가 문서의 버전을 나열하고 비교할 수 있도록.

## 변경 내역

- **0.5.1** - Its page shows its list of changes in English in every language.
- **0.5.0** - From Textus 1.4.4 the versions other plugins keep of a document - Cloud Sync's - are listed too, each under its source's name, to compare and restore like the rest.
- **0.4.1** - Restore is one word, so its button fits a narrow sidebar in every language.
- **0.4.0** - Versions thin out with age instead of the last 50 going; each text is stored once; a deleted document's versions go a month later. Compare any two versions, word by word; take back one change; name and pin versions; changes made outside Textus are kept. Versions from 0.3 move over by themselves. Needs Textus 1.4.3. In a Git folder on the desktop, the document's commits show under its versions.
- **0.3.8** - The text from before the first save is no longer lost when that save comes right as the document opens.
- **0.3.7** - The text a document had before its first save is kept as a version too, and a document's versions follow it when it is renamed or moved.
- **0.3.6** - Autosave while you type writes only the newest version, not every version of the document, so long documents save with much less work.
- **0.3.5** - An open version stays open while autosave updates it, and Restore always finds it. When storage is full, older versions of other documents make room, and the panel says when a save couldn't be kept. Rows work from the keyboard; buttons wrap in a narrow sidebar.
- **0.3.4** - In the sidebar the panel draws no title of its own, as the sidebar's other tabs. Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.3.3** - Its bars, lists and controls are Textus's own, grow with the interface and follow every theme; needs Textus 1.3.12.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Only the path code shared with other plugins changed; nothing changes in use.
- **0.3.0** - Textus AI can list a document's versions and compare them (`list_versions`, `diff_versions`).
- **0.2.0** - Textus's own controls. Needs Textus 1.3.2.
- **0.1.0-0.1.3** - First versions: a version on each save, what changed since, restore as an edit to accept or reject, open as a new document, saves close together kept as one, versions grouped by day, the oldest dropped when storage is full.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_versions`: 어떤 문서(경로가 없으면 앞에 열린 문서)의 저장된 버전을 최신순으로 1부터 번호를 매겨, 저장 시각과 크기와 함께 나열합니다.
- `diff_versions`: 문서의 두 버전 사이, 또는 어떤 버전과 지금 문서 사이에 바뀐 것을 줄 단위로 보여 줍니다. +는 추가, -는 삭제이며 앞뒤 줄을 조금 덧붙입니다.
<!-- /ai-tools -->
