# MDX

Docusaurus, Nextra 같은 사이트 도구가 쓰는, 컴포넌트가 들어간 Markdown인 MDX 문서를 위한 플러그인입니다. Textus는 `.mdx` 파일을 스스로 열고 import, `{expressions}`, 컴포넌트를 쓰인 그대로 지킵니다. 이 플러그인은 다음을 더합니다.

- **문제에 밑줄.** 쓰는 동안 MDX 공식 컴파일러가 문서를 검사하고, 처음 찾은 문제를 그 자리에 밑줄로 표시하며 몇 행인지와 무엇이 틀렸는지 알려 줍니다.
- **MDX 미리보기.** 문서 옆에 그려 보여 줍니다. 탭, 콜아웃(`<Callout>`, `<Admonition>`, `:::tip`), `<details>`는 Textus 모양으로, 그 밖의 컴포넌트는 이름과 속성을 담은 카드로 보입니다. 문서의 코드는 하나도 실행하지 않습니다.
- **Markdown으로 저장 / MDX로 저장.** 문서 옆에 사본을 만듭니다. 콜아웃은 GitHub 알림으로, 탭은 제목이 붙은 부분으로 바뀌고, 안에 아무것도 없는 컴포넌트는 주석으로 남습니다. 반대 방향에서는 중괄호와 `<`를 이스케이프하고, 주석과 `<br>`을 MDX가 원하는 형태로 씁니다.

이 명령들은 플러그인 메뉴에 있고, `.mdx` 문서에서 오른쪽 클릭해도 나옵니다.

## 권한

- **문서 읽기**: 쓰는 동안 검사하고 그려 보이기 위해.
- **파일 읽기와 쓰기**: Textus AI가 지정한 .mdx 파일을 검사하고, 변환한 사본을 문서 옆에 저장하기 위해.
- **Textus AI 도구**: Textus AI가 쓴 MDX를 검사할 수 있도록.

## 변경 내역

- **0.1.3** - Its page is in every language Textus speaks.
- **0.1.2** - Its package lists the libraries it carries, with their licenses.
- **0.1.1** - Preview MDX on a phone, where the preview shows alone, draws the document it was opened from instead of an empty page.
- **0.1.0** - First version: problems underlined by MDX's compiler, Preview MDX, Save as Markdown and Save as MDX, and check_mdx for Textus AI.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_mdx`: MDX 공식 컴파일러로 MDX를 검사해 첫 번째 문제와 그 행·열을 알려 줍니다. .mdx 문서를 쓰거나 고친 뒤, 된다고 말하기 전에 사용하세요.
<!-- /ai-tools -->
