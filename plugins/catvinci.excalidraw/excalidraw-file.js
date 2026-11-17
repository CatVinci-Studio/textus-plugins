// Excalidraw's two files: a .excalidraw (the scene as JSON) and Obsidian
// Excalidraw's .excalidraw.md (a note whose "Drawing" section holds the
// scene, plain or compressed, with the words of the drawing listed above it
// so a search finds them). A drawing written back keeps the note's other
// parts as they were, and the form its scene was in.
/* global LZString */
(function (root) {
  "use strict";

  const DRAWING = /^(%%\r?\n)?#{1,2} Drawing[ \t]*\r?\n```(json|compressed-json)[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*(\r?\n%%)?/m;
  const TEXT_ELEMENTS = /^#{1,2} Text Elements[ \t]*$/m;
  const EMBEDDED_FILE = /^([0-9a-fA-F]+): \[\[([^\]]+)\]\]/gm;

  const isNote = (path) => /\.md$/i.test(path);

  function decompress(data) {
    const scene = LZString.decompressFromBase64(data.replace(/\s+/g, ""));
    if (!scene) throw new Error("The drawing's compressed data can't be read.");
    return scene;
  }

  /** A file's scene, the form it was kept in and, for a note, the pictures
   *  it links by id (`{id, link}`). An empty file is an empty drawing. */
  function parse(path, text) {
    if (!isNote(path)) {
      const scene = text.trim() ? JSON.parse(text) : {};
      return { scene: scene, compressed: false, embedded: [] };
    }
    const m = DRAWING.exec(text);
    if (!m) return { scene: {}, compressed: true, embedded: [], words: {} };
    const compressed = m[2] === "compressed-json";
    const scene = JSON.parse(compressed ? decompress(m[3]) : m[3]);
    const embedded = [];
    for (const e of text.slice(0, m.index).matchAll(EMBEDDED_FILE)) embedded.push({ id: e[1], link: e[2] });
    return { scene: scene, compressed: compressed, embedded: embedded, words: wordsOf(text, scene) };
  }

  const shownText = (e) => (e.originalText != null ? e.originalText : e.text || "");

  /** Each text element's words as the note lists them - with its
   *  [[links]], which the drawing itself shows without - while the drawing
   *  still shows what it did when read. */
  function wordsOf(text, scene) {
    const at = TEXT_ELEMENTS.exec(text);
    if (!at) return {};
    const rest = text.slice(at.index + at[0].length);
    const next = /\n(#{1,6} |%%)/.exec(rest);
    const section = (next ? rest.slice(0, next.index) : rest).replace(/\r\n/g, "\n").trim();
    const shown = {};
    for (const e of scene.elements || []) if (e && e.type === "text") shown[e.id] = shownText(e);
    const words = {};
    for (const entry of section.split(/\n\n(?=[^\n])/)) {
      const m = / \^([\w-]+)$/.exec(entry);
      if (m && m[1] in shown) words[m[1]] = { listed: entry.slice(0, m.index), shown: shown[m[1]] };
    }
    return words;
  }

  /** The words of a note's drawing, as Obsidian Excalidraw lists them:
   *  each text element's own text and its id. */
  function textElements(scene, words) {
    return (scene.elements || [])
      .filter((e) => e && e.type === "text" && !e.isDeleted)
      .map((e) => {
        const kept = words && words[e.id];
        const now = shownText(e);
        return (kept && kept.shown === now ? kept.listed : now) + " ^" + e.id;
      })
      .join("\n\n");
  }

  /** Breaks compressed data into lines as Obsidian Excalidraw does. */
  const lines = (data) => data.replace(/(.{256})/g, "$1\n\n").trim();

  function drawingSection(json, compressed, eol) {
    const body = compressed ? lines(LZString.compressToBase64(json)) : json;
    return ["%%", "## Drawing", "```" + (compressed ? "compressed-json" : "json"), body, "```", "%%"].join(eol);
  }

  /** The file with `json` as its scene. A note keeps its front matter and
   *  other sections; its list of words is made again from the scene, and
   *  the pictures it links by id aren't written into the scene too. */
  function write(path, text, json, parsed) {
    if (!isNote(path)) return json;
    const eol = /\r\n/.test(text) ? "\r\n" : "\n";
    const scene = JSON.parse(json);
    if (scene.files && parsed && parsed.embedded.length) {
      for (const e of parsed.embedded) delete scene.files[e.id];
    }
    const compressed = parsed ? parsed.compressed : true;
    const drawing = drawingSection(JSON.stringify(scene, null, compressed ? 0 : "\t"), compressed, eol);
    const words = "## Text Elements" + eol + textElements(scene, parsed && parsed.words).replace(/\n/g, eol) + eol;

    let out = text;
    const m = DRAWING.exec(out);
    out = m ? out.slice(0, m.index) + drawing + out.slice(m.index + m[0].length) : out.replace(/\s*$/, eol + eol) + drawing + eol;
    const at = TEXT_ELEMENTS.exec(out);
    if (at) {
      // To the next heading or the drawing, whichever comes first.
      const rest = out.slice(at.index + at[0].length);
      const next = /\n(#{1,6} |%%)/.exec(rest);
      const end = at.index + at[0].length + (next ? next.index + 1 : rest.length);
      out = out.slice(0, at.index) + words + eol + out.slice(end).replace(/^\s*/, "");
    } else {
      const d = DRAWING.exec(out);
      out = out.slice(0, d.index) + words + eol + out.slice(d.index);
    }
    return out;
  }

  /** A new drawing's file. */
  const empty = () =>
    JSON.stringify({ type: "excalidraw", version: 2, source: "https://textus.md", elements: [], appState: {}, files: {} }, null, 2);

  root.excalidrawFile = { parse: parse, write: write, textElements: textElements, empty: empty };
})(typeof window !== "undefined" ? window : globalThis);
