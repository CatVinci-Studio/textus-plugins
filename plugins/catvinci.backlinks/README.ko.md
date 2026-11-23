# 양방향 링크

`[[`를 입력해 노트·제목·블록을 링크하고, `![[`로 넣어 보여 주며, 지금 문서를 링크하는 노트를 사이드바에서 확인합니다.

`[[노트]]` 같은 링크는 Textus에 기본으로 들어 있어 플러그인 없이도 쓰고 열 수 있습니다. 이 플러그인은 링크 쓰기를 돕고, 링크가 가리키는 내용을 그 자리에 보여 주며, 지금 문서 주변의 링크를 목록으로 보여 줍니다. 데스크톱과 iOS에서 쓸 수 있습니다.

## 쓰면서 링크하기

- `[[`를 입력하고 열린 패널에서 노트를 고릅니다. 파일 이름, 첫 제목, front matter의 `aliases` 어느 것으로든 찾을 수 있습니다. 별칭을 고르면 `[[노트|별칭]]`으로 써집니다.
- `#` 다음에는 그 노트의 제목이 나옵니다: `[[노트#제목]]`. `[[#`는 지금 문서의 제목을 보여 줍니다.
- `#^` 다음에는 그 노트의 블록이 나옵니다: 문단, 목록 항목, 표, 인용. id가 없는 블록을 고르면 그 노트의 블록 끝에 Obsidian과 같은 방식으로 id(`^1a2b3c` 등)를 붙입니다.
- 글자를 선택한 뒤 `[[`를 입력하면 링크가 됩니다.
- 링크는 폴더의 방식대로 씁니다. 폴더에서 고른 방식이나 Obsidian 보관소의 링크 형식을 따르고, 없으면 그 노트에 이미 있는 링크를, 그것도 없으면 어떤 앱에서도 열리는 표준 링크 `[Nov 8](Week45/Nov%208.md)`를 씁니다. 경로가 필요한 위키 링크는 노트 이름만 보여 줍니다.

## 넣어 보기

- `![[노트]]`는 노트 전체를, `![[노트#제목]]`은 그 절을, `![[노트#^id]]`는 그 블록을 그 자리에 보여 줍니다. 읽기 전용이며 원래 노트가 바뀌면 함께 바뀝니다.
- 그 줄에 커서를 두면 링크 자체를 고칠 수 있습니다.

## 사이드바의 링크

사이드바의 **양방향 링크** 탭에서 지금 문서를 링크하는 노트와 이 문서가 링크하는 곳을 볼 수 있습니다.

- **링크된 언급**: [[위키 링크]]나 이 파일로 가는 링크로 여기를 가리키는 다른 노트의 줄입니다. 누르면 그곳으로 갑니다.
- **링크되지 않은 언급**: 이 노트의 이름(파일 이름, 첫 제목, `aliases`)을 언급했지만 링크가 없는 줄입니다. 오른쪽 클릭 후 **링크로 만들기**를 고르면 링크가 됩니다. 그 줄이 별칭을 썼다면 별칭이 링크 텍스트로 남습니다.
- **나가는 링크**: 이 노트가 링크하는 노트입니다. 아직 만들지 않은 노트도 포함합니다.
- 위쪽 입력란으로 목록을 거를 수 있습니다.

## 표준 링크와 위키 링크

- **플러그인 › 새 링크 작성 방식: 표준 또는 위키…** 로 열린 폴더의 새 링크를 어떻게 쓸지 고릅니다. 선택은 폴더의 `.textus/settings.json`에 저장되고, Textus와 다른 플러그인도 그대로 따릅니다.
- **플러그인 › 링크를 표준 링크로 변환…** 과 **링크를 위키 링크로 변환…** 은 지금 문서나 폴더의 모든 노트의 링크를 다시 씁니다. 먼저 바뀔 링크 수를 알려 주고, 모든 링크는 원래 가리키던 곳을 그대로 가리킵니다. 코드, 맨 앞의 속성, 대상을 찾을 수 없는 링크는 그대로 두고, 그림과 다른 파일은 표준 링크로 남깁니다.

## 권한

- **문서 읽기와 편집**: 입력 중 링크를 완성하고, 선택한 글자를 링크로 바꾸기 위해.
- **열린 폴더의 파일 읽기와 쓰기**: 링크와 언급을 찾고, 링크되지 않은 언급에 링크를 넣고, 블록에 `^id`를 붙이기 위해.
- **Textus AI 도구**: Textus AI가 문서의 링크를 나열할 수 있도록.

## 변경 내역

- **0.4.7** - Code kept for Textus versions it no longer runs on is gone.
- **0.4.6** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.4.5** - Unlinked mentions open on the right line, and Link Style is set by Textus itself (Textus 1.4.3).
- **0.4.4** - The Convert Links commands leave links inside a code block alone and convert the ones after it, and Unlinked mentions no longer lists or links names in front matter or code.
- **0.4.3** - Standard links to notes that don't exist yet now show under Outgoing links, a note's links to its own headings no longer list the note itself, and dragging a divider no longer redraws the panel.
- **0.4.2** - Shorter help and empty-state text. Its sidebar panel and page follow Textus 1.3.13's layout.
- **0.4.1** - In a note with no links yet, [[ writes a standard link: the [[ being typed was taken for a wiki link the note already had.
- **0.4.0** - New Links: Standard or [[Wiki]]… chooses how the folder writes new links, and Convert Links turns a note's or the whole folder's links from one way into the other; [[ writes the folder's way, a standard link where nothing says otherwise.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - `[[` completion for notes, headings and blocks; `![[` embeds; renamed from Backlinks to Two-way Links
- **0.2.1** - the description says "two-way links", so a store search finds it
- **0.2.0** - a tool for Textus AI, `list_backlinks`
- **0.1.0-0.1.1** - first versions: linked and unlinked mentions with **Link**, outgoing links and a filter; suggested for documents with wiki links

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_backlinks`: 어떤 문서(경로가 없으면 앞에 열린 문서)에 대해, 그 문서로 링크하는 노트(경로·줄 번호·그 줄의 내용), 링크 없이 이름만 언급한 줄, 그 문서가 링크하는 노트를 나열합니다.
<!-- /ai-tools -->
