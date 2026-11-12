/* global dates */
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

  const dateOf = (d) => dates.format(d, "YYYY-MM-DD");
  const saved = api.getState() || {};
  let shown = saved.month ? new Date(saved.month + "-01T00:00:00") : new Date();
  shown = new Date(shown.getFullYear(), shown.getMonth(), 1);
  let noted = new Set();
  let weekStart = "monday";
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
    $("month").textContent = name;
    $("month").disabled = !monthNotes;
    // The full name even when the bar cuts it short.
    $("month").title = monthNotes ? name + " · " + api.t("openMonth") : name;
    $("nofolder").hidden = hasFolder;
    const grid = $("grid");
    grid.textContent = "";
    grid.classList.toggle("weeks", !!week);
    if (week) grid.append(document.createElement("div"));
    const first = weekStart === "sunday" ? 0 : 1;
    for (let i = 0; i < 7; i++) {
      const day = new Date(2024, 0, 7 + first + i); // 2024-01-07 is a Sunday
      const cell = document.createElement("div");
      cell.className = "tx-calendar-weekday";
      cell.textContent = day.toLocaleDateString(api.language, {
        weekday: "narrow",
      });
      grid.append(cell);
    }
    const lead = (shown.getDay() - first + 7) % 7;
    const start = new Date(shown.getFullYear(), shown.getMonth(), 1 - lead);
    const today = dateOf(new Date());
    for (let i = 0; i < 42; i++) {
      const day = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i,
      );
      if (i >= 35 && day.getMonth() !== shown.getMonth()) break;
      if (week && i % 7 === 0) grid.append(weekButton(day));
      const date = dateOf(day);
      const button = document.createElement("button");
      button.className = "tx-calendar-day";
      if (day.getMonth() !== shown.getMonth()) button.classList.add("is-other");
      if (date === today) button.classList.add("is-today");
      if (noted.has(date)) button.classList.add("is-marked");
      button.textContent = String(day.getDate());
      button.dataset.date = date;
      button.setAttribute(
        "aria-label",
        day.toLocaleDateString(api.language, { dateStyle: "full" }),
      );
      button.onclick = () => api.postMessage({ type: "open", date: date });
      grid.append(button);
    }
  }

  /** The week number in front of a row: its weekly note. The row's middle
   *  day names it, whichever day the calendar starts its weeks on. */
  function weekButton(start) {
    const middle = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 3);
    const number = dates.format(middle, week, api.language);
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
    weekStart = message.weekStart || "monday";
    week = message.week || null;
    monthNotes = !!message.month;
    render();
  });
  render();
  api.postMessage({ type: "ready" });
})();
