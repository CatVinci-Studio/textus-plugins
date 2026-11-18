// ssh://host/abs/path, as the sidebar and tabs carry a folder on a server.
var sshPaths = (function () {
  var PREFIX = "ssh://";

  /** { host, path } of a URL, or null for one that isn't this plugin's. */
  function parse(url) {
    if (typeof url !== "string" || url.indexOf(PREFIX) !== 0) return null;
    var rest = url.slice(PREFIX.length);
    var slash = rest.indexOf("/");
    if (slash <= 0) return null;
    return { host: rest.slice(0, slash), path: rest.slice(slash) };
  }

  function url(host, path) {
    return PREFIX + host + (path.charAt(0) === "/" ? path : "/" + path);
  }

  function join(path, name) {
    return path.replace(/\/+$/, "") + "/" + name;
  }

  function parent(path) {
    var at = path.replace(/\/+$/, "").lastIndexOf("/");
    return at <= 0 ? "/" : path.slice(0, at);
  }

  function base(path) {
    var trimmed = path.replace(/\/+$/, "");
    return trimmed.slice(trimmed.lastIndexOf("/") + 1);
  }

  return { parse: parse, url: url, join: join, parent: parent, base: base };
})();

