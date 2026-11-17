// Spoilers and Readings: editor.registerSyntax, API 1.8 (preview).
// A pattern's `text` group is what shows, styled; the rest of a match is
// hidden until the caret is in it. Nothing in the document changes.

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.editor.registerSyntax("spoiler", {
      pattern: /\|\|(?<text>[^|\n]+)\|\|/,
      style: "spoiler",
    }),
    // {漢字|かんじ}: the reading, in `note`, set above the words.
    textus.editor.registerSyntax("ruby", {
      pattern: /\{(?<text>[^{}|\n]+)\|(?<note>[^{}|\n]+)\}/,
      style: "ruby",
    }),
  );
};
