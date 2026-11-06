// Quick Preview: rest the pointer on a link to another document - a
// Markdown link or a [[wikilink]] - and its opening (or the section or
// block the link names) shows in a card beside it, to read without leaving
// the document; Pin keeps the card open, Open goes to it. The card is the
// app's (textus.editor.registerHover); this plugin reads the document.

/* global noteParts */

/** How much of a document a card shows; Pin and Open give the rest. */
const LIMIT = 1500;

function baseName(path) {
  const name = String(path).split(/[\\/]/).pop() || String(path);
  return name.replace(/\.(md|markdown)$/i, "");
}

/** At most `limit` characters, cut at a paragraph's end where one is
 *  near. */
function opening(text, limit) {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  const cut = trimmed.lastIndexOf("\n\n", limit);
  return (
    (cut > limit / 2 ? trimmed.slice(0, cut) : trimmed.slice(0, limit)) +
    "\n\n…"
  );
}

exports.activate = function () {
  textus.editor.registerHover({
    provideHover: async function (target) {
      if (target.type !== "document") return null;
      let text;
      try {
        text = await textus.files.readText(target.path);
      } catch {
        // Outside the open folder, or gone.
        return null;
      }
      const part = target.block
        ? noteParts.block(text, target.block)
        : target.heading
          ? noteParts.section(text, target.heading)
          : null;
      const where = !part ? "" : " › " + (target.block ? "^" + part.id : part.heading);
      return {
        title: baseName(target.path) + where,
        markdown: opening(part ? part.markdown : noteParts.body(text), LIMIT) || "…",
      };
    },
  });
};
