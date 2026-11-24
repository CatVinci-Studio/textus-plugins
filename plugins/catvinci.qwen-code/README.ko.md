# Qwen Code

Textus AI에서 Alibaba의 Qwen 모델로 Qwen Code와 대화합니다. 연 폴더를 읽고 노트를 쓰고 고치며, 바꾸기 전마다 먼저 묻습니다. Textus가 무엇을 하려는지 보여 주면 허용할지 고르면 됩니다. 바꾼 곳은 문서에 표시되며, 실행 취소 한 번으로 되돌릴 수 있습니다. 모드(먼저 묻기, 편집 허용, 스스로 판단, 모두 허용, 계획), 모델, 생각하기 설정은 Textus AI의 모델 메뉴 옆 메뉴에 있습니다.

1. 이 컴퓨터에 [Node.js](https://nodejs.org) 22 이상이 없으면 설치합니다.
2. API 키를 한 번 넣어 줍니다. `~/.qwen/.env`에 `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`을 넣거나(OpenRouter의 base URL은 `https://openrouter.ai/api/v1`), 터미널에서 `npx @qwen-code/qwen-code`를 실행하고 `/auth`를 씁니다(Alibaba Cloud Model Studio나 OpenAI 호환 서비스).
3. 창 오른쪽 위, Textus AI 버튼 옆의 Qwen Code 버튼을 누릅니다.

Textus는 [Qwen Code](https://github.com/QwenLM/qwen-code)를 Agent Client Protocol 서버인 `qwen --acp`로 `npx`를 통해 실행합니다. 키와 사용량은 사용하는 공급자의 것이며, Textus는 이를 위한 키를 보관하지 않습니다.

처음에는 먼저 묻기 모드로 시작합니다. 명령에 대해 "Always allow"를 고르면 Qwen Code가 그 선택을 프로젝트나 사용자 설정에 영구히 저장합니다.

Textus 1.4.3 이상이 필요합니다. 요청하는 권한은 하나로, 이 컴퓨터에서 이 에이전트를 실행하기 위해서입니다.

## 변경 내역

- **0.1.2** - Its icon is Qwen Code's own logo.
- **0.1.1** - Its page is in every language Textus speaks. Needs Textus 1.4.3 itself, not a test version of it.
- **0.1.0** - First version: Qwen Code in Textus AI.
