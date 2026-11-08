// How the open folder is written, as Textus reads it for every app
// (textus.files.conventions): the templates folder and the daily notes
// settings, Templates/ and the plugin's own settings where no app says -
// and the few settings of an Obsidian vault Textus doesn't read.
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

  /** The Obsidian vault `base` is in, as Textus found it; null for none. */
  function obsidian(c) {
    return (c && (c.sources || []).find((s) => s.app === "obsidian")) || null;
  }

  /** A JSON file of the vault's .obsidian folder, as an object; {} with no
   *  vault, or no such file. */
  async function obsidianSettings(base, name) {
    var vault = obsidian(await of(base));
    if (!vault) return {};
    try {
      return JSON.parse(await textus.files.readText(folderPaths.abs(vault.root, ".obsidian/" + name))) || {};
    } catch {
      return {};
    }
  }

  /** The daily notes' folder (in `base`), name format and template file (in
   *  `base`, or null for none); null when no app says. A vault without
   *  daily notes settings keeps them at its top, as Obsidian does. */
  async function daily(base) {
    var c = await of(base);
    var d = c && c.daily && c.daily.value;
    var vault = !d && obsidian(c);
    if (vault) return { folder: inFolder(base, vault.root) || "", format: "YYYY-MM-DD", template: null };
    if (!d) return null;
    return {
      folder: inFolder(base, d.folder) || "",
      format: d.format,
      template: d.template ? inFolder(base, d.template) : null,
    };
  }

  /** A vault's weekly or monthly notes (`period`), as the Periodic Notes
   *  plugin sets them: on or off, folder (in `base`), name format and
   *  template file; null when it sets none. */
  async function periodic(base, period) {
    var vault = obsidian(await of(base));
    if (!vault) return null;
    var p;
    try {
      p = JSON.parse(await textus.files.readText(folderPaths.abs(vault.root, ".obsidian/plugins/periodic-notes/data.json")))[period];
    } catch {
      return null;
    }
    if (!p || typeof p !== "object") return null;
    var inVault = (rel) => inFolder(base, folderPaths.abs(vault.root, String(rel).replace(/^\/+|\/+$/g, "")));
    return {
      enabled: !!p.enabled,
      folder: (p.folder && inVault(p.folder)) || "",
      format: p.format || null,
      template: p.template ? inVault(p.template) : null,
    };
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
