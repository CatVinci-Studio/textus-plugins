# Gemini CLI

Textus AI에서 Google의 Gemini 모델로 Gemini CLI와 대화합니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다. 모드(먼저 묻기, 편집 허용, 모두 허용, 계획)와 모델은 Textus AI의 모델 메뉴 옆 메뉴에 있습니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org)가 없으면 설치합니다.
2. 창 오른쪽 위, Textus AI 버튼 옆의 Gemini CLI 버튼을 누릅니다. 처음에는 브라우저가 열려 Google 계정으로 로그인합니다. Gemini API 키나 Vertex AI를 쓰려면 터미널에서 `npx @google/gemini-cli`를 한 번 실행하고 `/auth`로 고릅니다(Dock에서 연 Textus는 터미널에서 설정한 변수를 보지 못합니다).

Textus는 [Gemini CLI](https://github.com/google-gemini/gemini-cli)를 Agent Client Protocol 서버인 `gemini --acp`로 `npx`를 통해 실행합니다. 계정과 사용량은 Google의 것이며, Textus는 이를 위한 키를 보관하지 않습니다.

편집 허용과 모두 허용은 Gemini CLI에서 직접 신뢰한 폴더에서만 쓸 수 있습니다. 다른 폴더에서는 먼저 묻기로 남습니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Gemini CLI in Textus AI.
