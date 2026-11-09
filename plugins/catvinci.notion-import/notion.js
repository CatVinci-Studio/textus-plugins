// Notion Import: a Notion export ("Markdown & CSV") as a Textus folder - the
// import run, its report and the source it reads. No textus.* calls here,
// so the tests drive it directly; paths are `/`-separated. Runs after
// notion-layout.js and notion-pages.js.

(function (root) {
  const N = root.notionCsv;
  const { cleanName, plan, unique, splitExt, dirOf, baseOf, joinPath } = root.notionLayout;
  const P = root.notionPages;
  /** A status column's "not started", which Notion fills in on a new row by itself. */
  const STATUS_KEY = /(^|_)(status|state|stage|progress)$|进度|状态|狀態/i;
  const NOT_STARTED = /^(not started|to ?do|new|backlog|未开始|未開始|待办|待辦)$/i;
  /** Whether a page's properties say anything: a status Notion set by itself doesn't. */
  const said = (props) =>
    Object.entries(props).some(
      ([k, v]) =>
        !(STATUS_KEY.test(k) && NOT_STARTED.test(String(v).trim())) &&
        v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length),
    );
  const { EMOJI, SCHEME, TEMPLATE, boardKey, convertCallouts, convertPage, databasePage, dateKey, decode } = P;
  const { encodeLink, frontMatter, linkRelations, propertyValue, relative, resolve, rewriteLinks, wikiNames } = P;

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
    // A unit (X/X.md) holds what is beside it in X/; an older page, what is in the folder named as it.
    const unit = dirOf(to) !== "" && baseOf(to).slice(0, -3) === baseOf(dirOf(to));
    const stem = (unit ? dirOf(to) : to.slice(0, -3)) + "/";
    for (const target of layout.files.values()) if (target !== to && target.startsWith(stem)) return true;
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
  async function importExport({ paths, read, write, progress, signal, links }) {
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
    layout.links = links ? wikiNames(layout, links) : null;
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
      // A row with no title, no properties and nothing written in it isn't brought in: Notion's
      // empty "Untitled". A status Notion filled in by itself (Not started) doesn't count.
      // Links to its page go to the database's page.
      db.skip = [];
      for (const [i, page] of db.pages.entries()) {
        const row = db.rows[i];
        const untitled = !row.name.trim() || /^untitled$/i.test(cleanName(row.name));
        if (!untitled || said(row.props) || (page && hasSubfolder(layout, page))) continue;
        const text = page ? await Promise.resolve().then(() => read(page, "text")).catch(() => null) : "";
        if (text === null || (page && N.pageParts(text).body.trim())) continue;
        db.skip[i] = true;
        if (!page) continue;
        layout.files.set(page, db.page);
        const id = N.idOf(splitExt(baseOf(page)).stem);
        if (id) layout.byId.set(id, db.page);
      }
    }
    // Pictures after the rows have their names: one takes its page's name.
    await placeAttachments(layout, paths, read);
    // Databases: a document per row, its body from the row's page.
    for (const db of layout.databases) {
      if (stopped()) return report;
      const { rows, pages } = db;
      for (const [i, row] of rows.entries()) {
        if (stopped()) return report;
        const page = pages[i];
        if (page) rowPages.add(page);
        if (db.skip[i]) {
          report.skipped = (report.skipped || 0) + 1;
          if (page) step(page);
          continue;
        }
        const to = page ? layout.files.get(page) : joinPath(db.folder, unique(layout.taken.get(db.folder), cleanName(row.name), [".md", ""]) + ".md");
        // A page that can't be read is a failure; its row is kept with the CSV's properties.
        let body = "";
        if (page) await attempt(page, async () => (body = N.pageParts(await read(page, "text")).body));
        await attempt(to, async () => {
          await writeText(to, convertPage(body, row.name, row.props, page || db.csv, to, layout, found));
          report.rows++;
        });
        if (page) step(page);
      }
      await attempt(db.page, async () => {
        const view = databasePage(db.name, rows.filter((r, i) => !db.skip[i]).map((r) => ({ props: linkRelations(r.props, db.page, layout) })));
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
          // Notion's empty "Untitled" page - no title, no properties, nothing written - isn't brought in;
          // nor a database's blank page that isn't one of its rows, its status Notion's own "not started".
          if (/^untitled$/i.test(title.trim()) && !page.body.trim() && !said(props) && !hasSubfolder(layout, path)) {
            report.skipped = (report.skipped || 0) + 1;
            return;
          }
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
    // Where each Notion page went: its icon, read from an HTML export, follows it.
    report.byId = Object.fromEntries(layout.byId);
    return report;
  }

  /** The emoji icon of each page of a Notion HTML export, by the page's id.
   *  The Markdown export leaves icons out; a picture icon isn't brought. */
  async function iconsOf({ paths, read, signal }) {
    const icons = {};
    for (const path of paths) {
      if (signal && signal.aborted) break;
      if (!/\.html$/i.test(path)) continue;
      const id = N.idOf(splitExt(baseOf(path)).stem);
      if (!id) continue;
      const html = await Promise.resolve().then(() => read(path, "text")).catch(() => "");
      const m = /class="page-header-icon[^"]*"[^>]*>\s*<span class="icon">([^<]{1,16})<\/span>/.exec(html);
      if (m && EMOJI.test(m[1].trim())) icons[id] = m[1].trim();
    }
    return icons;
  }

  /** The official plugins that help with what the import holds, `installed` ones left out. */
  function recommend(stats, installed) {
    const has = installed || new Set();
    const all = [
      ["catvinci.database", stats.subpages > 0 || stats.databases > 0],
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
    if (report.icons) out.push("- " + t("countIcons", report.icons));
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
    wikiNames,
    convertCallouts,
    frontMatter,
    propertyValue,
    boardKey,
    dateKey,
    databasePage,
    importExport,
    iconsOf,
    recommend,
    reportPage,
    tidyPaths,
    zipSource,
    isExport,
  };
})(typeof window !== "undefined" ? window : globalThis);
