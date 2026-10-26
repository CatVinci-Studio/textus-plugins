# WaveDrom

WaveJSON からデジタルタイミング図を描きます。

- `wavedrom` のコードブロックを書くと、その下に描かれます。ブロックをクリックするとソースが表示され、編集できます。
- 言語名の後に `height=400` と書くと高さを指定できます。
- HTML・PDF・Word に書き出すと、図は画像として入ります。

## 例

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```
