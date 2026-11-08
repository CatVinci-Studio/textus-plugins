// Notion Import: a Notion export in the open folder (its .zip, or the folder it unzips to) imported
// into a new dated folder at the open folder's top, then a report page with the plugins that help.

/* global notionImport, notionCsv, JSZip, folderPaths, dates, freeName */
// jszip, run before this file, takes the host's module.exports for itself,
// as a CommonJS module does: given back here.
const Zip = typeof module !== "undefined" && module.exports !== exports ? module.exports : JSZip;
if (typeof module !== "undefined") module.exports = exports;

const t = (key, ...args) => textus.l10n.t(key, ...args);
const RECOMMENDED = "recommended";
// Textus hands a plugin at most 256 MB in one read; a folder is read a file at a time.
const MAX_READ = 256 * 1024 * 1024;
let context = null;
// Folders an import running now has picked but not yet made.
const claimed = new Set();

const join = folderPaths.abs;
const today = () => dates.day(new Date());

async function filesUnder(dir, signal) {
  const out = [];
  const walk = async (at, prefix) => {
    if (signal.aborted) return;
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
  // Claimed in the same step as it is found free, so two imports never share one.
  const taken = async (candidate) => {
    const path = join(dir, candidate);
    if ((await textus.files.stat(path)) || claimed.has(path)) return true;
    claimed.add(path);
    return false;
  };
  return join(dir, await freeName(name, taken));
}

/** The export at `path` (a .zip or a folder) as importExport reads it. */
async function sourceOf(path, stat, signal) {
  if (!stat || !stat.isDir) return notionImport.zipSource(Zip, await textus.files.read(path));
  // Notion's links are NFC; a Mac's Archive Utility writes names decomposed.
  const raw = new Map((await filesUnder(path, signal)).map((p) => [p.normalize("NFC"), p]));
  const { top, paths } = notionImport.tidyPaths([...raw.keys()]);
  const at = (rel) => join(path, raw.get(top + rel));
  return { paths, read: (rel, kind) => (kind === "text" ? textus.files.readText(at(rel)) : textus.files.read(at(rel))) };
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
  const name = String(source).replace(/\\/g, "/").split("/").pop();
  const stat = await textus.files.stat(source);
  if (stat && !stat.isDir && stat.size > MAX_READ) return textus.ui.message(t("tooBig", name));
  // The import is a workspace of its own: named as the reader likes, "Notion" unless they say.
  const asked = await textus.ui.input({ prompt: t("namePrompt"), value: t("folderName") });
  if (asked === null || asked === undefined) return;
  const named = notionImport.cleanName(String(asked).trim() || t("folderName"));
  const target = await freeFolder(root, named);
  let report;
  try {
    report = await textus.ui.withProgress(t("importing"), async (progress, signal) => {
      progress({ message: t("reading") });
      const from = await sourceOf(source, stat, signal);
      if (signal.aborted) return false;
      if (!notionImport.isExport(from.paths)) return null;
      await textus.files.createFolder(target);
      return notionImport.importExport({
        ...from,
        signal,
        // Where the import sits in the open folder: a database shown on another page names its folder from there.
        prefix: folderPaths.rel(root, target) || "",
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
  } finally {
    claimed.delete(target);
  }
  if (report === false) return;
  if (!report) return textus.ui.message(t("notExport", name));
  const suggestions = await stillMissing(notionImport.recommend(report.stats));
  await context.storage.global.set(RECOMMENDED, suggestions.map((s) => s.id));
  const page = join(target, await freeName(t("reportName"), (name) => textus.files.stat(join(target, name)), { ext: ".md" }));
  await textus.files.create(page, notionImport.reportPage(report, suggestions, t, { source: name, date: today() }));
  await textus.layout.open(page);
  const where = folderPaths.rel(root, target) || target;
  textus.ui.notice(report.stopped ? t("cancelled", where) : t("done", report.pages + report.rows, report.databases, where));
}

async function stillMissing(suggestions) {
  const out = [];
  for (const s of suggestions) if ((await textus.plugins.get(s.id).catch(() => null)) === null) out.push(s);
  return out;
}

/** The last import's suggestions, one to install: Textus asks first and shows its permissions. */
async function recommend() {
  const ids = (await context.storage.global.get(RECOMMENDED)) || [];
  const left = await stillMissing(ids.map((id) => ({ id, why: "why." + id })));
  if (!left.length) return textus.ui.message(t("noTips"));
  const id = await textus.ui.pick(
    left.map((s) => ({ label: t("plugin." + s.id), detail: t(s.why), value: s.id })),
    { placeholder: t("recommendPick") },
  );
  if (!id) return;
  const offered = await textus.commands.execute("textus.offerPlugin", { id, reason: t("why." + id) }).catch(() => false);
  // Declined, muted, offline, or a Textus too old to be asked: say where the plugin is.
  if (offered !== true) await textus.ui.notice(t("offerFallback", t("plugin." + id)));
}

exports.activate = function (ctx) {
  context = ctx;
  ctx.subscriptions.push(
    textus.commands.register("catvinci.notion-import.import", importNotion),
    textus.commands.register("catvinci.notion-import.recommend", recommend),
  );
};
