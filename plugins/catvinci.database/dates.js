// A database page's date fields: typed as the note writes them (2026-11-08),
// or picked from a small month under the field. view.js makes them;
// loaded before it.
window.databaseDates = function (page) {
  "use strict";
  const { el, icon, s } = page;
  /** A date as it is written in the note, the way the table shows it: the
   *  system's date field would show it in its own order (11/02/2026). */
  const DATE = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/;
  const pad = (n) => String(n).padStart(2, "0");
  const dayOf = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());

  /** The month to show for what the field holds: its own, else this one. */
  function monthOf(text) {
    const d = DATE.test(text) ? new Date(text.slice(0, 10) + "T00:00:00") : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  /** The small month under `input` while it has the focus. A day picked
   *  goes in (a time typed after the date stays) and is confirmed as Enter
   *  confirms a typed one. */
  function picker(input) {
    let month = monthOf(input.value.trim());
    const pop = el("div", { class: "date-pop", role: "dialog", "aria-label": s("pickDate") });
    // The field keeps the focus: a click here is no leaving it.
    pop.addEventListener("pointerdown", (e) => e.preventDefault());
    pop.addEventListener("mousedown", (e) => e.preventDefault());
    const lang = s("locale");
    function draw() {
      const typed = input.value.trim();
      const chosen = DATE.test(typed) ? typed.slice(0, 10) : "";
      const today = dayOf(new Date());
      const shift = (n) => {
        month = new Date(month.getFullYear(), month.getMonth() + n, 1);
        draw();
      };
      const head = el("div", { class: "date-pop-head" },
        el("button", { type: "button", class: "tx-icon-button", "aria-label": s("prev"), onclick: () => shift(-1) }, icon("left")),
        el("strong", null, new Intl.DateTimeFormat(lang, { year: "numeric", month: "long" }).format(month)),
        el("button", { type: "button", class: "tx-icon-button", "aria-label": s("next"), onclick: () => shift(1) }, icon("right")));
      // Monday first, as the calendar view.
      const start = new Date(month);
      start.setDate(1 - ((month.getDay() + 6) % 7));
      const cells = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        cells.push(el("span", { class: "date-pop-weekday" }, new Intl.DateTimeFormat(lang, { weekday: "narrow" }).format(d)));
      }
      for (let i = 0; i < 42; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const k = dayOf(d);
        const cls = "date-pop-day" + (d.getMonth() !== month.getMonth() ? " other" : "") + (k === today ? " today" : "") + (k === chosen ? " chosen" : "");
        cells.push(el("button", { type: "button", class: cls, "aria-pressed": String(k === chosen), onclick: () => pick(k) }, String(d.getDate())));
      }
      pop.replaceChildren(head, el("div", { class: "date-pop-grid" }, cells));
    }
    function pick(day) {
      const time = /^\d{4}-\d{2}-\d{2}([ T].*)$/.exec(input.value.trim());
      input.value = day + (time ? time[1] : "");
      pop.remove();
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }
    // Under the field, in the page's flow, so a short page grows to hold it.
    // By layout offsets, not the screen's: in a zoomed document WebKit's
    // screen rectangles are zoomed and the month would land out of sight.
    function place() {
      let left = 0;
      let top = input.offsetHeight;
      for (let el = input; el && el !== document.body; el = el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
      }
      pop.style.left = Math.max(0, left) + "px";
      pop.style.top = top + 4 + "px";
      // Near the page's end (a frame no taller than 70% of the window can't
      // grow to hold it): above the field instead.
      const box = input.getBoundingClientRect();
      const zoom = box.height / input.offsetHeight || 1;
      const below = (window.innerHeight - box.bottom) / zoom;
      const tall = pop.offsetHeight + 8;
      if (below < tall && top - input.offsetHeight - tall >= 0) pop.style.top = top - input.offsetHeight - tall + "px";
    }
    // Typed, the month follows what is typed.
    input.addEventListener("input", () => {
      if (DATE.test(input.value.trim())) month = monthOf(input.value.trim());
      draw();
    });
    // Opened when the field is made to be edited (not on its focus event,
    // which a page without the window's focus never gets) and on a click.
    const open = () => {
      if (pop.isConnected || !input.isConnected) return;
      draw();
      document.body.append(pop);
      place();
    };
    input.openMonth = open;
    input.addEventListener("focus", open);
    input.addEventListener("click", open);
    // Gone with the field: WebKit sends no blur for a field taken out of the page.
    input.addEventListener("blur", () => pop.remove());
    input.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" || e.key === "Escape") pop.remove();
    });
  }

  function dateInput(attrs) {
    const input = el("input", { ...attrs, type: "text", placeholder: "YYYY-MM-DD", inputmode: "numeric", spellcheck: "false" });
    picker(input);
    return input;
  }

  return { DATE, dateInput };
};
