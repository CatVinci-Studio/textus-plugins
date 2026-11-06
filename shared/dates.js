// Dates written and read in Moment-style formats (YYYY-MM-DD, "dddd, MMMM
// D"), as Obsidian's settings and templates name them, and the {{date}}
// and {{time}} of a template filled in. Each plugin using it lists this as
// lib/dates.js in libs.json.
(function (root) {
  "use strict";

  var pad = function (n, width) {
    return String(n).padStart(width || 2, "0");
  };
  var TOKENS = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|mm|ss/g;

  /** `date` written in a Moment format, names in `language`. */
  function format(date, form, language) {
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
    return String(form || "YYYY-MM-DD").replace(TOKENS, function (all, literal) {
      return literal !== undefined ? literal : values[all];
    });
  }

  /** `date`'s local day as YYYY-MM-DD. */
  function day(date) {
    return format(date, "YYYY-MM-DD");
  }

  /** The YYYY-MM-DD a name written in `form` stands for; null for a
   *  name that isn't one. Names of months and weekdays match any word. */
  function parse(text, form) {
    var order = [];
    var source = String(form || "YYYY-MM-DD").replace(
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
    var date = new Date(parts.Y, parts.M - 1, parts.D);
    if (date.getMonth() !== parts.M - 1) return null;
    return parts.Y + "-" + pad(parts.M) + "-" + pad(parts.D);
  }

  /**
   * A template's {{date}} and {{time}} filled in, as Obsidian writes them
   * ({{date:FORMAT}}, {{time:FORMAT}}): the date is `options.day`'s, the
   * time `options.now`'s (both now when not given). Every other {{name}}
   * found in `options.values` is filled in too; the rest stay as written.
   */
  function fill(text, options) {
    var now = options.now || new Date();
    var date = options.day || now;
    var values = options.values || {};
    return String(text).replace(/\{\{(\w+)(?::([^}]*))?\}\}/g, function (all, key, form) {
      if (key === "date") return format(date, form || "YYYY-MM-DD", options.language);
      if (key === "time") return format(now, form || "HH:mm", options.language);
      return form === undefined && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : all;
    });
  }

  root.dates = { format: format, day: day, parse: parse, fill: fill };
})(globalThis);
