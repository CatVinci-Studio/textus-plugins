# GitHub Copilot CLI

Textus AI에서 GitHub Copilot CLI와 대화하며, Copilot 요금제의 모델을 씁니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다. 모드(agent, plan, autopilot), 모델, "allow all" 스위치는 Textus AI의 모델 메뉴 옆 메뉴에 있으며, "allow all"은 꺼진 채로 시작합니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org)가 없으면 설치합니다. GitHub Copilot 요금제가 필요합니다.
2. 터미널에서 한 번: `npx @github/copilot login`.
3. 창 오른쪽 위, Textus AI 버튼 옆의 GitHub Copilot CLI 버튼을 누릅니다.

Textus는 [GitHub Copilot CLI](https://github.com/github/copilot-cli)를 Agent Client Protocol 서버인 `copilot --acp`로 `npx`를 통해 실행합니다. Copilot CLI는 GitHub의 소프트웨어로 GitHub의 라이선스를 따릅니다. 계정과 사용량은 GitHub의 것이며, Textus는 이를 위한 토큰을 보관하지 않습니다.

Autopilot은 혼자서 계속 진행하며 프리미엄 요청을 더 많이 씁니다. Textus는 실행하는 버전을 고정해 두므로, 여기서는 Copilot이 스스로 업데이트하지 않습니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.2** - A simpler icon, drawn in the text colour.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: GitHub Copilot CLI in Textus AI.
