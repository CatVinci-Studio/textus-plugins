// Notion Import: one page converted - its links pointed at where their
// targets went, callouts, properties as front matter, a database as its
// page and its views. Runs after notion-layout.js.

(function (root) {
  const N = root.notionCsv;
  const { splitExt, dirOf, baseOf, joinPath } = root.notionLayout;

  function relative(fromDir, to) {
    const a = fromDir ? fromDir.split("/") : [];
    const b = to.split("/");
    let i = 0;
    while (i < a.length && i < b.length - 1 && a[i] === b[i]) i++;
    return a.slice(i).map(() => "..").concat(b.slice(i)).join("/");
  }

  const encodeLink = (path) => path.replace(/[%() <>#?]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));

  function decode(text) {
    try {
      return decodeURIComponent(text);
    } catch {
      return text;
    }
  }

  function resolve(dir, link) {
    const out = dir ? dir.split("/") : [];
    for (const part of link.split("/")) {
      if (part === "..") out.pop();
      else if (part && part !== ".") out.push(part);
    }
    return out.join("/");
  }

  const NOTION_URL = /^https?:\/\/(?:www\.)?notion\.(?:so|site)\//i;
  const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

  /** `change` applied outside fenced blocks and inline code spans. */
  function outsideCode(text, change) {
    const parts = text.split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?(?:^(?:```|~~~)[ \t]*$|(?![\s\S])))/m);
    return parts
      .map((part, i) => {
        if (i % 2) return part;
        return part
          .split(/(`+[^`\n]*?`+)/)
          .map((bit, j) => (j % 2 ? bit : change(bit)))
          .join("");
      })
      .join("");
  }

  /** Links into the export (relative, or notion.so with an id it has) follow the page from `from`
   *  to `to`; others stay. `found` hears each: kind "page", "file", "missing" or "web". */
  function rewriteLinks(text, from, to, layout, found) {
    const note = found || (() => {});
    const newDir = dirOf(to);
    const local = (target) => {
      const hash = target.search(/[#?]/);
      const path = hash < 0 ? target : target.slice(0, hash);
      const rest = hash < 0 ? "" : target.slice(hash);
      if (NOTION_URL.test(target)) {
        const at = layout.byId.get(N.idOf(path));
        return at ? { at, rest: "" } : null;
      }
      if (SCHEME.test(target)) return null;
      const full = resolve(dirOf(from), decode(path));
      const at = layout.files.get(full) || layout.byId.get(N.idOf(full));
      return at ? { at, rest } : undefined;
    };
    return outsideCode(text, (part) =>
      // Link text may hold a [pair], a target a (pair): titles like "[WIP] Plan (v2)".
      part.replace(/(!?\[(?:[^[\]\n]|\[[^[\]\n]*\])*\]\()(<[^>\n]+>|(?:[^()\s]|\([^()\s]*\))+)((?:\s+"[^"\n]*")?\))/g, (all, open, raw, close) => {
        const target = raw.startsWith("<") ? raw.slice(1, -1) : raw;
        if (!target || target.startsWith("#")) return all;
        const hit = local(target);
        if (hit === null) {
          note({ target, kind: "web" });
          return all;
        }
        if (!hit) {
          note({ target: decode(target), kind: "missing" });
          return all;
        }
        const page = /\.md$/i.test(hit.at);
        note({ target: hit.at, kind: page ? "page" : "file" });
        // A page linked as the folder writes links: [[Page]], as a new subpage's is.
        if (page && layout.links && !open.startsWith("!")) {
          const name = layout.links.get(hit.at);
          const label = open.slice(1, -2);
          const heading = hit.rest.startsWith("#") && !NOTION_URL.test(target) ? decode(hit.rest) : "";
          return "[[" + name + heading + (label && label !== name ? "|" + label : "") + "]]";
        }
        return open + encodeLink(relative(newDir, hit.at)) + hit.rest + close;
      }),
    );
  }

  /** Each page's name in a [[link]]: its own where no other imported page
   *  shares it, else its path from the link root (`links.base`, the import's
   *  folder there). */
  function wikiNames(layout, links) {
    const pages = [...new Set(layout.files.values())].filter((at) => /\.md$/i.test(at));
    const count = new Map();
    const stem = (at) => baseOf(at).replace(/\.md$/i, "");
    for (const at of pages) count.set(stem(at), (count.get(stem(at)) || 0) + 1);
    const names = new Map();
    for (const at of pages)
      names.set(at, count.get(stem(at)) > 1 ? joinPath(links.base, at.replace(/\.md$/i, "")) : stem(at));
    return names;
  }

  const EMOJI = /^\p{Extended_Pictographic}/u;

  /** Callouts (`<aside>`) as GitHub notes, `> [!NOTE]`, their emoji kept; an icon that is one of
   *  Notion's own pictures goes. `found` hears "callout" and "icon". */
  function convertCallouts(text, found) {
    const note = found || (() => {});
    return outsideCode(text, (part) =>
      part.replace(/^<aside>[ \t]*\n?([\s\S]*?)\n?[ \t]*<\/aside>[ \t]*$/gm, (all, inner) => {
        note("callout");
        let lines = inner.split("\n");
        let icon = "";
        // Notion puts the icon before the first words, or on a line of its own.
        const first = lines.findIndex((l) => l.trim());
        const img = first < 0 ? null : /^\s*<img\b[^>]*>[ \t]*/i.exec(lines[first]);
        if (img) {
          const alt = (/\balt="([^"]*)"/i.exec(img[0]) || [])[1] || "";
          if (EMOJI.test(alt)) icon = alt;
          else note("icon");
          lines[first] = lines[first].slice(img[0].length);
        }
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        lines = lines.map((l) => l.trimEnd());
        if (icon) lines[0] = icon + " " + (lines[0] || "");
        return ["> [!NOTE]"].concat(lines.map((l) => (l ? "> " + l : ">"))).join("\n");
      }),
    );
  }

  const RESERVED = /^(?:true|false|yes|no|on|off|null|~)$/i;

  function yamlScalar(value) {
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    const s = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const plain =
      /^[\p{L}\p{N}][^\n:#]*$/u.test(s) && !/\s$/.test(s) && !RESERVED.test(s) && !/^[-+.\d][\d.eE+-]*$/.test(s);
    return plain ? s : JSON.stringify(s);
  }

  function frontMatter(props) {
    const lines = [];
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === "") continue;
      if (Array.isArray(value)) {
        if (!value.length) continue;
        lines.push(key + ":");
        for (const item of value) lines.push("  - " + yamlScalar(item));
      } else lines.push(key + ": " + yamlScalar(value));
    }
    return lines.length ? "---\n" + lines.join("\n") + "\n---\n" : "";
  }

  function propertyValue(text) {
    const range = N.rangeOf(text);
    if (range) return range;
    const relation = N.relationItems(text);
    if (relation) return relation.map((item) => ({ relation: item }));
    return N.cellValue(text, false);
  }

  /** Props with each `{ relation }` as a link from the document at `to`. */
  function linkRelations(props, to, layout, found) {
    const out = {};
    const link = (item) => {
      const md = "[" + item.title + "](" + item.target + ")";
      const fixed = rewriteLinks(md, layout.from || "", to, layout, found);
      return fixed === md && !layout.files.has(item.target) ? item.title : fixed;
    };
    for (const [key, value] of Object.entries(props)) {
      if (value && typeof value === "object" && "start" in value) {
        out[key] = value.start;
        out[key + "_end"] = value.end;
      } else if (Array.isArray(value)) out[key] = value.map((v) => (v && v.relation ? link(v.relation) : v));
      else out[key] = value;
    }
    return out;
  }

  // Whole words of a key: "problem_statement" isn't a status.
  const STATUS = /(?:^|_)(?:status|state|stage|estado|statut|état|zustand|статус)(?:_|$)|状态|狀態|阶段|階段|ステータス|상태/i;

  /** A status-like property, else text with a few values said again and again; null for none. */
  function boardKey(rows) {
    const keys = [];
    for (const row of rows) for (const k of Object.keys(row.props)) if (!keys.includes(k)) keys.push(k);
    const selects = keys.filter((k) => {
      const said = rows.map((r) => r.props[k]).filter((v) => v !== undefined && v !== null);
      if (!said.length || !said.every((v) => typeof v === "string" && v.length <= 40 && !/^\d{4}-\d{2}-\d{2}$/.test(v) && !/^\[/.test(v))) return false;
      const values = new Set(said);
      return values.size <= 10 && (STATUS.test(k) || values.size < said.length);
    });
    return selects.find((k) => STATUS.test(k)) || selects[0] || null;
  }

  function dateKey(rows) {
    const keys = [];
    for (const row of rows) for (const k of Object.keys(row.props)) if (!keys.includes(k)) keys.push(k);
    return (
      keys.find((k) => {
        if (k.endsWith("_end")) return false;
        const said = rows.map((r) => r.props[k]).filter((v) => v !== undefined && v !== null);
        return said.length > 0 && said.every((v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v));
      }) || null
    );
  }

  /** A database's page: its base, the views a click apart - a board first when the rows have a
   *  status, then the table, and a calendar when they have dates. */
  function databasePage(name, rows) {
    const B = root.database;
    const group = boardKey(rows);
    const date = dateKey(rows);
    let base = B.unitBase(group ? "board" : "table");
    if (group) {
      base = B.setView(base, 0, { group });
      base = B.addView(base, "table", B.viewName("table"));
    }
    if (date) {
      base = B.addView(base, "calendar", B.viewName("calendar"));
      const end = rows.some((r) => r.props[date + "_end"]) ? date + "_end" : null;
      base = B.setView(base, base.views.length - 1, { date, end });
    }
    return { text: "# " + name + "\n\n```base\n" + B.writeBase(base) + "```\n", group, date };
  }

  const VIEW_LINK = /^\s*\[[^\]\n]*\]\(([^)\s]+?\.csv)\)\s*$/i;

  /** Newer exports show a database where a page has it as a link to its CSV, then the view's
   *  "filters:" (property names only) and "sort:" lines. Each becomes the link to the database's
   *  page and a ```database block showing it, sorted as it was; the database's own page (`own`,
   *  its folder) keeps only the link. */
  function convertViews(text, from, to, layout, own) {
    if (!layout.databases.length) return text;
    const lines = text.split("\n");
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      const m = VIEW_LINK.exec(lines[i]);
      const id = m && N.idOf(splitExt(baseOf(decode(m[1]))).stem.replace(/_all$/, ""));
      const db = id && layout.databases.find((d) => d.id === id);
      if (!db) {
        out.push(lines[i]);
        continue;
      }
      const sort = [];
      let k = i + 1;
      while (k < lines.length && !lines[k].trim()) k++;
      if (k < lines.length && /^(filters|sort):\s*$/i.test(lines[k].trim())) {
        let mode = null;
        for (; k < lines.length && lines[k].trim(); k++) {
          const t = lines[k].trim();
          const head = /^(filters|sort):\s*$/i.exec(t);
          if (head) mode = head[1].toLowerCase();
          const by = mode === "sort" && /^(.+?):\s*(ascending|descending)$/i.exec(t);
          if (by) sort.push((/^d/i.test(by[2]) ? "-" : "") + N.propertyName(by[1]));
        }
        i = k - 1;
      }
      if (db.folder === own) continue;
      // Another page's view of the database: its rows by the folder's path in the open folder.
      const B = root.database;
      let base = { filters: { and: B.folderRows(dirOf(to), db.folder) }, views: [{ type: "table", name: B.viewName("table") }] };
      if (sort.length) base = B.setView(base, 0, { sort: sort.map((k) => (k.startsWith("-") ? { key: k.slice(1), desc: true } : { key: k, desc: false })) });
      out.push(m[0].trim(), "", "```base", B.writeBase(base).replace(/\n$/, ""), "```");
    }
    return out.join("\n").replace(/\n{3,}/g, "\n\n");
  }

  const TODO = /^\s*[-*+] \[[ xX]\] /gm;
  const BOOKMARK = /^\s*(?:\[[^\]\n]*\]\((https?:[^)\s]+)\)|<?(https?:\/\/\S+?)>?)\s*$/gm;
  const TEMPLATE = /template|模板|範本|テンプレート|템플릿|plantilla|modèle|vorlage|шаблон|modelo/i;

  function convertPage(body, title, props, from, to, layout, found, own) {
    let text = convertCallouts(convertViews(body, from, to, layout, own), (kind) => found.block(kind, to));
    text = rewriteLinks(text, from, to, layout, (link) => found.link(link, to));
    found.todos((text.match(TODO) || []).length);
    for (const m of text.matchAll(BOOKMARK)) if (!NOTION_URL.test(m[1] || m[2])) found.url();
    const fm = frontMatter(linkRelations(props, to, { ...layout, from }, (link) => found.link(link, to)));
    return fm + "# " + title + "\n" + (text ? "\n" + text + "\n" : "");
  }

  /** Each row's page, or null: by file name, else by the page's own title (Notion cuts long names
   *  and swaps / : ? in them); rows sharing a name take the page whose properties agree. */

  root.notionPages = {
    EMOJI,
    SCHEME,
    TEMPLATE,
    boardKey,
    convertCallouts,
    convertPage,
    databasePage,
    dateKey,
    decode,
    encodeLink,
    frontMatter,
    linkRelations,
    propertyValue,
    relative,
    resolve,
    rewriteLinks,
    wikiNames,
  };
})(typeof window !== "undefined" ? window : globalThis);
