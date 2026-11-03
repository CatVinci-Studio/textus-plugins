// Natural Dates: type @ and a day - @tomorrow, @下周五, @明日 - and pick the
// date it names: as a date, or as a link to that day's note.

/* global naturalDates */
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Textus AI's tool: the date a phrase names, from today or `today`. */
function parseDate(input) {
  const m = DAY.exec(String(input.today || ""));
  const today = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();
  const date = naturalDates.parse(input.phrase || "", today);
  if (date) return { phrase: String(input.phrase).trim(), date: date };
  const words = String(input.phrase || "").trim().replace(/^@/, "").slice(0, 3);
  return {
    error: "Not a phrase this knows: today, tomorrow, next friday, in 3 days, 下周五, 明後日 and the like.",
    suggestions: words ? naturalDates.suggest(words, today, 8) : [],
  };
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.ai.registerTool("parse_date", parseDate),
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
