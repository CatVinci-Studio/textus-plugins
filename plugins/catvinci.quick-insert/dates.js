// Quick Insert's @ dates - "@tomorrow", "@下周五", "@下週五", "@明日": the dates a phrase
// names, counted from today, in English, Chinese and Japanese.

/* global textus */
(function (root) {
  const WEEK_EN = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const WEEK_ZH = ["日", "一", "二", "三", "四", "五", "六"];
  const WEEK_JA = ["日", "月", "火", "水", "木", "金", "土"];

  const add = (d, n) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  };
  /** The next `weekday` after today; with `nextWeek`, the one in the week
   *  after this one (weeks start on Monday). */
  function weekday(today, day, nextWeek) {
    if (!nextWeek) return add(today, ((day - today.getDay() + 7) % 7) || 7);
    const monday = add(today, -((today.getDay() + 6) % 7));
    return add(monday, 7 + ((day + 6) % 7));
  }

  /** Every phrase this knows, with its date from `today` and its language:
   *  "hans"/"hant" for one Chinese script only, "zh" for both. */
  function phrases(today) {
    const out = [
      ["today", 0, "en"], ["tomorrow", 1, "en"], ["yesterday", -1, "en"],
      ["今天", 0, "zh"], ["明天", 1, "zh"], ["后天", 2, "hans"], ["後天", 2, "hant"],
      ["大后天", 3, "hans"], ["大後天", 3, "hant"], ["昨天", -1, "zh"], ["前天", -2, "zh"],
      ["今日", 0, "ja"], ["明日", 1, "ja"], ["明後日", 2, "ja"], ["昨日", -1, "ja"],
    ].map(([p, n, lang]) => [p, add(today, n), lang]);
    WEEK_EN.forEach((name, i) => {
      out.push([name, weekday(today, i, false), "en"], ["next " + name, weekday(today, i, true), "en"]);
    });
    const ZH_PRE = [["周", "hans"], ["週", "hant"], ["星期", "zh"], ["礼拜", "hans"], ["禮拜", "hant"]];
    WEEK_ZH.forEach((c, i) => {
      for (const [pre, lang] of ZH_PRE) {
        out.push([pre + c, weekday(today, i, false), lang], ["下" + pre + c, weekday(today, i, true), lang]);
      }
    });
    WEEK_JA.forEach((c, i) => {
      out.push([c + "曜日", weekday(today, i, false), "ja"], ["来週" + c + "曜日", weekday(today, i, true), "ja"]);
    });
    for (const n of [2, 3, 5, 7, 10, 14, 30]) {
      const d = add(today, n);
      out.push(["in " + n + " days", d, "en"], [n + "天后", d, "hans"], [n + "天後", d, "hant"], [n + "日後", d, "ja"]);
    }
    const week = add(today, 7);
    out.push(["next week", week, "en"], ["下周", week, "hans"], ["下週", week, "hant"], ["来週", week, "ja"]);
    return out;
  }

  /** The phrase languages a UI language reads first. */
  function preferred(language) {
    const l = String(language || "en").toLowerCase();
    if (l.startsWith("zh")) return /hant|tw|hk|mo/.test(l) ? ["zh", "hant"] : ["zh", "hans"];
    return [l.startsWith("ja") ? "ja" : "en"];
  }

  const iso = (d) => textus.dates.format(d);

  /** The phrases beginning with what was typed after "@", up to `limit`,
   *  those of the UI `language` first. */
  function suggest(typed, today, limit, language) {
    const q = typed.toLowerCase();
    const first = preferred(language);
    const found = phrases(today).filter(([p]) => p.startsWith(q));
    return found
      .filter(([, , l]) => first.includes(l))
      .concat(found.filter(([, , l]) => !first.includes(l)))
      .slice(0, limit || 8)
      .map(([p, d]) => ({ phrase: p, date: iso(d) }));
  }

  /** The date `phrase` names, whole: one of the phrases, or any number of
   *  days ahead ("in 12 days", "12天后", "12天後", "12日後"); null for none. */
  function parse(phrase, today) {
    const q = String(phrase).trim().replace(/^@/, "").toLowerCase();
    const found = phrases(today).find(([p]) => p === q);
    if (found) return iso(found[1]);
    const days = /^in (\d+) days?$|^(\d+)\s*(?:天[后後]|日後)$/.exec(q);
    return days ? iso(add(today, Number(days[1] || days[2]))) : null;
  }

  root.naturalDates = { suggest: suggest, iso: iso, parse: parse };
})(typeof window !== "undefined" ? window : globalThis);
