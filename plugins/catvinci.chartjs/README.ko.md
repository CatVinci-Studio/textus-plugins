# Chart.js

코드 블록에 쓴 Chart.js 설정으로 꺾은선, 막대, 원 같은 간단한 차트를 그립니다.

언어가 `chartjs`인 코드 블록에 Chart.js 4 설정 하나를 씁니다. `type`, `labels`와 `datasets`가 있는 `data`, 필요하면 `options`입니다. 차트는 바로 아래에 그려지고, 블록을 클릭하면 소스가 다시 보여 고칠 수 있습니다.

- 차트 종류: `line`, `bar`, `pie`, `doughnut`, `polarArea`, `radar`, `scatter`, `bubble`.
- 설정은 JSON이지만 손으로 쓸 때 흔한 형태도 읽습니다: 따옴표 없는 키, 작은따옴표, 끝의 쉼표, 주석. 함수는 실행하지 않습니다.
- 색을 지정하지 않은 계열은 테마의 색을 차례로 쓰고, 라이트와 다크를 바꾸면 다시 그려집니다.
- 첫 줄의 `chartjs` 뒤에 `height=400`을 쓰면 높이를 픽셀 단위로 정할 수 있습니다(기본 300).
- 설정이 틀리면 블록 아래에 무엇이 틀렸는지 한 줄로 알려 줍니다.
- HTML, PDF, Word로 내보내면 차트가 그림으로 들어갑니다.

데스크톱과 iPhone에서 쓸 수 있고 Textus 1.3.2 이상이 필요합니다. 요청하는 권한은 Textus AI 도구 하나뿐이며, Textus AI가 `chartjs` 블록을 문서에 쓰기 전에 검사하는 데 씁니다.

## 예시

```chartjs
{
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ label: "Words", data: [1200, 1900, 3000] }]
  }
}
```

## 변경 내역

- **0.3.0** - Textus AI가 `chartjs` 블록을 쓰기 전에 검사할 수 있습니다(`check_chartjs`).
- **0.2.0** - 계열이 테마의 색을 씁니다. Textus 1.3.2 필요.
- **0.1.3** - Textus에서 이름이 바뀐 문서 색을 씁니다.
- **0.1.2** - 입력하는 동안 차트가 항상 최신 내용을 보여 줍니다.
- **0.1.0-0.1.1** - 첫 버전: 소스 아래에 그려지는 `chartjs` 블록, `height=`, 내보내기 시 그림. 스토어 페이지와 아이콘.

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_chartjs`: ```chartjs 블록의 소스(JSON으로 쓴 Chart.js 4 설정: type, labels와 datasets가 있는 data, options)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
