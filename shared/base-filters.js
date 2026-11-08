// A view's filters kept free of repeats as rules are added: the same rule
// twice is one, and a rule that holds one value per property ("is", "after",
// "is empty"...) replaces the one it contradicts instead of piling up.
// Rules written by hand (`raw`) are left as they are.
(function (root) {
  "use strict";

  /** Operators a property can meet once: a second one of them, on the same
   *  property, takes the first one's place. */
  const ONE_EACH = [["="], [">", ">="], ["<", "<="], ["empty", "!empty"]];
  const family = (op) => ONE_EACH.find((f) => f.includes(op)) || null;
  const same = (a, b) => a.key === b.key && a.op === b.op && String(a.value) === String(b.value);

  /** `filters` with `next` added: once, and in place of a rule it contradicts. */
  function merge(filters, next) {
    if (filters.some((f) => f.raw === undefined && same(f, next))) return filters;
    const ops = family(next.op);
    const kept = filters.filter(
      (f) => f.raw !== undefined || f.key !== next.key || !ops || !ops.includes(f.op),
    );
    return kept.concat([next]);
  }

  root.baseFilters = { merge };
})(typeof window !== "undefined" ? window : globalThis);
