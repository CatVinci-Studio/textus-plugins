// OCR: scanned PDFs and pictures read into Markdown by an OCR model on this
// computer - Xiaomi-OCR-0 by default - served by Ollama or any
// OpenAI-compatible server. The model is downloaded only when the user says
// so. A PDF's pages are drawn in the plugin's page (pdf.js) and read one by
// one there, with a Stop; a picture is read at once.
/* global folderPaths */
let ctx;
const t = (key, ...args) => textus.l10n.t(key, ...args);
const IMAGES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const PROMPT = "Convert this page to Markdown. Keep tables as Markdown tables and formulas as LaTeX.";
const RUN_VIEW = "catvinci.ocr.run";

const extOf = (path) => (/\.([^./\\]+)$/.exec(path) || [])[1]?.toLowerCase() || "";
const readable = (path) => extOf(path) === "pdf" || extOf(path) in IMAGES;

async function settings() {
  const server = String((await textus.settings.get("server")) || "http://localhost:11434").replace(/\/+$/, "");
  const model = String((await textus.settings.get("model")) || "richardyoung/xiaomi-ocr-0");
  return { server, model };
}

async function getJson(url, init) {
  const response = await textus.net.fetch(url, init);
  if (!response.ok) throw new Error(url + ": " + response.status + " " + (await response.text()).slice(0, 200));
  return JSON.parse(await response.text());
}

/** Whether the model is there to read with: the server answers and has it;
 *  else says what is missing, and downloads the model only if asked. */
async function ready() {
  const { server, model } = await settings();
  let names;
  try {
    // Ollama lists its models; another server answers the OpenAI way.
    names = (await getJson(server + "/api/tags")).models.map((m) => m.name);
  } catch {
    try {
      names = (await getJson(server + "/v1/models")).data.map((m) => m.id);
    } catch {
      await textus.ui.message(t("noServer", server));
      return false;
    }
  }
  if (names.some((n) => n === model || n === model + ":latest")) return true;
  const ok = await textus.ui.confirm(t("askDownload", model), { okLabel: t("download") });
  if (!ok) return false;
  try {
    await textus.ui.withProgress(t("downloading", model), async () => {
      await getJson(server + "/api/pull", { method: "POST", body: JSON.stringify({ model: model, stream: false }) });
    });
    return true;
  } catch (e) {
    await textus.ui.message(t("downloadFailed", model, String((e && e.message) || e)), { tone: "error" });
    return false;
  }
}

/** One page or picture (base64 of `type`) read into Markdown. */
async function recognize(base64, type) {
  const { server, model } = await settings();
  const reply = await getJson(server + "/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: "data:" + type + ";base64," + base64 } },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    }),
  });
  return String(reply.choices[0].message.content || "").trim();
}

function base64Of(bytes) {
  let text = "";
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(text);
}

/** Runs waiting for their page: by path. */
const runs = new Map();

/** `path` read into Markdown: a picture at once, a PDF page by page in the
 *  plugin's page, which shows the progress and can stop it. */
async function read(path, pages) {
  if (extOf(path) in IMAGES) {
    const bytes = await textus.files.read(path);
    return textus.ui.withProgress(t("reading", path.split(/[\\/]/).pop()), () =>
      recognize(base64Of(bytes), IMAGES[extOf(path)]),
    );
  }
  return new Promise((resolve, reject) => {
    runs.set(path, { resolve: resolve, reject: reject, pages: pages || null, parts: [] });
    textus.layout
      .openView(RUN_VIEW, { where: "beside", title: t("runTitle", path.split(/[\\/]/).pop()), state: { path: path } })
      .catch(reject);
  });
}

/** The plugin's page for one PDF: sends its bytes, reads each page it
 *  draws, and tells it how each went. */
async function resolveRun(webview, state) {
  const path = state && state.path;
  webview.html = await ctx.plugin.readText("run.html");
  webview.onDidReceiveMessage(async (message) => {
    const run = runs.get(path);
    if (message.type === "ready") {
      if (!run) return webview.postMessage({ type: "gone" });
      const bytes = await textus.files.read(path);
      return webview.postMessage({ type: "pdf", bytes: bytes, pages: run.pages });
    }
    if (!run) return;
    if (message.type === "page") {
      try {
        const text = await recognize(message.png, "image/png");
        run.parts.push("<!-- " + t("pageMark", message.number) + " -->\n\n" + text);
        webview.postMessage({ type: "read", number: message.number });
      } catch (e) {
        runs.delete(path);
        run.reject(e);
        webview.postMessage({ type: "failed", message: String((e && e.message) || e) });
      }
    }
    if (message.type === "done" || message.type === "stopped") {
      runs.delete(path);
      run.resolve(run.parts.join("\n\n"));
    }
    if (message.type === "failed") {
      runs.delete(path);
      run.reject(new Error(message.message));
    }
  });
  webview.onDidDispose(() => {
    const run = runs.get(path);
    if (run) {
      runs.delete(path);
      run.resolve(run.parts.join("\n\n"));
    }
  });
}

/** The command: `path` (the file tree's, else the file in front) read and
 *  written beside it as Markdown, then opened. */
async function convert(path) {
  const target = typeof path === "string" ? path : await textus.editor.getPath();
  if (!target || !readable(target)) return textus.ui.message(t("notReadable"));
  if (!(await ready())) return;
  let text;
  try {
    text = await read(target);
  } catch (e) {
    return textus.ui.message(t("failed", String((e && e.message) || e)), { tone: "error" });
  }
  if (!text.trim()) return textus.ui.notice(t("nothingRead"));
  const md = target.replace(/\.[^./\\]+$/, "") + ".md";
  const written = await textus.files.create(md, text + "\n", { unique: true });
  await textus.layout.open(written);
}

/** Textus AI's tool: a scanned PDF or a picture of the open folder, read. */
async function readWithOcr(input) {
  const root = await textus.files.root();
  const rel = root && input.path && folderPaths.clean(root, input.path, false);
  if (!rel) return { error: "path must be a PDF's or a picture's path in the open folder." };
  const path = folderPaths.abs(root, rel);
  if (!readable(path)) return { error: "OCR reads PDFs and PNG, JPEG or WebP pictures." };
  if (!(await ready())) return { error: "The OCR model isn't available; the user was told how to set it up." };
  const pages = Array.isArray(input.pages) ? input.pages.map(Number).filter((n) => n > 0) : null;
  const text = await read(path, pages && pages.length ? pages : null);
  return { file: rel, note: "Read by OCR: may hold recognition errors.", text: text };
}

exports.activate = function (context) {
  ctx = context;
  textus.commands.register("catvinci.ocr.convert", convert);
  textus.ai.registerTool("read_with_ocr", readWithOcr);
  textus.views.registerWebview(RUN_VIEW, { resolve: (webview, c) => resolveRun(webview, c && c.state) });
};
