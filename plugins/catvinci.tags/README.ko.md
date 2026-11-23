# 태그

열린 폴더의 모든 `#태그`를 그 태그를 쓰는 노트 수와 함께 사이드바에 보여 줍니다.

- **태그** 탭에 태그가 많이 쓰인 순으로 나옵니다. 중첩 태그(`#project/alpha`)는 Obsidian처럼 트리를 이루며, 태그의 수에는 그 아래 태그의 노트도 포함됩니다. 입력란에 입력해 목록을 거를 수 있습니다.
- 태그를 펼치면 그 노트들이 보이고, 누르면 열립니다.
- 태그를 오른쪽 클릭해 **이름 바꾸기…**를 고르면 모든 노트에서 그 안에 중첩된 태그와 함께 이름을 바꿉니다(`#project/alpha`가 `#new/alpha`로). 대소문자는 가리지 않습니다. 이미 있는 태그 이름으로 바꾸면 둘이 하나로 합쳐집니다. 태그는 글자, 숫자, `_`, `-`, `/`로 이루어지며, 숫자만으로는 안 됩니다.
- front matter의 태그(`tags: [a, b]` 또는 `tags:` 아래의 목록)도 함께 바뀝니다. 코드, 인라인 코드, 링크 주소, 그리고 같은 글자로 시작하는 더 긴 태그(`#draft`를 바꿀 때의 `#drafts`)는 그대로 둡니다.

## 권한

- 파일 읽기: 폴더에서 태그를 찾기 위해.
- 파일 쓰기: 태그가 있는 노트에서 태그 이름을 바꾸기 위해.
- Textus AI 도구: Textus AI가 태그 목록과 어떤 태그가 붙은 노트를 볼 수 있도록.

## 변경 내역

- **0.3.7** - Its page is in every language Textus speaks.
- **0.3.6** - Sorts names with Textus's own order instead of a copy of it, so the package is smaller.
- **0.3.5** - The filter field and empty message follow Textus's language when you switch it. Needs Textus 1.4.3.
- **0.3.4** - Renaming leaves `[[#Heading]]` links alone, and a ``` line inside a `~~~` block no longer ends the code.
- **0.3.3** - Tags match in any letter case, as their counts do; renaming a tag moves its nested tags too and no longer touches link addresses or front-matter tags like `project-x`; tags like `a/` or `a//b` are refused.
- **0.3.2** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.1** - Tags used equally often are listed in natural name order ("Week2" before "Week10").
- **0.3.0** - Nested tags form a tree, each counting the notes of the tags under it; Textus AI finds a tag's nested tags too.
- **0.2.0** - Textus AI can list your tags and the notes with a tag (`list_tags`, `notes_with_tag`).
- **0.1.0-0.1.1** - First versions: tags with their counts, a tag's notes, renaming and merging in every note; runs on desktop and iOS.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `list_tags`: 열린 폴더의 문서에 쓰인 #태그를 모두, 각각 몇 개의 문서에 쓰였는지와 함께 많이 쓰인 순으로 나열합니다.
- `notes_with_tag`: 열린 폴더에서 어떤 #태그가 붙은 문서를 제목·경로·태그와 함께 나열합니다.
<!-- /ai-tools -->
