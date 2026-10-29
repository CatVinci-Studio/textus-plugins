// "@tomorrow", "@下周五", "@明日": the dates a phrase names, counted from
// today, in English, Chinese and Japanese.

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

  /** Every phrase this knows, with its date from `today`. */
  function phrases(today) {
    const out = [
      ["today", 0], ["tomorrow", 1], ["yesterday", -1],
      ["今天", 0], ["明天", 1], ["后天", 2], ["大后天", 3], ["昨天", -1], ["前天", -2],
      ["今日", 0], ["明日", 1], ["明後日", 2], ["昨日", -1],
    ].map(([p, n]) => [p, add(today, n)]);
    WEEK_EN.forEach((name, i) => {
      out.push([name, weekday(today, i, false)], ["next " + name, weekday(today, i, true)]);
    });
    WEEK_ZH.forEach((c, i) => {
      for (const pre of ["周", "星期"]) {
        out.push([pre + c, weekday(today, i, false)], ["下" + pre + c, weekday(today, i, true)]);
      }
    });
    WEEK_JA.forEach((c, i) => {
      out.push([c + "曜日", weekday(today, i, false)], ["来週" + c + "曜日", weekday(today, i, true)]);
    });
    for (const n of [2, 3, 5, 7, 10, 14, 30]) {
      out.push(["in " + n + " days", add(today, n)], [n + "天后", add(today, n)], [n + "日後", add(today, n)]);
    }
    out.push(["next week", add(today, 7)], ["下周", add(today, 7)], ["来週", add(today, 7)]);
    return out;
  }

  const iso = (d) =>
    d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  /** The phrases beginning with what was typed after "@", up to `limit`. */
  function suggest(typed, today, limit) {
    const q = typed.toLowerCase();
    return phrases(today)
      .filter(([p]) => p.startsWith(q))
      .slice(0, limit || 8)
      .map(([p, d]) => ({ phrase: p, date: iso(d) }));
  }

  root.naturalDates = { suggest: suggest, iso: iso };
})(typeof window !== "undefined" ? window : globalThis);
