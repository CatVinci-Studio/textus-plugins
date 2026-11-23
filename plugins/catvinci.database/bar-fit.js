// A database page's bar, kept on one line as the block narrows: it gives
// way a step at a time (view.css's data-fit), and its sorts and filters ride
// in it while there is room. view.js starts it; loaded before view.js.

// Whether the bar holds on one line. Items on a line are centred on it, so
// one there starts above the first item's foot; one that wrapped starts at
// or below it. Zero-height items (the spacer) say nothing: centred, a
// spacer's top is the line's middle, which rounding put on either side of
// a half-height test - and a zoomed block in WebKit then folded the tabs
// and dropped the sorts to a line of their own, with room to spare.
window.databaseBarFits = function ($, bar) {
  "use strict";
  const tabs = [...$("views").children];
  const shown = [...bar.children].filter((n) => n.offsetParent !== null && n.offsetHeight > 0);
  const row = (n) => n.offsetTop;
  if (!tabs.length || !shown.length) return true;
  const foot = row(shown[0]) + shown[0].offsetHeight;
  return !(
    tabs.some((n) => row(n) !== row(tabs[0])) ||
    $("views").scrollWidth > $("views").clientWidth + 1 ||
    // A tab squeezed until its name is cut ("Calenda") doesn't fit either.
    tabs.some((n) => {
      const label = n.querySelector(".tx-segment-label");
      return label && label.scrollWidth > label.clientWidth + 1;
    }) ||
    (bar.contains($("rules")) && $("rules").scrollWidth > $("rules").clientWidth + 1) ||
    shown.some((n) => row(n) >= foot) ||
    bar.scrollWidth > bar.clientWidth + 1
  );
};

// Whether the page goes on past its right edge or its foot (view.js fades
// them). Below counts in a document only: a .base file's tab scrolls as
// any tab does. A sideways scroll bar (`innerHeight` past the root's
// height) is not more rows: the block is sized to the rows without it.
window.databaseMore = function (root, scrollX, scrollY, inTab, innerHeight) {
  "use strict";
  const bar = Math.max(0, (innerHeight || root.clientHeight) - root.clientHeight);
  return {
    right: root.scrollWidth - root.clientWidth - scrollX > 1,
    below: !inTab && root.scrollHeight - root.clientHeight - scrollY > bar + 1,
  };
};

window.databaseBarFit = function ($) {
  "use strict";
  // The bar gives way a step at a time until it fits on one line: the page
  // count goes, then New's word, then the tabs fold into one button.
  const STEPS = ["", "tight", "tighter", "compact"];
  const barFits = (bar) => window.databaseBarFits($, bar);
  const fit = () => {
    const bar = $("bar");
    const rules = $("rules");
    // The sorts and filters ride in the bar wherever it has room for them:
    // one line, not two.
    const inBar = () => bar.insertBefore(rules, bar.querySelector(".tx-spacer"));
    const below = () => rules.parentNode === bar && bar.after(rules);
    // First every step with them in the bar, then on a line of their own.
    for (const place of rules.childElementCount ? [inBar, below] : [below]) {
      place();
      for (const step of STEPS) {
        bar.dataset.fit = step;
        if (barFits(bar)) return;
      }
    }
  };
  // Measured again whenever what it holds or its room may have changed:
  // the page's width, the tabs drawn, the fonts arriving. Only the width:
  // the bar's own change of height must not ask again, or a scroll bar
  // coming and going with it would swap the two ways forever.
  // Once a frame however many observers ask: every step measured is a
  // layout of the whole page, the table's rows and all.
  let asked = false;
  const refit = () => {
    if (asked) return;
    asked = true;
    requestAnimationFrame(() => {
      asked = false;
      fit();
    });
  };
  let width = -1;
  new ResizeObserver(() => {
    const now = document.body.clientWidth;
    if (now === width) return;
    width = now;
    refit();
  }).observe(document.body);
  new MutationObserver(refit).observe($("views"), { childList: true });
  new MutationObserver(refit).observe($("rules"), { childList: true });
  if (document.fonts) document.fonts.ready.then(refit);
};
