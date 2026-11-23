# 북마크

글의 한 부분에 북마크를 걸고, 사이드바에서 언제든 그 자리로 돌아갑니다. 어느 문서에서나 쓸 수 있습니다.

글자를 선택하고 **선택 영역 북마크**를 고르세요. 선택한 글자를 오른쪽 클릭하거나 **플러그인 › 선택 영역 북마크**를 쓰면 됩니다. 북마크는 파일을 가리키므로 먼저 문서를 저장해야 합니다.

사이드바의 **북마크** 탭에 북마크가 문서별로 나열됩니다. 하나를 누르면 문서가 열리고 그 글자로 이동합니다. 지우려면 북마크를 오른쪽 클릭하고 **북마크 삭제**를 고르세요. 문서 이름을 바꾸거나 옮겨도 북마크가 따라갑니다.

## Obsidian 보관소

열린 폴더가 Obsidian 보관소(`.obsidian` 폴더가 있음)일 때:

- Obsidian 자체 북마크(`.obsidian/bookmarks.json`)도 이 탭의 **Obsidian 북마크** 아래에 Obsidian의 그룹 그대로 나옵니다. 노트, 제목, 블록 북마크만 나오고 검색이나 폴더 등은 나오지 않습니다.

## 권한

- 문서 읽기: 선택한 글자를 읽기 위해.
- 파일 읽기: Obsidian의 `bookmarks.json`을 위해.
- Textus AI 도구: Textus AI가 북마크를 나열할 수 있도록.

## 변경 내역

- **0.4.6** - Its page shows its list of changes in English in every language.
- **0.4.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.4** - Obsidian's bookmarks are listed as before but no longer written: Textus 1.4 keeps plugins out of `.obsidian`. Needs Textus 1.4.0.
- **0.4.3** - Rows are grouped by the document's path in the folder, one group per document; long passages end at a word with "…"; a failed block-id edit in a vault keeps the bookmark.
- **0.4.2** - Shorter help and empty-state text.
- **0.4.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.4.0** - In an Obsidian vault, new bookmarks are written to Obsidian's `bookmarks.json` too, and removed and renamed there.
- **0.3.0** - Lists the vault's own Obsidian bookmarks of notes, headings and blocks.
- **0.2.1** - Paths handled by code shared with other plugins; nothing changes in use.
- **0.2.0** - Textus AI can list your bookmarks (`list_bookmarks`).
- **0.1.0-0.1.2** - First versions: bookmark a selection, the sidebar list by document, bookmarks that follow renames; store page and icon; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_bookmarks`: 사용자의 북마크를 나열합니다. 각 문서에서 북마크한 글과, 열린 폴더에서 그 문서의 경로입니다.
<!-- /ai-tools -->
