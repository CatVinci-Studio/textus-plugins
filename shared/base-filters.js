// A view's filters: a rule the page made ({ key, op, value }) written as a
// Bases statement and read back, and kept free of repeats as rules are
// added - the same rule twice is one, and a rule that holds one value per
// property ("is", "after", "is empty"...) replaces the one it contradicts.
// Rules written by hand (`raw`) are left as they are.
(function (root) {
  "use strict";

  const DATE = /^\d{4}-\d{2}-\d{2}/;

  /** A name as Bases writes it in an expression: plain, or note["with spaces"]. */
  const ref = (key) => (/^[A-Za-z_][\w]*$/.test(key) ? key : "note[" + JSON.stringify(key) + "]");
  const literal = (value) => {
    const v = String(value).trim().replace(/^["']|["']$/g, "");
    if (/^-?\d+(\.\d+)?$/.test(v)) return v;
    if (v === "true" || v === "false") return v;
    if (DATE.test(v)) return "date(" + JSON.stringify(v.slice(0, 10)) + ")";
    return JSON.stringify(v);
  };

  /** A filter the page made ({ key, op, value }) as a Bases statement. */
  function filterText(f) {
    const r = ref(f.key === "name" ? "file.basename" : f.key);
    const k = f.key === "name" ? "file.basename" : r;
    switch (f.op) {
      case "=":
        return k + " == " + literal(f.value);
      case "!=":
        return k + " != " + literal(f.value);
      case "has":
        return k + ".contains(" + JSON.stringify(String(f.value)) + ")";
      case "!has":
        return "!" + k + ".contains(" + JSON.stringify(String(f.value)) + ")";
      case "empty":
        return k + ".isEmpty()";
      case "!empty":
        return "!" + k + ".isEmpty()";
      default:
        return k + " " + f.op + " " + literal(f.value);
    }
  }

  const NAME = String.raw`(note\["(?:[^"\\]|\\.)*"\]|file\.basename|[A-Za-z_]\w*)`;
  const VALUE = String.raw`(date\("[^"]*"\)|"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|true|false)`;
  const unref = (name) => (name === "file.basename" ? "name" : name.startsWith("note[") ? JSON.parse(name.slice(5, -1)) : name);
  const unliteral = (v) => (v.startsWith("date(") ? JSON.parse(v.slice(5, -1)) : v.startsWith('"') ? JSON.parse(v) : v);

  /** A Bases statement as a filter the page can show, or `{ raw }`. */
  function readFilter(text) {
    const s = String(text).trim();
    let m;
    if ((m = new RegExp("^" + NAME + "\\s*(==|!=|>=|<=|>|<)\\s*" + VALUE + "$").exec(s)))
      return { key: unref(m[1]), op: m[2] === "==" ? "=" : m[2], value: unliteral(m[3]) };
    if ((m = new RegExp("^(!?)" + NAME + "\\.contains\\(" + VALUE + "\\)$").exec(s)))
      return { key: unref(m[2]), op: m[1] ? "!has" : "has", value: unliteral(m[3]) };
    if ((m = new RegExp("^(!?)" + NAME + "\\.isEmpty\\(\\)$").exec(s)))
      return { key: unref(m[2]), op: m[1] ? "!empty" : "empty", value: "" };
    return { raw: s };
  }

  /** A view's filters as a list of statements: its "and", or the one filter. */
  function statements(filters) {
    if (!filters) return [];
    if (typeof filters === "string") return [filters];
    if (Array.isArray(filters.and)) return filters.and;
    return [filters];
  }

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

  root.baseFilters = { merge, text: filterText, read: readFilter, statements };
})(typeof window !== "undefined" ? window : globalThis);
