# WaveDrom

WaveJSON으로 디지털 타이밍 다이어그램을 그립니다.

- `wavedrom` 코드 블록을 쓰면 그 아래에 그려집니다. 블록을 클릭하면 소스가 다시 보이고 고칠 수 있습니다.
- 언어 이름 뒤에 `height=400`을 쓰면 높이를 정할 수 있습니다.
- HTML, PDF, Word로 내보내면 그림이 이미지로 들어갑니다.

## 예시

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_wavedrom`: ```wavedrom 블록의 소스(WaveJSON: wave 문자열과 data가 있는 신호 레인, 또는 레지스터의 필드)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
