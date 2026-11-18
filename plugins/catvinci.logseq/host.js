// Reads a Logseq graph's settings (logseq-config.js) for Textus, which
// offers them once on a card: wikilinks, pictures in assets/, journals.
/* global logseqConventions */
exports.activate = function (context) {
  var files = textus.files;
  if (!files || !files.registerConventionReader) return;
  context.subscriptions.push(
    files.registerConventionReader("logseq", {
      label: "Logseq",
      marker: "logseq/config.edn",
      notes: true,
      read: function (request) {
        return logseqConventions(request.text);
      },
    }),
  );
};
