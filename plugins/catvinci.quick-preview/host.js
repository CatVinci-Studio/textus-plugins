// Quick Preview: rest the pointer on a link to another document - a
// Markdown link or a [[wikilink]] - and its opening (or the section the
// link names) shows in a card beside it, to read without leaving the
// document; Pin keeps the card open, Open goes to it. The card is the app's
// (textus.editor.registerHover); this plugin reads the document.

/** How much of a document a card shows, by Settings › Quick Preview. */
const LENGTHS = { short: 600, medium: 1500, long: 4000 };

function baseName(path) {
  const name = String(path).split(/[\\/]/).pop() || String(path);
  return name.replace(/\.(md|markdown)$/i, "");
}

/** Without its front matter (--- ... ---) at the top. */
function body(text) {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(text);
  return match ? text.slice(match[0].length) : text;
}

/** A heading's words as a link names them: `#My Heading`, `#my-heading`. */
function slug(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

/** The section under heading `name` - to the next heading of its level
 *  or above - and the heading's own words. Null when there is none by
 *  that name. */
function section(text, name) {
  const lines = text.split("\n");
  const want = slug(name);
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(lines[i]);
    if (!m || slug(m[2]) !== want) continue;
    const level = m[1].length;
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      const n = /^(#{1,6})\s/.exec(lines[j]);
      if (n && n[1].length <= level) {
        end = j;
        break;
      }
    }
    return { heading: m[2], text: lines.slice(i, end).join("\n") };
  }
  return null;
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
        text = body(await textus.files.readText(target.path));
      } catch {
        // Outside the open folder, or gone.
        return null;
      }
      const part = target.heading ? section(text, target.heading) : null;
      const limit =
        LENGTHS[await textus.settings.get("length")] || LENGTHS.medium;
      return {
        title: baseName(target.path) + (part ? " › " + part.heading : ""),
        markdown: opening(part ? part.text : text, limit) || "…",
      };
    },
  });
};
