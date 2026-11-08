// Notion Import: a Notion export ("Markdown & CSV") as a Textus folder. No textus.* calls here,
// so the tests drive it directly; paths are `/`-separated. Runs after lib/notion-csv.js.

(function (root) {
  const N = root.notionCsv;

  const NAME_MAX = 100;
  // ext4 takes 255 bytes a name: room left for " 2" and an extension.
  const NAME_BYTES = 200;
  const utf8 = new TextEncoder();

  /** A name as a file or folder name on every system: Notion's id gone,
   *  NFC, no characters Windows refuses, not too long. */
  function cleanName(name) {
    const safe = N.withoutId(name).normalize("NFC").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").trim();
    // By code points, so an emoji is never cut in half.
    const all = Array.from(safe);
    const chars = all.slice(0, NAME_MAX);
    while (utf8.encode(chars.join("")).length > NAME_BYTES) chars.pop();
    // A name cut short ends at a word, not inside one.
    const space = chars.lastIndexOf(" ");
    if (chars.length < all.length && all[chars.length] !== " " && space > chars.length - 20) chars.length = space;
    return chars.join("").trim().replace(/[. ]+$/, "") || "Untitled";
  }

  const dirOf = (path) => (path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "");
  const baseOf = (path) => path.slice(path.lastIndexOf("/") + 1);
  const joinPath = (dir, name) => (dir ? dir + "/" + name : name);

  /** A file name's stem and extension ("a.b.png" is "a.b" and ".png"). */
  function splitExt(name) {
    const m = /^(.+?)(\.[A-Za-z0-9]{1,8})?$/.exec(name);
    return { stem: m[1], ext: m[2] || "" };
  }

  const counted = new WeakMap();

  /** `base`, or `base 2`, `base 3`…: the first whose every name (base
   *  plus each of `suffixes`) is free in `taken`, which keeps them. */
  function unique(taken, base, suffixes) {
    // Where the last search for these names ended: every number below it is still taken.
    const next = counted.get(taken) || counted.set(taken, new Map()).get(taken);
    const key = [base.toLowerCase()].concat(suffixes).join("\n");
    for (let n = next.get(key) || 1; ; n++) {
      const name = n === 1 ? base : base + " " + n;
      const names = suffixes.map((s) => (name + s).toLowerCase());
      if (names.some((x) => taken.has(x))) continue;
      names.forEach((x) => taken.add(x));
      next.set(key, n + 1);
      return name;
    }
  }

  /** Where each file goes: `Title <id>.md` and its folder become `Title.md` and `Title/`, as Pages
   *  has them; a database CSV becomes a page beside its rows' folder; `copies` are attachments. */
  function plan(paths, titles = new Map()) {
    const files = new Map();
    const copies = new Set();
    const byId = new Map();
    const databases = [];
    const taken = new Map();
    const children = new Map();
    const child = (dir) => children.get(dir) || children.set(dir, { files: [], dirs: new Set() }).get(dir);
    for (const path of paths) {
      child(dirOf(path)).files.push(baseOf(path));
      for (let d = dirOf(path); d; d = dirOf(d)) child(dirOf(d)).dirs.add(baseOf(d));
    }

    // `rows`: the folder holds a database's rows, which stay files in it - a row with a folder of
    // its own keeps the older layout (Row.md beside Row/), or it would leave the database.
    function walk(oldDir, newDir, rows) {
      const here = children.get(oldDir) || { files: [], dirs: new Set() };
      const used = new Set();
      taken.set(newDir, used);
      // Pages, their folders and databases first, by the name they share.
      const groups = new Map();
      const group = (key) => groups.get(key) || groups.set(key, { page: null, csv: [], dir: null }).get(key);
      const attachments = [];
      for (const name of here.files) {
        const { stem, ext } = splitExt(name);
        const key = /^\.csv$/i.test(ext) ? stem.replace(/_all$/, "") : stem;
        // Notion's pages and databases end in an id; an attached file keeps its own name.
        if (!/^\.(md|csv)$/i.test(ext) || !N.idOf(key)) attachments.push(name);
        else if (/^\.md$/i.test(ext)) group(key).page = name;
        else group(key).csv.push(name);
      }
      for (const name of here.dirs) {
        // Newer exports name a page's folder without its id: it is the folder of the one page or
        // database here whose name it is.
        // Two of one name tell their folders apart by the id's first and last four ("Notes b606-ff8f").
        const short = /^(.*) ([0-9a-f]{4})-([0-9a-f]{4})$/i.exec(name);
        const owns = (k) =>
          !groups.get(k).dir &&
          (short
            ? N.withoutId(k) === short[1] && (N.idOf(k) || "").replace(/-/g, "").toLowerCase().startsWith(short[2].toLowerCase()) && (N.idOf(k) || "").replace(/-/g, "").toLowerCase().endsWith(short[3].toLowerCase())
            : N.withoutId(k) === name);
        const owners = groups.has(name) || N.idOf(name) ? [] : [...groups.keys()].filter(owns);
        group(owners.length === 1 ? owners[0] : name).dir = name;
      }
      // Two that Notion named alike take their own titles ("Notes (Fall)", "Notes (Spring)").
      const alike = new Map();
      for (const key of groups.keys()) alike.set(cleanName(key), (alike.get(cleanName(key)) || 0) + 1);
      for (const key of [...groups.keys()].sort()) {
        const g = groups.get(key);
        const title = g.page && titles.get(joinPath(oldDir, g.page));
        const base = alike.get(cleanName(key)) > 1 && title ? cleanName(title) : cleanName(key);
        const stem = unique(used, base, [".md", ""]);
        const id = N.idOf(key);
        // A page with sub-pages, and every database, is a folder unit: Plans/Plans.md beside what
        // it holds. A page without is a file on its own.
        const unit = !!(g.csv.length || (g.dir && !rows));
        const own = unit ? joinPath(joinPath(newDir, stem), stem + ".md") : joinPath(newDir, stem + ".md");
        if (unit) units.push({ folder: joinPath(newDir, stem), name: stem + ".md" });
        if (g.page) {
          files.set(joinPath(oldDir, g.page), own);
          if (id) byId.set(id, own);
        }
        if (g.csv.length) {
          const page = own;
          for (const csv of g.csv) files.set(joinPath(oldDir, csv), page);
          if (id) byId.set(id, page);
          databases.push({
            name: cleanName(key),
            csv: joinPath(oldDir, g.csv.find((c) => /_all\.csv$/i.test(c)) || g.csv[0]),
            page,
            folder: joinPath(newDir, stem),
            from: g.dir ? joinPath(oldDir, g.dir) : null,
            intro: g.page ? joinPath(oldDir, g.page) : null,
            id,
          });
        }
        if (g.dir) walk(joinPath(oldDir, g.dir), joinPath(newDir, stem), g.csv.length > 0);
      }
      for (const name of attachments.sort()) {
        const { stem, ext } = splitExt(name);
        files.set(joinPath(oldDir, name), joinPath(newDir, unique(used, cleanName(stem), [ext]) + ext));
        copies.add(joinPath(oldDir, name));
      }
    }
    const units = [];
    walk("", "");
    // A unit's own page has its folder's name: nothing in the folder may take it.
    for (const u of units) {
      const used = taken.get(u.folder) || taken.set(u.folder, new Set()).get(u.folder);
      used.add(u.name.toLowerCase());
      used.add(u.name.slice(0, -3).toLowerCase());
    }
    return { files, byId, databases, taken, copies };
  }

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
        note({ target: hit.at, kind: /\.md$/i.test(hit.at) ? "page" : "file" });
        return open + encodeLink(relative(newDir, hit.at)) + hit.rest + close;
      }),
    );
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

  /** A database's page: one block, its views a click apart in it, opening on a board when the
   *  rows have a status, else a table; the board's grouping and the calendar's dates set. */
  function databasePage(name, folderName, rows, table, foldersBy) {
    const group = boardKey(rows);
    const date = dateKey(rows);
    // Without from, a database in its folder unit's own page shows that folder.
    const lines = (folderName ? ["from: " + folderName] : []).concat("view: " + (group ? "board" : "table"));
    if (group) lines.push("group: " + group);
    if (date) lines.push("date: " + date);
    if (date && rows.some((r) => r.props[date + "_end"])) lines.push("end: " + date + "_end");
    if (foldersBy) lines.push("folders: " + foldersBy + ":year");
    // The rows with nothing written in them, as the Database view keeps them: a table under "rows:".
    if (table && table.length) lines.push("rows:", root.database.writeSpec({ view: "table", sort: [], filters: [], types: {}, table }).split("\nrows:\n")[1]);
    return { text: "# " + name + "\n\n```database\n" + lines.join("\n") + "\n```\n", group, date };
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
      out.push(m[0].trim(), "", "```database", "from: " + relative(dirOf(to), db.folder), "view: table");
      if (sort.length) out.push("sort: " + sort.join(", "));
      out.push("```");
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
  async function pagesOfRows(rows, table, pages, read) {
    const keys = (table[0] || []).map(N.propertyName);
    const seen = new Map();
    const peek = async (p) => {
      if (!seen.has(p)) {
        // One that can't be read is reported when its row is written.
        const text = await Promise.resolve().then(() => read(p, "text")).catch(() => "");
        const { title, props } = N.pageParts(text);
        seen.set(p, { title, props });
      }
      return seen.get(p);
    };
    const fit = async (p, i) => {
      const { title, props } = await peek(p);
      const cells = table[i + 1] || [];
      const agree = props.filter(([k, v]) => (cells[keys.indexOf(N.propertyName(k))] || "").trim() === v).length;
      return { score: (title === rows[i].name ? 1000 : 0) + agree, whole: title === rows[i].name && agree === props.length };
    };
    const out = rows.map(() => null);
    const pass = async (keyOf, left) => {
      const by = new Map();
      for (const p of left) {
        const key = await keyOf(p);
        (by.get(key) || by.set(key, []).get(key)).push(p);
      }
      for (const [i, row] of rows.entries()) {
        const same = !out[i] && by.get(row.name);
        if (!same || !same.length) continue;
        let best = 0;
        // The first page that agrees in everything ends the search.
        for (let j = 0, top = -1; same.length > 1 && j < same.length; j++) {
          const { score, whole } = await fit(same[j], i);
          if (score > top) [top, best] = [score, j];
          if (whole) break;
        }
        out[i] = same.splice(best, 1)[0];
      }
    };
    await pass(async (p) => N.withoutId(splitExt(baseOf(p)).stem), pages);
    const taken = new Set(out);
    const left = pages.filter((p) => !taken.has(p));
    if (left.length && out.includes(null)) await pass(async (p) => (await peek(p)).title, left);
    return out;
  }

  /** Whether the row's page has a folder of its own (attachments, sub-pages): it stays a file. */
  function hasSubfolder(layout, page) {
    const to = layout.files.get(page);
    if (!to) return false;
    const stem = to.slice(0, -3) + "/";
    for (const target of layout.files.values()) if (target.startsWith(stem)) return true;
    return false;
  }

  /** Newer exports keep every attachment at the top, in attachments/<id>/<name>. Each goes into an
   *  assets folder beside the first page that shows or links it, as Textus keeps pictures; one no
   *  page links stays in attachments/, without the id folders. */
  async function placeAttachments(layout, paths, read) {
    const pooled = paths.filter((p) => layout.copies.has(p) && /^attachments\/[^/]+\/[^/]+$/i.test(p));
    if (!pooled.length) return;
    const pool = new Set(pooled);
    const home = new Map();
    for (const page of paths) {
      const to = layout.files.get(page);
      if (!/\.md$/i.test(page) || layout.copies.has(page) || !to) continue;
      // One that can't be read is reported when it is written.
      const text = await Promise.resolve().then(() => read(page, "text")).catch(() => "");
      for (const m of text.matchAll(/\]\((<[^>\n]+>|[^)\s]+)/g)) {
        const raw = m[1].replace(/^<|>$/g, "");
        if (SCHEME.test(raw)) continue;
        const full = resolve(dirOf(page), decode(raw.split(/[#?]/)[0]));
        if (pool.has(full) && !home.has(full)) home.set(full, to);
      }
    }
    for (const path of pooled) {
      const page = home.get(path);
      const dir = page ? joinPath(dirOf(page), "assets") : "attachments";
      const used = layout.taken.get(dir) || layout.taken.set(dir, new Set()).get(dir);
      const { stem, ext } = splitExt(baseOf(path));
      // Notion calls every pasted picture "image": those take their page's name instead, so a
      // folder of them says whose each is. A file's own name stays.
      const generic = page && /^(image|untitled|pasted image.*)$/i.test(stem.trim());
      const words = page ? Array.from(splitExt(baseOf(page)).stem) : [];
      const cut = words.length > 60 ? words.slice(0, 60).join("").replace(/\s+\S*$/, "") : words.join("");
      const base = generic ? cleanName(cut) : cleanName(stem);
      layout.files.set(path, joinPath(dir, unique(used, base, [ext]) + ext));
    }
  }

  /** Imports the export a file at a time, so a large one never sits in memory whole; `signal`
   *  stops it between files. A file that can't be read or written goes in `report.failed`. */
  /** How many rows with pages of their own make a database big enough to file by year. */
  const BIG = 200;

  async function importExport({ paths, read, write, progress, signal, byYear }) {
    // The titles of pages Notion named alike in one folder, to tell them apart.
    const titles = new Map();
    const stems = new Map();
    for (const p of paths) {
      if (!/\.md$/i.test(p) || !N.idOf(splitExt(baseOf(p)).stem)) continue;
      const key = joinPath(dirOf(p), N.withoutId(splitExt(baseOf(p)).stem));
      stems.set(key, (stems.get(key) || []).concat(p));
    }
    for (const same of stems.values())
      if (same.length > 1)
        for (const p of same) {
          const text = await Promise.resolve().then(() => read(p, "text")).catch(() => "");
          const title = N.pageParts(text).title;
          if (title) titles.set(p, title);
        }
    const layout = plan(paths, titles);
    const report = {
      pages: 0, databases: 0, rows: 0, files: 0, total: paths.length, done: 0, stopped: false,
      missing: [], failed: [], blocks: { callout: [], icon: [] },
      stats: { subpages: 0, databases: 0, links: 0, todos: 0, urls: 0, pdfs: 0, templates: 0 },
      written: [],
    };
    const made = new Set([""]);
    const folder = async (path) => {
      if (made.has(path)) return;
      await folder(dirOf(path));
      await write.folder(path);
      made.add(path);
    };
    const found = {
      link(link, page) {
        if (link.kind === "missing") report.missing.push({ page, target: link.target });
        else if (link.kind === "page" && link.target !== page) report.stats.links++;
      },
      block(kind, page) {
        report.blocks[kind].push(page);
      },
      todos(n) {
        report.stats.todos += n;
      },
      url() {
        report.stats.urls++;
      },
    };
    const step = (path) => {
      report.done++;
      if (progress) progress(report.done, report.total, path);
    };
    const stopped = () => signal && signal.aborted && (report.stopped = true);
    const attempt = async (path, work) => {
      try {
        await work();
      } catch (err) {
        report.failed.push({ path, error: String((err && err.message) || err) });
      }
    };
    const writeText = async (path, text) => {
      await folder(dirOf(path));
      await write.text(path, text);
      report.written.push(path);
    };
    // The folders that hold a page's sub-pages: its unit's own, or (older) the one named as it.
    const isUnitPage = (p) => dirOf(p) !== "" && baseOf(p).slice(0, -3) === baseOf(dirOf(p));
    const pageFolders = new Set(
      [...layout.files.values()].filter((p) => /\.md$/i.test(p)).map((p) => (isUnitPage(p) ? dirOf(p) : p.slice(0, -3))),
    );
    const pagesIn = new Map();
    for (const p of paths) if (/\.md$/i.test(p) && !layout.copies.has(p)) (pagesIn.get(dirOf(p)) || pagesIn.set(dirOf(p), []).get(dirOf(p))).push(p);
    const rowPages = new Set();

    // Each database's rows and their pages first, so every link already knows the rows' names:
    // Notion cuts a long page name to 50 characters, the row's whole title is in the CSV.
    for (const db of layout.databases) {
      if (stopped()) return report;
      let source = "";
      await attempt(db.csv, async () => (source = await read(db.csv, "text")));
      db.rows = N.fromNotionCsv(source, { relation: (item) => ({ relation: item }) });
      db.pages = await pagesOfRows(db.rows, N.parseCsv(source), (db.from && pagesIn.get(db.from)) || [], read);
      const used = layout.taken.get(db.folder) || layout.taken.set(db.folder, new Set()).get(db.folder);
      const targets = [...layout.files.values()];
      for (const [i, page] of db.pages.entries()) {
        const to = page && layout.files.get(page);
        // As Notion names files: / : ? and the like dropped, not swapped.
        const whole = cleanName(db.rows[i].name.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " "));
        const stem = to && to.slice(0, -3);
        // Cut names also drop the characters a file name can't hold: compared by letters and digits.
        const bare = (x) => x.replace(/[^\p{L}\p{N}]+/gu, "").toLowerCase();
        if (!to || baseOf(stem) === whole || !bare(whole).startsWith(bare(baseOf(stem).replace(/ \d+$/, ""))) || bare(whole).length <= bare(baseOf(stem).replace(/ \d+$/, "")).length || targets.some((t) => t.startsWith(stem + "/"))) continue;
        const name = joinPath(dirOf(to), unique(used, whole, [".md", ""]) + ".md");
        layout.files.set(page, name);
        const id = N.idOf(splitExt(baseOf(page)).stem);
        if (id) layout.byId.set(id, name);
      }
      // A row with nothing written in it is a line of the database's own table, not a file: one
      // place for each row. Links to its page go to the database's page.
      db.inline = [];
      for (const [i, page] of db.pages.entries()) {
        const text = page ? await Promise.resolve().then(() => read(page, "text")).catch(() => null) : "";
        if (text === null || (page && N.pageParts(text).body.trim()) || (page && hasSubfolder(layout, page))) continue;
        db.inline[i] = true;
        if (!page) continue;
        layout.files.set(page, db.page);
        const id = N.idOf(splitExt(baseOf(page)).stem);
        if (id) layout.byId.set(id, db.page);
      }
      // Asked for, a big database's pages go in a folder per year of their date (folders: date:year).
      const filed = db.pages.filter((p, i) => p && !db.inline[i]);
      const date = byYear && filed.length > BIG ? dateKey(db.rows) : null;
      if (date) {
        db.folders = date;
        for (const [i, page] of db.pages.entries()) {
          const year = page && !db.inline[i] && String(db.rows[i].props[date] || "").slice(0, 4);
          if (!year || !/^\d{4}$/.test(year) || hasSubfolder(layout, page)) continue;
          const to = joinPath(joinPath(db.folder, year), baseOf(layout.files.get(page)));
          layout.files.set(page, to);
          const id = N.idOf(splitExt(baseOf(page)).stem);
          if (id) layout.byId.set(id, to);
        }
      }
    }
    // Pictures after the rows have their names: one takes its page's name.
    await placeAttachments(layout, paths, read);
    // Databases: a document per row, its body from the row's page.
    for (const db of layout.databases) {
      if (stopped()) return report;
      const { rows, pages } = db;
      const table = [];
      for (const [i, row] of rows.entries()) {
        if (stopped()) return report;
        const page = pages[i];
        if (page) rowPages.add(page);
        if (db.inline[i]) {
          // Its page, mapped to the database's page, is counted with that below.
          table.push({ name: row.name, props: linkRelations(row.props, db.page, layout) });
          report.rows++;
          continue;
        }
        const to = page ? layout.files.get(page) : joinPath(db.folder, unique(layout.taken.get(db.folder), cleanName(row.name), [".md", ""]) + ".md");
        await attempt(page || to, async () => {
          const body = page ? N.pageParts(await read(page, "text")).body : "";
          await writeText(to, convertPage(body, row.name, row.props, page || db.csv, to, layout, found));
          report.rows++;
        });
        if (page) step(page);
      }
      await attempt(db.page, async () => {
        const view = databasePage(db.name, null, rows.map((r) => ({ props: linkRelations(r.props, db.page, layout) })), table, db.folders);
        // A newer export's own page for the database: what else it says goes above the views.
        const parts = db.intro ? N.pageParts(await read(db.intro, "text")) : { title: "", body: "" };
        const intro = parts.body;
        if (parts.title) view.text = view.text.replace(/^# [^\n]*/, "# " + parts.title);
        const said = intro && convertPage(intro, "", {}, db.intro, db.page, layout, found, db.folder).replace(/^# \n+/, "").trim();
        await writeText(db.page, said ? view.text.replace(/\n/, "\n\n" + said + "\n") : view.text);
        report.databases++;
        report.stats.databases++;
      });
      for (const p of paths) if (p === db.csv || layout.files.get(p) === db.page) step(p);
    }

    const rowFolders = new Set(layout.databases.map((db) => db.from).filter(Boolean));
    for (const db of layout.databases) if (db.intro) rowPages.add(db.intro);
    for (const path of paths) {
      const copy = layout.copies.has(path);
      if (rowPages.has(path) || (/\.csv$/i.test(path) && !copy)) continue;
      if (stopped()) return report;
      const to = layout.files.get(path);
      await attempt(path, async () => {
        if (/\.md$/i.test(path) && !copy) {
          const page = N.pageParts(await read(path, "text"), rowFolders.has(dirOf(path)));
          const props = {};
          for (const [key, value] of page.props) props[N.propertyName(key)] = propertyValue(value);
          const title = page.title || cleanName(splitExt(baseOf(path)).stem);
          await writeText(to, convertPage(page.body, title, props, path, to, layout, found));
          report.pages++;
          if (pageFolders.has(isUnitPage(to) ? dirOf(dirOf(to)) : dirOf(to))) report.stats.subpages++;
          if (TEMPLATE.test(title)) report.stats.templates++;
        } else {
          await folder(dirOf(to));
          await write.bytes(to, await read(path, "bytes"));
          report.written.push(to);
          report.files++;
          if (/\.pdf$/i.test(path)) report.stats.pdfs++;
        }
      });
      step(path);
    }
    return report;
  }

  /** The official plugins that help with what the import holds, `installed` ones left out. */
  function recommend(stats, installed) {
    const has = installed || new Set();
    // Pages and databases are this plugin's own (Workspace): only the others.
    const all = [
      ["catvinci.backlinks", stats.links > 0],
      ["catvinci.quick-preview", stats.links > 0],
      ["catvinci.tasks", stats.todos >= 10],
      ["catvinci.link-cards", stats.urls > 0],
      ["catvinci.pdf-viewer", stats.pdfs > 0],
      ["catvinci.templates", stats.templates > 0],
    ];
    return all.filter(([id, yes]) => yes && !has.has(id)).map(([id]) => ({ id, why: "why." + id }));
  }

  function reportPage(report, suggestions, t, meta) {
    const link = (path) => "[" + splitExt(baseOf(path)).stem + "](" + encodeLink(path) + ")";
    const out = ["# " + t("reportTitle"), "", t("reportFrom", meta.source, meta.date), ""];
    out.push("- " + t("countPages", report.pages));
    out.push("- " + t("countDatabases", report.databases, report.rows));
    out.push("- " + t("countFiles", report.files));
    if (report.stopped) out.push("", "> [!WARNING]", "> " + t("stopped", report.done, report.total));
    if (suggestions.length) {
      out.push("", "## " + t("helpTitle"), "", t("helpIntro"), "");
      for (const s of suggestions) out.push("- **" + t("plugin." + s.id) + "**: " + t(s.why));
    }
    if (report.missing.length) {
      out.push("", "## " + t("missingTitle"), "", t("missingIntro"), "");
      for (const m of report.missing) out.push("- " + link(m.page) + ": `" + m.target.replace(/`/g, "'") + "`");
    }
    if (report.failed.length) {
      out.push("", "## " + t("failedTitle"), "", t("failedIntro"), "");
      for (const f of report.failed) out.push("- `" + f.path.replace(/`/g, "'") + "`: " + f.error.replace(/\s+/g, " "));
    }
    const callouts = report.blocks.callout.length;
    const icons = report.blocks.icon.length;
    if (callouts || icons) {
      out.push("", "## " + t("blocksTitle"), "");
      if (callouts) out.push("- " + t("callouts", callouts) + " " + pagesOf(report.blocks.callout, link));
      if (icons) out.push("- " + t("icons", icons) + " " + pagesOf(report.blocks.icon, link));
    }
    return out.join("\n") + "\n";
  }

  const pagesOf = (pages, link) => "(" + [...new Set(pages)].map(link).join(", ") + ")";

  /** The files without a Mac zip's extras and without the one folder they're all in, as `top`. */
  function tidyPaths(paths) {
    const kept = paths.filter((p) => !/(^|\/)(__MACOSX\/|\.DS_Store$)/.test(p) && !p.endsWith("/"));
    let top = "";
    for (;;) {
      const rest = kept[0] ? kept[0].slice(top.length) : "";
      const next = rest.includes("/") ? top + rest.slice(0, rest.indexOf("/") + 1) : null;
      if (!next || !kept.every((p) => p.startsWith(next))) break;
      top = next;
    }
    return { top, paths: kept.map((p) => p.slice(top.length)) };
  }

  /** A zip as importExport reads it; Notion splits a large export into Part-N zips inside one. */
  async function zipSource(JSZip, bytes) {
    const entries = new Map();
    const add = async (zip) => {
      const files = Object.values(zip.files).filter((f) => !f.dir && !/(^|\/)__MACOSX\//.test(f.name));
      const zips = files.filter((f) => /\.zip$/i.test(f.name));
      if (zips.length && zips.length === files.filter((f) => !/\.DS_Store$/.test(f.name)).length) {
        for (const inner of zips) await add(await JSZip.loadAsync(await inner.async("uint8array")));
        return;
      }
      for (const f of files) entries.set(f.name.normalize("NFC"), f);
    };
    await add(await JSZip.loadAsync(bytes));
    const { top, paths } = tidyPaths([...entries.keys()]);
    return {
      paths,
      read: (path, kind) => entries.get(top + path).async(kind === "text" ? "string" : "uint8array"),
    };
  }

  /** A Notion export has a page or database whose name ends in an id. */
  const isExport = (paths) => paths.some((p) => /\.(md|csv)$/i.test(p) && N.idOf(splitExt(baseOf(p)).stem));

  root.notionImport = {
    cleanName,
    plan,
    relative,
    encodeLink,
    rewriteLinks,
    convertCallouts,
    frontMatter,
    propertyValue,
    boardKey,
    dateKey,
    databasePage,
    importExport,
    recommend,
    reportPage,
    tidyPaths,
    zipSource,
    isExport,
  };
})(typeof window !== "undefined" ? window : globalThis);
