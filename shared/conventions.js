// How the open folder is written, as Textus reads it for every app
// (textus.files.conventions): the templates folder and the daily notes
// settings, Templates/ and the plugin's own settings where no app says.
// Each plugin using it lists this as lib/conventions.js in libs.json,
// after lib/folder-paths.js.
/* global folderPaths */
(function (root) {
  "use strict";

  /** The folder's conventions; null when Textus can't tell. */
  function of(base) {
    return textus.files.conventions(base).catch(function () {
      return null;
    });
  }

  /** A full path the app gave as a path in the folder `base`: "/" apart,
   *  "" for the folder itself, null outside it. */
  function inFolder(base, path) {
    return path ? folderPaths.rel(base, path) : null;
  }

  /** The templates folder in `base`: the app's, else Templates. */
  async function templatesFolder(base) {
    var c = await of(base);
    var folder = c && c.templates && inFolder(base, c.templates.value);
    return folder === null || folder === undefined ? "Templates" : folder;
  }

  /** The daily notes' folder (in `base`), name format and template file (in
   *  `base`, or null for none); null when no app says. */
  async function daily(base) {
    var c = await of(base);
    var d = c && c.daily && c.daily.value;
    if (!d) return null;
    return {
      folder: inFolder(base, d.folder) || "",
      format: d.format,
      template: d.template ? inFolder(base, d.template) : null,
    };
  }

  root.folderConventions = { templatesFolder: templatesFolder, daily: daily };
})(globalThis);
