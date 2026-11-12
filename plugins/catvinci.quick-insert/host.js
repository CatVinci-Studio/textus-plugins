// Quick Insert: the / menu's blocks are Textus's own Format commands, run
// straight from the manifest (`runs`), so they land before the next key;
// here are the rest: a callout, Turn into…, emoji after :, and dates after
// @ (@tomorrow, @下周五), written as a date or a link to the day's note.

/* global quickEmoji, naturalDates, folderConventions, linkStyle */
const t = (key, ...args) => textus.l10n.t(key, ...args);
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Turn into…'s blocks, as textus.insertBlock names them. */
const BLOCKS = {
  text: "paragraph",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  bullet: "bullet-list",
  numbered: "ordered-list",
  task: "task-list",
  quote: "blockquote",
  code: "code-block",
};

async function turnInto() {
  const name = await textus.ui.pick(
    Object.keys(BLOCKS).map((value) => ({ label: t(value), value: value })),
    { placeholder: t("turnPlaceholder") },
  );
  if (name) await textus.commands.execute("textus.insertBlock", BLOCKS[name]);
}

const dateOf = (day) => {
  const m = DAY.exec(day);
  return m && new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

/** The folder's daily notes, as its app keeps them (an Obsidian vault's
 *  folder and name format); YYYY-MM-DD names elsewhere. Asked once per
 *  folder and its settings. */
let dailyNotes = null;
function daily() {
  dailyNotes =
    dailyNotes ||
    (async () => {
      const root = await textus.files.root().catch(() => null);
      // Where Calendar & Daily Notes puts them when no app says.
      const own = {
        folder: folderConventions.DAILY.folder,
        format: folderConventions.DAILY.format,
      };
      return {
        root: root,
        ...((root && (await folderConventions.daily(root))) || own),
      };
    })();
  return dailyNotes;
}

/** The link to `day`'s note (YYYY-MM-DD) from the document at `path`, as
 *  the folder writes links. */
async function dayLink(day, path) {
  const notes = await daily();
  const name = textus.dates.format(dateOf(day), notes.format);
  if (!notes.root) return "[" + name + "](" + name.replace(/ /g, "%20") + ".md)";
  const note =
    notes.root + "/" + (notes.folder ? notes.folder + "/" : "") + name + ".md";
  const from =
    path || (await textus.editor.getPath().catch(() => null)) || note;
  return linkStyle.linkTo(note, from);
}

/** Textus AI's tool: the date a phrase names, from today or `today`. */
function parseDate(input) {
  const today = dateOf(String(input.today || "")) || new Date();
  const date = naturalDates.parse(input.phrase || "", today);
  if (date) return { phrase: String(input.phrase).trim(), date: date };
  const words = String(input.phrase || "")
    .trim()
    .replace(/^@/, "")
    .slice(0, 3);
  return {
    error:
      "Not a phrase this knows: today, tomorrow, next friday, in 3 days, 下周五, 下週五, 明後日 and the like.",
    suggestions: words
      ? naturalDates.suggest(words, today, 8, textus.env.language)
      : [],
  };
}

/** What a picked date writes: after "(" a reminder's @date, else the date
 *  or, as set, a link to its note. */
async function dateCompletions(context) {
  const reminder = /[(（]$/.test(context.text.slice(0, -context.match.length));
  const asLink = !reminder && (await textus.settings.get("insert")) === "link";
  const found = naturalDates.suggest(
    context.match.slice(1),
    new Date(),
    8,
    textus.env.language,
  );
  const out = [];
  for (const s of found)
    out.push({
      label: "@" + s.phrase,
      detail: s.date,
      insert: reminder
        ? "@" + s.date
        : asLink
          ? await dayLink(s.date, context.path)
          : s.date,
    });
  return out;
}

exports.activate = function (ctx) {
  const command = (name, run) =>
    textus.commands.register("catvinci.quick-insert." + name, run);
  const forget = () => void (dailyNotes = null);
  ctx.subscriptions.push(
    command("callout", () => textus.editor.insertText("> [!NOTE]\n> ")),
    command("turnInto", turnInto),
    textus.ai.registerTool("parse_date", parseDate),
    textus.editor.registerCompletion("catvinci.quick-insert.emoji", {
      provideCompletions(context) {
        return quickEmoji.search(context.match.slice(1), 8).map((e) => ({
          label: e.char + "  :" + e.name + ":",
          insert: e.char,
        }));
      },
    }),
    textus.editor.registerCompletion("catvinci.quick-insert.at", {
      provideCompletions: dateCompletions,
    }),
    textus.files.onDidChangeRoot(forget),
    textus.files.onDidChangeConventions(forget),
  );
};
