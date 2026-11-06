// Paths in the open folder: a document by its place in it
// ("Projects/Plan.md"), as Textus AI's tools name one, and back to the
// path the system uses. Each plugin using it lists this as
// lib/folder-paths.js in libs.json and runs it before its host.js.
/* exported folderPaths */
var folderPaths = (function () {
  "use strict";
  var trim = (root) => root.replace(/[\\/]+$/, "");
  var windows = (path) => path.includes("\\") && !path.includes("/");

  /** `path` "/"-separated; null for none. */
  var slash = (path) => (path ? String(path).replace(/\\/g, "/") : null);

  /** A "/"-separated `path` in the separator `like` (another path) uses. */
  var native = (path, like) => (windows(like) ? path.replace(/\//g, "\\") : path);

  /** `rel` ("a/b.md") as a path under `root`, in the root's own separator. */
  function abs(root, rel) {
    return rel ? trim(root) + (windows(root) ? "\\" : "/") + native(rel, root) : trim(root);
  }

  /** `path`'s place in the folder, "/"-separated; null outside it. */
  function rel(root, path) {
    if (!root || !path) return null;
    var base = slash(trim(root)) + "/";
    var p = slash(path);
    return p.startsWith(base) ? p.slice(base.length) : null;
  }

  /** What the model wrote for a path in the folder, made one: "/" apart,
   *  no leading "./" or "/", the folder's own path taken off, `.md` added
   *  for a document (`ext`) without one. null for one leaving the folder. */
  function clean(root, path, ext) {
    var p = String(path || "").trim().replace(/\\/g, "/");
    var inside = rel(root, p);
    if (inside !== null) p = inside;
    p = p.replace(/^(\.\/|\/)+/, "").replace(/\/+$/, "");
    if (p.split("/").includes("..")) return null;
    if (ext && p && !/\.(md|markdown)$/i.test(p)) p += ".md";
    return p;
  }

  return { abs: abs, rel: rel, clean: clean, slash: slash, native: native };
})();
