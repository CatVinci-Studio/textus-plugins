// Dragging on a plugin's page with pointer events, not HTML drag and drop
// (the Textus window's own file drop takes that over: a copy cursor and no
// drop). A copy of the item follows the pointer while the item itself moves
// through the lists in its place, so the others make way; letting go hands
// the caller the list and index, Esc puts it back. The rules are Textus's
// own: a mouse drags once it moves 5 px, a finger once it has held still a
// moment (before that, a move is a scroll), and the page doesn't scroll
// under a lifted finger. Each plugin using it lists this as lib/drag.js in
// libs.json. No page of its own: the page's tx-drag-ghost and
// tx-drag-source styles are Textus's.
(function (root) {
  "use strict";

  var START_PX = 5;
  /** How long a finger holds still to lift what it is on, and how far it
   *  may wander meanwhile. */
  var HOLD_MS = 300;
  var SLOP_PX = 10;
  /** How near a scroller's edge the pointer scrolls it, and the fastest it
   *  goes, in pixels a 60 Hz frame. */
  var EDGE = 36;
  var MAX_STEP = 40;
  var FRAME_MS = 1000 / 60;
  var LONGEST_GAP_MS = 50;
  /** A scroller that snaps turns a page after the pointer rests this long. */
  var FLIP_MS = 600;

  // A lifted finger's moves are the drag's, not the page's scroll.
  var lifted = false;
  root.addEventListener(
    "touchmove",
    function (e) {
      if (lifted && e.cancelable) e.preventDefault();
    },
    { passive: false },
  );

  /** The window's motion, as Textus gives its pages: a duration, an ease. */
  function motion() {
    var style = root.getComputedStyle(root.document.documentElement);
    var ms = parseFloat(style.getPropertyValue("--dur-base"));
    return {
      duration: isFinite(ms) ? ms : 200,
      easing: style.getPropertyValue("--ease-out").trim() || "ease-out",
    };
  }

  /** The click a release sends lands on what was dragged: it isn't one. */
  function swallowClick() {
    var stop = function (e) {
      e.stopPropagation();
      e.preventDefault();
    };
    root.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(function () {
      root.removeEventListener("click", stop, true);
    }, 0);
  }

  /** Follows a press from `down` (already a drag with `started`): start
   *  once it moves START_PX, move, then end(x, y, dropped). */
  function follow(down, handlers, started) {
    var from = { x: down.clientX, y: down.clientY };
    var last = { x: from.x, y: from.y };
    var dragging = false;
    var done = false;
    var selecting = "";
    // A finger's events stay with the node it pressed, also once that node
    // leaves the page: they no longer reach the window.
    var origin = typeof Node !== "undefined" && down.target instanceof Node ? down.target : null;
    var heard = new WeakSet();
    function once(handle) {
      return function (e) {
        if (heard.has(e)) return;
        heard.add(e);
        handle(e);
      };
    }
    function begin() {
      dragging = true;
      lifted = true;
      // No text is selected on the way.
      selecting = document.body.style.userSelect;
      document.body.style.userSelect = "none";
      var selection = root.getSelection && root.getSelection();
      if (selection) selection.removeAllRanges();
    }
    var move = once(function (e) {
      // A release WebView2 never told: the buttons are up.
      if (e.buttons === 0) return finish(e.clientX, e.clientY, true);
      last = { x: e.clientX, y: e.clientY };
      if (!dragging) {
        if (Math.hypot(e.clientX - from.x, e.clientY - from.y) < START_PX) return;
        begin();
        if (handlers.start) handlers.start(from.x, from.y);
      }
      e.preventDefault();
      handlers.move(e.clientX, e.clientY, e);
    });
    var hold = function (e) {
      if (dragging && e.cancelable) e.preventDefault();
    };
    function finish(x, y, dropped) {
      if (done) return;
      done = true;
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", cancel);
      root.removeEventListener("pointerdown", pressed, true);
      root.removeEventListener("keydown", key, true);
      root.removeEventListener("contextmenu", noMenu, true);
      onOrigin.forEach(function (pair) {
        if (origin) origin.removeEventListener(pair[0], pair[1]);
      });
      if (!dragging) return;
      lifted = false;
      document.body.style.userSelect = selecting;
      handlers.end(x, y, dropped);
      swallowClick();
    }
    var up = once(function (e) {
      finish(e.clientX, e.clientY, true);
    });
    var cancel = once(function (e) {
      finish(e.clientX, e.clientY, false);
    });
    // A new press while this one is still followed: its release went
    // unheard, and the drag ends where it was, dropping nothing.
    function pressed() {
      finish(last.x, last.y, false);
    }
    function key(e) {
      if (e.key !== "Escape" || !dragging) return;
      e.preventDefault();
      finish(from.x, from.y, false);
    }
    // A finger held still is a long press to Android's web view: neither
    // its menu nor the page's own takes the drag over.
    function noMenu(e) {
      e.preventDefault();
      if (dragging) e.stopPropagation();
    }
    var onOrigin = [
      ["pointermove", move],
      ["pointerup", up],
      ["pointercancel", cancel],
      ["touchmove", hold],
    ];
    if (started) begin();
    root.addEventListener("contextmenu", noMenu, true);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", cancel);
    root.addEventListener("pointerdown", pressed, true);
    root.addEventListener("keydown", key, true);
    onOrigin.forEach(function (pair) {
      if (origin) origin.addEventListener(pair[0], pair[1], { passive: false });
    });
    return {
      cancel: function () {
        finish(last.x, last.y, false);
      },
    };
  }

  /** A finger's press that lifts once it has held still HOLD_MS: start,
   *  then move once it travels; let go without travelling, it ends dropping
   *  nothing and was a long press (`held`). */
  function holdThen(down, handlers) {
    var from = { x: down.clientX, y: down.clientY };
    var following = null;
    function stop() {
      clearTimeout(timer);
      root.removeEventListener("pointermove", moved);
      root.removeEventListener("pointerup", stop);
      root.removeEventListener("pointercancel", stop);
    }
    function moved(e) {
      if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > SLOP_PX) stop();
    }
    var timer = setTimeout(function () {
      stop();
      var travelled = false;
      if (handlers.start) handlers.start(from.x, from.y);
      following = follow(
        down,
        {
          move: function (x, y, e) {
            travelled = travelled || Math.hypot(x - from.x, y - from.y) >= START_PX;
            if (travelled) handlers.move(x, y, e);
          },
          end: function (x, y, dropped) {
            handlers.end(x, y, travelled && dropped);
            if (!travelled && dropped && handlers.held) handlers.held(x, y);
          },
        },
        true,
      );
    }, HOLD_MS);
    root.addEventListener("pointermove", moved);
    root.addEventListener("pointerup", stop);
    root.addEventListener("pointercancel", stop);
    return {
      cancel: function () {
        stop();
        if (following) following.cancel();
      },
    };
  }

  /** Follows a press from `down`: start, move, then end(x, y, dropped); the
   *  click a drag's release sends is swallowed. A finger holds first, unless
   *  `options.hold` is false (a surface that takes every touch itself).
   *  Returns the handle that ends it, dropping nothing. */
  function track(down, handlers, options) {
    if (down.button !== 0) return { cancel: function () {} };
    var hold = down.pointerType === "touch" && !(options && options.hold === false);
    return hold ? holdThen(down, handlers) : follow(down, handlers, false);
  }

  /** Pixels a frame a pointer at `at` asks a scroller spanning lo..hi to
   *  move: more the further into the edge band, up to MAX_STEP; negative
   *  towards lo. */
  function edgeStep(at, lo, hi) {
    var ramp = function (into) {
      return Math.min(MAX_STEP, Math.ceil(into / 3));
    };
    if (at > hi - EDGE) return ramp(at - (hi - EDGE));
    if (at < lo + EDGE) return -ramp(lo + EDGE - at);
    return 0;
  }

  function scrollsOn(el, axis) {
    var room = axis === "x" ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    if (!(room > 0)) return false;
    if (el === document.scrollingElement) return true;
    var overflow = root.getComputedStyle(el)[axis === "x" ? "overflowX" : "overflowY"];
    return overflow === "auto" || overflow === "scroll";
  }

  function snaps(el, axis) {
    var type = (root.getComputedStyle(el).scrollSnapType || "none").split(" ")[0];
    return type === axis || type === "both";
  }

  /** The pointer near the edge of what scrolls around `node` scrolls it,
   *  on either axis, and goes on while it rests there; a scroller that
   *  snaps turns a page at a time instead. */
  function edgeScroll() {
    var point = null;
    var frame = 0;
    var then = 0;
    var carry = { x: 0, y: 0 };
    var dwell = { x: null, y: null };
    function scrollerOf(node, axis) {
      for (var n = node; n && n.nodeType === 1; n = n.parentNode) if (scrollsOn(n, axis)) return n;
      return null;
    }
    function stepAxis(axis, now, gap) {
      var el = scrollerOf(point.node, axis);
      var r = el && el.getBoundingClientRect();
      var pace = r
        ? axis === "x"
          ? edgeStep(point.x, Math.max(r.left, 0), Math.min(r.right, root.innerWidth))
          : edgeStep(point.y, Math.max(r.top, 0), Math.min(r.bottom, root.innerHeight))
        : 0;
      if (!pace) {
        carry[axis] = 0;
        dwell[axis] = null;
        return false;
      }
      var sign = Math.sign(pace);
      if (snaps(el, axis)) {
        var d = dwell[axis];
        if (!d || d.el !== el || d.sign !== sign) dwell[axis] = { el: el, sign: sign, since: now };
        else if (now - d.since >= FLIP_MS) {
          var by = { behavior: "smooth" };
          by[axis === "x" ? "left" : "top"] = sign * (axis === "x" ? el.clientWidth : el.clientHeight);
          el.scrollBy(by);
          d.since = now;
        }
        return true;
      }
      var want = (pace * gap) / FRAME_MS + carry[axis];
      var whole = Math.trunc(want);
      carry[axis] = want - whole;
      if (whole) el[axis === "x" ? "scrollLeft" : "scrollTop"] += whole;
      return true;
    }
    function run(now) {
      frame = 0;
      var gap = then ? Math.min(now - then, LONGEST_GAP_MS) : FRAME_MS;
      then = now;
      var x = stepAxis("x", now, gap);
      var y = stepAxis("y", now, gap);
      if (x || y) frame = root.requestAnimationFrame(run);
      else then = 0;
    }
    return {
      at: function (x, y, node) {
        point = { x: x, y: y, node: node };
        if (!frame) frame = root.requestAnimationFrame(run);
      },
      stop: function () {
        root.cancelAnimationFrame(frame);
        frame = 0;
        then = 0;
      },
    };
  }

  /** Where among `items` a pointer at `at` goes: before the first whose
   *  middle it hasn't passed. */
  function indexAt(items, at, axis) {
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      var middle = axis === "x" ? r.left + r.width / 2 : r.top + r.height / 2;
      if (at < middle) return i;
    }
    return items.length;
  }

  /** The others slide from where they were to where they are now. */
  function slide(nodes, before) {
    if (root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    nodes.forEach(function (n) {
      var was = before.get(n);
      if (!was) return;
      var now = n.getBoundingClientRect();
      var dx = was.left - now.left;
      var dy = was.top - now.top;
      if (!dx && !dy) return;
      n.animate(
        [{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }],
        motion(),
      );
    });
  }

  /**
   * `item` dragged among the lists `lists()` gives, each holding its items
   * as `itemsOf(list)` gives them (`item` among them while it is there),
   * along `axis` ("y" down a list, "x" across). `onDrop(list, index)`: the
   * list let go over and the index among its other items. `held(x, y)`: a
   * finger lifted it and let go where it was (a long press).
   */
  function sortable(down, options) {
    var item = options.item;
    var axis = options.axis || "y";
    var home = { parent: item.parentNode, next: item.nextSibling };
    var ghost = null;
    var grab = { x: 0, y: 0 };
    // The page's own zoom (a page drawn in a zoomed document): the pointer
    // is in screen pixels, the ghost's place in the page's.
    var scale = 1;
    var over = null;
    var last = null;
    var edges = edgeScroll();
    var finger = down.pointerType === "touch";
    function listAt(x, y) {
      var lists = options.lists();
      for (var i = 0; i < lists.length; i++) {
        var r = lists[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return lists[i];
      }
      return null;
    }
    /** Past the end of a short list (below a board's column): the nearest
     *  list across whose span the pointer is. */
    function listBeside(x, y) {
      var best = null;
      var far = Infinity;
      options.lists().forEach(function (l) {
        var r = l.getBoundingClientRect();
        var across = axis === "y" ? x >= r.left && x <= r.right : y >= r.top && y <= r.bottom;
        if (!across) return;
        var d = axis === "y" ? Math.max(r.top - y, y - r.bottom, 0) : Math.max(r.left - x, x - r.right, 0);
        if (d < far) {
          far = d;
          best = l;
        }
      });
      return best;
    }
    function others(list) {
      return options.itemsOf(list).filter(function (n) {
        return n !== item;
      });
    }
    /** The item to its place for a pointer at x, y. A finger at the
     *  window's edge or past a short list counts for the list beside it. */
    function place(x, y) {
      var list =
        listAt(x, y) ||
        (finger &&
          listBeside(
            Math.min(Math.max(x, EDGE), root.innerWidth - EDGE),
            Math.min(Math.max(y, EDGE), root.innerHeight - EDGE),
          ));
      if (!list) return;
      over = list;
      var rest = others(list);
      var at = indexAt(rest, axis === "x" ? x : y, axis);
      var anchor = rest[at] || null;
      // Already there: nothing moves.
      if (item.parentNode === (anchor ? anchor.parentNode : list) && item.nextSibling === anchor) return;
      var moving = options.lists().reduce(function (all, l) {
        return all.concat(options.itemsOf(l));
      }, []);
      var before = new Map();
      moving.forEach(function (n) {
        before.set(n, n.getBoundingClientRect());
      });
      if (anchor) anchor.parentNode.insertBefore(item, anchor);
      else if (rest.length) rest[rest.length - 1].after(item);
      else {
        // An empty list: before what follows its items (its add button).
        var end = options.after ? options.after(list) : null;
        if (end) end.parentNode.insertBefore(item, end);
        else list.append(item);
      }
      slide(moving, before);
    }
    // The lists moved under a pointer at rest: it is somewhere new.
    function scrolled() {
      if (last) place(last.x, last.y);
    }
    return track(down, {
      start: function (x, y) {
        var r = item.getBoundingClientRect();
        grab = { x: x - r.left, y: y - r.top };
        ghost = item.cloneNode(true);
        ghost.classList.add("tx-drag-ghost");
        // Its width with its padding and border, as the rect has it: a
        // padded item (a table's head cell) is otherwise measured as zoomed.
        ghost.style.boxSizing = "border-box";
        ghost.style.width = r.width + "px";
        document.body.append(ghost);
        scale = ghost.getBoundingClientRect().width / r.width || 1;
        ghost.style.width = r.width / scale + "px";
        // Measured: now it may grow, as everything dragged in Textus does.
        ghost.classList.add("is-lifted");
        ghost.style.left = r.left / scale + "px";
        ghost.style.top = r.top / scale + "px";
        item.classList.add("tx-drag-source");
        over = home.parent;
        root.addEventListener("scroll", scrolled, true);
      },
      move: function (x, y) {
        last = { x: x, y: y };
        ghost.style.left = (x - grab.x) / scale + "px";
        ghost.style.top = (y - grab.y) / scale + "px";
        place(x, y);
        edges.at(x, y, listAt(x, y) || over || home.parent);
      },
      end: function (x, y, dropped) {
        edges.stop();
        root.removeEventListener("scroll", scrolled, true);
        if (ghost) ghost.remove();
        item.classList.remove("tx-drag-source");
        var list = over;
        var index = list ? options.itemsOf(list).indexOf(item) : -1;
        if (!dropped || !list || index < 0) {
          home.parent.insertBefore(item, home.next);
          return;
        }
        options.onDrop(list, index);
      },
      held: options.held,
    });
  }

  root.drag = { track: track, sortable: sortable, indexAt: indexAt, edgeStep: edgeStep };
})(globalThis);
