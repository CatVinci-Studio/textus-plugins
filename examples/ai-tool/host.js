// Glossary: a tool Textus AI calls. The user writes terms in the
// plugin's settings (term = meaning, one per line); look_up_term answers
// what a term means, or says it isn't there.

/** The settings' lines as a map of lower-cased term to meaning. */
function glossary(text) {
  const terms = new Map();
  for (const line of String(text ?? "").split("\n")) {
    const at = line.indexOf("=");
    if (at > 0)
      terms.set(line.slice(0, at).trim().toLowerCase(), line.slice(at + 1).trim());
  }
  return terms;
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.ai.registerTool("look_up_term", async ({ term }) => {
      const terms = glossary(await textus.settings.get("terms"));
      const meaning = terms.get(String(term ?? "").trim().toLowerCase());
      return meaning
        ? `${term}: ${meaning}`
        : `"${term}" is not in the user's glossary.`;
    }),
  );
};

// For tests; Textus reads only activate.
exports.glossary = glossary;
