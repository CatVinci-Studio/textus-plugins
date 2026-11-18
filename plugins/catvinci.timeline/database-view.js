// A database's rows on a timeline (textus.views.registerDatabaseView): a
// line down the left, a dot, the date and the name for each row that has
// one, earliest first. Plain HTML styled inline: the database's page shows
// it without scripts or <style>.
/* exported timelineView */

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/** The date a row is placed by, as written (YYYY-MM-DD...), or null. */
function rowDate(row, key) {
  var value = key ? row.props[key] : null;
  if (Array.isArray(value)) value = value[0];
  var text = value == null ? "" : String(value).trim();
  return /^\d{4}(-\d{2}(-\d{2})?)?/.test(text) ? text : null;
}

/** The timeline of `data`'s rows, as HTML; `empty` when none has a date. */
function timelineView(data, empty) {
  var key =
    data.date ||
    data.columns.filter(function (c) {
      return data.types[c] === "date";
    })[0];
  var rows = data.rows
    .map(function (row) {
      return { row: row, date: rowDate(row, key) };
    })
    .filter(function (x) {
      return x.date;
    })
    .sort(function (a, b) {
      return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
  if (!rows.length)
    return '<p style="color:var(--ui-muted,inherit);margin:1em 0">' + escapeHtml(empty) + "</p>";
  var items = rows.map(function (x) {
    return (
      '<li data-row="' +
      escapeHtml(x.row.path) +
      '" style="position:relative;margin:0;padding:0.1em 0 0.9em 1.1em;cursor:pointer">' +
      '<span style="position:absolute;left:-0.4em;top:0.5em;width:0.65em;height:0.65em;border-radius:50%;background:var(--ui-accent,currentColor)"></span>' +
      '<div style="font-size:0.85em;color:var(--ui-muted,inherit);font-variant-numeric:tabular-nums">' +
      escapeHtml(x.date) +
      "</div>" +
      "<div>" +
      escapeHtml(x.row.name) +
      "</div></li>"
    );
  });
  return (
    '<ol style="list-style:none;margin:0.75em 0 0 0.4em;padding:0;border-left:0.125em solid var(--ui-border,currentColor)">' +
    items.join("") +
    "</ol>"
  );
}
