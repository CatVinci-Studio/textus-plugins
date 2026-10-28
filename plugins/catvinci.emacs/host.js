// Emacs keys in the Textus editor: motion (C-f C-b C-n C-p, C-a C-e, M-f
// M-b, M-< M->, M-{ M-}, C-v M-v), the mark and the region (C-SPC, C-g,
// C-x h), killing into a kill ring (C-k, C-w, M-w, M-d, M-DEL) and yanking
// back (C-y, then M-y for older kills), undo (C-/, C-_, C-x u) and C-x C-s.
// Only these keys are taken (textus.editor.captureKeys, "some"): typing
// stays the editor's own. A Markdown document is not a plain file: a
// "line" here is a paragraph, a heading, a list item - or a code block's
// line.

function mac() {
  return textus.env.platform === "macos";
}

var on = true;
var settings = { ctrlKeys: false };
var mark = false; // the mark is set: motions extend the region
var prefix = ""; // "ctrl+x" while C-x waits for its second key
var kills = []; // newest last
var MAX_KILLS = 60;
var lastWasKill = false; // consecutive kills append to the newest
var yanked = -1; // the kill C-y or M-y put in, while M-y may follow
var status = null;

// Keys and what they do. A motion is a move op's unit; "repeat" moves that
// many times.
var MOTIONS = {
  "ctrl+f": { unit: "charForward" },
  ArrowRight: { unit: "charForward" },
  "ctrl+b": { unit: "charBack" },
  ArrowLeft: { unit: "charBack" },
  "ctrl+n": { unit: "down" },
  ArrowDown: { unit: "down" },
  "ctrl+p": { unit: "up" },
  ArrowUp: { unit: "up" },
  "ctrl+a": { unit: "lineStart" },
  Home: { unit: "lineStart" },
  "ctrl+e": { unit: "lineEndInsert" },
  End: { unit: "lineEndInsert" },
  "alt+f": { unit: "wordEnd", after: true },
  "alt+b": { unit: "wordBack" },
  "alt+<": { unit: "docStart" },
  "alt+>": { unit: "docEnd" },
  "alt+{": { unit: "paragraphPrev" },
  "alt+}": { unit: "paragraphNext" },
  "ctrl+v": { unit: "down", repeat: 20 },
  "alt+v": { unit: "up", repeat: 20 },
};

var KEYS = Object.keys(MOTIONS)
  .filter(function (k) {
    return k.indexOf("+") > 0;
  })
  .concat([
    "ctrl+ ",
    "ctrl+@",
    "ctrl+g",
    "ctrl+k",
    "ctrl+w",
    "alt+w",
    "alt+d",
    "alt+Backspace",
    "ctrl+y",
    "alt+y",
    "ctrl+/",
    "ctrl+_",
    "ctrl+x",
    "ctrl+d",
    "alt+u",
    "alt+l",
    "alt+c",
  ]);

/** The keys taken. On Windows and Linux, Ctrl chords are the app's and
 *  the system's (copy, paste, cut, select all, bold, find) until the
 *  setting gives them to Emacs - all but C-SPC and C-g, which are no one
 *  else's; on a Mac those are on ⌘, and Ctrl is Emacs's. */
function taken() {
  var keys = KEYS.filter(function (k) {
    if (mac() || settings.ctrlKeys) return true;
    return k.indexOf("ctrl+") !== 0 || k === "ctrl+ " || k === "ctrl+g";
  });
  // While the mark is set, plain arrows extend the region too.
  if (mark)
    keys = keys.concat(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
  return keys;
}

function capture() {
  if (!on) return textus.editor.keys.capture(null);
  // After C-x every key is Emacs's: the one that finishes the command, or
  // any other, which cancels it.
  if (prefix) return textus.editor.keys.capture({ mode: "all", keys: [] });
  return textus.editor.keys.capture({ mode: "some", keys: taken() });
}

function exec(op) {
  return textus.editor.keys.exec(op);
}

function showStatus() {
  if (!on) {
    if (status) status.dispose();
    status = null;
    return;
  }
  var text = "Emacs";
  if (mark) text += " · " + textus.l10n.t("mark");
  if (prefix) text += " C-x-";
  status = textus.ui.statusItem("mode", {
    text: text,
    tooltip: textus.l10n.t("statusTip"),
    command: "catvinci.emacs.toggle",
  });
}

function setMark(active) {
  mark = active;
  capture();
  showStatus();
}

/** Keeps killed text: after another kill it joins the newest one, as
 *  Emacs's C-k C-k does. */
function keep(text) {
  if (!text) return;
  if (lastWasKill && kills.length) kills[kills.length - 1] += text;
  else kills.push(text);
  if (kills.length > MAX_KILLS) kills.shift();
}

async function move(motion) {
  var times = motion.repeat || 1;
  for (var n = 0; n < times; n++) {
    await exec({ op: "move", unit: motion.unit, select: mark });
    if (motion.after)
      await exec({ op: "move", unit: "rightInsert", select: mark });
  }
}

/** Kills from the cursor through what `select` selects. */
async function killWith(select) {
  await select();
  var result = await exec({ op: "delete" });
  keep(result && result.text);
  return result;
}

async function yank(index) {
  var text = kills[index];
  if (text === undefined) return;
  await exec({ op: "insertText", text: text });
  yanked = index;
}

async function key(name) {
  var killing = false;
  var yanking = false;
  if (prefix === "ctrl+x") {
    prefix = "";
    capture();
    showStatus();
    if (name === "u") await exec({ op: "undo" });
    else if (name === "h") {
      await exec({ op: "move", unit: "docStart" });
      mark = true;
      await exec({ op: "move", unit: "docEnd", select: true });
      capture();
      showStatus();
    } else if (name === "ctrl+s")
      await textus.commands.execute("textus.save");
    lastWasKill = false;
    return;
  }
  var motion = MOTIONS[name];
  if (motion) {
    await move(motion);
  } else {
    switch (name) {
      case "ctrl+ ":
      case "ctrl+@":
        await exec({ op: "collapse", to: "head" });
        setMark(true);
        break;
      case "ctrl+g":
        await exec({ op: "collapse", to: "head" });
        setMark(false);
        break;
      case "ctrl+x":
        prefix = "ctrl+x";
        capture();
        showStatus();
        return;
      case "ctrl+k": {
        killing = true;
        var result = await killWith(function () {
          return exec({ op: "move", unit: "lineEndInsert", select: true });
        });
        // At the end of a line: the line break goes, joining the next.
        if (result && !result.text)
          await killWith(function () {
            return exec({ op: "move", unit: "charForward", select: true });
          });
        break;
      }
      case "ctrl+w": {
        killing = true;
        var region = await exec({ op: "delete" });
        keep(region && region.text);
        setMark(false);
        break;
      }
      case "alt+w": {
        var copied = await exec({ op: "copy" });
        if (copied && copied.text) kills.push(copied.text);
        await exec({ op: "collapse", to: "head" });
        setMark(false);
        break;
      }
      case "alt+d":
        killing = true;
        await killWith(async function () {
          await exec({ op: "move", unit: "wordEnd", select: true });
          await exec({ op: "move", unit: "rightInsert", select: true });
        });
        break;
      case "alt+Backspace":
        killing = true;
        await killWith(function () {
          return exec({ op: "move", unit: "wordBack", select: true });
        });
        break;
      case "ctrl+d":
        // Not a kill: the clipboard keeps what it had.
        if (mark) {
          await exec({ op: "collapse", to: "head" });
          setMark(false);
        }
        await exec({ op: "move", unit: "charForward", select: true });
        await exec({ op: "delete", copy: false });
        break;
      case "ctrl+y":
        yanking = true;
        if (mark) {
          await exec({ op: "collapse", to: "head" });
          setMark(false);
        }
        await yank(kills.length - 1);
        break;
      case "alt+y":
        // Only right after a yank: the older kill in its place.
        if (yanked > 0) {
          yanking = true;
          await exec({ op: "undo" });
          await yank(yanked - 1);
        }
        break;
      case "ctrl+/":
      case "ctrl+_":
        await exec({ op: "undo" });
        break;
      // M-u, M-l, M-c: the word from the caret upper-cased, lower-cased
      // or capitalized; the caret ends after it.
      case "alt+u":
      case "alt+l":
      case "alt+c":
        await recaseWord(name);
        break;
    }
  }
  lastWasKill = killing;
  if (!yanking) yanked = -1;
}

async function recaseWord(name) {
  await exec({ op: "move", unit: "wordEnd", select: true });
  await exec({ op: "move", unit: "rightInsert", select: true });
  var copied = await exec({ op: "copy" });
  var text = (copied && copied.text) || "";
  if (!text || text.indexOf("\n") >= 0) {
    await exec({ op: "collapse", to: "head" });
    return;
  }
  var next =
    name === "alt+u"
      ? text.toUpperCase()
      : name === "alt+l"
        ? text.toLowerCase()
        : text.replace(/\p{L}[\p{L}\p{N}']*/u, function (word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
          });
  await exec({ op: "insertText", text: next });
}

var queue = Promise.resolve();
function handle(name) {
  queue = queue
    .then(function () {
      return key(name);
    })
    .catch(function (err) {
      console.error(err);
    });
}

async function readSettings() {
  settings.ctrlKeys = (await textus.settings.get("ctrlKeys")) === true;
}

exports.activate = async function () {
  await readSettings();
  textus.settings.onDidChange(function () {
    readSettings().then(capture);
  });
  textus.editor.keys.onKey(handle);
  textus.commands.register("catvinci.emacs.toggle", function () {
    on = !on;
    mark = false;
    prefix = "";
    capture();
    showStatus();
  });
  capture();
  showStatus();
};

exports.deactivate = function () {
  textus.editor.keys.capture(null);
};
