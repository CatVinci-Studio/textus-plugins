// How the open folder is written, as Textus reads it for every app
// (textus.files.conventions, 1.3.10): the templates folder and the daily,
// weekly and monthly notes, Templates/ and the plugin's own settings where
// no app says - and a vault's other settings files (files.appSettings).
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
    var t = pick(c, "templates");
    var folder = t && inFolder(base, t.value);
    return folder === null || folder === undefined ? "Templates" : folder;
  }

  /** A setting of the folder's app, whether or not the folder took its
   *  settings. */
  function pick(c, key) {
    return (c && (c[key] || (c.detected && c.detected[key]))) || null;
  }

  /** A JSON file of the nearest vault's .obsidian folder, as an object; {}
   *  with no vault, or no such file. Found above the open folder too. */
  async function obsidianSettings(base, name) {
    var found = await textus.files.appSettings("obsidian", name, base).catch(function () {
      return null;
    });
    return found && typeof found === "object" ? found : {};
  }

  /** Periodic notes as Textus reads them: folder (in `base`), name format
   *  and template file (in `base`, or null). */
  function notes(base, setting) {
    var d = setting && setting.value;
    if (!d) return null;
    return {
      enabled: true,
      folder: inFolder(base, d.folder) || "",
      format: d.format,
      template: d.template ? inFolder(base, d.template) : null,
    };
  }

  /** The daily notes; null when no app says. A vault without daily notes
   *  settings keeps them at its top, as Obsidian does (Textus says so). */
  async function daily(base) {
    return notes(base, pick(await of(base), "daily"));
  }

  /** A vault's weekly or monthly notes (`period`), only where Periodic
   *  Notes turns them on; null otherwise. */
  async function periodic(base, period) {
    return notes(base, pick(await of(base), period));
  }

  /** Calendar & Daily Notes' own settings, where no app says. */
  var DAILY = { folder: "Daily", format: "YYYY-MM-DD", template: "# {{date}}\\n\\n" };

  root.folderConventions = {
    templatesFolder: templatesFolder,
    daily: daily,
    periodic: periodic,
    obsidianSettings: obsidianSettings,
    DAILY: DAILY,
  };
})(globalThis);
