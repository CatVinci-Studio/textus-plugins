// MDX: an .mdx document checked with MDX's own compiler, its problem
// underlined where it is; drawn beside it with none of its code run
// (preview.html); turned into Markdown and back, saved beside it.
// lib/mdx.js is textusMdx (vendor-src/mdx.mjs).
const VIEW = "catvinci.mdx.preview";
const t = (key, ...args) => textus.l10n.t(key, ...args);
const isMdx = (path) => /\.mdx$/i.test(path || "");

/** The last text checked and what was found, so a scroll checks nothing. */
let checked = { text: null, problems: [] };
async function problemsOf(text) {
  if (checked.text !== text) checked = { text, problems: await textusMdx.check(text) };
  return checked.problems;
}

const lineAt = (text, offset) => text.slice(0, offset).split("\n").length;

/** Each block's first and last line in `text`, found in order. */
function blockLines(text, blocks) {
  const lines = [];
  let at = 0;
  for (const block of blocks) {
    const found = text.indexOf(block.markdown, at);
    if (found < 0) continue;
    at = found + block.markdown.length;
    lines.push({ block, from: lineAt(text, found), to: lineAt(text, at) });
  }
  return lines;
}

async function decorate(blocks) {
  if (!isMdx(await textus.editor.getPath())) return [];
  const text = await textus.editor.getText();
  if (text === null) return [];
  const marks = [];
  for (const problem of await problemsOf(text)) {
    const at = blockLines(text, blocks).find((b) => problem.line >= b.from && problem.line <= b.to);
    if (!at) continue;
    const words = text.split("\n")[problem.line - 1]?.trim();
    marks.push({
      block: at.block.id,
      anchor: words && at.block.markdown.includes(words) ? words : undefined,
      style: "underline",
      tone: "danger",
      tooltip: t("problem", problem.line, problem.message),
    });
  }
  return marks;
}

/** Textus AI's tool: what MDX's compiler says of some MDX, a file, or the
 *  document in front. */
async function checkMdx(input) {
  let text = typeof input.text === "string" ? input.text : null;
  if (text === null && typeof input.path === "string") text = await textus.files.readText(input.path);
  if (text === null) text = await textus.editor.getText();
  if (text === null) return { error: "Give the MDX to check, a file's path, or open a document." };
  const problems = await textusMdx.check(text);
  return problems.length ? { ok: false, problems } : { ok: true };
}

/** The document in front converted and saved beside it, then opened. */
async function convert(from, to, change) {
  const path = await textus.editor.getPath();
  const text = await textus.editor.getText();
  if (!path || text === null) return textus.ui.notice(t("saveFirst"), { tone: "warning" });
  if (!from.test(path)) return textus.ui.notice(t(to === ".md" ? "notMdx" : "notMarkdown"));
  let out;
  try {
    out = change(text);
  } catch (error) {
    return textus.ui.notice(t("unreadable", error.line ?? 1, error.reason ?? error.message), { tone: "warning" });
  }
  const written = await textus.files.create(path.replace(from, to), out, { unique: true });
  await textus.layout.open(written);
}

/** The preview pages open, each sent the drawing when it changes. */
const views = new Set();
let shown = null;
async function update(to) {
  if (!views.size) return;
  const path = await textus.editor.getPath();
  const text = await textus.editor.getText();
  // Another kind of document in front: the last MDX stays drawn.
  if (isMdx(path) && text !== null) {
    const html = textusMdx.toHtml(text);
    const problems = await problemsOf(text);
    shown = { html, problem: problems[0] ? t("problem", problems[0].line, problems[0].message) : null };
  }
  const message = shown ?? { html: null, empty: t("empty") };
  for (const view of to ? [to] : views) void view.postMessage(message);
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.editor.registerDecorations({ decorate }),
    textus.ai.registerTool("check_mdx", checkMdx),
    textus.views.registerWebview(VIEW, {
      async resolve(webview) {
        webview.html = await ctx.plugin.readText("preview.html");
        views.add(webview);
        webview.onDidDispose(() => {
          views.delete(webview);
          if (!views.size) shown = null;
        });
        webview.onDidReceiveMessage((message) => {
          if (message === "ready") void update(webview);
        });
      },
    }),
    textus.commands.register("catvinci.mdx.preview", () => textus.layout.openView(VIEW, { where: "beside" })),
    textus.commands.register("catvinci.mdx.toMarkdown", () => convert(/\.mdx$/i, ".md", textusMdx.mdxToMarkdown)),
    textus.commands.register("catvinci.mdx.toMdx", () => convert(/\.(md|markdown)$/i, ".mdx", textusMdx.markdownToMdx)),
    textus.editor.onDidChange(() => update()),
    textus.editor.onDidChangeActive(() => update()),
  );
};
