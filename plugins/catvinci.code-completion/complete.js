// What a word started in a code block completes to: the language's
// keywords and built-in names (words.js), then the words written around the
// caret; exact-case starts before any-case ones, shortest first.
(function (root) {
  const MAX = 30;
  const WORD = /[A-Za-z_$][\w$]{2,}/g;
  const lists = {};

  function wordsOf(language) {
    const words = root.codeWords;
    const key = words.aliases[language] || language;
    const lang = words.languages[key];
    if (!lang) return null;
    if (!lists[key]) lists[key] = { ...lang, list: lang.words.split(" ") };
    return lists[key];
  }

  /** A keyword as the query writes it: "sel" is select, "SEL" SELECT. */
  function inCase(word, query, anyCase) {
    return anyCase && /[A-Z]/.test(query) && query === query.toUpperCase()
      ? word.toUpperCase()
      : word;
  }

  function complete(context) {
    const lang = wordsOf(String(context.language || "").toLowerCase());
    const query = context.query;
    const lower = query.toLowerCase();
    const found = new Map();
    let rank = 0;
    const add = (word, detail) => {
      if (word !== query && !found.has(word))
        found.set(word, { rank, item: { label: word, insert: word, detail } });
    };
    const near = (context.text + " " + (context.after || "")).match(WORD) || [];
    for (const test of [
      (word) => word.startsWith(query),
      (word) => word.toLowerCase().startsWith(lower),
    ]) {
      if (lang)
        for (const word of lang.list)
          if (test(word)) add(inCase(word, query, lang.anyCase), lang.name);
      for (const word of near) if (test(word)) add(word, "");
      rank++;
    }
    return [...found.values()]
      .sort(
        (a, b) => a.rank - b.rank || a.item.label.length - b.item.label.length,
      )
      .slice(0, MAX)
      .map((found) => found.item);
  }

  root.codeCompletion = { complete: complete };
})(typeof window !== "undefined" ? window : globalThis);
