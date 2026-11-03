// Paths for the tools plugins give Textus AI: the model names a document
// by its path in the open folder ("Projects/Plan.md"), and is answered the
// same way. Shared by the plugins whose tools take paths: each lists this
// as lib/folder-paths.js in libs.json and runs it before its host.js.
/* exported folderPaths */
var folderPaths = (function () {
  "use strict";
  var trim = (root) => root.replace(/[\\/]+$/, "");

  /** `rel` ("a/b.md") as a path under `root`, in the root's own separator. */
  function abs(root, rel) {
    var sep = root.includes("\\") && !root.includes("/") ? "\\" : "/";
    return rel ? trim(root) + sep + rel.split("/").join(sep) : trim(root);
  }

  /** `path`'s place in the folder, "/"-separated; null outside it. */
  function rel(root, path) {
    if (!root || !path) return null;
    var base = trim(root).replace(/\\/g, "/") + "/";
    var p = String(path).replace(/\\/g, "/");
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

  return { abs: abs, rel: rel, clean: clean };
})();
