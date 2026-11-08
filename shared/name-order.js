// Names in the order people expect: "Week2" before "Week10", case and
// accents aside. Each plugin using it lists this as lib/name-order.js in
// libs.json, before the files that sort names.
(function (root) {
  "use strict";
  var collators = new Map();

  function collator(locale) {
    var key = locale || "";
    if (!collators.has(key)) {
      var options = { numeric: true, sensitivity: "base" };
      var made;
      try {
        made = new Intl.Collator(locale || undefined, options);
      } catch {
        made = new Intl.Collator(undefined, options);
      }
      collators.set(key, made);
    }
    return collators.get(key);
  }

  /** `a` before `b` (below 0), after it or the same, as names; names the
   *  collator holds equal ("a", "A") still keep one order. */
  function compareNames(a, b, locale) {
    var x = a === null || a === undefined ? "" : String(a);
    var y = b === null || b === undefined ? "" : String(b);
    return collator(locale).compare(x, y) || (x < y ? -1 : x > y ? 1 : 0);
  }

  root.nameOrder = { compareNames: compareNames };
})(typeof window !== "undefined" ? window : globalThis);
