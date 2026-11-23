// A database page's edges: whether more goes on past its right edge or its
// foot, and where a block held to Textus's height ends so no row is cut.
// view.js starts it; loaded before view.js.

// Whether the page goes on past its right edge or its foot. Below counts in
// a document only: a .base file's tab scrolls as any tab does. A sideways
// scroll bar (`innerHeight` past the root's height) is not more rows: the
// block is sized to the rows without it.
window.databaseMore = function (root, scrollX, scrollY, inTab, innerHeight) {
  "use strict";
  const bar = Math.max(0, (innerHeight || root.clientHeight) - root.clientHeight);
  return {
    right: root.scrollWidth - root.clientWidth - scrollX > 1,
    below: !inTab && root.scrollHeight - root.clientHeight - scrollY > bar + 1,
  };
};

// How much of the foot to cover so the block ends between two rows: from
// the top of the row the foot runs through. `rect(i)` is row i's box, rows
// in order down the page; `head` the foot of what stays at the top (the
// table's head), above which nothing is covered.
window.databaseCut = function (count, rect, foot, head) {
  "use strict";
  let lo = 0;
  let hi = count;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (rect(mid).bottom > foot) hi = mid;
    else lo = mid + 1;
  }
  if (lo >= count) return 0;
  const top = rect(lo).top;
  return top < foot && top > head ? foot - top : 0;
};

window.databaseEdges = function ($) {
  "use strict";
  const root = document.documentElement;
  const cover = document.createElement("div");
  cover.id = "foot";
  cover.setAttribute("aria-hidden", "true");
  document.body.append(cover);
  // The rows a view is read by, cut only between: a table's, a list's.
  const rowsOf = () => {
    const body = document.querySelector(".tx-table tbody");
    if (body) return { rows: body.rows, head: document.querySelector(".tx-table th") };
    const list = document.querySelector(".rows-list");
    return list ? { rows: list.children, head: null } : null;
  };
  // The cover's own box gives the frame's foot, and its height measured at
  // 100 how the page's zoom scales the boxes: engines measure a zoomed
  // page's boxes differently.
  const cut = (on) => {
    const found = on && rowsOf();
    root.classList.toggle("rows-below", !!found);
    if (!found) return;
    const { rows, head } = found;
    const probe = 100;
    cover.style.height = probe + "px";
    const box = cover.getBoundingClientRect();
    const px = window.databaseCut(rows.length, (i) => rows[i].getBoundingClientRect(), box.bottom, head ? head.getBoundingClientRect().bottom : -Infinity);
    cover.style.height = (px * probe) / (box.height || probe) + "px";
  };
  const edge = () => {
    const more = window.databaseMore(root, window.scrollX, window.scrollY, document.body.classList.contains("in-tab"), window.innerHeight);
    root.classList.toggle("more-right", more.right);
    root.classList.toggle("more-below", more.below);
    cut(more.below);
  };
  window.addEventListener("scroll", edge, { passive: true });
  window.addEventListener("resize", edge);
  new MutationObserver(edge).observe($("body"), { childList: true, subtree: true });
  // The rows moved without a change in them: the bar refitted onto fewer
  // lines, the fonts arrived.
  new ResizeObserver(edge).observe(document.body);
};
