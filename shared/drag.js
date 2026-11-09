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
    var selecting = "";
    function move(e) {
      if (!dragging) {
        if (Math.hypot(e.clientX - from.x, e.clientY - from.y) < START_PX) return;
        dragging = true;
        // No text is selected on the way.
        selecting = document.body.style.userSelect;
        document.body.style.userSelect = "none";
        var selection = root.getSelection && root.getSelection();
        if (selection) selection.removeAllRanges();
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
      document.body.style.userSelect = selecting;
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
    // The page's own zoom (a page drawn in a zoomed document): the pointer
    // is in screen pixels, the ghost's place in the page's.
    var scale = 1;
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
      },
      move: function (x, y) {
        ghost.style.left = (x - grab.x) / scale + "px";
        ghost.style.top = (y - grab.y) / scale + "px";
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

  /**
   * `item` dragged along its row (`axis` "x") or column ("y") among
   * `items()`, as the window's own tabs and sidebar icons are: the item
   * itself follows the pointer, the others slide aside, no copy and no
   * outline. `onDrop(index)`: where it was let go, among all of them.
   */
  function reorder(down, options) {
    var item = options.item;
    var axis = options.axis || "x";
    var all = [];
    var slots = [];
    var from = 0;
    var at = 0;
    var size = 0;
    var start = axis === "x" ? down.clientX : down.clientY;
    var scale = 1;
    function place(n, px, lifted) {
      n.style.translate = px ? (axis === "x" ? px + "px 0" : "0 " + px + "px") : "";
      n.classList.toggle("is-drag-lifted", lifted);
    }
    track(down, {
      start: function () {
        all = options.items();
        from = all.indexOf(item);
        at = from;
        slots = all.map(function (n) {
          var r = n.getBoundingClientRect();
          return axis === "x" ? { a: r.left, mid: r.left + r.width / 2 } : { a: r.top, mid: r.top + r.height / 2 };
        });
        var box = item.getBoundingClientRect();
        // A page drawn in a zoomed document: screen pixels to the page's.
        scale = (axis === "x" ? box.width / item.offsetWidth : box.height / item.offsetHeight) || 1;
        var next = slots[from + 1] || slots[from - 1];
        size = next ? Math.abs(next.a - slots[from].a) : axis === "x" ? box.width : box.height;
        all.forEach(function (n) {
          if (n !== item) n.style.transition = "translate " + SLIDE_MS + "ms ease-out";
        });
      },
      move: function (x, y) {
        var delta = (axis === "x" ? x : y) - start;
        var mid = slots[from].mid + delta;
        at = from;
        slots.forEach(function (s, i) {
          if (i < from && mid < s.mid) at = Math.min(at, i);
          if (i > from && mid > s.mid) at = Math.max(at, i);
        });
        all.forEach(function (n, i) {
          if (n === item) return place(n, delta / scale, true);
          var shift = i >= at && i < from ? size : i <= at && i > from ? -size : 0;
          place(n, shift / scale, false);
        });
      },
      end: function (_x, _y, dropped) {
        all.forEach(function (n) {
          place(n, 0, false);
          n.style.transition = "";
        });
        options.onDrop(dropped ? at : from);
      },
    });
  }

  root.drag = { track: track, sortable: sortable, reorder: reorder, indexAt: indexAt };
})(globalThis);
