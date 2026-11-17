(function () {
  "use strict";
  const api = acquireTextusApi();
  const $ = (id) => document.getElementById(id);
  // The icon buttons' names, in the UI's language.
  for (const [id, key] of [
    ["prev", "prevMonth"],
    ["next", "nextMonth"],
  ])
    for (const attr of ["aria-label", "title"])
      $(id).setAttribute(attr, api.t(key));
  $("today").textContent = api.t("todayButton");
  $("nofolder").textContent = api.t("nofolder");

  // Textus's dates, as the host's textus.dates.
  const dates = window.textus.dates;
  const dateOf = (d) => dates.format(d, "YYYY-MM-DD");
  const saved = api.getState() || {};
  let shown = saved.month ? new Date(saved.month + "-01T00:00:00") : new Date();
  shown = new Date(shown.getFullYear(), shown.getMonth(), 1);
  let noted = new Set();
  let hasFolder = true;
  // The week number weekly notes count, "w" or "W"; null with them off.
  let week = null;
  let monthNotes = false;

  function render() {
    api.setState({ month: dateOf(shown).slice(0, 7) });
    const name = shown.toLocaleDateString(api.language, {
      year: "numeric",
      month: "long",
    });
    const month = $("month");
    fitMonth();
    month.disabled = !monthNotes;
    // The full name even when the bar cuts it short.
    $("month").title = monthNotes ? name + " · " + api.t("openMonth") : name;
    $("nofolder").hidden = hasFolder;
    const grid = $("grid");
    grid.textContent = "";
    grid.classList.toggle("weeks", !!week);
    if (week) grid.append(document.createElement("div"));
    // Textus's month: whole weeks from the UI language's first weekday, as
    // the week numbers beside them count; a sixth row only when needed.
    const days = window.textus
      .monthDays(shown.getFullYear(), shown.getMonth())
      .filter((g, i, all) => i < 35 || all.slice(35).some((x) => x.inMonth));
    for (const g of days.slice(0, 7)) {
      const cell = document.createElement("div");
      cell.className = "tx-calendar-weekday";
      cell.textContent = new Date(g.date + "T00:00:00").toLocaleDateString(api.language, {
        weekday: "narrow",
      });
      grid.append(cell);
    }
    days.forEach((g, i) => {
      const day = new Date(g.date + "T00:00:00");
      if (week && i % 7 === 0) grid.append(weekButton(day));
      const date = g.date;
      const button = document.createElement("button");
      button.className = "tx-calendar-day";
      if (!g.inMonth) button.classList.add("is-other");
      if (g.today) button.classList.add("is-today");
      if (noted.has(date)) button.classList.add("is-marked");
      button.textContent = String(g.day);
      button.dataset.date = date;
      button.setAttribute(
        "aria-label",
        day.toLocaleDateString(api.language, { dateStyle: "full" }),
      );
      button.onclick = () => api.postMessage({ type: "open", date: date });
      grid.append(button);
    });
  }

  /** The month's name, short when the bar is too narrow for the long one
   *  (a sidebar, a phone), and on a row of its own above the buttons when
   *  even that won't fit: again whenever the bar's width changes. */
  function fitMonth() {
    const month = $("month");
    const as = (style) => shown.toLocaleDateString(api.language, { year: "numeric", month: style });
    // The text's own width: a button reports no overflow of its own.
    const text = document.createRange();
    const fits = (style) => {
      month.textContent = as(style);
      text.selectNodeContents(month);
      return text.getBoundingClientRect().width <= month.clientWidth;
    };
    $("bar").classList.remove("stacked");
    if (fits("long") || fits("short")) return;
    $("bar").classList.add("stacked");
    if (!fits("long")) fits("short");
  }
  new ResizeObserver(() => fitMonth()).observe($("month").parentElement);

  /** The week number in front of a row: its weekly note. The row's middle
   *  day names it, whichever day the calendar starts its weeks on. */
  function weekButton(start) {
    const middle = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 3);
    const number = dates.format(middle, week);
    const button = document.createElement("button");
    button.className = "week";
    button.textContent = number;
    button.setAttribute("aria-label", api.t("weekNumber", number));
    button.onclick = () =>
      api.postMessage({ type: "open", date: dateOf(middle), period: "weekly" });
    return button;
  }

  $("month").onclick = () =>
    api.postMessage({ type: "open", date: dateOf(shown), period: "monthly" });
  $("prev").onclick = () => {
    shown = new Date(shown.getFullYear(), shown.getMonth() - 1, 1);
    render();
  };
  $("next").onclick = () => {
    shown = new Date(shown.getFullYear(), shown.getMonth() + 1, 1);
    render();
  };
  $("today").onclick = () => {
    const now = new Date();
    shown = new Date(now.getFullYear(), now.getMonth(), 1);
    render();
    api.postMessage({ type: "open", date: dateOf(now) });
  };

  api.onMessage((message) => {
    if (message.type !== "dates") return;
    hasFolder = message.dates !== null;
    noted = new Set(message.dates || []);
    week = message.week || null;
    monthNotes = !!message.month;
    render();
  });
  render();
  api.postMessage({ type: "ready" });
})();
