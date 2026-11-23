# DeepSeek Harness

Textus AI에서 DeepSeek의 공식 에이전트인 DeepSeek Harness와 대화합니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org) 24.9 이상이 없으면 설치합니다.
2. DeepSeek API 키를 한 번 넣어 줍니다. 터미널에서 `npx -y @deepseek-ai/dsh@0.2.2-rc.1 web`을 실행하고 Models 페이지에서 키를 추가합니다.
3. 창 오른쪽 위, Textus AI 버튼 옆의 DeepSeek Harness 버튼을 누릅니다.

Textus는 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)를 Agent Client Protocol 서버인 `dsh --profile acp`로 `npx`를 통해 실행합니다. 키와 사용량은 DeepSeek의 것이며, Textus는 이를 위한 키를 보관하지 않습니다. DeepSeek Harness는 미리 보기 버전이라 동작이 바뀔 수 있습니다.

Textus는 이 에이전트를 읽기 전용 샌드박스에서 실행합니다. 자유롭게 읽고 찾을 수 있지만, 파일을 쓰거나 무언가를 바꾸는 명령을 실행하기 전에는 먼저 묻습니다.

DeepSeek Harness는 기본적으로 세션 기록을 DeepSeek에 보냅니다. `dsh web`의 Settings › General에서 끌 수 있습니다. 사용 보고는 Textus가 꺼 둡니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.3** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.2** - Asks before writing files or running commands that change things (before, it did both without asking). Usage reports off, and the setup names the exact version and Node.js 24.9. Needs Textus 1.4.3.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: DeepSeek Harness in Textus AI.
