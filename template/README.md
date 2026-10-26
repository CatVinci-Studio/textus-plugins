# The plugin template

A small plugin that works, to start yours from: a command, a sidebar list
and its strings in English and Chinese. The
[textus-plugin-template](https://github.com/CatVinci-Studio/textus-plugin-template)
repository is this folder laid out by Textus's **Export for Publishing**
(with its README, LICENSE and release workflow) - use it with GitHub's
**Use this template**.

To try it as it is: in Textus, **Settings › Extensions › Plugins › Load a
plugin folder…**, and pick this folder.

To make it yours:

1. Change `your-name` in `textus-plugin.json` and `host.js` to your
   publisher name, and `hello` to your plugin's.
2. Write what it does in `host.js` - every call is in
   [textus.d.ts](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/textus.d.ts),
   and [Writing plugins](https://github.com/CatVinci-Studio/Textus/blob/main/docs/dev/writing-plugins.md)
   walks through them.
3. Say how to use it in `USAGE.md`; Textus opens it after the plugin is
   installed.

More of what a plugin can do, each a few lines:

```js
// A fenced block drawn by the plugin: ```chart ... ``` (manifest:
// contributes.codeBlocks [{ "language": "chart" }]).
textus.views.registerCodeBlock("chart", {
  render(block, webview) {
    webview.html = `<pre>${block.source}</pre>`;
    block.onDidChange((source) => webview.postMessage(source));
  },
});

// Marks on the text: "TODO" highlighted wherever it is.
textus.editor.registerDecorations({
  decorate: (blocks) =>
    blocks
      .filter((b) => b.markdown.includes("TODO"))
      .map((b) => ({ block: b.id, anchor: "TODO", style: "highlight", tone: "warning" })),
});

// Before a save: the front matter's "updated" set to today (files.write).
textus.files.onWillSave(({ text }) =>
  text.replace(/^updated: .*$/m, `updated: ${new Date().toISOString().slice(0, 10)}`),
);
```
