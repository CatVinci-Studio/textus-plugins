// A template's {{key}} filled in from a map of values, and {{key:FORMAT}}
// for a date written in a Moment format; no files, no page. Each plugin
// using it lists this as lib/fill-template.js in libs.json, after
// lib/dates.js.
/* global dates */
(function (root) {
  "use strict";

  /** `value` as a Date: a Date, or text that starts with YYYY, YYYY-MM
   *  or YYYY-MM-DD (a time after it is read too); null otherwise. */
  function asDate(value) {
    if (value instanceof Date) return isNaN(value) ? null : value;
    var text = String(value);
    if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
      var at = new Date(text);
      return isNaN(at) ? null : at;
    }
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(text);
    return m ? new Date(Number(m[1]), Number(m[2] || 1) - 1, Number(m[3] || 1)) : null;
  }

  /**
   * `text` with each {{key}} found in `values` replaced: a list joined
   * with ", ", nothing for null. {{key:FORMAT}} writes a date value in
   * that format; {{date}} and {{time}} are `options.now` (now when not
   * given) unless `values` has them. Keys it doesn't know stay as written.
   * Options: `now`, `language`, `dateFormat` ("YYYY-MM-DD"), `timeFormat`
   * ("HH:mm").
   */
  function fillTemplate(text, values, options) {
    var o = options || {};
    var given = values || {};
    var clock = { date: o.dateFormat || "YYYY-MM-DD", time: o.timeFormat || "HH:mm" };
    return String(text).replace(/\{\{\s*([A-Za-z_][\w.-]*)\s*(?::([^}]*))?\}\}/g, function (all, key, form) {
      var has = Object.prototype.hasOwnProperty.call(given, key);
      if (!has && clock[key]) return dates.format(o.now || new Date(), form || clock[key], o.language);
      if (!has) return all;
      var value = given[key];
      if (value === null || value === undefined) return "";
      if (form !== undefined) {
        var date = asDate(value);
        if (date) return dates.format(date, form, o.language);
      }
      return Array.isArray(value) ? value.join(", ") : String(value);
    });
  }

  root.fillTemplate = fillTemplate;
})(globalThis);
