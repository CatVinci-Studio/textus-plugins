// Notion Import: where each file of a Notion export goes - names cleaned of
// Notion's ids, kept unique, folders for pages with children. Paths are
// `/`-separated. Runs after lib/notion-csv.js.

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
        // A page with sub-pages - a database's row too - and every database is a folder unit:
        // Plans/Plans.md beside what it holds. A page without is a file on its own.
        const unit = !!(g.csv.length || g.dir);
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
        if (g.dir) walk(joinPath(oldDir, g.dir), joinPath(newDir, stem));
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

  root.notionLayout = { cleanName, plan, unique, splitExt, dirOf, baseOf, joinPath };
})(typeof window !== "undefined" ? window : globalThis);
