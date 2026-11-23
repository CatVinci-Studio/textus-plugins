# 데스크 펫

글을 쓰는 동안 곁에 있어 주고, 하는 일에 반응하는 치비 친구입니다.

**플러그인 › 데스크 펫 보이기/숨기기**나 명령 팔레트로 켜고 끕니다. 플러그인을 처음 켜면 저절로 나타납니다.

- **누가:** Textus의 고양이 소녀 Moyu(墨羽)입니다. Textus AI가 일하고 그 패널이 열려 있는 동안에는 사용하는 모델의 LLM 짱이 놀러 옵니다: Claude 짱, GPT 짱, Gemini 짱, DeepSeek 짱, Kimi 짱, Qwen 짱, Doubao 짱, GLM 짱, MiniMax 짱, Grok 짱, ERNIE 짱. 손님은 Textus AI가 일을 마친 뒤 1분 반쯤 머물다가, AI 패널을 닫으면 집으로 돌아갑니다. 한 캐릭터만 두고 싶다면 플러그인 설정이나 오른쪽 클릭 메뉴의 **캐릭터 바꾸기…**에서 고릅니다.
- **어디에:** 처음에는 Textus 창 안에 있습니다. 어디로든 끌어 옮길 수 있고, 오른쪽 클릭하면 캐릭터를 바꾸거나, 바탕화면에 두거나(모든 창 위), 점으로 접거나, 닫을 수 있습니다. 바탕화면에서는 메뉴로 Textus나 Textus AI도 엽니다. 마지막에 둔 자리에서 나타나며, 어느 쪽 가장자리에 있든 가운데를 바라봅니다.
- **하는 일:** 입력하면 같이 글을 쓰고, 멈추면 멍하니 있다가 졸고, 저장하면 기뻐하고, Textus AI가 일하면 다가와 보고, Textus가 뒤에 있으면 잡니다. 누르면 대답하고, 몇 번 누르면 쓰다듬어 줄 수 있고, 들어 옮기면 깜짝 놀랍니다. 하루에 한 번 인사하고, 오래 쉬다 돌아오면 반겨 주고, 오래 쓰면 응원한 뒤 쉬라고 하고, 밤늦게는 자라고 알려 주며, Textus AI가 검토할 수정을 내놓으면 알려 줍니다.
- **하는 말:** 캐릭터마다 자기 말투가 있고, 순간마다 고를 수 있는 대사가 몇 개씩 있으며, Textus가 지원하는 모든 언어로 말합니다(`lines/`).

## 설정

- **곁에 있는 친구:** Textus AI의 모델을 따라가거나(기본값), 늘 같은 캐릭터를 둡니다.
- **말풍선:** 끄면 조용히 있습니다.
- **밤늦게 쉬라고 알려 주기:** 밤 11시부터 새벽 5시 사이에 글을 쓰면, 그날 밤 한 번 자라고 알려 줍니다.

무언가 일어났다는 *사실*만 압니다. 입력했다, 저장했다, Textus AI가 생각 중이다. 문서나 대화의 내용은 한 글자도 모르기 때문에 플러그인은 권한을 요청하지 않습니다.

## 만든 사람

Moyu는 CatVinci Studio의 캐릭터입니다. LLM 짱은 커뮤니티가 만든 AI 모델의 의인화 캐릭터로, [ZipZipPipe](https://space.bilibili.com/4168597)와 여러 작가가 디자인했고 CatVinci Studio가 치비로 다시 그렸습니다. [LLM-chan stickers](https://github.com/ChengAoShen/LLM-chan-stickers)를 참고하세요. 팬 창작물이며 어떤 AI 회사와도 관계가 없습니다.

## 변경 내역

- **0.1.10** - Its page is in every language Textus speaks. Its description begins with what she does, and no longer counts the characters or languages. Its page receives Textus's messages by the API's current name.
- **0.1.9** - Code kept for Textus versions it no longer runs on is gone.
- **0.1.8** - What she says sits above her, two lines at most, and never covers her face.
- **0.1.7** - A visiting LLM-chan keeps her pose and greeting when a new page opens, and stays still while Textus is in the background. Her hop is gentler, and the bubble's tail points at her middle.
- **0.1.6** - The speech bubble's tail joins its box with no line between them.
- **0.1.5** - started on the left, she faces the middle from the first frame; her speech bubble is Textus's own, and when she is small its words shrink with her (to a readable floor) and wrap into even lines; needs Textus 1.3.12
- **0.1.4** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.1.3** - The model's LLM-chan visits only while the Textus AI panel is open, and goes home when it closes.
- **0.1.2** - Every character redrawn; she sits at either side and turns to face the middle.
- **0.1.1** - Moyu speaks for herself when Textus AI works ("I'm here to help"), and cheers on fluent writing.
- **0.1.0** - First version: Moyu and the LLM-chan in a floating view, in the window or on the desktop, with lines in every language Textus speaks.
