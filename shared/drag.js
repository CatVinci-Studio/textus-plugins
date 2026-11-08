// Dragging on a plugin's page with pointer events, not HTML drag and drop
// (the Textus window's own file drop takes that over: a copy cursor and no
// drop). A copy of the item follows the pointer while the item itself moves
// through the lists in its place, so the others make way; letting go hands
// the caller the list and index, Esc puts it back. Each plugin using it lists
// this as lib/drag.js in libs.json. No page of its own: the page's
// tx-drag-ghost and tx-drag-source styles are Textus's.
(function (root) {
  "use strict";

  var START_PX = 5;
  var SLIDE_MS = 160;

  /** Follows a press from `down`: start once it moves START_PX, move, then
   *  end(x, y, dropped). The click a drag's release sends is swallowed. */
  function track(down, handlers) {
    if (down.button !== 0) return;
    var from = { x: down.clientX, y: down.clientY };
    var dragging = false;
    function move(e) {
      if (!dragging) {
        if (Math.hypot(e.clientX - from.x, e.clientY - from.y) < START_PX) return;
        dragging = true;
        if (handlers.start) handlers.start(from.x, from.y);
      }
      e.preventDefault();
      handlers.move(e.clientX, e.clientY);
    }
    function finish(x, y, dropped) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", key, true);
      if (!dragging) return;
      handlers.end(x, y, dropped);
      var stop = function (e) {
        e.stopPropagation();
        e.preventDefault();
      };
      window.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(function () {
        window.removeEventListener("click", stop, true);
      }, 0);
    }
    function up(e) {
      finish(e.clientX, e.clientY, true);
    }
    function cancel(e) {
      finish(e.clientX, e.clientY, false);
    }
    function key(e) {
      if (e.key !== "Escape" || !dragging) return;
      e.preventDefault();
      finish(from.x, from.y, false);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", key, true);
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
        { duration: SLIDE_MS, easing: "ease-out" },
      );
    });
  }

  /**
   * `item` dragged among the lists `lists()` gives, each holding its items
   * as `itemsOf(list)` gives them (`item` among them while it is there),
   * along `axis` ("y" down a list, "x" across). `onDrop(list, index)`: the
   * list let go over and the index among its other items.
   */
  function sortable(down, options) {
    var item = options.item;
    var axis = options.axis || "y";
    var home = { parent: item.parentNode, next: item.nextSibling };
    var ghost = null;
    var grab = { x: 0, y: 0 };
    var over = null;
    function listAt(x, y) {
      var lists = options.lists();
      for (var i = 0; i < lists.length; i++) {
        var r = lists[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return lists[i];
      }
      return null;
    }
    function others(list) {
      return options.itemsOf(list).filter(function (n) {
        return n !== item;
      });
    }
    track(down, {
      start: function (x, y) {
        var r = item.getBoundingClientRect();
        grab = { x: x - r.left, y: y - r.top };
        ghost = item.cloneNode(true);
        ghost.classList.add("tx-drag-ghost");
        ghost.style.width = r.width + "px";
        ghost.style.left = r.left + "px";
        ghost.style.top = r.top + "px";
        document.body.append(ghost);
        item.classList.add("tx-drag-source");
        over = home.parent;
      },
      move: function (x, y) {
        ghost.style.left = x - grab.x + "px";
        ghost.style.top = y - grab.y + "px";
        var list = listAt(x, y);
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
      },
      end: function (x, y, dropped) {
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
    });
  }

  root.drag = { track: track, sortable: sortable, indexAt: indexAt };
})(globalThis);
