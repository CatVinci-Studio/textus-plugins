// An Obsidian vault's settings that Templates and Daily Notes follow, read
// from .obsidian/ and never written. Each plugin using it lists this as
// lib/obsidian-vault.js in libs.json, after lib/folder-paths.js.
/* global folderPaths */
(function (root) {
  "use strict";

  /** `.obsidian/<name>.json` of the folder at `base` as an object; null
   *  when the folder is not a vault or the file isn't there or isn't JSON. */
  async function config(files, base, name) {
    try {
      var value = JSON.parse(await files.readText(folderPaths.abs(base, ".obsidian/" + name + ".json")));
      return value && typeof value === "object" ? value : null;
    } catch (e) {
      return null;
    }
  }

  /** A folder setting as a path in the vault: "/" apart, no leading or
   *  trailing slash; "" for the vault itself. */
  function cleanFolder(folder) {
    return String(folder || "")
      .replace(/\\/g, "/")
      .replace(/^[./]+|\/+$/g, "");
  }

  /** The templates folder: the vault's (templates.json), else Templates. */
  async function templatesFolder(files, base) {
    var conf = await config(files, base, "templates");
    return (conf && cleanFolder(conf.folder)) || "Templates";
  }

  root.obsidianVault = {
    config: config,
    cleanFolder: cleanFolder,
    templatesFolder: templatesFolder,
  };
})(globalThis);
