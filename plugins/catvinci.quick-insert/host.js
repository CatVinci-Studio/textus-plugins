// Quick Insert: the / menu's blocks are Textus's own Format commands, run
// straight from the manifest (`runs`), so they land before the next key;
// here are the rest: a callout, Turn into… and emoji. Dates are Natural
// Dates' (@today).

/* global quickEmoji */
const t = (key, ...args) => textus.l10n.t(key, ...args);

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

exports.activate = function (ctx) {
  const command = (name, run) =>
    textus.commands.register("catvinci.quick-insert." + name, run);
  ctx.subscriptions.push(
    command("callout", () => textus.editor.insertText("> [!NOTE]\n> ")),
    command("turnInto", turnInto),
    textus.editor.registerCompletion("catvinci.quick-insert.emoji", {
      provideCompletions(context) {
        return quickEmoji.search(context.match.slice(1), 8).map((e) => ({
          label: e.char + "  :" + e.name + ":",
          insert: e.char,
        }));
      },
    }),
  );
};
