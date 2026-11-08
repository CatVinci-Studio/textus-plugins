// A Dataview query (DQL) as an Obsidian base: TABLE or LIST, FROM folders,
// tags and links, WHERE, SORT and LIMIT. What has no sure match in Bases is
// refused, naming the part, rather than turned into a different base.

/* global yaml */
(function (root) {
  const CLAUSES = ["from", "where", "sort", "limit", "group", "flatten"];
  const FILE = { name: "file.name", link: "file.name", folder: "file.folder", path: "file.path", ctime: "file.ctime", mtime: "file.mtime", tags: "file.tags", size: "file.size", ext: "file.ext" };
  const DAYS = { today: "today()", now: "now()", tomorrow: 'today() + "1d"', yesterday: 'today() - "1d"' };
  const NAME = /^[\p{L}_][\p{L}\p{N}_-]*$/u;

  class Refused extends Error {}
  const refuse = (part) => {
    throw new Refused(String(part).trim());
  };

  function tokenize(src) {
    const out = [];
    const re = /\s+|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\[\[[^\]]*\]\])|(#[\p{L}\p{N}_/-]+)|(\d+(?:\.\d+)?(?![\p{L}_]))|(\d[\p{L}\p{N}_:.-]*)|([\p{L}_][\p{L}\p{N}_-]*(?:\.[\p{L}_][\p{L}\p{N}_-]*)*)|(<=|>=|!=|=|<|>|!|\(|\)|,|\+|-|\*|\/|&|\|)/uy;
    let at = 0;
    while (at < src.length) {
      re.lastIndex = at;
      const m = re.exec(src);
      if (!m) refuse(src.slice(at).split(/\s/)[0]);
      const kind = m[1] ? "str" : m[2] ? "link" : m[3] ? "tag" : m[4] ? "num" : m[5] ? "word" : m[6] ? "id" : m[7] ? "op" : null;
      if (kind) out.push({ kind, value: m[0], at, end: re.lastIndex });
      at = re.lastIndex;
    }
    return out;
  }

  const word = (tok, w) => tok && tok.kind === "id" && tok.value.toLowerCase() === w;
  const unquote = (s) => (s[0] === "'" ? s.slice(1, -1).replace(/\\(.)/g, "$1") : JSON.parse(s));
  const linkTarget = (s) => s.slice(2, -2).split("|")[0].split("#")[0].trim();
  /** A property as Bases writes it in an expression. */
  const ref = (key) => (/^[A-Za-z_]\w*$/.test(key) ? key : "note[" + JSON.stringify(key) + "]");

  /** A column or sort key: a note's property or one of the file's own. */
  function columnId(text) {
    if (/^file\./i.test(text)) return FILE[text.slice(5)] || refuse(text);
    if (!NAME.test(text)) refuse(text);
    return text;
  }

  /** A field inside an expression. */
  function fieldExpr(text) {
    const self = /^this\./.test(text);
    const name = self ? text.slice(5) : text;
    if (/^file\./.test(name)) {
      const f = name.slice(5);
      if (!FILE[f] || f === "link") refuse(text);
      return (self ? "this." : "") + (f === "name" ? "file.basename" : FILE[f]);
    }
    if (self || !NAME.test(name)) refuse(text);
    return ref(name);
  }

  /** Expressions over `toks` (WHERE, FROM), each parser taking what it can. */
  function reader(toks, src) {
    let at = 0;
    const peek = () => toks[at];
    const isOp = (v) => peek() && peek().kind === "op" && peek().value === v;
    const take = (v) => (isOp(v) ? toks[at++] : null);
    const need = (v) => take(v) || refuse(peek() ? peek().value : v);
    const done = () => at >= toks.length;
    const takeWord = (w) => (word(peek(), w) ? toks[at++] : null);
    const raw = (from, to) => src.slice(toks[from].at, toks[to].end);

    // WHERE: nodes { t: "and" | "or" | "not" | "cmp" | "bin" | "val", ... }.
    function or() {
      let left = and();
      while (takeWord("or") || take("|")) left = { t: "or", a: left, b: and() };
      return left;
    }
    function and() {
      let left = not();
      while (takeWord("and") || take("&")) left = { t: "and", a: left, b: not() };
      return left;
    }
    function not() {
      if (take("!")) return { t: "not", a: not() };
      return cmp();
    }
    function cmp() {
      const left = add();
      const op = ["<=", ">=", "!=", "=", "<", ">"].find(isOp);
      if (!op) return left;
      at++;
      return { t: "cmp", op, a: left, b: add() };
    }
    function add() {
      let left = mul();
      for (let op; (op = ["+", "-"].find(isOp)); ) {
        at++;
        left = { t: "bin", op, a: left, b: mul() };
      }
      return left;
    }
    function mul() {
      let left = primary();
      for (let op; (op = ["*", "/"].find(isOp)); ) {
        at++;
        left = { t: "bin", op, a: left, b: primary() };
      }
      return left;
    }
    /** What is inside `name(...)`, as written. */
    function inner() {
      const open = at;
      let depth = 1;
      while (!done() && depth) {
        if (isOp("(")) depth++;
        if (isOp(")")) depth--;
        at++;
      }
      if (depth) refuse(raw(open - 2, at - 1));
      return at - 1 > open ? src.slice(toks[open].at, toks[at - 2].end).trim() : "";
    }
    function primary() {
      const tok = toks[at++];
      if (!tok) refuse("WHERE");
      if (tok.kind === "op" && tok.value === "(") {
        const e = or();
        need(")");
        return { t: "group", a: e };
      }
      if (tok.kind === "op" && tok.value === "-" && peek() && peek().kind === "num") return { t: "val", text: "-" + toks[at++].value };
      if (tok.kind === "str") return { t: "val", text: JSON.stringify(unquote(tok.value)) };
      if (tok.kind === "num") return { t: "val", text: tok.value };
      if (tok.kind === "link") return { t: "val", text: "link(" + JSON.stringify(linkTarget(tok.value)) + ")" };
      if (tok.kind !== "id") refuse(tok.value);
      const low = tok.value.toLowerCase();
      if (low === "true" || low === "false") return { t: "val", text: low };
      if (low === "null") return { t: "null" };
      if (!isOp("(")) return { t: "val", text: fieldExpr(tok.value), field: tok.value };
      at++;
      if (low === "date") {
        const arg = inner();
        const bare = arg.replace(/^["']|["']$/g, "");
        if (DAYS[bare.toLowerCase()]) return { t: "val", text: DAYS[bare.toLowerCase()], date: true };
        if (/^\d{4}-\d{2}-\d{2}(T[\d:.]+)?$/.test(bare)) return { t: "val", text: "date(" + JSON.stringify(bare) + ")", date: true };
        return refuse("date(" + arg + ")");
      }
      if (low === "dur") {
        const arg = inner().replace(/^["']|["']$/g, "");
        if (!/^\d+\s*[A-Za-z]+$/.test(arg)) refuse("dur(" + arg + ")");
        return { t: "val", text: JSON.stringify(arg), dur: true };
      }
      if (low === "contains") {
        const list = or();
        need(",");
        const item = or();
        need(")");
        return { t: "contains", a: list, b: item };
      }
      return refuse(tok.value + "()");
    }

    // FROM: "folder", #tag, [[link]], with and, or, - and ().
    function source() {
      let left = sourceAnd();
      while (takeWord("or") || take("|")) left = { t: "or", a: left, b: sourceAnd() };
      return left;
    }
    function sourceAnd() {
      let left = sourceNot();
      while (takeWord("and") || take("&")) left = { t: "and", a: left, b: sourceNot() };
      return left;
    }
    function sourceNot() {
      if (take("-") || take("!")) return { t: "not", a: sourceNot() };
      const tok = toks[at++];
      if (!tok) refuse("FROM");
      if (tok.kind === "op" && tok.value === "(") {
        const e = source();
        need(")");
        return { t: "group", a: e };
      }
      if (tok.kind === "str") {
        const path = unquote(tok.value).replace(/^\/+|\/+$/g, "");
        if (/\.md$/i.test(path)) return { t: "val", text: "file.path == " + JSON.stringify(path) };
        return { t: "val", text: "file.inFolder(" + JSON.stringify(path) + ")" };
      }
      if (tok.kind === "tag") return { t: "val", text: "file.hasTag(" + JSON.stringify(tok.value.slice(1)) + ")" };
      if (tok.kind === "link") {
        const target = linkTarget(tok.value);
        return { t: "val", text: target ? "file.hasLink(link(" + JSON.stringify(target) + "))" : "file.hasLink(this.file)" };
      }
      return refuse(tok.kind === "id" && isOp("(") ? tok.value + "()" : tok.value);
    }

    const end = () => done() || refuse(raw(at, toks.length - 1));
    return { or, source, end };
  }

  /** A WHERE or FROM tree as a Bases statement. */
  function emit(n) {
    switch (n.t) {
      case "val":
        if (n.dur) refuse(JSON.parse(n.text));
        return n.text;
      case "group":
        return "(" + emit(n.a) + ")";
      case "not": {
        const inner = emit(n.a);
        return "!" + (n.a.t === "val" || n.a.t === "group" || n.a.t === "contains" ? inner : "(" + inner + ")");
      }
      case "and":
      case "or": {
        const side = (x) => (x.t === "or" && n.t === "and" ? "(" + emit(x) + ")" : emit(x));
        return side(n.a) + (n.t === "and" ? " && " : " || ") + side(n.b);
      }
      case "cmp": {
        const op = n.op === "=" ? "==" : n.op;
        if (n.b.t === "null" || n.a.t === "null") {
          const x = n.b.t === "null" ? n.a : n.b;
          if (op === "==") return operand(x) + ".isEmpty()";
          if (op === "!=") return "!" + operand(x) + ".isEmpty()";
          refuse("null");
        }
        return operand(n.a) + " " + op + " " + operand(n.b);
      }
      case "contains": {
        if (n.a.field && /^file\.tags$/.test(n.a.field) && n.b.t === "val" && /^"#?[^"]+"$/.test(n.b.text))
          return "file.hasTag(" + JSON.stringify(JSON.parse(n.b.text).replace(/^#/, "")) + ")";
        return operand(n.a) + ".contains(" + operand(n.b) + ")";
      }
      case "null":
        return refuse("null");
      default:
        return refuse(n.t);
    }
  }
  /** A value in a comparison: arithmetic is only kept on numbers and on dates
   *  moved by a dur(). */
  function operand(n) {
    if (n.t === "bin") {
      if (n.b.dur && (n.op === "+" || n.op === "-")) return operand(n.a) + " " + n.op + " " + n.b.text;
      if (n.a.dur || n.b.dur) refuse(n.op);
      const side = (x) => (x.t === "bin" ? "(" + operand(x) + ")" : operand(x));
      return side(n.a) + " " + n.op + " " + side(n.b);
    }
    if (n.t === "group") return "(" + operand(n.a) + ")";
    if (n.t === "val" && n.dur) refuse("dur(" + JSON.parse(n.text) + ")");
    if (n.t !== "val") refuse(emit(n));
    return n.text;
  }

  /** A tree's top-level "and"s as separate statements. */
  const conjuncts = (n) => (n.t === "and" ? conjuncts(n.a).concat(conjuncts(n.b)) : n.t === "group" ? conjuncts(n.a) : [emit(n)]);

  /** Columns: `field [AS alias]`, by commas. */
  function columns(toks, src) {
    const out = [];
    let start = 0;
    for (let i = 0; i <= toks.length; i++) {
      if (i < toks.length && !(toks[i].kind === "op" && toks[i].value === ",")) continue;
      const part = toks.slice(start, i);
      start = i + 1;
      if (!part.length) {
        if (i < toks.length) refuse(",");
        continue;
      }
      const text = src.slice(part[0].at, part[part.length - 1].end);
      const as = part.findIndex((t) => word(t, "as"));
      const field = as < 0 ? part : part.slice(0, as);
      if (field.length !== 1 || field[0].kind !== "id") refuse(as < 0 ? text : src.slice(field[0].at, field[field.length - 1].end));
      let alias = null;
      if (as >= 0) {
        const rest = part.slice(as + 1);
        if (rest.length !== 1 || (rest[0].kind !== "str" && rest[0].kind !== "id")) refuse(text);
        alias = rest[0].kind === "str" ? unquote(rest[0].value) : rest[0].value;
      }
      out.push({ id: columnId(field[0].value), alias });
    }
    return out;
  }

  /** `SORT a [ASC|DESC], b ...`. */
  function sorts(toks, src) {
    const out = [];
    let start = 0;
    for (let i = 0; i <= toks.length; i++) {
      if (i < toks.length && !(toks[i].kind === "op" && toks[i].value === ",")) continue;
      const part = toks.slice(start, i);
      start = i + 1;
      if (!part.length || part[0].kind !== "id") refuse("SORT " + src.slice(toks[0].at, toks[toks.length - 1].end));
      const dir = part[1] ? part[1].value.toLowerCase() : "asc";
      if (part.length > 2 || !["asc", "ascending", "desc", "descending"].includes(dir))
        refuse(src.slice(part[0].at, part[part.length - 1].end));
      out.push({ property: columnId(part[0].value), direction: dir.startsWith("desc") ? "DESC" : "ASC" });
    }
    return out;
  }

  /** The query's clauses: its header's tokens, then each FROM, WHERE... */
  function split(toks) {
    const parts = [{ name: "head", toks: [] }];
    let depth = 0;
    for (let i = 0; i < toks.length; i++) {
      const tok = toks[i];
      if (tok.kind === "op" && tok.value === "(") depth++;
      if (tok.kind === "op" && tok.value === ")") depth--;
      const low = tok.kind === "id" ? tok.value.toLowerCase() : "";
      if (!depth && CLAUSES.includes(low) && (low !== "group" || word(toks[i + 1], "by"))) {
        parts.push({ name: low, toks: [], at: tok.at });
        if (low === "group") i++;
        continue;
      }
      parts[parts.length - 1].toks.push(tok);
    }
    return parts;
  }

  /** `{ yaml, warnings }` for a base doing what `query` does, or `{ error }`
   *  naming the part that can't be carried over. */
  function toBase(query) {
    const warnings = [];
    const src = String(query)
      .split("\n")
      .filter((line) => {
        if (!/^\s*\/\//.test(line)) return true;
        warnings.push(line.trim());
        return false;
      })
      .join("\n");
    try {
      const parts = split(tokenize(src));
      const clause = (p, i) => src.slice(p.at, i < parts.length - 1 ? parts[i + 1].at : src.length).trim();
      const head = parts[0].toks;
      const kind = head[0] ? head[0].value.toLowerCase() : "";
      if (kind !== "table" && kind !== "list") refuse(head[0] ? head[0].value : src);
      const withoutId = word(head[1], "without") && word(head[2], "id");
      const rest = head.slice(withoutId ? 3 : 1);
      const cols = rest.length ? columns(rest, src) : [];
      if (kind === "list" && cols.length > 1) refuse(src.slice(rest[0].at, rest[rest.length - 1].end));

      const view = { type: kind, name: kind === "table" ? "Table" : "List" };
      const order = (withoutId ? [] : ["file.name"]).concat(cols.map((c) => c.id).filter((id) => withoutId || id !== "file.name"));
      if (order.length) view.order = order;
      const props = {};
      for (const c of cols) if (c.alias) props[c.id] = { displayName: c.alias };

      const where = [];
      let from = null;
      parts.slice(1).forEach((p, i) => {
        const text = clause(p, i + 1);
        if (p.name === "group" || p.name === "flatten") refuse(text);
        if (view.limit && p.name !== "limit") refuse(text);
        if (p.name === "from") {
          if (from || i > 0) refuse(text);
          const r = reader(p.toks, src);
          from = r.source();
          r.end();
        } else if (p.name === "where") {
          const r = reader(p.toks, src);
          const tree = r.or();
          r.end();
          where.push(...conjuncts(tree));
        } else if (p.name === "sort") {
          if (view.sort) refuse(text);
          view.sort = sorts(p.toks, src);
        } else if (p.name === "limit") {
          if (view.limit || p.toks.length !== 1 || !/^\d+$/.test(p.toks[0].value) || !Number(p.toks[0].value)) refuse(text);
          view.limit = Number(p.toks[0].value);
        }
      });
      if (where.length) view.filters = { and: where };
      const out = from ? { filters: { and: conjuncts(from) } } : {};
      if (Object.keys(props).length) out.properties = props;
      out.views = [view];
      return { yaml: yaml.stringify(out), warnings };
    } catch (err) {
      if (err instanceof Refused) return { error: err.message || String(query).trim() };
      throw err;
    }
  }

  /** The query in a fenced ```dataview block's Markdown; `{ error }` for a
   *  ```dataviewjs one, null for any other block. */
  function blockQuery(markdown) {
    const m = /^(`{3,}|~{3,})[ \t]*([\w-]+)[^\n]*\n([\s\S]*?)\n?\1[`~]*\s*$/.exec(String(markdown).trim());
    if (!m) return null;
    const lang = m[2].toLowerCase();
    if (lang === "dataviewjs") return { error: "dataviewjs" };
    return lang === "dataview" ? { query: m[3] } : null;
  }

  root.dataview = { toBase, blockQuery };
})(typeof window !== "undefined" ? window : globalThis);
