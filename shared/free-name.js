// A name no file has yet: "Note", else "Note 2", "Note 3"… so a plugin
// making a file never writes over one. Each plugin using it lists this as
// lib/free-name.js in libs.json.
(function (root) {
  "use strict";

  /**
   * The first of `stem` + `ext`, then `stem` + `sep` + n + `ext` from n =
   * `first`, that `taken(name)` (which may be async) says is free.
   * Options: `ext` (""), `sep` (" "), `first` (2).
   */
  async function freeName(stem, taken, options) {
    var o = options || {};
    var ext = o.ext || "";
    var sep = o.sep === undefined ? " " : o.sep;
    if (!(await taken(stem + ext))) return stem + ext;
    for (var n = o.first || 2; ; n++) {
      var name = stem + sep + n + ext;
      if (!(await taken(name))) return name;
    }
  }

  root.freeName = freeName;
})(globalThis);
