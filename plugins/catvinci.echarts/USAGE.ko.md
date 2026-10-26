# ECharts

ECharts 옵션으로 차트를 그립니다: 막대, 선, 원형 등.

- `echarts` 코드 블록을 쓰면 그 아래에 그려집니다. 블록을 클릭하면 소스가 다시 보이고 고칠 수 있습니다.
- 언어 이름 뒤에 `height=400`을 쓰면 높이를 정할 수 있습니다.
- HTML, PDF, Word로 내보내면 그림이 이미지로 들어갑니다.

## 예시

```echarts
{
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [120, 200, 150] }]
}
```
