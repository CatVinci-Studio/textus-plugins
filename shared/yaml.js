// The YAML a base is written in (Obsidian Bases): block maps and lists by
// indentation, "- " items that are values or maps, [a, b] and {a: b} on one
// line, quoted and plain values, "|" and ">" blocks, comments. Written back
// as Obsidian writes it: two spaces, lists under their key.

(function (root) {
  /** Text without its comment: a "#" at the start or after a space, outside quotes. */
  function uncomment(line) {
    let quote = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (quote) {
        if (c === "\\" && quote === '"') i++;
        else if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === "#" && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i).trimEnd();
    }
    return line.trimEnd();
  }

  function scalar(text) {
    const t = text.trim();
    if (t === "" || t === "~" || t === "null") return null;
    if (t === "true") return true;
    if (t === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    if (t[0] === "'" && t.endsWith("'") && t.length > 1) return t.slice(1, -1).replace(/''/g, "'");
    if (t[0] === '"' && t.endsWith('"') && t.length > 1) {
      try {
        return JSON.parse(t);
      } catch {
        return t.slice(1, -1);
      }
    }
    if (t[0] === "[" || t[0] === "{") return flow(t);
    return t;
  }

  /** `[a, "b, c", [d]]` or `{a: 1, b: x}`, on one line. */
  function flow(text) {
    let i = 0;
    const s = text.trim();
    const space = () => {
      while (i < s.length && /\s/.test(s[i])) i++;
    };
    function value(stops) {
      space();
      if (s[i] === "[") {
        i++;
        const out = [];
        space();
        if (s[i] === "]") return i++, out;
        for (;;) {
          out.push(value(",]"));
          space();
          if (s[i] === ",") i++;
          else {
            i++;
            return out;
          }
        }
      }
      if (s[i] === "{") {
        i++;
        const out = {};
        space();
        if (s[i] === "}") return i++, out;
        for (;;) {
          const key = String(value(":,}"));
          space();
          if (s[i] === ":") i++;
          out[key] = value(",}");
          space();
          if (s[i] === ",") i++;
          else {
            i++;
            return out;
          }
        }
      }
      if (s[i] === '"' || s[i] === "'") {
        const q = s[i];
        let j = i + 1;
        while (j < s.length && (s[j] !== q || (q === "'" && s[j + 1] === "'")))
          j += (s[j] === "\\" && q === '"') || (q === "'" && s[j] === "'") ? 2 : 1;
        const raw = s.slice(i, j + 1);
        i = j + 1;
        return scalar(raw);
      }
      const start = i;
      while (i < s.length && !stops.includes(s[i])) i++;
      return scalar(s.slice(start, i));
    }
    return value("");
  }

  /** "key: value" at the line's start: the key and what follows it. */
  function keyOf(text) {
    const m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^:#'"][^:]*?)\s*:(?:\s+(.*)|$)/.exec(text);
    if (!m) return null;
    return { key: String(scalar(m[1])), rest: m[2] === undefined ? "" : m[2] };
  }

  function parse(source) {
    const lines = String(source)
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((raw) => ({ indent: raw.length - raw.trimStart().length, raw }));
    let at = 0;
    const meaningful = (l) => uncomment(l.raw).trim() !== "";
    const skip = () => {
      while (at < lines.length && !meaningful(lines[at])) at++;
    };

    /** A "|" or ">" block: the lines indented past `indent`. */
    function block(style, indent) {
      const kept = [];
      let inner = null;
      while (at < lines.length) {
        const l = lines[at];
        if (l.raw.trim() === "") {
          kept.push("");
          at++;
          continue;
        }
        if (l.indent <= indent) break;
        if (inner === null) inner = l.indent;
        kept.push(l.raw.slice(inner));
        at++;
      }
      while (kept.length && kept[kept.length - 1] === "") kept.pop();
      const text = style[0] === ">" ? kept.join(" ").replace(/ {2,}/g, " ") : kept.join("\n");
      // "|" keeps one line end, "|-" none.
      return style.endsWith("-") || !text ? text : text + "\n";
    }

    /** The value after "key:" or "- ": inline, a block, or the lines below. */
    function after(rest, indent) {
      if (/^[|>][-+]?$/.test(rest.trim())) return block(rest.trim(), indent);
      if (rest.trim() !== "") return scalar(rest);
      skip();
      if (at < lines.length && lines[at].indent > indent) return node(lines[at].indent);
      // A list may sit at its key's own indent.
      if (at < lines.length && lines[at].indent === indent && /^-(\s|$)/.test(lines[at].raw.trim()))
        return node(indent);
      return null;
    }

    function node(indent) {
      skip();
      if (at >= lines.length) return null;
      const first = uncomment(lines[at].raw).trim();
      if (/^-(\s|$)/.test(first)) {
        const out = [];
        while (at < lines.length) {
          skip();
          if (at >= lines.length || lines[at].indent !== indent) break;
          const text = uncomment(lines[at].raw).trim();
          if (!/^-(\s|$)/.test(text)) break;
          const item = text.slice(1).trimStart();
          const itemIndent = indent + (text.length - item.length);
          at++;
          const pair = item && item[0] !== "[" && item[0] !== "{" && item[0] !== '"' && item[0] !== "'" ? keyOf(item) : null;
          if (pair) {
            // "- key: value" and the keys under it: one map.
            const map = {};
            map[pair.key] = after(pair.rest, itemIndent);
            skip();
            if (at < lines.length && lines[at].indent === itemIndent && !/^-(\s|$)/.test(lines[at].raw.trim()))
              Object.assign(map, node(itemIndent));
            out.push(map);
          } else out.push(item === "" ? after("", indent) : after(item, itemIndent));
        }
        return out;
      }
      const out = {};
      while (at < lines.length) {
        skip();
        if (at >= lines.length || lines[at].indent !== indent) break;
        const text = uncomment(lines[at].raw).trim();
        const pair = keyOf(text);
        if (!pair) {
          at++;
          continue;
        }
        at++;
        out[pair.key] = after(pair.rest, indent);
      }
      return out;
    }

    skip();
    if (at >= lines.length) return {};
    return node(lines[at].indent);
  }

  // ------------------------------------------------------------- write
  const PLAIN = /^[^\s\-?:,[\]{}#&*!|>'"%@`][^:#]*$/;

  function quote(value) {
    const s = String(value);
    if (s !== "" && PLAIN.test(s) && s === s.trim() && !/:\s|\s#/.test(s) && typeof scalar(s) === "string") return s;
    if (!s.includes("'")) return "'" + s + "'";
    return JSON.stringify(s);
  }

  function inline(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return "[" + value.map(inline).join(", ") + "]";
    if (typeof value === "object")
      return "{" + Object.entries(value).map(([k, v]) => quote(k) + ": " + inline(v)).join(", ") + "}";
    return quote(value);
  }

  const simple = (v) => v === null || typeof v !== "object" || (Array.isArray(v) && v.length === 0) || (!Array.isArray(v) && Object.keys(v).length === 0);

  function lines(value, indent) {
    const pad = " ".repeat(indent);
    const out = [];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && !Array.isArray(item) && Object.keys(item).length) {
          const inner = lines(item, indent + 2);
          out.push(pad + "- " + inner[0].trimStart(), ...inner.slice(1));
        } else if (Array.isArray(item) && item.length) {
          out.push(pad + "- " + inline(item));
        } else out.push(pad + "- " + (Array.isArray(item) ? "[]" : item && typeof item === "object" ? "{}" : inline(item)));
      }
      return out;
    }
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined) continue;
      if (typeof v === "string" && v.includes("\n")) {
        const ends = v.endsWith("\n") && !v.endsWith("\n\n");
        out.push(pad + quote(key) + ": |" + (ends ? "" : "-"));
        for (const l of (ends ? v.slice(0, -1) : v).split("\n")) out.push(l ? pad + "  " + l : "");
      } else if (simple(v)) out.push(pad + quote(key) + ":" + (v === null ? "" : " " + (Array.isArray(v) ? "[]" : typeof v === "object" ? "{}" : inline(v))));
      else {
        out.push(pad + quote(key) + ":");
        out.push(...lines(v, indent + 2));
      }
    }
    return out;
  }

  /** `value` as YAML text. */
  function stringify(value) {
    if (!value || typeof value !== "object") return inline(value) + "\n";
    return lines(value, 0).join("\n") + "\n";
  }

  root.yaml = { parse, stringify };
})(typeof window !== "undefined" ? window : globalThis);
