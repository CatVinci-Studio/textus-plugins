// Image Folder: a picture pasted or dropped into a document moves into
// "<document>.assets/" beside it, and the link with it; renaming the
// document in its folder renames that folder and its links. Textus saves
// the picture first (Settings › Images), so this follows its file events.
// Where Typora front matter or an Obsidian, Logseq or Dendron setting says where pictures go, they stay.
/* global imageFolder, folderPaths, freeName */
const WAIT_MS = 3000;
const STEP_MS = 150;

const { slash, native } = folderPaths;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The block of the document in front linking to one of `forms`, once the
 *  editor has written the link; null when it doesn't within a few seconds
 *  or another document comes to the front. */
async function blockLinking(doc, forms) {
  for (let waited = 0; waited <= WAIT_MS; waited += STEP_MS) {
    if (slash(await textus.editor.getPath()) !== doc) return null;
    const blocks = (await textus.editor.getBlocks()) || [];
    const block = blocks.find((b) => imageFolder.relink(b.markdown, forms, "\0") !== b.markdown);
    if (block) return block;
    await sleep(STEP_MS);
  }
  return null;
}

/** A path in `dir` for `name` no file has: "a.png", "a-1.png"… */
async function freePath(dir, name, like) {
  const dot = name.lastIndexOf(".");
  const taken = (candidate) => textus.files.stat(native(dir + "/" + candidate, like));
  return dir + "/" + (await freeName(name.slice(0, dot), taken, { ext: name.slice(dot), sep: "-", first: 1 }));
}

/** Whether the document's attachment rule (its front matter first, then
 *  its folder's) comes from an app that places pictures itself. */
async function appPlaces(doc) {
  let rule;
  try {
    rule = (await textus.files.conventions(doc)).attachments;
  } catch {
    return false;
  }
  if (!rule || rule.app !== "obsidian") return imageFolder.appPlaces(rule, null);
  // Its settings through Textus: plugins don't read .obsidian themselves.
  const app = await textus.files.appSettings("obsidian", "app.json", doc).catch(() => null);
  return app ? imageFolder.appPlaces(rule, app) : false;
}

const moving = new Set();

async function onCreate(event) {
  const like = event.path;
  const picture = slash(event.path);
  const doc = slash(await textus.editor.getPath());
  if (!imageFolder.shouldMove(doc, picture) || moving.has(picture)) return;
  if (await appPlaces(native(doc, like))) return;
  moving.add(picture);
  try {
    const forms = imageFolder.srcForms(doc, picture);
    const block = await blockLinking(doc, forms);
    if (!block) return;
    const assets = imageFolder.assetsOf(doc);
    await textus.files.createFolder(native(assets, like)).catch(() => {});
    const target = await freePath(assets, imageFolder.baseOf(picture), like);
    await textus.files.rename(native(picture, like), native(target, like));
    const src = imageFolder.baseOf(assets) + "/" + imageFolder.baseOf(target);
    try {
      await textus.editor.edit([{ action: "replace", block: block.id, text: imageFolder.relink(block.markdown, forms, src) }]);
    } catch (err) {
      // The link stayed as it was: so does the picture.
      await textus.files.rename(native(target, like), native(picture, like));
      throw err;
    }
  } finally {
    moving.delete(picture);
  }
}

/** A document renamed in its folder takes its picture folder along -
 *  unless another document links into that folder too. */
async function onRename(event) {
  const from = slash(event.from);
  const to = slash(event.to);
  if (!/\.md$/i.test(from) || !/\.md$/i.test(to) || imageFolder.dirOf(from) !== imageFolder.dirOf(to)) return;
  const oldAssets = imageFolder.assetsOf(from);
  const newAssets = imageFolder.assetsOf(to);
  const like = event.to;
  if (!(await textus.files.stat(native(oldAssets, like))) || (await textus.files.stat(native(newAssets, like)))) return;
  const oldName = imageFolder.baseOf(oldAssets);
  const found = await textus.metadata.search(oldName + "/", { limit: 100 }).catch(() => ({ hits: [] }));
  if (found.truncated || found.hits.some((h) => slash(h.path) !== to && slash(h.path) !== from)) return;
  await textus.files.rename(native(oldAssets, like), native(newAssets, like));
  await textus.files.process(event.to, (text) => imageFolder.rebase(text, oldName, imageFolder.baseOf(newAssets)));
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.files.onDidCreate((e) => onCreate(e).catch(() => {})),
    textus.files.onDidRename((e) => onRename(e).catch(() => {})),
  );
};
