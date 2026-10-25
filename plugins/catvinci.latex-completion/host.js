// LaTeX Completion: in a formula, a backslash and the start of a command
// bring up the LaTeX commands that begin so (commands.js), each with what
// it draws; Enter or Tab writes it, with the caret inside its braces.
/* global latexCommands */
exports.activate = function () {
  textus.editor.registerCompletionProvider(
    "catvinci.latex-completion.commands",
    {
      provideCompletions: function (context) {
        // The manifest's pattern: a backslash and the letters after it.
        return latexCommands.complete(context.match.slice(1));
      },
    },
  );
};
