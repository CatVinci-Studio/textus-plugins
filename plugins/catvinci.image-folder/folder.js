// Image Folder's rules, as Typora and VS Code keep pictures: beside
// "Note.md", in "Note.assets/". Pure functions on "/"-separated paths; a
// plain script the host and the tests read.
(function (root) {
  "use strict";
  var PICTURE = /\.(png|jpe?g|gif|webp|avif|bmp|svg|ico|heic|tiff?)$/i;

  var dirOf = function (path) {
    return path.slice(0, path.lastIndexOf("/"));
  };
  var baseOf = function (path) {
    return path.slice(path.lastIndexOf("/") + 1);
  };
  var stemOf = function (path) {
    return baseOf(path).replace(/\.[^.]+$/, "");
  };

  /** The picture folder of the document at `doc`: "<dir>/<name>.assets". */
  function assetsOf(doc) {
    return dirOf(doc) + "/" + stemOf(doc) + ".assets";
  }

  /** How a link in `doc` may write `path`: relative to the document, plain,
   *  with spaces as %20, and in angle brackets. */
  function srcForms(doc, path) {
    var base = dirOf(doc) + "/";
    if (!path.startsWith(base)) return [];
    var rel = path.slice(base.length);
    var forms = [rel, "./" + rel, encodeURI(rel), "./" + encodeURI(rel)];
    return forms.filter(function (f, i) {
      return forms.indexOf(f) === i;
    });
  }

  /** A newly made `path` that should move into the picture folder of the
   *  document at `doc`: a picture under the document's folder, not there
   *  yet. */
  function shouldMove(doc, path) {
    return (
      !!doc &&
      PICTURE.test(path) &&
      path.startsWith(dirOf(doc) + "/") &&
      dirOf(path) !== assetsOf(doc)
    );
  }

  /** Whether the folder's app puts pictures in a place of its own, which
   *  Textus saves them to: an Obsidian vault with an attachment folder
   *  setting (`app`, its .obsidian/app.json), or a Logseq graph.
   *  `attachments` is the folder conventions' rule. */
  function appPlaces(attachments, app) {
    if (!attachments) return false;
    if (attachments.app === "logseq") return true;
    return attachments.app === "obsidian" && !!app && typeof app.attachmentFolderPath === "string";
  }

  var escape = function (s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  /** `text` with each link target `from` (any of its forms) changed to
   *  `to`, in ](…), <…> and src="…"; every other byte as it was. */
  function relink(text, fromForms, to) {
    var out = text;
    fromForms.forEach(function (from) {
      var pattern = new RegExp("(\\]\\(<?|src=[\"']|^\\[[^\\]\\n]+\\]:\\s*<?)" + escape(from) + "(?=[>)\"'\\s#?]|$)", "gm");
      out = out.replace(pattern, function (all, lead) {
        return lead + (/%20/.test(from) ? encodeURI(to) : to);
      });
    });
    return out;
  }

  /** `text` with link targets starting `from` + "/" (a folder) starting
   *  `to` + "/" instead; every other byte as it was. */
  function rebase(text, from, to) {
    var out = text;
    var forms = [from, encodeURI(from)];
    forms.slice(0, from === forms[1] ? 1 : 2).forEach(function (f, i) {
      var pattern = new RegExp("(\\]\\(<?|src=[\"']|^\\[[^\\]\\n]+\\]:\\s*<?)(\\.\\/)?" + escape(f) + "/", "gm");
      out = out.replace(pattern, function (all, lead, dot) {
        return lead + (dot || "") + (i ? encodeURI(to) : to) + "/";
      });
    });
    return out;
  }

  root.imageFolder = {
    rebase: rebase,
    PICTURE: PICTURE,
    dirOf: dirOf,
    baseOf: baseOf,
    stemOf: stemOf,
    assetsOf: assetsOf,
    srcForms: srcForms,
    shouldMove: shouldMove,
    appPlaces: appPlaces,
    relink: relink,
  };
})(globalThis);
