// Notion Import: a Notion export ("Markdown & CSV") as a Textus folder.
// Pure functions over paths and text, shared by the host and the tests:
// names without Notion's ids, links that follow them, property lines and
// CSV rows as front matter, callouts as notes, and the report. Paths are
// `/`-separated; the export's are relative to its top, the new ones to the
// import folder. Runs after lib/notion-csv.js.

(function (root) {
  const N = root.notionCsv;

  // ------------------------------------------------------------------
  // Names
  // ------------------------------------------------------------------

  const NAME_MAX = 100;

  /** A name as a file or folder name on every system: Notion's id gone,
   *  NFC, no characters Windows refuses, not too long. */
  function cleanName(name) {
    let s = N.withoutId(name)
      .normalize("NFC")
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
      .trim()
      .replace(/[. ]+$/, "");
    if (s.length > NAME_MAX) s = s.slice(0, NAME_MAX).trim();
    return s || "Untitled";
  }

  const dirOf = (path) => (path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "");
  const baseOf = (path) => path.slice(path.lastIndexOf("/") + 1);
  const joinPath = (dir, name) => (dir ? dir + "/" + name : name);

  /** A file name's stem and extension ("a.b.png" is "a.b" and ".png"). */
  function splitExt(name) {
    const m = /^(.+?)(\.[A-Za-z0-9]{1,8})?$/.exec(name);
    return { stem: m[1], ext: m[2] || "" };
  }

  /** `base`, or `base 2`, `base 3`…: the first whose every name (base
   *  plus each of `suffixes`) is free in `taken`, which keeps them. */
  function unique(taken, base, suffixes) {
    for (let n = 1; ; n++) {
      const name = n === 1 ? base : base + " " + n;
      const names = suffixes.map((s) => (name + s).toLowerCase());
      if (names.some((x) => taken.has(x))) continue;
      names.forEach((x) => taken.add(x));
      return name;
    }
  }

  /** The import's layout from the export's files: where each one goes,
   *  and the databases. A page `Title <id>.md` and its folder `Title <id>/`
   *  keep one name, `Title.md` and `Title/`, as the Pages plugin has them;
   *  a database `Name <id>.csv` (or `_all.csv`, preferred) becomes a page
   *  `Name.md` beside the folder of its rows `Name/`. A name met twice in a
   *  folder gets " 2". */
  function plan(paths) {
    const files = new Map();
    const byId = new Map();
    const databases = [];
    const taken = new Map();
    const children = new Map();
    const child = (dir) => children.get(dir) || children.set(dir, { files: [], dirs: new Set() }).get(dir);
    for (const path of paths) {
      child(dirOf(path)).files.push(baseOf(path));
      for (let d = dirOf(path); d; d = dirOf(d)) child(dirOf(d)).dirs.add(baseOf(d));
    }

    function walk(oldDir, newDir) {
      const here = children.get(oldDir) || { files: [], dirs: new Set() };
      const used = new Set();
      taken.set(newDir, used);
      // Pages, their folders and databases first, by the name they share.
      const groups = new Map();
      const group = (key) => groups.get(key) || groups.set(key, { page: null, csv: [], dir: null }).get(key);
      const attachments = [];
      for (const name of here.files) {
        const { stem, ext } = splitExt(name);
        if (/^\.md$/i.test(ext)) group(stem).page = name;
        else if (/^\.csv$/i.test(ext)) group(stem.replace(/_all$/, "")).csv.push(name);
        else attachments.push(name);
      }
      for (const name of here.dirs) group(name).dir = name;
      for (const key of [...groups.keys()].sort()) {
        const g = groups.get(key);
        const stem = unique(used, cleanName(key), [".md", ""]);
        const id = N.idOf(key);
        if (g.page) {
          files.set(joinPath(oldDir, g.page), joinPath(newDir, stem + ".md"));
          if (id) byId.set(id, joinPath(newDir, stem + ".md"));
        }
        if (g.csv.length) {
          const page = joinPath(newDir, stem + ".md");
          for (const csv of g.csv) files.set(joinPath(oldDir, csv), page);
          if (id) byId.set(id, page);
          databases.push({
            name: cleanName(key),
            csv: joinPath(oldDir, g.csv.find((c) => /_all\.csv$/i.test(c)) || g.csv[0]),
            page,
            folder: joinPath(newDir, stem),
            from: g.dir ? joinPath(oldDir, g.dir) : null,
          });
        }
        if (g.dir) walk(joinPath(oldDir, g.dir), joinPath(newDir, stem));
      }
      for (const name of attachments.sort()) {
        const { stem, ext } = splitExt(name);
        files.set(joinPath(oldDir, name), joinPath(newDir, unique(used, cleanName(stem), [ext]) + ext));
      }
    }
    walk("", "");
    return { files, byId, databases, taken };
  }

  // ------------------------------------------------------------------
  // Links
  // ------------------------------------------------------------------

  /** `to` written relative to the folder `fromDir`. */
  function relative(fromDir, to) {
    const a = fromDir ? fromDir.split("/") : [];
    const b = to.split("/");
    let i = 0;
    while (i < a.length && i < b.length - 1 && a[i] === b[i]) i++;
    return a.slice(i).map(() => "..").concat(b.slice(i)).join("/");
  }

  /** A path as a link's target: the characters a Markdown link can't hold
   *  as they are, encoded. */
  const encodeLink = (path) => path.replace(/[%() <>#?]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));

  function decode(text) {
    try {
      return decodeURIComponent(text);
    } catch {
      return text;
    }
  }

  /** `link` from the folder `dir`, `.` and `..` worked out. */
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

  /** Applies `change` to the parts of `text` outside code: fenced blocks
   *  and inline code spans stay as they are. */
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

  /**
   * The page's links made to point at the new places: `from` and `to` are
   * the page's old and new paths, `layout` what plan() gave. Links into the
   * export (relative, or notion.so with an id the export has) follow;
   * anything else stays. `found` hears each one: `{ target, kind }`, kind
   * "page" (a document of the import), "file", "missing" or "web".
   */
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
      part.replace(/(!?\[[^\]\n]*\]\()(<[^>\n]+>|[^)\s]+)((?:\s+"[^"\n]*")?\))/g, (all, open, raw, close) => {
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

  // ------------------------------------------------------------------
  // Notion's blocks
  // ------------------------------------------------------------------

  const EMOJI = /^\p{Extended_Pictographic}/u;

  /** Callouts (`<aside>`) as GitHub notes, `> [!NOTE]`, their emoji kept
   *  on the first line; an icon that is one of Notion's own pictures goes.
   *  `found` hears "callout" and "icon" for each. */
  function convertCallouts(text, found) {
    const note = found || (() => {});
    return outsideCode(text, (part) =>
      part.replace(/^<aside>[ \t]*\n?([\s\S]*?)\n?[ \t]*<\/aside>[ \t]*$/gm, (all, inner) => {
        note("callout");
        let lines = inner.split("\n");
        let icon = "";
        const img = /^\s*<img\b[^>]*>\s*$/i.exec(lines.find((l) => l.trim()) || "");
        if (img) {
          const alt = (/\balt="([^"]*)"/i.exec(img[0]) || [])[1] || "";
          if (EMOJI.test(alt)) icon = alt;
          else note("icon");
          lines.splice(lines.indexOf(lines.find((l) => l.trim())), 1);
        }
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        lines = lines.map((l) => l.trimEnd());
        if (icon) lines[0] = icon + " " + (lines[0] || "");
        return ["> [!NOTE]"].concat(lines.map((l) => (l ? "> " + l : ">"))).join("\n");
      }),
    );
  }

  // ------------------------------------------------------------------
  // Front matter
  // ------------------------------------------------------------------

  const RESERVED = /^(?:true|false|yes|no|on|off|null|~)$/i;

  function yamlScalar(value) {
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    const s = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const plain =
      /^[\p{L}\p{N}][^\n:#]*$/u.test(s) && !/\s$/.test(s) && !RESERVED.test(s) && !/^[-+.\d][\d.eE+-]*$/.test(s);
    return plain ? s : JSON.stringify(s);
  }

  /** `props` as a front matter block (with its fences); "" for none. */
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

  /** A page property line's value: a date (and a range's end), Yes/No,
   *  a number, a relation's pages or text. */
  function propertyValue(text) {
    const range = N.rangeOf(text);
    if (range) return range;
    const relation = N.relationItems(text);
    if (relation) return relation.map((item) => ({ relation: item }));
    return N.cellValue(text, false);
  }

  /** Props, with each relation `{ relation: { title, target } }` as a
   *  link from the document at `to`. */
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

  // ------------------------------------------------------------------
  // Databases
  // ------------------------------------------------------------------

  const STATUS = /status|state|stage|状态|狀態|阶段|階段|ステータス|상태|estado|statut|état|zustand|статус/i;

  /** The property a board groups by: a status-like one, else text with a
   *  few values said again and again; null for none. */
  function boardKey(rows) {
    const keys = [];
    for (const row of rows) for (const k of Object.keys(row.props)) if (!keys.includes(k)) keys.push(k);
    const selects = keys.filter((k) => {
      const said = rows.map((r) => r.props[k]).filter((v) => v !== undefined && v !== null);
      if (!said.length || !said.every((v) => typeof v === "string" && v.length <= 40 && !/^\d{4}-\d{2}-\d{2}$/.test(v) && !/^\[/.test(v))) return false;
      const values = new Set(said);
      return values.size <= 10 && values.size < said.length;
    });
    return selects.find((k) => STATUS.test(k)) || selects[0] || null;
  }

  /** The first date property, its range's end aside; null for none. */
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

  /** A database's page: its title and a table, with a board when it has a
   *  status and a calendar when it has a date. */
  function databasePage(name, folderName, rows) {
    const block = (lines) => "```database\nfrom: " + folderName + "\n" + lines.join("\n") + "\n```\n";
    const out = ["# " + name + "\n", block(["view: table"])];
    const group = boardKey(rows);
    const date = dateKey(rows);
    if (group) out.push(block(["view: board", "group: " + group]));
    if (date) out.push(block(["view: calendar", "date: " + date].concat(rows.some((r) => r.props[date + "_end"]) ? ["end: " + date + "_end"] : [])));
    return { text: out.join("\n"), group, date };
  }

  // ------------------------------------------------------------------
  // The import
  // ------------------------------------------------------------------

  const TODO = /^\s*[-*+] \[[ xX]\] /gm;
  const BOOKMARK = /^\s*(?:\[[^\]\n]*\]\((https?:[^)\s]+)\)|<?(https?:\/\/\S+?)>?)\s*$/gm;
  const TEMPLATE = /template|模板|範本|テンプレート|템플릿|plantilla|modèle|vorlage|шаблон|modelo/i;

  /** A page written for Textus: front matter from `props`, its title, and
   *  its body with links and callouts converted; `found` hears what it met. */
  function convertPage(body, title, props, from, to, layout, found) {
    let text = convertCallouts(body, (kind) => found.block(kind, to));
    text = rewriteLinks(text, from, to, layout, (link) => found.link(link, to));
    found.todos((text.match(TODO) || []).length);
    for (const m of text.matchAll(BOOKMARK)) if (!NOTION_URL.test(m[1] || m[2])) found.url();
    const fm = frontMatter(linkRelations(props, to, { ...layout, from }, (link) => found.link(link, to)));
    return fm + "# " + title + "\n" + (text ? "\n" + text + "\n" : "");
  }

  /**
   * Imports the export: `paths` its files, `read(path, "text" | "bytes")`
   * reads one, `write` puts things in the import folder - `folder(path)`,
   * `text(path, text)`, `bytes(path, bytes)`. A file at a time, so a large
   * export never sits in memory as a whole; `progress(done, total, path)`
   * after each, and a `signal` that stops it between files. Resolves with
   * the report: what was imported, what wasn't found, and the numbers the
   * plugin suggestions go by.
   */
  async function importExport({ paths, read, write, progress, signal }) {
    const layout = plan(paths);
    const report = {
      pages: 0, databases: 0, rows: 0, files: 0, total: paths.length, done: 0, stopped: false,
      missing: [], blocks: { callout: [], icon: [] },
      stats: { subpages: 0, databases: 0, boards: 0, dateDatabases: 0, links: 0, todos: 0, urls: 0, pdfs: 0, templates: 0 },
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
    const writeText = async (path, text) => {
      await folder(dirOf(path));
      await write.text(path, text);
      report.written.push(path);
    };
    const pageFolders = new Set([...layout.files.values()].filter((p) => /\.md$/i.test(p)).map((p) => p.slice(0, -3)));
    const rowPages = new Set();

    // Databases: a document per row, its body from the row's page.
    for (const db of layout.databases) {
      if (stopped()) return report;
      const source = await read(db.csv, "text");
      const rows = N.fromNotionCsv(source, { relation: (item) => ({ relation: item }) });
      const pages = paths.filter((p) => db.from && dirOf(p) === db.from && /\.md$/i.test(p));
      const used = layout.taken.get(db.folder) || new Set();
      layout.taken.set(db.folder, used);
      const docs = [];
      for (const row of rows) {
        const page = pages.find((p) => !rowPages.has(p) && N.withoutId(baseOf(p).slice(0, -3)) === row.name);
        let to;
        if (page) {
          rowPages.add(page);
          to = layout.files.get(page);
        } else to = joinPath(db.folder, unique(used, cleanName(row.name), [".md", ""]) + ".md");
        docs.push({ row, page, to });
      }
      for (const { row, page, to } of docs) {
        if (stopped()) return report;
        const body = page ? N.pageParts(await read(page, "text")).body : "";
        await writeText(to, convertPage(body, row.name, row.props, page || db.csv, to, layout, found));
        report.rows++;
        if (page) step(page);
      }
      const view = databasePage(db.name, baseOf(db.folder), rows.map((r) => ({ props: linkRelations(r.props, db.page, layout) })));
      await writeText(db.page, view.text);
      report.databases++;
      report.stats.databases++;
      if (view.group) report.stats.boards++;
      if (view.date) report.stats.dateDatabases++;
      for (const p of paths) if (p === db.csv || layout.files.get(p) === db.page) step(p);
    }

    for (const path of paths) {
      if (rowPages.has(path) || /\.csv$/i.test(path)) continue;
      if (stopped()) return report;
      const to = layout.files.get(path);
      if (/\.md$/i.test(path)) {
        const page = N.pageParts(await read(path, "text"));
        const props = {};
        for (const [key, value] of page.props) props[N.propertyName(key)] = propertyValue(value);
        const title = page.title || cleanName(splitExt(baseOf(path)).stem);
        await writeText(to, convertPage(page.body, title, props, path, to, layout, found));
        report.pages++;
        if (pageFolders.has(dirOf(to))) report.stats.subpages++;
        if (TEMPLATE.test(title)) report.stats.templates++;
      } else {
        await folder(dirOf(to));
        await write.bytes(to, await read(path, "bytes"));
        report.written.push(to);
        report.files++;
        if (/\.pdf$/i.test(path)) report.stats.pdfs++;
      }
      step(path);
    }
    return report;
  }

  // ------------------------------------------------------------------
  // Suggestions and the report
  // ------------------------------------------------------------------

  /** The official plugins that make the import better, by what it holds:
   *  `{ id, why }` each, in the order shown, `why` the l10n key of the line
   *  saying so. Installed ones (`installed`, a Set of ids) are left out. */
  function recommend(stats, installed) {
    const has = installed || new Set();
    const all = [
      ["catvinci.pages", stats.subpages > 0],
      ["catvinci.database", stats.databases > 0],
      ["catvinci.kanban", stats.boards > 0],
      ["catvinci.backlinks", stats.links > 0],
      ["catvinci.quick-preview", stats.links > 0],
      ["catvinci.tasks", stats.todos >= 10],
      ["catvinci.daily-notes", stats.dateDatabases > 0],
      ["catvinci.reminders", stats.dateDatabases > 0],
      ["catvinci.link-cards", stats.urls > 0],
      ["catvinci.pdf-viewer", stats.pdfs > 0],
      ["catvinci.templates", stats.templates > 0],
    ];
    return all.filter(([id, yes]) => yes && !has.has(id)).map(([id]) => ({ id, why: "why." + id }));
  }

  /** The report page, in the UI language (`t` looks up l10n strings). */
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

  /** The export's files without the files a Mac's zip adds, and without
   *  the folder all of them are in (a zip often has one): `{ top, paths }`,
   *  `top` that folder's path with its "/". */
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

  /** The files of a zip, a zip of zips (Notion splits a large export into
   *  Part-1.zip, Part-2.zip…) opened too: `{ paths, read }` for
   *  importExport. `JSZip` is the library. */
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

  /** Whether `paths` look like a Notion export: a page or database whose
   *  name ends in an id. */
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
