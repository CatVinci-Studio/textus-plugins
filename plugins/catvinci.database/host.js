// Workspace's databases: Obsidian bases - ```base blocks in a note and
// .base files - drawn as a table, a board, a calendar, a gallery or a list
// of the notes their filters choose, front matter the columns. Edits in a
// view go to those notes' front matter, or to the base's own views; New
// makes a note. Also Textus AI's tools for databases.

/* global database, dataview, folderPaths, activatePages, linkStyle */
const t = (key, ...args) => textus.l10n.t(key, ...args);
const STRINGS = [
  "table", "board", "calendar", "gallery", "list", "page", "add", "count", "empty",
  "noValue", "noGroup", "noDate", "today", "prev", "next", "missing", "locale",
  "filter", "sort", "addFilter", "addSort", "ascending", "descending", "remove",
  "is", "isNot", "contains", "notContains", "isEmpty", "notEmpty", "greater", "less",
  "value", "search", "create", "clear", "untitled", "newProperty", "propertyName",
  "type", "rename", "hide", "deleteProperty", "showAll", "open", "addView", "renameView", "deleteView", "skipped", "notBase", "unknownView",
  "type.text", "type.number", "type.select", "type.tags", "type.date", "type.checkbox", "type.url",
];

let root = null;
/** The bases on screen, each sending itself again. */
const live = new Set();

const join = folderPaths.abs;
const relOf = (path) => folderPaths.rel(root, path);
const fileName = (title) => title.trim().replace(/[\\/:*?"<>|#^[\]]/g, "-");
const empty = (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length);

/** Front matter values as the page can show them: dates as their day. */
function plain(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(plain);
  return value;
}

// Obsidian's property types, .obsidian/types.json, when the folder is a vault.
const TYPES_FILE = ".obsidian/types.json";
async function obsidianTypes() {
  try {
    const parsed = JSON.parse(await textus.files.readText(join(root, TYPES_FILE)));
    return parsed && parsed.types && typeof parsed.types === "object" ? parsed.types : {};
  } catch {
    return {};
  }
}
/** A property's type kept where Obsidian keeps it; false when the folder isn't a vault. */
async function setObsidianType(key, kind) {
  if (!(await textus.files.stat(join(root, ".obsidian")))) return false;
  let parsed = {};
  try {
    parsed = JSON.parse(await textus.files.readText(join(root, TYPES_FILE)));
  } catch {
    parsed = {};
  }
  parsed.types = { ...(parsed.types || {}), [key]: database.TO_OBSIDIAN[kind] || "text" };
  await textus.files.writeText(join(root, TYPES_FILE), JSON.stringify(parsed, null, 2) + "\n");
  return true;
}

/** What a base's page draws: view `index` of `target`'s base. */
async function snapshot(target, index) {
  root = await textus.files.root();
  const parsed = database.parseBase(target.source());
  if (parsed.error) return { error: t("notBase"), detail: parsed.error, strings: strings() };
  if (!root) return { missing: true, strings: strings() };
  const base = parsed.base;
  const i = Math.min(Math.max(0, index | 0), base.views.length - 1);
  const spec = database.viewSpec(base, i);
  const self = relOf(target.path);
  const { rows: chosen, skipped } = database.rowsOf(base, await textus.metadata.all(), self);
  const rows = chosen.map((r) => ({
    rel: r.rel,
    name: r.name,
    file: r.file,
    props: Object.fromEntries(Object.entries(r.props).map(([k, v]) => [k, plain(v)])),
  }));
  const types = database.typesOf(rows, await obsidianTypes(), spec.kinds);
  const shown = database.viewRows(rows, spec, self, database.formulasOf(base));
  const keys = [...new Set([...Object.keys(types), ...(spec.columns || [])])].filter((k) => k !== "icon" && k !== "cover" && k !== "name");
  const options = {};
  for (const k of keys) if (types[k] === "select" || types[k] === "tags") options[k] = database.options(rows, k);
  const group = database.groupKey(spec, rows, types);
  return {
    spec,
    index: i,
    views: spec.views,
    folder: database.folderOf(base, self),
    rows: shown.map((r) => ({ rel: r.rel, name: r.name, props: r.props })),
    columns: database.columnsOf(spec, rows).filter((k) => k !== "name"),
    keys,
    types,
    options,
    group,
    groups: database.groups(shown, group, spec.groupOrder).map((g) => ({ value: g.value, rels: g.rows.map((r) => r.rel) })),
    date: database.dateKey(spec, types),
    end: spec.end || Object.keys(types).find((k) => types[k] === "date" && /end|until|due/i.test(k)) || null,
    skipped: skipped.concat(spec.filters.filter((f) => f.raw !== undefined).map((f) => f.raw)),
    strings: strings(),
  };
}

function strings() {
  return Object.fromEntries(STRINGS.map((k) => [k, t(k)]));
}

/** A new note in `folder`, its front matter `props`; its title typed in
 *  the view, or asked for. */
async function addRow(folder, props, typed) {
  const title = typed || (await textus.ui.input({ prompt: t("newTitle") }));
  if (!title || !title.trim()) return;
  const file = join(root, (folder ? folder + "/" : "") + fileName(title) + ".md");
  if (await textus.files.stat(file)) return textus.ui.message(t("exists", title.trim()));
  if (folder) await textus.files.createFolder(join(root, folder)).catch(() => {});
  await textus.files.create(file, "# " + title.trim() + "\n");
  const set = Object.fromEntries(Object.entries(props || {}).filter(([, v]) => !empty(v)));
  if (Object.keys(set).length) await textus.files.frontmatter.update(file, (fm) => Object.assign(fm, set));
}

async function setProp(rel, key, value) {
  await textus.files.frontmatter.update(join(root, rel), (fm) => {
    if (empty(value)) delete fm[key];
    else fm[key] = value;
  });
}

/** Every note the base chooses, view filters aside. */
async function rowsOfBase(target) {
  const parsed = database.parseBase(target.source());
  if (parsed.error) return { base: null, rows: [] };
  return { base: parsed.base, rows: database.rowsOf(parsed.base, await textus.metadata.all(), relOf(target.path)).rows };
}

/** Property `from` called `to` in every row, in the same place, and in the base's views. */
async function renameProp(target, from, to) {
  if (to === undefined) to = (await textus.ui.input({ prompt: t("rename"), value: from })) || "";
  to = to.trim();
  if (!to || to === from) return;
  const { base, rows } = await rowsOfBase(target);
  if (!base) return;
  for (const row of rows)
    if (from in row.props)
      await textus.files.frontmatter.update(join(root, row.rel), (fm) =>
        Object.fromEntries(Object.entries(fm).map(([k, v]) => [k === from ? to : k, v])),
      );
  await target.setSource(database.writeBase(database.renameKey(base, from, to)));
}

async function deleteProp(target, key) {
  const { base, rows } = await rowsOfBase(target);
  if (!base) return;
  const using = rows.filter((r) => key in r.props);
  if (using.length && !(await textus.ui.confirm(t("deleteAsk", key, using.length), { okLabel: t("deleteProperty"), danger: true }))) return;
  for (const row of using)
    await textus.files.frontmatter.update(join(root, row.rel), (fm) => {
      delete fm[key];
      return fm;
    });
  await target.setSource(database.writeBase(database.dropKey(base, key)));
}

/** A page renamed in the view: its file, the links to it, and its title. */
async function renamePage(rel, title) {
  title = title.trim();
  const dir = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/") + 1) : "";
  const old = rel.slice(dir.length).replace(/\.md$/i, "");
  if (!title || title === old) return;
  const to = join(root, dir + fileName(title) + ".md");
  if (await textus.files.stat(to)) return textus.ui.message(t("exists", title));
  await textus.files.rename(join(root, rel), to, { updateLinks: true });
  await textus.files.process(to, (text) => text.replace(/^(---\n[\s\S]*?\n---\n+)?# .*$/m, (line, fm) => (fm || "") + "# " + title));
}

/** The base changed by `change(base)`, written back. */
async function changeBase(target, change) {
  const parsed = database.parseBase(target.source());
  if (parsed.error) return;
  await target.setSource(database.writeBase(change(parsed.base)));
}

/** A view's kinds of property: those Obsidian keeps in its types file go
 *  there when the folder is a vault, the rest (select, url) in the base. */
async function kindsOf(types) {
  const kinds = {};
  for (const [key, kind] of Object.entries(types))
    kinds[key] = kind === "select" || kind === "url" || !(await setObsidianType(key, kind)) ? kind : null;
  return kinds;
}

/**
 * Draws `target` - a ```base block, or a .base file - in `webview`.
 * `target`: { path, source(), setSource(text), onDidChange(fn) }.
 */
function draw(target, webview, context) {
  return context.plugin.readText("view.html").then((html) => {
    webview.html = html;
    // The view in front: the page keeps it (each reader's own), and says.
    let index = 0;
    let sent = 0;
    const send = async () => {
      const mine = ++sent;
      const data = await snapshot(target, index).catch((err) => ({ error: String((err && err.message) || err), strings: strings() }));
      if (mine === sent) webview.postMessage({ type: "data", data });
    };
    // Each reader's view, on this device only: not in the file.
    const store = context.storage.global;
    const remembered = () => store.get("view:" + target.key()).then((v) => v || {}, () => ({}));
    const remember = async (change) =>
      store.set("view:" + target.key(), Object.assign(await remembered(), change)).catch(() => {});
    const select = (i) => {
      index = i;
      void remember({ index });
      webview.postMessage({ type: "selected", index });
    };
    live.add(send);
    webview.onDidDispose(() => live.delete(send));
    target.onDidChange(send);
    webview.onDidReceiveMessage(async (m) => {
      if (!m) return;
      // View `at` (the one in front unless a menu named another) set to `spec`.
      const set = (spec, at = index) => changeBase(target, (base) => database.setView(base, Math.min(at, base.views.length - 1), spec));
      switch (m.type) {
        case "ready": {
          const kept = await remembered();
          index = typeof kept.index === "number" ? kept.index : m.index | 0;
          webview.postMessage({ type: "selected", index });
          return send();
        }
        case "select":
          index = m.index | 0;
          void remember({ index });
          return send();
        // A row opens in a tab, as a file does.
        case "open":
          return textus.layout.open(join(root, m.rel));
        case "set":
          return setProp(m.rel, m.key, m.value);
        case "add":
          return addRow(m.folder, m.props, m.title);
        case "view":
          return set({ view: m.view }, m.index ?? index);
        case "addView":
          return changeBase(target, (base) => {
            select(base.views.length);
            return database.addView(base, m.view, database.viewName(m.view));
          });
        case "renameView": {
          const name = ((await textus.ui.input({ prompt: t("renameView"), value: m.name || "" })) || "").trim();
          return name && set({ name }, m.index ?? index);
        }
        case "deleteView":
          return changeBase(target, (base) => {
            if (base.views.length < 2) return base;
            const gone = Math.min(m.index ?? index, base.views.length - 1);
            if (gone <= index) select(Math.max(0, index - 1));
            return { ...base, views: base.views.filter((_, n) => n !== gone) };
          });
        // Filters, sorts, columns, grouping, the board's order, as the view's menus set them.
        case "spec": {
          const spec = { ...m.spec };
          if (spec.types) {
            spec.kinds = await kindsOf(spec.types);
            delete spec.types;
          }
          return set(spec);
        }
        case "renameProp":
          return renameProp(target, m.from, m.to);
        case "deleteProp":
          return deleteProp(target, m.key);
        case "renamePage":
          return renamePage(m.rel, m.title);
        // What a menu can't hold - a name, a value - asked in Textus's own field.
        case "addProp": {
          const name = ((await textus.ui.input({ prompt: t("propertyName") })) || "").trim();
          if (!name) return;
          const columns = m.columns.includes(name) ? m.columns : m.columns.concat([name]);
          const spec = { columns };
          if (m.kind !== "text") spec.kinds = await kindsOf({ [name]: m.kind });
          return set(spec);
        }
        case "addFilter": {
          const value = m.value !== undefined ? m.value : await textus.ui.input({ prompt: t("value") });
          if (value === null || value === undefined) return;
          const parsed = database.parseBase(target.source());
          if (parsed.error) return;
          const spec = database.viewSpec(parsed.base, Math.min(index, parsed.base.views.length - 1));
          const others = spec.filters.filter((f, i) => i !== m.replace);
          return set({ filters: baseFilters.merge(others, { key: m.key, op: m.op, value: String(value).trim() }) });
        }
        case "newOption": {
          const value = ((await textus.ui.input({ prompt: t("create") })) || "").trim();
          if (!value) return;
          return setProp(m.rel, m.key, m.multi ? (m.current || []).concat([value]) : value);
        }
        case "move": {
          const fm = (await textus.files.frontmatter.get(join(root, m.rel))) || {};
          return setProp(m.rel, m.key, database.regroup(fm[m.key], m.from, m.to));
        }
        default:
          return undefined;
      }
    });
  });
}

/** A ```base block as a target. */
function blockTarget(block) {
  return {
    path: block.path,
    // Its place among the note's blocks: a reader's view is kept by it.
    key: () => block.path + "#" + (block.block ?? 0),
    source: () => block.source,
    setSource: (text) => block.setSource(text.replace(/\n$/, "")),
    onDidChange: (fn) => block.onDidChange(fn),
  };
}

/** A .base file as a target: `this` is the file itself, as in Obsidian. */
function fileTarget(file) {
  let text = "";
  const listeners = [];
  const reload = async () => {
    text = await file.readText();
    listeners.forEach((fn) => fn());
  };
  return {
    path: file.path,
    key: () => file.path,
    ready: reload(),
    source: () => text,
    setSource: async (next) => {
      text = next;
      await file.writeText(next);
      listeners.forEach((fn) => fn());
    },
    onDidChange: (fn) => listeners.push(fn),
    reload,
  };
}

/** A folder renamed or moved: bases that name it by its path - written by
 *  hand or in Obsidian - name it by its new one. */
async function followFolder(change) {
  root = await textus.files.root();
  const from = relOf(change.from);
  const to = relOf(change.to);
  if (!root || !from || !to || /\.[a-z0-9]+$/i.test(from)) return;
  const old = (q) => 'file.inFolder("' + from + q;
  for (const doc of await textus.metadata.all()) {
    if (!/\.(md|base)$/i.test(doc.rel)) continue;
    const path = join(root, doc.rel);
    const text = await textus.files.readText(path).catch(() => "");
    if (!text.includes(old('"')) && !text.includes(old("/"))) continue;
    await textus.files.process(path, (t) =>
      t.split(old('"')).join('file.inFolder("' + to + '"').split(old("/")).join('file.inFolder("' + to + "/"),
    );
  }
}

/** A database at the caret: a folder unit for it beside the note, its
 *  page holding the base, and a link to it here. */
async function newDatabase() {
  root = await textus.files.root();
  const doc = await textus.editor.getPath();
  if (!root || !doc || !relOf(doc)) return textus.ui.message(t("needsSaved"));
  const name = await textus.ui.input({ prompt: t("dbName") });
  if (!name || !name.trim()) return;
  const docRel = relOf(doc);
  const dir = docRel.includes("/") ? docRel.slice(0, docRel.lastIndexOf("/")) : "";
  const folder = (dir ? dir + "/" : "") + fileName(name);
  const page = folder + "/" + fileName(name) + ".md";
  await textus.files.createFolder(join(root, folder)).catch(() => {});
  if (!(await textus.files.stat(join(root, page))))
    await textus.files.create(join(root, page), "# " + name.trim() + "\n\n```base\n" + database.writeBase(database.unitBase("table")) + "```\n");
  // The link the folder writes (its style and path rules), named as asked.
  await textus.editor.insertText((await linkStyle.linkTo(join(root, page), doc, { alias: name.trim() })) + "\n");
}

/** The ```dataview block holding the selection - else the only one, or one
 *  picked - in place of itself as a ```base block, one undo step. */
async function fromDataview(editor) {
  const blocks = ((await editor.getBlocks()) || []).filter((b) => b.kind === "code" && dataview.blockQuery(b.markdown));
  const selected = ((await editor.getSelection()) || {}).text || "";
  const holding = selected.trim() ? blocks.filter((b) => b.markdown.includes(selected.trim())) : [];
  let block = holding.length === 1 ? holding[0] : blocks.length === 1 ? blocks[0] : null;
  if (!block && blocks.length > 1) {
    const id = await textus.ui.pick(
      blocks.map((b) => ({ label: b.markdown.split("\n")[1] || b.markdown, value: b.id })),
      { placeholder: t("dataviewPick") },
    );
    block = blocks.find((b) => b.id === id);
    if (!block) return;
  }
  if (!block) return textus.ui.notice(t("dataviewNone"));
  const found = dataview.blockQuery(block.markdown);
  const made = found.error ? found : dataview.toBase(found.query);
  if (!made.yaml) return textus.ui.notice(t("dataviewCant", made.error), { tone: "warning" });
  await editor.edit({ action: "replace", block: block.id, text: "```base\n" + made.yaml + "```" });
  if (made.warnings.length) await textus.ui.notice(t("dataviewLeftOut", made.warnings.join(" ")));
}

/** A row: a note in `folder` named for it, its properties in its front matter. */
async function makeRow(folder, row) {
  const title = fileName(String(row.name || ""));
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
  const sort = String(input.sort || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.startsWith("-") ? { key: s.slice(1), desc: true } : { key: s, desc: false }));
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
  return { database: db.folder, path: db.folder + "/" + fileName(String(input.name)) + ".md" };
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
  const name = fileName(title);
  const folder = (dir ? dir + "/" : "") + name;
  await textus.files.createFolder(join(root, folder)).catch(() => {});
  let made = 0;
  for (const row of Array.isArray(input.rows) ? input.rows.slice(0, 400) : []) if (await makeRow(folder, row)) made++;
  const view = database.VIEWS.includes(input.view) ? input.view : "table";
  const spec = {};
  if (input.sort)
    spec.sort = String(input.sort)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith("-") ? { key: s.slice(1), desc: true } : { key: s, desc: false }));
  if (input.group) spec.group = String(input.group);
  const base = database.setView(database.unitBase(view), 0, spec);
  const page = folder + "/" + name + ".md";
  if (!(await textus.files.stat(join(root, page))))
    await textus.files.create(join(root, page), "# " + title + "\n\n```base\n" + database.writeBase(base) + "```\n");
  const from = (await textus.editor.getPath().catch(() => null)) || join(root, page);
  const link = await linkStyle.linkTo(join(root, page), from, { alias: title });
  return { folder, page, documents: made, link, note: t("aiNote") };
}

exports.activate = function (ctx) {
  let pending = null;
  const again = () => {
    clearTimeout(pending);
    pending = setTimeout(() => live.forEach((send) => send()), 150);
  };
  ctx.subscriptions.push(
    textus.views.registerCodeBlock("base", { render: (b, w) => draw(blockTarget(b), w, ctx) }),
    textus.views.registerFileEditor("catvinci.database.base", {
      resolve: async (file, webview) => {
        const target = fileTarget(file);
        await target.ready;
        return draw(target, webview, ctx);
      },
    }),
    textus.commands.register("catvinci.database.new", newDatabase),
    textus.commands.registerEditorCommand("catvinci.database.fromDataview", fromDataview),
    textus.ai.registerTool("create_database", createDatabase),
    textus.ai.registerTool("query_rows", queryRows),
    textus.ai.registerTool("add_row", addRowTool),
    // A note edited here, or anywhere: every base on screen again.
    textus.files.onDidChangeRoot(again),
    textus.metadata.onDidChange(again),
    textus.files.onDidChange(again),
    textus.files.onDidCreate(again),
    textus.files.onDidDelete(again),
    textus.files.onDidRename(again),
    textus.files.onDidRename((change) => void followFolder(change)),
  );
  // Its pages tree, a module of its own (pages-host.js).
  activatePages(ctx);
};
