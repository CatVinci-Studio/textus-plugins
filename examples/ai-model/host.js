// Title Ideas: the two AI interfaces of API 1.8.
// - ai.complete asks the user's own writing model (permission ai.model).
//   The first call asks the user; each plugin has a monthly allowance.
// - ai.registerInlineCompletion offers grey text after the caret. This one
//   needs no model: it finishes a word from the words already written.
//   The user picks it in Settings › Textus AI › Writing assist.

const t = (key, ...args) => textus.l10n.t(key, ...args);

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.commands.register("your-name.title-ideas.suggest", async () => {
      if (!(await textus.ai.available())) return textus.ui.message(t("off"));
      const text = ((await textus.editor.getText()) ?? "").trim();
      if (!text) return textus.ui.message(t("empty"));
      const answer = await textus.ai.complete({
        system:
          "You suggest titles. Answer with three titles, one per line, in the document's language, nothing else.",
        prompt: text.slice(0, 8000),
      });
      await textus.ui.message(answer);
    }),

    textus.ai.registerInlineCompletion("words", {
      label: t("words"),
      provide({ before, after }) {
        const typed = /[\p{L}\p{N}]{2,}$/u.exec(before)?.[0];
        if (!typed || /^[\p{L}\p{N}]/u.test(after)) return null;
        const words = (before + " " + after).match(/[\p{L}\p{N}]{4,}/gu) ?? [];
        const match = words.find(
          (word) => word.length > typed.length && word.startsWith(typed),
        );
        return match ? match.slice(typed.length) : null;
      },
    }),
  );
};
