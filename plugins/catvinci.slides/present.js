// How a presented deck moves by touch and click, as the saved HTML does: the
// left third back, the rest forward; a sideways swipe either way.
(function (root) {
  "use strict";
  /** How far a finger goes sideways before it is a swipe, not a tap. */
  const SWIPE = 40;
  /** How long the exit button stays after the last touch or move. */
  const REVEAL_MS = 3000;

  /** -1 or 1 for a tap `x` across a slide `width` wide. */
  const tap = (x, width) => (x < width / 3 ? -1 : 1);

  /** -1, 1 or 0 for a press that moved `dx`, `dy`: leftward is forward. */
  function swipe(dx, dy) {
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return 0;
    return dx < 0 ? 1 : -1;
  }

  root.slidesPresent = { tap: tap, swipe: swipe, REVEAL_MS: REVEAL_MS };
})(typeof window !== "undefined" ? window : globalThis);
