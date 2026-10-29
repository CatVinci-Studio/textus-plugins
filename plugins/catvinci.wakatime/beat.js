// When WakaTime hears about writing, and what it is told: the rules every
// WakaTime plugin follows - a heartbeat when the document changes, at most
// one per two minutes for the same file, and always on a save.

(function (root) {
  const EVERY_MS = 2 * 60 * 1000;

  /** Whether a change (or a save) to `path` at `now` is worth a heartbeat,
   *  given the last one sent: { path, at } or null. */
  function due(last, path, now, isWrite) {
    if (isWrite) return true;
    if (!last || last.path !== path) return true;
    return now - last.at >= EVERY_MS;
  }

  /** The heartbeat for `path`: a writing session in Markdown, under the
   *  open folder's name as its project. */
  function heartbeat(path, now, isWrite, folder) {
    const beat = {
      entity: path,
      type: "file",
      category: "writing docs",
      time: now / 1000,
      is_write: !!isWrite,
      language: "Markdown",
    };
    if (folder) {
      const parts = folder.replace(/[\\/]+$/, "").split(/[\\/]/);
      beat.project = parts[parts.length - 1];
    }
    return beat;
  }

  root.wakaBeat = { due: due, heartbeat: heartbeat, EVERY_MS: EVERY_MS };
})(typeof window !== "undefined" ? window : globalThis);
