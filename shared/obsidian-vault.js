// An Obsidian vault's settings that Templates and Daily Notes follow, read
// from .obsidian/ and never written, and the Moment-style date formats
// those settings use (YYYY-MM-DD, "dddd, MMMM D"). Each plugin using it
// lists this as lib/obsidian-vault.js in libs.json.
(function (root) {
  "use strict";

  function join(base) {
    var sep = base.includes("\\") && !base.includes("/") ? "\\" : "/";
    var parts = Array.prototype.slice.call(arguments, 1).filter(Boolean);
    return [base.replace(/[\\/]+$/, "")].concat(parts).join(sep);
  }

  /** `.obsidian/<name>.json` of the folder at `base` as an object; null
   *  when the folder is not a vault or the file isn't there or isn't JSON. */
  async function config(files, base, name) {
    try {
      var value = JSON.parse(await files.readText(join(base, ".obsidian", name + ".json")));
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

  var pad = function (n, width) {
    return String(n).padStart(width || 2, "0");
  };
  var TOKENS = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|mm|ss/g;

  /** `date` written in a Moment format, names in `language`. */
  function formatDate(date, format, language) {
    var name = function (options) {
      return date.toLocaleDateString(language || "en", options);
    };
    var values = {
      YYYY: String(date.getFullYear()),
      YY: String(date.getFullYear()).slice(-2),
      MMMM: name({ month: "long" }),
      MMM: name({ month: "short" }),
      MM: pad(date.getMonth() + 1),
      M: String(date.getMonth() + 1),
      DD: pad(date.getDate()),
      D: String(date.getDate()),
      dddd: name({ weekday: "long" }),
      ddd: name({ weekday: "short" }),
      HH: pad(date.getHours()),
      H: String(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds()),
    };
    return String(format || "YYYY-MM-DD").replace(TOKENS, function (all, literal) {
      return literal !== undefined ? literal : values[all];
    });
  }

  /** The YYYY-MM-DD a name written in `format` stands for; null for a
   *  name that isn't one. Names of months and weekdays match any word. */
  function parseDate(text, format) {
    var order = [];
    var source = String(format || "YYYY-MM-DD").replace(
      /\[([^\]]*)\]|YYYY|MMMM|MMM|dddd|ddd|MM|M|DD|D|[.*+?^${}()|\\]/g,
      function (all, literal) {
        if (literal !== undefined) return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (/^[.*+?^${}()|\\]$/.test(all)) return "\\" + all;
        if (all[0] === "Y" || all === "MM" || all === "M" || all === "DD" || all === "D") {
          order.push(all[0]);
          return all === "YYYY" ? "(\\d{4})" : all.length === 2 ? "(\\d{2})" : "(\\d{1,2})";
        }
        return "[^\\s/\\d]+";
      },
    );
    var m = new RegExp("^" + source + "$").exec(String(text));
    if (!m) return null;
    var parts = {};
    order.forEach(function (key, i) {
      parts[key] = Number(m[i + 1]);
    });
    if (!parts.Y || !parts.M || !parts.D) return null;
    var day = new Date(parts.Y, parts.M - 1, parts.D);
    if (day.getMonth() !== parts.M - 1) return null;
    return parts.Y + "-" + pad(parts.M) + "-" + pad(parts.D);
  }

  root.obsidianVault = {
    join: join,
    config: config,
    cleanFolder: cleanFolder,
    templatesFolder: templatesFolder,
    formatDate: formatDate,
    parseDate: parseDate,
  };
})(globalThis);
