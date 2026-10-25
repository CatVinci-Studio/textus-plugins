// Tasks: every Markdown task in the open folder's documents - "- [ ] …" and
// "- [x] …" - gathered into the sidebar, by document, under the heading
// each sits beneath. Ticking one writes that one line of its file, after
// checking the line still says what was listed.
let panel = null;

const TASK = /^(\s*(?:[-*+]|\d+[.)])\s+\[)( |x|X)(\]\s+)(.*)$/;
const HEADING = /^#{1,6}\s+(.*?)\s*#*\s*$/;

/** The tasks of one document's text, with the line each is on. */
function tasksIn(text) {
  const out = [];
  let heading = null;
  let fenced = false;
  // A file written on Windows ends its lines with \r\n.
  text.split(/\r?\n/).forEach(function (line, index) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) return;
    const h = HEADING.exec(line);
    if (h) heading = h[1];
    const m = TASK.exec(line);
    if (m)
      out.push({
        line: index,
        done: m[2] !== " ",
        text: m[4].trim(),
        heading: heading,
      });
  });
  return out;
}

async function scan() {
  const root = await textus.workspace.rootPath();
  if (!root) return null;
  const { documents } = await textus.workspace.readDocuments();
  const files = [];
  for (const doc of documents) {
    const tasks = tasksIn(doc.text);
    if (tasks.length) files.push({ path: doc.path, rel: doc.rel, tasks: tasks });
  }
  return files;
}

let scanning = false;
let again = false;
async function refresh() {
  if (!panel) return;
  // One scan at a time; any number asked for meanwhile make one more.
  if (scanning) {
    again = true;
    return;
  }
  scanning = true;
  try {
    do {
      again = false;
      const files = await scan();
      if (panel)
        panel.postMessage({
          type: "tasks",
          files: files,
          showDone: await textus.settings.get("showDone"),
        });
    } while (again && panel);
  } catch {
    // The folder couldn't be read: the list stays as it was.
  } finally {
    scanning = false;
  }
}

// Saves come in runs (autosave, Save All): the folder is read again once
// they stop.
let timer = 0;
function changed() {
  clearTimeout(timer);
  timer = setTimeout(refresh, 400);
}

async function toggle(message) {
  const text = await textus.workspace.readText(message.path);
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const m = TASK.exec(lines[message.line] || "");
  // The file changed since it was listed: nothing is written; the list
  // is read again.
  if (!m || m[4].trim() !== message.text) return refresh();
  lines[message.line] = m[1] + (m[2] === " " ? "x" : " ") + m[3] + m[4];
  await textus.workspace.writeText(message.path, lines.join(eol));
  await refresh();
}

exports.activate = function () {
  textus.workspace.onDidSaveDocument(changed);
  textus.workspace.onDidChangeRoot(refresh);
  textus.settings.onDidChange(refresh);
  textus.window.registerWebviewViewProvider("catvinci.tasks.panel", {
    resolveWebviewView: async function (webview) {
      panel = webview;
      webview.onDidDispose(function () {
        if (panel === webview) panel = null;
      });
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready" || message.type === "refresh")
          await refresh();
        if (message.type === "toggle") await toggle(message);
        if (message.type === "open")
          await textus.window.openFile(
            message.path,
            message.heading ? { heading: message.heading } : undefined,
          );
      });
      const html = await textus.plugin.readText("panel.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
    },
  });
};
