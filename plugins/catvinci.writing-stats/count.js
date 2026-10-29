// Counting words the way writers in every script expect: a word of Latin,
// Cyrillic or Greek letters is one word, and each Chinese, Japanese or
// Korean character is one. Markdown's own marks aren't counted.

(function (root) {
  const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g;
  const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

  /** The text a reader sees: no front matter, code fences' fences, link
   *  addresses, or heading, list and quote marks. */
  function plain(markdown) {
    return markdown
      .replace(/^---\n[\s\S]*?\n(---|\.\.\.)\n/, "")
      .replace(/^\s*(```|~~~).*$/gm, "")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2")
      .replace(/<[^>]+>/g, "")
      .replace(/^\s{0,3}(#{1,6}\s|>\s?|[-*+]\s(\[[ xX]\]\s)?|\d+[.)]\s)/gm, "")
      .replace(/[*_~=`]/g, "");
  }

  function count(markdown) {
    const text = plain(markdown || "");
    const cjk = (text.match(CJK) || []).length;
    const words = (text.replace(CJK, " ").match(WORD) || []).length;
    const characters = text.replace(/\s/g, "").length;
    return { words: words + cjk, characters: characters, cjk: cjk };
  }

  /** Minutes to read: 230 words a minute, 400 characters for CJK. */
  function readingMinutes(c) {
    return Math.max(1, Math.round((c.words - c.cjk) / 230 + c.cjk / 400));
  }

  root.writingCount = { count: count, readingMinutes: readingMinutes, plain: plain };
})(typeof window !== "undefined" ? window : globalThis);
