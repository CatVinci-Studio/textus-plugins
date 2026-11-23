# 악보(ABC)

코드 블록에 쓴 ABC 표기법을 악보로 그립니다.

언어가 `abc`인 코드 블록을 쓰면 바로 아래에 악보가 그려집니다. 블록을 클릭하면 소스가 다시 보여 고칠 수 있습니다.

- 마디가 열 너비에 맞춰 줄바꿈되어 좁은 패널에서도 음표가 잘 보입니다.
- 음표는 테마의 글자 색으로 그려지고, 라이트와 다크를 바꾸면 다시 그려집니다.
- HTML, PDF, Word로 내보내면 악보가 그림으로 들어갑니다.

Textus 1.3.2 이상이 필요합니다. 요청하는 권한은 Textus AI 도구 하나뿐이며, Textus AI가 `abc` 블록을 문서에 쓰기 전에 검사하는 데 씁니다.

## 예시

```abc
X:1
T:Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
```

## 변경 내역

- **0.3.5** - Its page no longer says which devices it runs on: the store shows that. Its page receives Textus's messages by the API's current name.
- **0.3.4** - Its package lists the libraries it carries, with their licenses.
- **0.3.3** - A chart drawn while its block was folded (a phone) fits once the block opens, instead of keeping its old size.
- **0.3.2** - Bars wrap to the column instead of the whole score shrinking; clicking a note no longer turns it red; `check_abc` accepts full mode names, any note length, `+:` lines, `` ` `` and `$`; `height=` is gone.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - Textus AI can check an `abc` block before writing it (`check_abc`).
- **0.2.0** - The notes follow the theme's text color; needs Textus 1.3.2.
- **0.1.3** - Uses Textus's renamed document colors.
- **0.1.2** - Exported pictures keep the music's width and height.
- **0.1.0-0.1.1** - First versions: `abc` blocks drawn under their source, `height=`, pictures in exports; store page and icon.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_abc`: ```abc 블록의 소스(ABC 악보 표기법: K:로 끝나는 필드 머리글, 그다음 음표)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
