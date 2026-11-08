// Obsidian Bases expressions, the part filters use: comparisons, && || !,
// arithmetic, strings and lists with their methods, file.* and this.file.*,
// note properties by name or note["name"], and today(), date(), list(), if().
// What it doesn't know throws, so a filter can say it was left out rather
// than guess.

(function (root) {
  class Unsupported extends Error {}

  // ------------------------------------------------------------ tokens
  function tokens(source) {
    const out = [];
    const s = String(source);
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        let text = "";
        while (j < s.length && s[j] !== c) {
          if (s[j] === "\\" && j + 1 < s.length) {
            const n = s[++j];
            text += n === "n" ? "\n" : n === "t" ? "\t" : n;
          } else text += s[j];
          j++;
        }
        out.push({ kind: "str", value: text });
        i = j + 1;
        continue;
      }
      const num = /^\d+(\.\d+)?/.exec(s.slice(i));
      if (num) {
        out.push({ kind: "num", value: Number(num[0]) });
        i += num[0].length;
        continue;
      }
      const word = /^[A-Za-z_À-￿][\wÀ-￿]*/.exec(s.slice(i));
      if (word) {
        out.push({ kind: "id", value: word[0] });
        i += word[0].length;
        continue;
      }
      const op = /^(==|!=|>=|<=|&&|\|\||[-+*/%<>!().,[\]])/.exec(s.slice(i));
      if (!op) throw new Unsupported("Unknown character " + c);
      out.push({ kind: "op", value: op[0] });
      i += op[0].length;
    }
    return out;
  }

  // ------------------------------------------------------------ parse
  function parse(source) {
    const list = tokens(source);
    let at = 0;
    const peek = (v) => list[at] && list[at].kind === "op" && list[at].value === v;
    const take = (v) => (peek(v) ? (at++, true) : false);
    const need = (v) => {
      if (!take(v)) throw new Unsupported("Expected " + v);
    };

    function or() {
      let left = and();
      while (take("||")) left = { t: "or", a: left, b: and() };
      return left;
    }
    function and() {
      let left = cmp();
      while (take("&&")) left = { t: "and", a: left, b: cmp() };
      return left;
    }
    function cmp() {
      const left = add();
      for (const op of ["==", "!=", ">=", "<=", ">", "<"]) if (take(op)) return { t: "cmp", op, a: left, b: add() };
      return left;
    }
    function add() {
      let left = mul();
      for (;;) {
        if (take("+")) left = { t: "bin", op: "+", a: left, b: mul() };
        else if (take("-")) left = { t: "bin", op: "-", a: left, b: mul() };
        else return left;
      }
    }
    function mul() {
      let left = unary();
      for (;;) {
        const op = ["*", "/", "%"].find((o) => peek(o));
        if (!op) return left;
        at++;
        left = { t: "bin", op, a: left, b: unary() };
      }
    }
    function unary() {
      if (take("!")) return { t: "not", a: unary() };
      if (take("-")) return { t: "neg", a: unary() };
      return postfix();
    }
    function args() {
      const out = [];
      if (take(")")) return out;
      do out.push(or());
      while (take(","));
      need(")");
      return out;
    }
    function postfix() {
      let node = primary();
      for (;;) {
        if (take(".")) {
          const name = list[at++];
          if (!name || name.kind !== "id") throw new Unsupported("Expected a name");
          node = take("(") ? { t: "call", on: node, name: name.value, args: args() } : { t: "get", on: node, name: name.value };
        } else if (take("[")) {
          const key = or();
          need("]");
          node = { t: "index", on: node, key };
        } else return node;
      }
    }
    function primary() {
      const tok = list[at++];
      if (!tok) throw new Unsupported("Unexpected end");
      if (tok.kind === "num" || tok.kind === "str") return { t: "lit", value: tok.value };
      if (tok.kind === "op" && tok.value === "(") {
        const inner = or();
        need(")");
        return inner;
      }
      if (tok.kind === "op" && tok.value === "[") {
        const items = [];
        if (!take("]")) {
          do items.push(or());
          while (take(","));
          need("]");
        }
        return { t: "list", items };
      }
      if (tok.kind === "id") {
        if (tok.value === "true" || tok.value === "false") return { t: "lit", value: tok.value === "true" };
        if (tok.value === "null") return { t: "lit", value: null };
        if (take("(")) return { t: "fn", name: tok.value, args: args() };
        return { t: "name", name: tok.value };
      }
      throw new Unsupported("Unexpected " + tok.value);
    }
    const tree = or();
    if (at < list.length) throw new Unsupported("Unexpected " + list[at].value);
    return tree;
  }

  // ------------------------------------------------------------ values
  const isDate = (v) => v instanceof Date;
  const DAY = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.]+Z?)?$/;
  function asDate(v) {
    if (isDate(v)) return v;
    if (typeof v === "string" && DAY.test(v)) {
      const d = new Date(v.length === 10 ? v + "T00:00:00" : v);
      if (!isNaN(d)) return d;
    }
    return null;
  }
  const empty = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
  const str = (v) => (v === null || v === undefined ? "" : isDate(v) ? v.toISOString().slice(0, 10) : Array.isArray(v) ? v.map(str).join(", ") : String(v));
  const truthy = (v) => !empty(v) && v !== false && v !== 0;

  /** "1 week", "3d", "-2M": a duration added to a date. */
  function shift(date, text, sign) {
    const m = /^\s*(-?\d+)\s*([a-zA-Z]+)\s*$/.exec(String(text));
    if (!m) throw new Unsupported("Duration " + text);
    const n = Number(m[1]) * sign;
    const unit = m[2];
    const d = new Date(date);
    if (/^(y|years?)$/.test(unit)) d.setFullYear(d.getFullYear() + n);
    else if (/^(M|months?)$/.test(unit)) d.setMonth(d.getMonth() + n);
    else if (/^(w|weeks?)$/.test(unit)) d.setDate(d.getDate() + 7 * n);
    else if (/^(d|days?)$/.test(unit)) d.setDate(d.getDate() + n);
    else if (/^(h|hours?)$/.test(unit)) d.setHours(d.getHours() + n);
    else if (/^(m|minutes?)$/.test(unit)) d.setMinutes(d.getMinutes() + n);
    else throw new Unsupported("Duration " + text);
    return d;
  }

  function compare(a, b) {
    const da = asDate(a);
    const db = asDate(b);
    if (da && db) return da - db;
    if (typeof a === "number" && typeof b === "number") return a - b;
    const na = Number(a);
    const nb = Number(b);
    if (str(a) !== "" && str(b) !== "" && !isNaN(na) && !isNaN(nb)) return na - nb;
    return str(a).localeCompare(str(b));
  }
  function equal(a, b) {
    if (empty(a) && empty(b)) return true;
    if (Array.isArray(a) || Array.isArray(b)) return str(a) === str(b);
    const da = asDate(a);
    const db = asDate(b);
    if (da && db) return +da === +db;
    if (typeof a === "boolean" || typeof b === "boolean") return a === b;
    return str(a) === str(b);
  }

  /** A link's or a tag's target, plain: "[[Note|x]]" → "note". */
  const linkName = (v) => {
    const s = str(v && v.path ? v.path : v).replace(/^\[\[|\]\]$/g, "").split("|")[0].replace(/\.md$/i, "");
    return s.slice(s.lastIndexOf("/") + 1).toLowerCase();
  };
  const tagName = (t) => str(t).replace(/^#/, "").toLowerCase();

  // A file as expressions see it.
  const FILE_FIELDS = ["name", "basename", "path", "folder", "ext", "tags", "links", "properties", "size", "ctime", "mtime"];
  function fileCall(file, name, args) {
    if (name === "inFolder") {
      const f = str(args[0] && args[0].path !== undefined ? args[0].path : args[0]).replace(/^\/+|\/+$/g, "");
      return f === "" || file.folder === f || file.folder.startsWith(f + "/");
    }
    if (name === "hasTag") {
      const have = (file.tags || []).map(tagName);
      return args.some((t) => have.some((h) => h === tagName(t) || h.startsWith(tagName(t) + "/")));
    }
    if (name === "hasLink") {
      const want = linkName(args[0]);
      return (file.links || []).some((l) => linkName(l) === want);
    }
    if (name === "hasProperty") return !empty((file.properties || {})[str(args[0])]);
    if (name === "asLink") return file;
    throw new Unsupported("file." + name);
  }

  function method(value, name, args) {
    if (value && value.__file) return fileCall(value, name, args);
    if (typeof value === "number") {
      if (name === "toFixed") return value.toFixed(Math.max(0, Math.min(20, Number(args[0]) || 0)));
      if (name === "round") {
        const k = 10 ** (Number(args[0]) || 0);
        return Math.round(value * k) / k;
      }
      if (name === "abs") return Math.abs(value);
      if (name === "ceil") return Math.ceil(value);
      if (name === "floor") return Math.floor(value);
    }
    if (name === "isEmpty") return empty(value);
    if (name === "toString") return str(value);
    if (Array.isArray(value)) {
      const items = value.map(str);
      if (name === "contains") return items.includes(str(args[0]));
      if (name === "containsAll") return args.every((a) => items.includes(str(a)));
      if (name === "containsAny") return args.some((a) => items.includes(str(a)));
      if (name === "join") return items.join(args.length ? str(args[0]) : ",");
      if (name === "slice") return value.slice(args[0], args[1]);
      if (name === "reverse") return value.slice().reverse();
      if (name === "sort") return value.slice().sort((a, b) => compare(a, b));
      if (name === "unique") return value.filter((v, i) => items.indexOf(str(v)) === i);
      if (name === "flat") return value.flat();
      throw new Unsupported("list." + name);
    }
    const text = str(value);
    if (name === "contains") return text.includes(str(args[0]));
    if (name === "containsAll") return args.every((a) => text.includes(str(a)));
    if (name === "containsAny") return args.some((a) => text.includes(str(a)));
    if (name === "startsWith") return text.startsWith(str(args[0]));
    if (name === "endsWith") return text.endsWith(str(args[0]));
    if (name === "lower") return text.toLowerCase();
    if (name === "upper") return text.toUpperCase();
    if (name === "trim") return text.trim();
    if (name === "slice") return text.slice(args[0], args[1]);
    if (name === "split") return text.split(str(args[0]));
    if (name === "replace") return text.split(str(args[0])).join(str(args[1]));
    if (name === "title") return text.replace(/\b\w/g, (c) => c.toUpperCase());
    throw new Unsupported("." + name);
  }

  function field(value, name) {
    if (value && value.__file) {
      if (!FILE_FIELDS.includes(name)) throw new Unsupported("file." + name);
      return value[name];
    }
    if (value && value.__note) return value.props[name];
    if (name === "length") return Array.isArray(value) ? value.length : str(value).length;
    if (isDate(value) || asDate(value)) {
      const d = asDate(value);
      const parts = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      if (name in parts) return parts[name];
    }
    if (value && typeof value === "object" && !Array.isArray(value)) return value[name];
    throw new Unsupported("." + name);
  }

  function run(node, ctx) {
    switch (node.t) {
      case "lit":
        return node.value;
      case "list":
        return node.items.map((n) => run(n, ctx));
      case "name":
        if (node.name === "file") return ctx.file;
        if (node.name === "this") return { __this: true, file: ctx.this };
        if (node.name === "note") return { __note: true, props: ctx.file.properties || {} };
        if (node.name === "formula") {
          if (!ctx.formulas) throw new Unsupported("formula");
          return { __formula: true };
        }
        return (ctx.file.properties || {})[node.name];
      case "get": {
        const on = run(node.on, ctx);
        if (on && on.__formula) return formula(node.name, ctx);
        if (on && on.__this) {
          if (node.name !== "file" || !on.file) throw new Unsupported("this." + node.name);
          return on.file;
        }
        return field(on, node.name);
      }
      case "index": {
        const on = run(node.on, ctx);
        const key = run(node.key, ctx);
        if (on && on.__note) return on.props[str(key)];
        if (Array.isArray(on)) return on[key < 0 ? on.length + key : key];
        if (on && typeof on === "object") return on[str(key)];
        return str(on)[key];
      }
      case "call":
        return method(run(node.on, ctx), node.name, node.args.map((a) => run(a, ctx)));
      case "fn": {
        const args = node.args.map((a) => run(a, ctx));
        if (node.name === "today") {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return d;
        }
        if (node.name === "now") return new Date();
        if (node.name === "date") return asDate(str(args[0])) || null;
        if (node.name === "list") return Array.isArray(args[0]) ? args[0] : empty(args[0]) ? [] : [args[0]];
        if (node.name === "if") return truthy(args[0]) ? args[1] : args.length > 2 ? args[2] : null;
        if (node.name === "link") return str(args[0]);
        if (node.name === "number") return Number(args[0]);
        throw new Unsupported(node.name + "()");
      }
      case "not":
        return !truthy(run(node.a, ctx));
      case "neg":
        return -run(node.a, ctx);
      case "and":
        return truthy(run(node.a, ctx)) && truthy(run(node.b, ctx));
      case "or":
        return truthy(run(node.a, ctx)) || truthy(run(node.b, ctx));
      case "cmp": {
        const a = run(node.a, ctx);
        const b = run(node.b, ctx);
        if (node.op === "==") return equal(a, b);
        if (node.op === "!=") return !equal(a, b);
        if (empty(a) || empty(b)) return false;
        const c = compare(a, b);
        return node.op === ">" ? c > 0 : node.op === "<" ? c < 0 : node.op === ">=" ? c >= 0 : c <= 0;
      }
      case "bin": {
        const a = run(node.a, ctx);
        const b = run(node.b, ctx);
        const date = asDate(a);
        if (date && (node.op === "+" || node.op === "-") && typeof b === "string" && !asDate(b))
          return shift(date, b, node.op === "+" ? 1 : -1);
        if (node.op === "-" && date && asDate(b)) return date - asDate(b);
        if (node.op === "+") return typeof a === "number" && typeof b === "number" ? a + b : str(a) + str(b);
        const x = Number(a);
        const y = Number(b);
        if (node.op === "-") return x - y;
        if (node.op === "*") return x * y;
        if (node.op === "/") return x / y;
        return x % y;
      }
      default:
        throw new Unsupported(node.t);
    }
  }

  /** A base's formula by name, worked out for this file: one formula may use
   *  another, never itself. */
  function formula(name, ctx) {
    const source = ctx.formulas[name];
    if (source === undefined) throw new Unsupported("formula." + name);
    const busy = ctx.busy || [];
    if (busy.includes(name)) throw new Unsupported("formula." + name + " uses itself");
    return compile(String(source))({ ...ctx, busy: busy.concat([name]) });
  }

  const cache = new Map();
  /** `source` as a test of a file: true, false, or Unsupported thrown. */
  function compile(source) {
    if (!cache.has(source)) {
      try {
        cache.set(source, { tree: parse(source) });
      } catch (err) {
        cache.set(source, { error: err });
      }
    }
    const got = cache.get(source);
    if (got.error) throw got.error;
    return (ctx) => run(got.tree, ctx);
  }

  /** A filter: a statement, or { and | or | not: [filters] }. Returns a test
   *  and the statements it left out (they pass). */
  function filterOf(filter) {
    const skipped = [];
    function build(f) {
      if (f === null || f === undefined) return () => true;
      if (typeof f === "string" || typeof f === "boolean" || typeof f === "number") {
        try {
          const test = compile(String(f));
          return (ctx) => {
            try {
              return truthy(test(ctx));
            } catch {
              return true;
            }
          };
        } catch {
          skipped.push(String(f));
          return () => true;
        }
      }
      if (typeof f !== "object") return () => true;
      if (Array.isArray(f.and)) {
        const parts = f.and.map(build);
        return (ctx) => parts.every((p) => p(ctx));
      }
      if (Array.isArray(f.or)) {
        const parts = f.or.map(build);
        return (ctx) => parts.length === 0 || parts.some((p) => p(ctx));
      }
      if (Array.isArray(f.not)) {
        const parts = f.not.map(build);
        return (ctx) => !parts.some((p) => p(ctx));
      }
      return () => true;
    }
    const test = build(filter);
    return { test, skipped };
  }

  /** A document as `file` for expressions: path relative to the open folder. */
  function fileOf(doc) {
    const path = doc.rel;
    const name = path.slice(path.lastIndexOf("/") + 1);
    const dot = name.lastIndexOf(".");
    const props = doc.frontmatter && typeof doc.frontmatter === "object" ? doc.frontmatter : {};
    const fmTags = [].concat(props.tags || props.tag || []).map(String);
    return {
      __file: true,
      path,
      name,
      basename: dot > 0 ? name.slice(0, dot) : name,
      ext: dot > 0 ? name.slice(dot + 1) : "",
      folder: path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "",
      tags: fmTags.concat((doc.tags || []).map((t) => (typeof t === "string" ? t : t.tag || ""))).filter(Boolean),
      links: (doc.links || []).map((l) => (typeof l === "string" ? l : l.target || l.link || l.path || "")).filter(Boolean),
      properties: props,
    };
  }

  /** Formula `name` for `ctx`, null when it can't be worked out. */
  function formulaValue(name, ctx) {
    try {
      return formula(name, ctx);
    } catch {
      return null;
    }
  }

  root.bexpr = { compile, filterOf, fileOf, formulaValue, Unsupported, str, truthy, asDate };
})(typeof window !== "undefined" ? window : globalThis);
