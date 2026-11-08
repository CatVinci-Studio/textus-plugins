// Templates: Markdown files in the open folder's templates folder -
// Templates/, or the one the folder's app names (an Obsidian vault, Foam...)
// - filled in as they are used ({{date}}, {{time}}, {{title}},
// {{date:YYYY-MM-DD}}, and Templater's common <% tp.… %> tags) into a new
// document or at the caret. Templates kept in the plugin's storage before
// 0.3 are copied there once.
/* global folderConventions, folderPaths, dates, freeName, templater */
let ctx;
const t = (key, ...args) => textus.l10n.t(key, ...args);
const MOVED = "movedToFolder";

/** A template filled in for a document titled `title` in `folder` (in the
 *  open folder): {{date}} and {{time}} in the vault's Templates formats,
 *  then Templater's tags. Gives the text, the caret's offset or null, and
 *  the tags left as written. */
async function fill(root, text, title, folder) {
  const formats = await folderConventions.obsidianSettings(root, "templates.json");
  const language = textus.env.language;
  const filled = dates.fill(text, {
    language: language,
    dateFormat: formats.dateFormat,
    timeFormat: formats.timeFormat,
    values: { title: title },
  });
  return templater.fill(filled, { title: title, folder: folder, now: new Date(), language: language });
}

/** One notice naming the tags a template had that weren't run. */
function tellSkipped(filled) {
  const tags = [...new Set(filled.skipped.map((tag) => (tag.length > 48 ? tag.slice(0, 45) + "…" : tag)))];
  if (tags.length) textus.ui.notice(t("notRun", tags.join("  ")));
}

/** The caret put where the template's tp.file.cursor() was: `start` is
 *  where the template's text begins in the document in front. */
async function placeCaret(editor, filled, start) {
  if (filled.cursor === null) return;
  const doc = (await editor.getText()) || "";
  await editor.reveal(templater.place(doc, start + filled.cursor));
}

/** Where `after` (a document's text) first differs from `before`. */
function firstChange(before, after) {
  let i = 0;
  while (i < before.length && before[i] === after[i]) i++;
  return i;
}

/** `rel`'s folder in the open folder, "" for its top. */
const folderOf = (rel) => (rel || "").split("/").slice(0, -1).join("/");

/** The open folder and its templates folder; null without a folder. */
async function where() {
  const root = await textus.files.root();
  if (!root) return null;
  const rel = await folderConventions.templatesFolder(root);
  return { root: root, rel: rel, dir: folderPaths.abs(root, rel) };
}

/** `name`.md in `dir`, or "name 2.md"… when that is taken: nothing is
 *  ever written over. Returns the name used. */
async function createFree(dir, name, text) {
  const at = (candidate) => folderPaths.abs(dir, candidate + ".md");
  if ((await textus.files.readText(at(name)).catch(() => null)) === text) return name;
  const free = await freeName(name, async (candidate) => !!(await textus.files.stat(at(candidate))));
  await textus.files.create(at(free), text);
  return free;
}

/** Once: the templates kept in the plugin's storage, as files in the
 *  templates folder, with a notice saying where. The stored ones stay. */
async function moveStored(place) {
  if (await ctx.storage.global.get(MOVED)) return;
  const stored = (await ctx.storage.global.files()).filter((f) => f.endsWith(".md"));
  if (stored.length) {
    await textus.files.createFolder(place.dir).catch(() => {});
    for (const file of stored)
      await createFree(place.dir, file.replace(/\.md$/, ""), await ctx.storage.global.readText(file));
    textus.ui.notice(t("moved", stored.length, place.rel));
  }
  await ctx.storage.global.set(MOVED, true);
}

/** The templates in the folder: name (its path in the templates folder,
 *  without .md) and path. */
async function templates(place) {
  await moveStored(place);
  const prefix = place.rel + "/";
  return (await textus.files.find(place.rel + "/**/*.md").catch(() => []))
    .filter((f) => f.rel.startsWith(prefix))
    .map((f) => ({ name: f.rel.slice(prefix.length).replace(/\.md$/i, ""), path: f.path }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The templates; a first one is written when there are none. */
async function templatesOrStarter(place) {
  const found = await templates(place);
  if (found.length) return found;
  const starter =
    "# {{title}}\n\n{{date}} {{time}}\n\n## " + t("attendees") + "\n\n- \n\n## " + t("agenda") + "\n\n1. \n\n## " +
    t("actions") + "\n\n- [ ] \n";
  await textus.files.createFolder(place.dir).catch(() => {});
  const name = await createFree(place.dir, t("meeting"), starter);
  return [{ name: name, path: folderPaths.abs(place.dir, name + ".md") }];
}

async function pickTemplate(place) {
  const list = await templatesOrStarter(place);
  const path = await textus.ui.pick(
    list.map((tpl) => ({ label: tpl.name, value: tpl.path })),
    { placeholder: t("pick") },
  );
  const tpl = path && list.find((x) => x.path === path);
  return tpl ? { name: tpl.name.split("/").pop(), text: await textus.files.readText(tpl.path) } : null;
}

// Textus AI's tools.
async function listTemplates() {
  const place = await where();
  if (!place) return { error: t("needsFolder") };
  const out = [];
  for (const tpl of await templates(place)) out.push({ name: tpl.name, text: await textus.files.readText(tpl.path) });
  return { folder: place.rel, templates: out };
}

async function createFromTemplate(input) {
  const place = await where();
  if (!place) return { error: t("needsFolder") };
  const list = await templates(place);
  const wanted = String(input.template || "").replace(/\.md$/, "").toLowerCase();
  const tpl = list.find((x) => x.name.toLowerCase() === wanted);
  if (!tpl) return { error: "No template " + JSON.stringify(input.template) + "; there are: " + list.map((x) => x.name).join(", ") };
  const title = String(input.title || "").trim() || tpl.name.split("/").pop();
  const folder = folderPaths.clean(place.root, input.folder, false);
  if (folder === null) return { error: "folder must be in the open folder." };
  const rel = (folder ? folder + "/" : "") + title.replace(/[\\/:*?"<>|]/g, "-") + ".md";
  const path = folderPaths.abs(place.root, rel);
  if (await textus.files.stat(path)) return { error: t("exists", title) };
  if (folder) await textus.files.createFolder(folderPaths.abs(place.root, folder)).catch(() => {});
  const filled = await fill(place.root, await textus.files.readText(tpl.path), title, folder);
  await textus.files.create(path, filled.text);
  return filled.skipped.length
    ? { path: rel, template: tpl.name, notRun: filled.skipped }
    : { path: rel, template: tpl.name };
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_templates", listTemplates);
  textus.ai.registerTool("create_from_template", createFromTemplate);
  textus.commands.register("catvinci.templates.new", async function () {
    const place = await where();
    if (!place) return textus.ui.message(t("needsFolder"));
    const template = await pickTemplate(place);
    if (!template) return;
    const title = await textus.ui.input({ prompt: t("docName"), value: template.name });
    if (!title || !title.trim()) return;
    const path = folderPaths.abs(place.root, title.trim().replace(/[\\/:*?"<>|]/g, "-") + ".md");
    if (await textus.files.stat(path)) return textus.ui.message(t("exists", title.trim()));
    const filled = await fill(place.root, template.text, title.trim(), "");
    await textus.files.create(path, filled.text);
    await textus.layout.open(path);
    await placeCaret(textus.editor, filled, 0);
    tellSkipped(filled);
  });
  textus.commands.registerEditorCommand("catvinci.templates.insert", async function (editor) {
    const place = await where();
    if (!place) return textus.ui.message(t("needsFolder"));
    const template = await pickTemplate(place);
    if (!template) return;
    const path = (await editor.getPath()) || "";
    const title = path.split(/[\\/]/).pop().replace(/\.md$/i, "") || template.name;
    const filled = await fill(place.root, template.text, title, folderOf(folderPaths.rel(place.root, path)));
    const before = (await editor.getText()) || "";
    await editor.insertText(filled.text);
    await placeCaret(editor, filled, firstChange(before, (await editor.getText()) || ""));
    tellSkipped(filled);
  });
  textus.commands.registerEditorCommand("catvinci.templates.save", async function (editor) {
    const place = await where();
    if (!place) return textus.ui.message(t("needsFolder"));
    const name = await textus.ui.input({ prompt: t("templateName") });
    if (!name || !name.trim()) return;
    await textus.files.createFolder(place.dir).catch(() => {});
    const saved = await createFree(place.dir, name.trim().replace(/[\\/:*?"<>|]/g, "-"), (await editor.getText()) || "");
    textus.ui.notice(t("saved", saved, place.rel), { tone: "success" });
  });
};
