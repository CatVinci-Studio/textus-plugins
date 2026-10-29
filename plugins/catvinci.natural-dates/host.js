// Natural Dates: type @ and a day - @tomorrow, @下周五, @明日 - and pick the
// date it names: as a date, or as a link to that day's note.

/* global naturalDates */
exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.editor.registerCompletion("catvinci.natural-dates.at", {
      async provideCompletions(context) {
        const typed = context.match.slice(1);
        const asLink = (await textus.settings.get("insert")) === "link";
        return naturalDates.suggest(typed, new Date(), 8).map((s) => ({
          label: "@" + s.phrase,
          detail: s.date,
          insert: asLink ? "[[" + s.date + "]]" : s.date,
        }));
      },
    }),
  );
};
