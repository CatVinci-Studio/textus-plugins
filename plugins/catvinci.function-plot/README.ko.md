# 함수 그래프

함수 그래프를 한 줄에 하나씩: sin(x), x^2 - 1.

- `function-plot` 코드 블록을 쓰면 그 아래에 그려집니다. 블록을 클릭하면 소스가 다시 보이고 고칠 수 있습니다.
- 언어 이름 뒤에 `height=400`을 쓰면 높이를 정할 수 있습니다.
- HTML, PDF, Word로 내보내면 그림이 이미지로 들어갑니다.
- 언어 이름 뒤에 `xmin=-5 xmax=5`(와 `ymin`, `ymax`)로 범위를 정합니다. + - * / ^, x, pi, e와 sin, cos, tan, exp, ln, log, sqrt, abs를 씁니다.

## 예시

```function-plot
sin(x)
x^2 / 4 - 1
```

<!-- ai-tools -->
## Textus AI 도구

이 플러그인을 설치하면 Textus AI가 대화 중에 사용할 수 있습니다:

- `check_function_plot`: ```function-plot 블록의 소스(한 줄에 하나씩 쓴 x의 함수. + - * / ^, 괄호, pi, e와 흔한 함수를 쓸 수 있습니다)를 문서에 넣기 전에 그리지 않고 검사합니다. ok나 먼저 고칠 문제를 돌려줍니다. 펜스 없이 소스만 넘기세요.
<!-- /ai-tools -->
