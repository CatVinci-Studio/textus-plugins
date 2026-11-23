# Codex

Textus AI에서 Codex와 대화합니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org)가 없으면 설치합니다.
2. 처음에는 브라우저가 열려 ChatGPT로 로그인합니다. 또는 터미널에서 한 번 로그인합니다: `npx -y @agentclientprotocol/codex-acp@2.6.0 cli login`.
3. 창 오른쪽 위, Textus AI 버튼 옆의 Codex 버튼을 누르거나 Textus AI의 모델 메뉴에서 **Codex**를 고릅니다.

Textus는 OpenAI의 Codex를 Agent Client Protocol 어댑터 `@agentclientprotocol/codex-acp`를 거쳐 `npx`로 실행합니다. 계정과 사용량은 Codex의 것이며, Textus는 이를 위한 키를 보관하지 않습니다.

처음에는 편집과 명령마다 먼저 묻는 **Read-only** 모드로 시작합니다. 다른 모드는 모델 옆 메뉴에서 고릅니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Signs in with ChatGPT in the browser (before, it tried an API key and stopped there), and starts in Read-only. Needs Textus 1.4.3, which also marks the changes Codex writes itself.
- **0.1.2** - Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Codex answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Codex in Textus AI.
