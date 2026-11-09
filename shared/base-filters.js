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

  /** Several values at once ("any of", Notion's ticked options): one
   *  statement each, joined with ||; negated, the whole group. */
  const ANY = { in: "=", "!in": "=", hasAny: "has", "!hasAny": "has" };

  /** A filter the page made ({ key, op, value }) as a Bases statement. */
  function filterText(f) {
    const r = ref(f.key === "name" ? "file.basename" : f.key);
    const k = f.key === "name" ? "file.basename" : r;
    if (ANY[f.op]) {
      const values = [].concat(f.value);
      const one = values.map((v) => filterText({ key: f.key, op: ANY[f.op], value: v }));
      const group = one.length === 1 ? one[0] : "(" + one.join(" || ") + ")";
      return f.op.startsWith("!") ? "!" + (one.length === 1 ? "(" + group + ")" : group) : group;
    }
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

  /** `text` split at its top-level ||, outside quotes and brackets. */
  function orParts(text) {
    const parts = [];
    let depth = 0;
    let quote = false;
    let from = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quote) {
        if (c === "\\") i++;
        else if (c === '"') quote = false;
      } else if (c === '"') quote = true;
      else if (c === "(" || c === "[") depth++;
      else if (c === ")" || c === "]") depth--;
      else if (depth === 0 && text.startsWith("||", i)) {
        parts.push(text.slice(from, i).trim());
        from = i + 2;
        i++;
      }
    }
    parts.push(text.slice(from).trim());
    return parts;
  }

  /** `a == x || a == y` (or contains) as one rule of several values. */
  function readAny(text) {
    const not = /^!\((.*)\)$/.exec(text);
    const inner = not ? not[1] : /^\((.*)\)$/.exec(text)?.[1] ?? text;
    const parts = orParts(inner);
    if (!not && parts.length < 2) return null;
    const read = parts.map(readOne);
    const key = read[0].key;
    const op = read[0].op;
    if (!read.every((r) => r.raw === undefined && r.key === key && r.op === op)) return null;
    if (op !== "=" && op !== "has") return null;
    const any = op === "=" ? "in" : "hasAny";
    return { key, op: (not ? "!" : "") + any, value: read.map((r) => r.value) };
  }

  /** A Bases statement as a filter the page can show, or `{ raw }`. */
  function readFilter(text) {
    const s = String(text).trim();
    const one = readOne(s);
    return one.raw === undefined ? one : readAny(s) || one;
  }

  function readOne(text) {
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
  const ONE_EACH = [["=", "in", "!in"], [">", ">="], ["<", "<="], ["empty", "!empty"], ["hasAny", "!hasAny"]];
  const family = (op) => ONE_EACH.find((f) => f.includes(op)) || null;
  const same = (a, b) => a.key === b.key && a.op === b.op && String([].concat(a.value)) === String([].concat(b.value));

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
