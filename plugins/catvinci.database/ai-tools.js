// Database's tools for Textus AI: read a database's rows, add one, or make
// a new database. Loaded before host.js, which registers them.

/** "rating,-date": a sort, key by key, "-" for descending. */
function sortOf(text) {
  return String(text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.startsWith("-") ? { key: s.slice(1), desc: true } : { key: s, desc: false }));
}

/** A row: a note in `folder` named for it, its properties in its front matter. */
async function makeRow(folder, row) {
  const title = pages.fileName(String(row.name || ""));
  if (!title) return false;
  const file = join(root, (folder ? folder + "/" : "") + title + ".md");
  if (await textus.files.stat(file)) return false;
  await textus.files.create(file, "# " + String(row.name).trim() + "\n" + (row.body ? "\n" + row.body + "\n" : ""));
  if (row.properties && typeof row.properties === "object")
    await textus.files.frontmatter.update(file, (fm) => Object.assign(fm, row.properties));
  return true;
}

/** The database a tool names - a folder in the open folder - and its unit page's base. */
async function databaseOf(name) {
  root = await textus.files.root();
  if (!root) return { error: t("needsFolder") };
  const folder = folderPaths.clean(root, name, false);
  if (!folder) return { error: "database must be its folder's path in the open folder." };
  const page = folder + "/" + folder.slice(folder.lastIndexOf("/") + 1) + ".md";
  const text = await textus.files.readText(join(root, page)).catch(() => "");
  const m = /^```base[^\n]*\n([\s\S]*?)^```/m.exec(text);
  const parsed = m ? database.parseBase(m[1]) : { error: "none" };
  if (parsed.error) return { folder, page: folder + "/_.md", base: { filters: { and: ["file.inFolder(this.file.folder)"] }, views: [{ type: "table" }] } };
  return { folder, page, base: parsed.base };
}

/** Textus AI's tool: a database's rows, filtered and sorted. */
async function queryRows(input) {
  const db = await databaseOf(input.database);
  if (db.error) return db;
  const { rows } = database.rowsOf(db.base, await textus.metadata.all(), db.page);
  if (!rows.length) return { error: "No notes in " + db.folder + "." };
  const filters = [].concat(input.filter || []).map((f) => ({ raw: String(f) }));
  const sort = sortOf(input.sort);
  const shown = database.viewRows(rows, { filters, sort }, db.page);
  const limit = Math.max(1, Number(input.limit) || 100);
  return {
    database: db.folder,
    total: shown.length,
    rows: shown.slice(0, limit).map((r) => ({
      name: r.name,
      path: r.rel,
      properties: Object.fromEntries(Object.entries(r.props).map(([k, v]) => [k, plain(v)])),
    })),
  };
}

/** Textus AI's tool: one more row in a database. */
async function addRowTool(input) {
  const db = await databaseOf(input.database);
  if (db.error) return db;
  await textus.files.createFolder(join(root, db.folder)).catch(() => {});
  if (!(await makeRow(db.folder, input)))
    return { error: input.name ? "A row named " + input.name + " is there already." : "The row has no name." };
  return { database: db.folder, path: db.folder + "/" + pages.fileName(String(input.name)) + ".md" };
}

/** Textus AI's tool: a folder unit of notes with these properties, its
 *  page holding the base, and a link to it for the AI to put where the user wants. */
async function createDatabase(input) {
  root = await textus.files.root();
  if (!root) return { error: t("needsFolder") };
  const doc = await textus.editor.getPath();
  const docRel = relOf(doc);
  const dir = docRel && docRel.includes("/") ? docRel.slice(0, docRel.lastIndexOf("/")) : "";
  const title = String(input.name || "Database").trim();
  const name = pages.fileName(title);
  const folder = (dir ? dir + "/" : "") + name;
  await textus.files.createFolder(join(root, folder)).catch(() => {});
  let made = 0;
  for (const row of Array.isArray(input.rows) ? input.rows.slice(0, 400) : []) if (await makeRow(folder, row)) made++;
  const view = database.VIEWS.includes(input.view) ? input.view : "table";
  const spec = {};
  if (input.sort)
    spec.sort = sortOf(input.sort);
  if (input.group) spec.group = String(input.group);
  const base = database.setView(database.unitBase(view), 0, spec);
  const page = folder + "/" + name + ".md";
  if (!(await textus.files.stat(join(root, page))))
    await textus.files.create(join(root, page), "# " + title + "\n\n```base\n" + database.writeBase(base) + "```\n");
  const from = (await textus.editor.getPath().catch(() => null)) || join(root, page);
  const link = await linkStyle.linkTo(join(root, page), from, { alias: title });
  return { folder, page, documents: made, link, note: t("aiNote") };
}
