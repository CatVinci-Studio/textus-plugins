# WaveDrom

Draws digital timing diagrams and register layouts from WaveJSON.

## Drawing a diagram

- Write a code block in `wavedrom` with WaveJSON in it. The diagram is drawn below the block, and the source shows again when you click into it.
- `signal` holds the lanes: each has a `name`, a `wave` string (`p n h l 0 1 x z . |` and `= 2-9` for values) and `data` for the value labels. A list starting with a label groups lanes; `{}` leaves a gap.
- `reg` draws a register's fields instead: `{ reg: [{ bits: 8, name: "data" }] }`.
- Hand-written JSON is fine: keys without quotes, single quotes, trailing commas and `//` comments are read.
- A mistake in the source is named under the block.
- `height=400` after the language sets the drawing's height.
- It uses WaveDrom's dark skin in a dark theme. An export - HTML, PDF, Word - carries the diagram as a picture, drawn in the export's colors.

## Example

```wavedrom
{ signal: [
  { name: "clk",  wave: "p....." },
  { name: "data", wave: "x.345x", data: ["a", "b", "c"] }
]}
```

## Permissions

It asks only for **Tools for Textus AI**, so Textus AI can check a block before it writes one. WaveDrom comes with the plugin: it reads no files and draws everything on your device, on the desktop and on iOS.

## Changes

- **0.3.2** - Diagrams take the theme's font and line colour, grow with the document's zoom, and `height=` now resizes the diagram itself.
- **0.3.1** - Its page now says in one sentence what it does, what it can do, and what changed in each version.
- **0.3.0** - a tool for Textus AI, `check_wavedrom`
- **0.2.0** - drawn again when the theme changes, with the chart page of Textus 1.3.2
- **0.1.3** - text in the theme's colors on Textus 1.3
- **0.1.2** - exports carry the diagram in the export's colors
- **0.1.0-0.1.1** - first versions: WaveJSON drawn with WaveDrom, dark skin, a height setting, pictures in exports

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `check_wavedrom`: Checks the source of a ```wavedrom block - WaveJSON: signal lanes with their wave strings and data, or a register's fields - before it goes into a document, without drawing it. Returns ok, or the problems to fix first. Pass the source without its fence.
<!-- /ai-tools -->
