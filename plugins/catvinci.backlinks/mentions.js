// Where a note is named but not linked - Obsidian's "unlinked mentions" -
// and the link that names it. Plain JavaScript, shared by the host
// (host.js) and the unit test (backlinks-mentions.test.ts).
(function (root) {
  "use strict";

  /** A note's names: its file name, first heading and front matter aliases. */
  function namesOf(stem, title, frontmatter) {
    const aliases = frontmatter && frontmatter.aliases;
    const all = [stem, title].concat(
      Array.isArray(aliases) ? aliases : aliases ? [aliases] : [],
    );
    const seen = new Set();
    return all
      .map((n) => String(n || "").trim())
      .filter((n) => {
        const key = n.toLowerCase();
        if (n.length < 2 || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  // Links, code and addresses: a name in them is not a mention.
  const SKIP = /\[\[[^\]\n]*\]\]|!?\[[^\]\n]*\]\([^)\n]*\)|`[^`\n]*`|<[^>\n]*>|\b[a-z][a-z0-9+.-]*:\/\/\S+/gi;
  const WORD = /[\p{L}\p{N}_]/u;
  const LATIN = /[A-Za-z0-9_]/;

  /**
   * Where in `line` `name` is first mentioned outside a link, ignoring
   * case, or -1. A name that starts or ends with a Latin letter must be a
   * whole word there; one in CJK needn't be, as CJK has no spaces.
   */
  function findMention(line, name) {
    const skipped = [];
    for (const m of line.matchAll(SKIP))
      skipped.push([m.index, m.index + m[0].length]);
    const hay = line.toLowerCase();
    const needle = name.toLowerCase();
    for (let at = hay.indexOf(needle); at >= 0; at = hay.indexOf(needle, at + 1)) {
      const end = at + needle.length;
      if (skipped.some(([a, b]) => at < b && end > a)) continue;
      const before = line[at - 1] || "";
      const after = line[end] || "";
      if (LATIN.test(name[0]) && WORD.test(before)) continue;
      if (LATIN.test(name[name.length - 1]) && WORD.test(after)) continue;
      return at;
    }
    return -1;
  }

  /** `line` with its first mention of `name` made a [[link]] to `stem`. */
  function linkMention(line, name, stem) {
    const at = findMention(line, name);
    if (at < 0) return null;
    const said = line.slice(at, at + name.length);
    const link = said === stem ? "[[" + stem + "]]" : "[[" + stem + "|" + said + "]]";
    return line.slice(0, at) + link + line.slice(at + name.length);
  }

  root.backlinkMentions = {
    namesOf: namesOf,
    findMention: findMention,
    linkMention: linkMention,
  };
})(typeof window !== "undefined" ? window : globalThis);
