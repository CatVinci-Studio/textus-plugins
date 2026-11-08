// How a folder writes links, for the plugins that write them: the folder's
// own choice (.textus/settings.json, or an Obsidian vault's setting), else
// a standard Markdown link - [Nov 8](Week45/Nov%208.md) - which opens in any
// app. Each plugin using it lists this as lib/link-style.js in libs.json.
(function (root) {
  "use strict";

  var SETTINGS = ".textus/settings.json";

  function folderOf(path) {
    return String(path || "").replace(/[\\/][^\\/]*$/, "");
  }

  /** "wiki" or "markdown" as the folder chose; null where it didn't. */
  function chosen(found) {
    var own = found && found.linkStyle;
    var theirs = found && found.detected && found.detected.linkStyle;
    var value = (own || theirs || {}).value;
    return value === "wiki" || value === "markdown" ? value : null;
  }

  var WIKI = /\[\[[^\]\n]+\]\]/g;
  var MARKDOWN = /\]\((?!https?:|mailto:|#)[^)\s]+\)/g;

  /** The style `text` already links in, by its links to notes; null for none. */
  function usedIn(text) {
    var wiki = (String(text).match(WIKI) || []).length;
    var markdown = (String(text).match(MARKDOWN) || []).length;
    return wiki === markdown ? null : wiki > markdown ? "wiki" : "markdown";
  }

  /** What `metadata.linkTo` is given beside its options for a link written
   *  in the document `from`: the folder's choice, else what the document
   *  already uses, so a page never mixes the two, else standard. */
  async function options(from, typing) {
    var found = await textus.files
      .conventions(folderOf(from))
      .catch(function () {
        return null;
      });
    var style = chosen(found);
    if (!style) {
      var text = await textus.files.readText(from).catch(function () {
        return "";
      });
      // The [[ being typed is no link the note has yet.
      style = usedIn(typing ? text.replace(typing, "") : text);
    }
    return { style: style || "markdown" };
  }

  /** `to` from the folder of `from`, "/" apart: "../b/Nov 8.md". */
  function relative(from, to) {
    var a = folderOf(from).replace(/\\/g, "/").split("/");
    var b = String(to).replace(/\\/g, "/").split("/");
    var i = 0;
    while (i < a.length && i < b.length - 1 && a[i] === b[i]) i++;
    return a
      .slice(i)
      .map(function () {
        return "..";
      })
      .concat(b.slice(i))
      .join("/");
  }

  /** A standard link to `to` from `from`: its path from there, a space as
   *  %20 as Obsidian and Notion write it, the note's name as its text. */
  function markdownLink(to, from, o) {
    var name = String(to)
      .split(/[\\/]/)
      .pop()
      .replace(/\.(md|markdown)$/i, "");
    var anchor = o.block ? "#^" + o.block : o.heading ? "#" + o.heading : "";
    var text =
      o.alias ||
      (anchor && !o.embed ? name + " > " + (o.heading || "^" + o.block) : name);
    var href = (relative(from, to) + anchor).replace(/ /g, "%20");
    return (
      (o.embed ? "!" : "") +
      "[" +
      text.replace(/([\[\]])/g, "\\$1") +
      "](" +
      href +
      ")"
    );
  }

  /** A link to `to` written in the document `from` in the folder's style;
   *  a [[link]] that needs a path to find its note shows the note's name. */
  async function linkTo(to, from, extra) {
    var o = Object.assign({}, extra && extra.style ? {} : await options(from), extra || {});
    if (o.style === "markdown") return markdownLink(to, from, o);
    var link = await textus.metadata.linkTo(to, from, o);
    if (o.alias || !/^!?\[\[[^\]|#]*\/[^\]|]*\]\]$/.test(link)) return link;
    var name = link
      .replace(/^!?\[\[|\]\]$/g, "")
      .split("#")[0]
      .split("/")
      .pop();
    return link.slice(0, -2) + "|" + name + "]]";
  }

  /** The style the folder at `rootPath` chose, or null. */
  async function current(rootPath) {
    return chosen(
      await textus.files.conventions(rootPath).catch(function () {
        return null;
      }),
    );
  }

  /** Sets the folder's style in its .textus/settings.json, keeping the rest. */
  async function choose(rootPath, style) {
    var path = rootPath.replace(/[\\/]$/, "") + "/" + SETTINGS;
    var text = await textus.files.readText(path).catch(function () {
      return "{}";
    });
    var settings;
    try {
      settings = JSON.parse(text) || {};
    } catch (e) {
      throw new Error(SETTINGS + " isn't JSON; fix it by hand first.");
    }
    settings.conventions = Object.assign({}, settings.conventions, {
      linkStyle: style,
    });
    await textus.files
      .createFolder(rootPath.replace(/[\\/]$/, "") + "/.textus")
      .catch(function () {});
    await textus.files.writeText(
      path,
      JSON.stringify(settings, null, 2) + "\n",
    );
  }

  root.linkStyle = {
    chosen: chosen,
    usedIn: usedIn,
    options: options,
    linkTo: linkTo,
    relative: relative,
    current: current,
    choose: choose,
  };
})(globalThis);
