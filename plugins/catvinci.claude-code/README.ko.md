# Claude Code

Textus AI에서 Claude Code와 대화합니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org)가 없으면 설치합니다.
2. 터미널에서 Claude Code에 한 번 로그인합니다: `npx -y @agentclientprotocol/claude-agent-acp@0.107.0 --cli auth login --claudeai`(설치되어 있다면 `claude`를 실행해도 됩니다).
3. 창 오른쪽 위, Textus AI 버튼 옆의 Claude Code 버튼을 누르거나 Textus AI의 모델 메뉴에서 **Claude Code**를 고릅니다.

Textus는 Anthropic의 Claude Code를 Agent Client Protocol 어댑터 `@agentclientprotocol/claude-agent-acp`를 거쳐 `npx`로 실행합니다. 계정과 사용량은 Claude Code의 것이며, Textus는 이를 위한 키를 보관하지 않습니다.

처음에는 Claude Code의 **Manual** 모드로 시작하며, 편집과 명령마다 먼저 묻습니다. 다른 모드는 모델 옆 메뉴에서 고릅니다. OpenRouter를 거쳐 쓰려면 `~/.claude/settings.json`의 `env` 블록에 `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, 그리고 빈 `ANTHROPIC_API_KEY`를 넣습니다. Dock에서 연 Textus는 터미널에서 설정한 변수를 보지 못하기 때문입니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.4** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.3** - Starts in Manual mode, named by the plugin; its sign-in command needs no separate Claude Code install. Needs Textus 1.4.3, which also marks the changes Claude Code writes itself.
- **0.1.2** - Uses Claude Code's ACP adapter 0.107.0. Needs Textus 1.4.2 or later, for its new agent views.
- **0.1.1** - While Claude Code answers, other plugins (such as the desk pet) know which AI is at work.
- **0.1.0** - First version: Claude Code in Textus AI.
