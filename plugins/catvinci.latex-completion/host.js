// LaTeX Completion: in a formula, a backslash and the start of a command
// bring up the LaTeX commands that begin so (commands.js), each with what
// it draws; Enter or Tab writes it, with the caret inside its braces.
/* global latexCommands */
exports.activate = function () {
  textus.editor.registerCompletion(
    "catvinci.latex-completion.commands",
    {
      provideCompletions: function (context) {
        // The manifest's pattern: a backslash and the letters after it.
        const items = latexCommands.complete(context.match.slice(1));
        // A space already after the caret: no second one.
        if (!/^\s/.test(context.after || "")) return items;
        return items.map(function (item) {
          return Object.assign({}, item, { insert: item.insert.replace(/ $/, "") });
        });
      },
    },
  );
};
