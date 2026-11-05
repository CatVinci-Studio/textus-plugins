// Notion Import: a Notion export - its .zip, or the folder it unzips to,
// in the open folder - imported into a new folder beside it (notion.js),
// then a report page with the plugins that would help.

/* global notionImport, notionCsv, JSZip */
// jszip, run before this file, takes the host's module.exports for itself,
// as a CommonJS module does: given back here.
const Zip = typeof module !== "undefined" && module.exports !== exports ? module.exports : JSZip;
if (typeof module !== "undefined") module.exports = exports;

const t = (key, ...args) => textus.l10n.t(key, ...args);
const RECOMMENDED = "recommended";
let context = null;

const trim = (path) => path.replace(/[\\/]+$/, "");
const join = (dir, rel) => (rel ? trim(dir) + "/" + rel : trim(dir));
const relOf = (root, path) => {
  const base = trim(root).replace(/\\/g, "/") + "/";
  const p = String(path).replace(/\\/g, "/");
  return p.startsWith(base) ? p.slice(base.length) : null;
};
const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
};

/** Every file under `dir`, by its path in it. */
async function filesUnder(dir) {
  const out = [];
  const walk = async (at, prefix) => {
    for (const entry of await textus.files.list(at)) {
      if (entry.name.startsWith(".")) continue;
      if (entry.isDir) await walk(entry.path, prefix + entry.name + "/");
      else out.push(prefix + entry.name);
    }
  };
  await walk(dir, "");
  return out;
}

/** The zips and unzipped exports in the open folder, to pick from. */
async function choices(root) {
  const items = [];
  for (const f of await textus.files.find("**/*.zip"))
    items.push({ label: f.rel.split("/").pop(), description: f.rel, value: f.path });
  // An unzipped export: the folder holding the first page or database
  // whose name ends in Notion's id.
  const folders = new Set();
  for (const f of await textus.files.find("**/*.{md,csv}")) {
    const parts = f.rel.split("/");
    const first = parts.findIndex((p) => notionCsv.idOf(p.replace(/(_all)?\.(md|csv)$/i, "")));
    if (first > 0) folders.add(parts.slice(0, first).join("/"));
  }
  for (const rel of [...folders].sort())
    items.push({ label: rel.split("/").pop(), description: rel + "/", value: join(root, rel) });
  return items;
}

/** A folder name in `dir` nothing has yet: `name`, else `name 2`… */
async function freeFolder(dir, name) {
  for (let n = 1; ; n++) {
    const path = join(dir, n === 1 ? name : name + " " + n);
    if (!(await textus.files.stat(path))) return path;
  }
}

/** The export at `path` (a .zip or a folder) as importExport reads it. */
async function sourceOf(path) {
  const stat = await textus.files.stat(path);
  if (stat && stat.isDir) {
    const { paths } = notionImport.tidyPaths(await filesUnder(path));
    return {
      paths,
      read: (rel, kind) => (kind === "text" ? textus.files.readText(join(path, rel)) : textus.files.read(join(path, rel))),
    };
  }
  return notionImport.zipSource(Zip, await textus.files.read(path));
}

async function importNotion(arg) {
  const root = await textus.files.root();
  if (!root) return textus.ui.message(t("needsFolder"));
  let source = typeof arg === "string" ? arg : arg && typeof arg.path === "string" ? arg.path : null;
  if (!source) {
    const items = await choices(root);
    if (!items.length) return textus.ui.message(t("noSource"));
    source = await textus.ui.pick(items, { placeholder: t("pickSource") });
    if (!source) return;
  }
  const target = await freeFolder(root, t("folderName", today()));
  const name = String(source).replace(/\\/g, "/").split("/").pop();
  let report;
  try {
    report = await textus.ui.withProgress(t("importing"), async (progress, signal) => {
      progress({ message: t("reading") });
      const from = await sourceOf(source);
      if (!notionImport.isExport(from.paths)) return null;
      await textus.files.createFolder(target);
      return notionImport.importExport({
        ...from,
        signal,
        write: {
          folder: (rel) => textus.files.createFolder(join(target, rel)),
          text: (rel, text) => textus.files.create(join(target, rel), text),
          bytes: (rel, bytes) => textus.files.write(join(target, rel), bytes),
        },
        progress: (done, total, path) => progress({ fraction: done / total, message: path.split("/").pop() }),
      });
    });
  } catch (err) {
    return textus.ui.message(t("failed", String((err && err.message) || err)), { tone: "error" });
  }
  if (!report) return textus.ui.message(t("notExport", name));
  const suggestions = await stillMissing(notionImport.recommend(report.stats));
  await context.storage.global.set(RECOMMENDED, suggestions.map((s) => s.id));
  const page = join(target, (await freeName(target, t("reportName"))) + ".md");
  await textus.files.create(page, notionImport.reportPage(report, suggestions, t, { source: name, date: today() }));
  await textus.layout.open(page);
  const where = relOf(root, target) || target;
  textus.ui.notice(report.stopped ? t("cancelled", where) : t("done", report.pages + report.rows, report.databases, where));
}

/** A document name in `dir` not taken by the import. */
async function freeName(dir, name) {
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? name : name + " " + n;
    if (!(await textus.files.stat(join(dir, candidate + ".md")))) return candidate;
  }
}

/** The suggestions whose plugin isn't installed and on. */
async function stillMissing(suggestions) {
  const out = [];
  for (const s of suggestions) if ((await textus.plugins.get(s.id).catch(() => null)) === null) out.push(s);
  return out;
}

/** The last import's suggestions, one to install: Textus asks first and
 *  shows its permissions. Older Textus can't be asked from a plugin. */
async function recommend() {
  const ids = (await context.storage.global.get(RECOMMENDED)) || [];
  const left = await stillMissing(ids.map((id) => ({ id, why: "why." + id })));
  if (!left.length) return textus.ui.message(t("noTips"));
  const id = await textus.ui.pick(
    left.map((s) => ({ label: t("plugin." + s.id), detail: t(s.why), value: s.id })),
    { placeholder: t("recommendPick") },
  );
  if (!id) return;
  try {
    await textus.commands.execute("textus.offerPlugin", { id, reason: t("why." + id) });
  } catch {
    await textus.ui.message(t("offerFallback", t("plugin." + id)));
  }
}

exports.activate = function (ctx) {
  context = ctx;
  ctx.subscriptions.push(
    textus.commands.register("catvinci.notion-import.import", importNotion),
    textus.commands.register("catvinci.notion-import.recommend", recommend),
  );
};
