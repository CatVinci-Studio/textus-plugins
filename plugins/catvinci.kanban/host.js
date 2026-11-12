// Kanban: a board kept as Markdown - "## List" headings, "- [ ] card"
// tasks under them, the front matter Obsidian's Kanban writes - opened as
// a board in its own tab. The page (board.html) parses and writes the
// Markdown; this reads and writes the file.
/** What activate was given: the plugin's storage and own files. */
let ctx;

// A plain .md, known by its front matter as Obsidian's Kanban knows it.
const TEMPLATE = function () {
  const lists = ["todo", "doing", "done"].map((key) => textus.l10n.t(key));
  return (
    "---\nkanban-plugin: board\n---\n\n" +
    lists.map((l) => "## " + l + "\n").join("\n")
  );
};

const join = folderPaths.abs;

// Textus AI's tools: boards named by their path in the folder, lists by
// their title, cards by their text.

/* global folderPaths, kanbanMarkdown */
const NO_FOLDER = { error: "No folder is open." };

async function boardFile(name) {
  const root = await textus.files.root();
  if (!root) return null;
  let rel = folderPaths.clean(root, name, false);
  if (!rel) return { error: "board must be a board's path in the open folder." };
  // A name without .md: the plain board, else one kept as name.kanban.md.
  if (!/\.md$/i.test(rel)) {
    const plain = rel + ".md";
    const old = rel + ".kanban.md";
    rel = (await textus.files.stat(folderPaths.abs(root, old))) && !(await textus.files.stat(folderPaths.abs(root, plain))) ? old : plain;
  }
  return { rel: rel, path: folderPaths.abs(root, rel) };
}

const findList = (board, title) =>
  board.lists.find((l) => l.title.trim().toLowerCase() === String(title || "").trim().toLowerCase());

const noList = (board, title) => ({
  error: "No list " + JSON.stringify(title) + "; the board's lists: " + board.lists.map((l) => l.title).join(", "),
});

/** The card `text` names: the one that says it, else the only one holding it. */
function findCard(board, text) {
  const want = String(text || "").trim().toLowerCase();
  const all = [];
  for (const list of board.lists) for (const card of list.cards) all.push({ list: list, card: card });
  const exact = all.filter((c) => c.card.text.trim().toLowerCase() === want);
  const near = all.filter((c) => c.card.text.toLowerCase().includes(want));
  if (exact.length === 1 || (!exact.length && near.length === 1)) return exact[0] || near[0];
  return { error: (near.length ? "More than one card says " : "No card says ") + JSON.stringify(text) };
}

/** Changes a board's file through `change(board)`, which returns an error
 *  to leave it as it is, or what to answer. */
async function changeBoard(name, change) {
  const file = await boardFile(name);
  if (!file) return NO_FOLDER;
  if (file.error) return file;
  if (!(await textus.files.stat(file.path))) return { error: "No board " + file.rel };
  let answer = null;
  await textus.files.process(file.path, function (text) {
    if (!boardText(file.rel, text)) {
      answer = notBoard(file);
      return text;
    }
    const board = kanbanMarkdown.parse(text);
    answer = change(board);
    return answer.error ? text : kanbanMarkdown.serialize(board);
  });
  return Object.assign({ board: file.rel }, answer);
}

/** Whether `text` is a board: kanban-plugin in its front matter. */
const isBoard = (text) => /^---\r?\n(?:[^\n]*\n)*?kanban-plugin\s*:/.test(String(text).split(/\r?\n---/)[0] + "\n");

/** Whether a file is a board: named .kanban.md or marked in its front matter. */
const boardText = (rel, text) => /\.kanban\.md$/i.test(rel) || isBoard(text);
const notBoard = (file) => ({ error: file.rel + " isn't a board." });

/** How many documents listBoards reads at most, looking for boards. */
const MAX_SCAN = 3000;

/** The documents that may be boards: from the folder's index when it has
 *  them (front matter already read), else every .md. */
async function candidates() {
  const docs = await textus.metadata.all().catch(() => null);
  if (!Array.isArray(docs) || !docs.length) return (await textus.files.find("**/*.md")).slice(0, MAX_SCAN);
  return docs.filter((d) => /\.kanban\.md$/i.test(d.rel) || (d.frontmatter && "kanban-plugin" in d.frontmatter));
}

async function listBoards() {
  if (!(await textus.files.root())) return NO_FOLDER;
  const boards = [];
  for (const file of await candidates()) {
    const text = await textus.files.readText(file.path).catch(() => "");
    if (!boardText(file.rel, text)) continue;
    const board = kanbanMarkdown.parse(text);
    boards.push({
      path: file.rel,
      lists: board.lists.map((l) => ({ title: l.title, cards: l.cards.length })),
    });
  }
  return { boards: boards };
}

async function readBoard(input) {
  const file = await boardFile(input.board);
  if (!file) return NO_FOLDER;
  if (file.error) return file;
  if (!(await textus.files.stat(file.path))) return { error: "No board " + file.rel };
  const text = await textus.files.readText(file.path);
  if (!boardText(file.rel, text)) return notBoard(file);
  const board = kanbanMarkdown.parse(text);
  return { board: file.rel, lists: board.lists };
}

function addCard(input) {
  const text = String(input.text || "").trim();
  if (!text) return { error: "The card has no text." };
  return changeBoard(input.board, function (board) {
    const list = findList(board, input.list);
    if (!list) return noList(board, input.list);
    list.cards.push({ text: text, done: !!input.done });
    return { list: list.title, position: list.cards.length };
  });
}

function moveCard(input) {
  return changeBoard(input.board, function (board) {
    const found = findCard(board, input.card);
    if (found.error) return found;
    const to = findList(board, input.to);
    if (!to) return noList(board, input.to);
    found.list.cards.splice(found.list.cards.indexOf(found.card), 1);
    const at = Number(input.position) > 0 ? Math.min(Number(input.position) - 1, to.cards.length) : to.cards.length;
    to.cards.splice(at, 0, found.card);
    return { card: found.card.text, from: found.list.title, to: to.title, position: at + 1 };
  });
}

exports.activate = function (context) {
  ctx = context;
  textus.ai.registerTool("list_boards", listBoards);
  textus.ai.registerTool("read_board", readBoard);
  textus.ai.registerTool("add_card", addCard);
  textus.ai.registerTool("move_card", moveCard);
  textus.commands.register("catvinci.kanban.new", async function () {
    const root = await textus.files.root();
    if (!root) {
      await textus.ui.message(textus.l10n.t("needsFolder"));
      return;
    }
    const name = await textus.ui.input({
      prompt: textus.l10n.t("boardName"),
      value: textus.l10n.t("board"),
    });
    if (!name || !name.trim()) return;
    const path = join(
      root,
      name.trim().replace(/[\\/:*?"<>|]/g, "-") + ".md",
    );
    // A board of that name opens as it is - matched without regard to
    // case, as macOS and Windows name files - and is never written over.
    const existing = (await textus.files.list(root)).find(
      (e) => e.path.toLowerCase() === path.toLowerCase(),
    );
    if (!existing) await textus.files.create(path, TEMPLATE());
    await textus.layout.open(existing ? existing.path : path);
  });

  textus.views.registerFileEditor("catvinci.kanban.board", {
    resolve: async function (document, webview) {
      // The text the board last showed or wrote: a change from elsewhere
      // (the file edited as Markdown) is sent to it, its own saves aren't.
      let known = null;
      const send = async function () {
        const text = await document.readText();
        if (text === known) return;
        known = text;
        webview.postMessage({ type: "file", text: text });
      };
      const watching = textus.files.onDidChange(function (e) {
        if (e.path === document.path) send().catch(() => {});
      });
      webview.onDidDispose(() => watching.dispose());
      webview.onDidReceiveMessage(async function (message) {
        if (message.type === "ready") {
          known = null;
          await send();
        }
        if (message.type === "save") {
          try {
            known = message.text;
            await document.writeText(message.text);
            webview.postMessage({ type: "saved" });
          } catch (err) {
            webview.postMessage({
              type: "error",
              message: String((err && err.message) || err),
            });
          }
        }
        // A [[link]] on a card: the note of that name in the folder, as
        // Textus resolves a wiki link - or, with none, beside the board.
        if (message.type === "openNote") {
          let note = null;
          try {
            note = await textus.metadata.resolveLink(
              "[[" + message.name + "]]",
              document.path,
            );
          } catch {
            // No folder open.
          }
          const beside = join(
            document.path.replace(/[\\/][^\\/]*$/, ""),
            message.name.replace(/\.(md|markdown)$/i, "") + ".md",
          );
          try {
            await textus.layout.open(note || beside);
          } catch {
            await textus.ui.message(textus.l10n.t("noNote", message.name));
          }
          return;
        }
        if (message.type === "markdown")
          await textus.layout.open(document.path, { asDocument: true });
      });
      const html = await ctx.plugin.readText("board.html");
      webview.html = html.replace("{{lang}}", textus.env.language);
      // Drawn again in the interface's language when that changes.
      const relabel = textus.env.onDidChangeLanguage(() => {
        webview.html = html.replace("{{lang}}", textus.env.language);
      });
      webview.onDidDispose(() => relabel.dispose());
    },
  });
};
