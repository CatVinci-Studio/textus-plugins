// Code Completion: in a code block, the start of a word brings up its
// language's keywords and the words around the caret (complete.js).
/* global codeCompletion */
exports.activate = function () {
  textus.editor.registerCompletion("catvinci.code-completion.words", {
    provideCompletions: codeCompletion.complete,
  });
};
