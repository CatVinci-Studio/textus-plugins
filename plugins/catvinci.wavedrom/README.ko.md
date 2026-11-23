# WaveDrom

WaveJSON으로 디지털 타이밍 다이어그램과 레지스터 필드 그림을 그립니다.

## 다이어그램 그리기

- `wavedrom` 코드 블록에 WaveJSON을 씁니다. 다이어그램은 블록 아래에 그려지고, 블록을 클릭하면 소스가 다시 보여 고칠 수 있습니다.
- `signal`에 신호를 나열합니다. 각각 `name`, `wave` 문자열(`p n h l 0 1 x z . |`와 값을 나타내는 `= 2-9`), 값 라벨 `data`를 씁니다. 라벨로 시작하는 목록은 신호를 묶고, `{}`는 빈 줄을 둡니다.
- `reg`를 쓰면 레지스터의 필드를 그립니다: `{ reg: [{ bits: 8, name: "data" }] }`.
- 손으로 쓴 JSON도 괜찮습니다. 따옴표 없는 키, 작은따옴표, 끝의 쉼표, `//` 주석도 읽습니다.
- 소스에 잘못이 있으면 블록 아래에 알려 줍니다.
- 언어 이름 뒤에 `height=400`을 쓰면 높이를 정할 수 있습니다.
- 어두운 테마에서는 WaveDrom의 어두운 스킨을 씁니다. HTML, PDF, Word로 내보내면 내보내는 곳의 색으로 다시 그린 이미지가 들어갑니다.

## 예시

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## 권한

**Textus AI 도구** 권한만 요청합니다. Textus AI가 블록을 쓰기 전에 확인할 수 있도록 하기 위해서입니다. WaveDrom은 플러그인에 들어 있어 파일을 읽지 않고 모두 기기 안에서 그립니다. 데스크톱과 iOS에서 쓸 수 있습니다.

## 변경 내역

- **0.3.5** - Its package lists the libraries it carries, with their licenses.
- **0.3.4** - A very long diagram shrinks only as far as its labels stay readable, then scrolls sideways (a phone).
- **0.3.3** - Readable in dark mode: the lines and text take the theme's colours on the page's own background; a diagram drawn while its block was folded fits once it opens. A long diagram shrinks to the column instead of being cut off.
- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_wavedrom`: ```wavedrom 블록의 소스(WaveJSON: wave 문자열과 data가 있는 신호 레인, 또는 레지스터의 필드)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
