# OpenCode

Textus AI에서 OpenCode와 대화하며, 설정한 어떤 모델이든 씁니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다. 묻지 않고 작업하게 하려면 모델 옆 메뉴에서 Allow all을 고릅니다(Textus 1.4.3 이상).

1. 이 컴퓨터에 [Node.js](https://nodejs.org)가 없으면 설치합니다.
2. OpenCode의 무료 모델은 바로 쓸 수 있습니다. 자신의 공급자(OpenRouter 등)를 쓰려면 터미널에서 한 번 로그인합니다: `npx -y opencode-ai@1.19.5 auth login`.
3. 창 오른쪽 위, Textus AI 버튼 옆의 OpenCode 버튼을 누릅니다.

Textus는 [OpenCode](https://opencode.ai)를 Agent Client Protocol 서버인 `opencode acp`로 `npx`를 통해 실행합니다. 계정과 사용량은 OpenCode의 것이며, Textus는 이를 위한 키를 보관하지 않습니다.

편집, 명령, 웹 가져오기 전에 먼저 묻고, plan 모드에서는 편집하지 않습니다. 하위 에이전트는 지금은 꺼져 있습니다. OpenCode가 하위 에이전트의 질문을 전달하지 않아 대화가 끝없이 기다리게 되기 때문입니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Asks before web fetches too, plan mode no longer edits, and sub-agents are off (their questions never arrived, so a turn hung). Needs Textus 1.4.3.
- **0.1.2** - Asks before each edit and command, as it says: OpenCode on its own allowed them unasked.
- **0.1.1** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.0** - First version: OpenCode in Textus AI.
