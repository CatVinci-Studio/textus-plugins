// Slides: the document in front as a Marp deck - slides apart at each
// "---" - shown in a tab that follows the writing, and saved as one HTML
// file to present from any browser. Obsidian's ![[picture.png]] shows as
// a picture; the tab shows pictures from the folder as data it is sent.

/* global Marp, slideEmbeds, folderPaths */
const t = (key, ...args) => textus.l10n.t(key, ...args);
let ctxRef = null;
const views = new Set();

function render(markdown) {
  const marp = new Marp({ html: false, math: "katex", script: false });
  return marp.render(markdown || "");
}

const { slash, native } = folderPaths;
const dirOf = (path) => path.slice(0, path.lastIndexOf("/"));

/** Where `target`, a picture embedded in `doc`, is: as Textus resolves
 *  the link, else beside the document, from the folder's top, or the
 *  shortest path ending in it - Obsidian's ways. Null for none. */
async function pictureAt(target, doc) {
  const linked = await textus.metadata.resolveLink("[[" + target + "]]", doc).catch(() => null);
  if (linked) return linked;
  const root = await textus.files.root().catch(() => null);
  const tries = [slideEmbeds.join(dirOf(slash(doc)), target)];
  if (root) tries.push(slideEmbeds.join(slash(root).replace(/\/+$/, ""), target));
  for (const path of tries)
    if (await textus.files.stat(native(path, doc)).catch(() => null)) return native(path, doc);
  if (!root) return null;
  const found = (await textus.files.find("**/" + target.split("/").pop()).catch(() => []))
    .filter((f) => f.rel === target || f.rel.endsWith("/" + target))
    .sort((a, b) => a.rel.length - b.rel.length);
  return found.length ? found[0].path : null;
}

/** `text` with its picture embeds as Markdown images, by their path from
 *  the document `doc`. */
async function withPictures(text, doc) {
  const targets = slideEmbeds.targets(text);
  if (!doc || !targets.length) return text;
  const hrefs = {};
  for (const target of targets) {
    const found = await pictureAt(target, doc);
    hrefs[target] = found ? slideEmbeds.relative(slash(doc), slash(found)) : target;
  }
  return slideEmbeds.rewrite(text, hrefs);
}

const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml", ico: "image/x-icon" };
const pictures = new Map();

/** The deck's `html` with its pictures from the folder as data: the tab
 *  shows nothing else. Kept until a picture changes. */
async function inlinePictures(html, doc) {
  if (!doc) return html;
  const urls = {};
  for (const src of slideEmbeds.localSources(html)) {
    let rel;
    try {
      rel = decodeURI(src);
    } catch {
      continue;
    }
    if (!slideEmbeds.PICTURE.test(rel)) continue;
    const path = native(slideEmbeds.join(dirOf(slash(doc)), rel), doc);
    const stat = await textus.files.stat(path).catch(() => null);
    if (!stat || stat.isDir) continue;
    let kept = pictures.get(path);
    if (!kept || kept.modifiedMs !== stat.modifiedMs) {
      const bytes = new Uint8Array(await textus.files.read(path));
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000)
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      const ext = rel.split(".").pop().toLowerCase();
      kept = { modifiedMs: stat.modifiedMs, url: "data:" + (MIME[ext] || "image/" + ext) + ";base64," + btoa(binary) };
      pictures.set(path, kept);
    }
    urls[src] = kept.url;
  }
  return slideEmbeds.inline(html, urls);
}

/** The last deck, kept while the slides' own tab is in front. */
let deck = null;

async function update() {
  const text = await textus.editor.getText();
  if (text !== null) {
    const doc = await textus.editor.getPath();
    const shown = render(await withPictures(text, doc));
    deck = { html: await inlinePictures(shown.html, doc), css: shown.css };
  }
  if (deck) for (const view of views) void view.postMessage(deck);
}

/** A page that presents itself: the slides, ← → and Space to move, F for
 *  full screen. */
function standalone(title, html, css) {
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}
html,body{margin:0;height:100%;background:var(--stage-bg)}
div.marpit{height:100%;display:grid;place-items:center}
div.marpit>svg{display:none;width:100vw;height:100vh}
div.marpit>svg.on{display:block}
</style></head><body>${html}
<script>
const s=[...document.querySelectorAll("div.marpit>svg")];let i=Number(location.hash.slice(1))||0;
const show=(n)=>{i=Math.max(0,Math.min(s.length-1,n));s.forEach((x,k)=>x.classList.toggle("on",k===i));history.replaceState(null,"","#"+i)};
addEventListener("keydown",(e)=>{if(["ArrowRight","ArrowDown","PageDown"," "].includes(e.key))show(i+1);else if(["ArrowLeft","ArrowUp","PageUp"].includes(e.key))show(i-1);else if(e.key==="f")document.documentElement.requestFullscreen?.()});
addEventListener("click",(e)=>show(e.clientX>innerWidth/3?i+1:i-1));show(i);
</script></body></html>`;
}

/** The document in front saved as a deck beside it: the deck's path and
 *  how many slides it has; null for an unsaved document. */
async function writeDeck() {
  const path = await textus.editor.getPath();
  const text = await textus.editor.getText();
  if (!path || text === null) return null;
  const { html, css } = render(await withPictures(text, path));
  const target = path.replace(/\.(md|markdown)$/i, "") + ".slides.html";
  const name = path.split(/[\\/]/).pop();
  await textus.files.writeText(target, standalone(name, html, css));
  return { path: target, slides: (html.match(/<svg[^>]*data-marpit-svg/g) || []).length };
}

async function exportHtml() {
  const deck = await writeDeck();
  if (!deck) return textus.ui.notice(t("saveFirst"), { tone: "warning" });
  textus.ui.notice(t("exported", deck.path.split(/[\\/]/).pop()));
}

/** Textus AI's tool. */
async function exportSlides() {
  const deck = await writeDeck();
  return deck || { error: "Open a saved Markdown document first: the deck is made from the document in front." };
}

exports.activate = function (ctx) {
  ctxRef = ctx;
  ctx.subscriptions.push(
    textus.views.registerWebview("catvinci.slides.view", {
      async resolve(webview) {
        const page = await ctxRef.plugin.readText("slides.html");
        webview.html = page.replace("{{lang}}", textus.env.language);
        // Drawn again in the interface's language when that changes.
        const relabel = textus.env.onDidChangeLanguage(() => {
          webview.html = page.replace("{{lang}}", textus.env.language);
        });
        webview.onDidDispose(() => relabel.dispose());
        views.add(webview);
        webview.onDidDispose(() => views.delete(webview));
        webview.onDidReceiveMessage((message) => {
          if (message === "ready") void update();
          if (message === "export") void exportHtml();
        });
      },
    }),
    textus.commands.register("catvinci.slides.present", async () => {
      // Read before the deck's tab takes the front.
      await update();
      await textus.layout.openView("catvinci.slides.view", { where: "beside" });
    }),
    textus.commands.register("catvinci.slides.export", exportHtml),
    textus.ai.registerTool("export_slides", exportSlides),
    textus.editor.onDidChange(update),
    textus.editor.onDidChangeActive(update),
  );
};
