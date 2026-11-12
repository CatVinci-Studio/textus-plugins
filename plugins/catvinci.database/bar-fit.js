// A database page's bar, kept on one line as the block narrows: it gives
// way a step at a time (view.css's data-fit), and its sorts and filters ride
// in it while there is room. view.js starts it; loaded before view.js.
window.databaseBarFit = function ($) {
  "use strict";
  // The bar gives way a step at a time until it fits on one line: the page
  // count goes, then New's word, then the tabs fold into one button.
  const STEPS = ["", "tight", "tighter", "compact"];
  const barFits = (bar) => {
    const tabs = [...$("views").children];
    const shown = [...bar.children].filter((n) => n.offsetParent !== null);
    const row = (n) => n.offsetTop;
    if (!tabs.length || !shown.length) return true;
    return !(
      tabs.some((n) => row(n) !== row(tabs[0])) ||
      $("views").scrollWidth > $("views").clientWidth + 1 ||
      (bar.contains($("rules")) && $("rules").scrollWidth > $("rules").clientWidth + 1) ||
      shown.some((n) => row(n) > row(shown[0]) + shown[0].offsetHeight / 2) ||
      bar.scrollWidth > bar.clientWidth + 1
    );
  };
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
  // the page's width, the tabs drawn, the fonts arriving.
  const refit = () => requestAnimationFrame(fit);
  new ResizeObserver(refit).observe(document.body);
  new MutationObserver(refit).observe($("views"), { childList: true });
  new MutationObserver(refit).observe($("rules"), { childList: true });
  if (document.fonts) document.fonts.ready.then(refit);
};
