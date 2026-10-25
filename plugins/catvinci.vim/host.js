// Vim in the Textus editor: normal, insert, visual and visual-line mode,
// counts, motions, operators, a register, dot repeat, and flash (s and two
// characters, then a label, jumps anywhere on screen). Keys come from the
// editor while this plugin holds the keyboard (textus.editor.captureKeys);
// every change is an editor action (textus.editor.exec), done as typing
// is and undone with u. A Markdown document is not a plain file: a "line"
// here is a paragraph, a heading, a list item - or a code block's line.

// The interface language arrives once the plugin is running: read when
// a label is made, not as this file loads.

var on = true;
var mode = "normal"; // normal | insert | visual | vline
var count = "";
var pending = ""; // an operator (d c y), "g", or a key waiting for its char (f t F T r)
var operator = null;
var register = { text: "", linewise: false };
var lastFind = null; // { char, forward, till }
var vlineCount = 1;
var flash = null; // { query } while s is collecting
var settings = { flash: true, escape: "" };
var escapeFirstAt = 0;

// Dot repeat: the keys of the last change made in normal mode, from its
// count to the key that finished it.
var recording = null;
var lastChange = null;
var replaying = false;
var CHANGES = "dcxXrpPDCS~";

var status = null;

var MOTIONS = {
  h: "left",
  ArrowLeft: "left",
  Backspace: "left",
  l: "right",
  ArrowRight: "right",
  " ": "right",
  j: "down",
  ArrowDown: "down",
  Enter: "down",
  k: "up",
  ArrowUp: "up",
  w: "wordStart",
  W: "wordStart",
  b: "wordBack",
  B: "wordBack",
  e: "wordEnd",
  E: "wordEnd",
  0: "lineStart",
  Home: "lineStart",
  "^": "lineFirstChar",
  $: "lineEnd",
  End: "lineEnd",
  "{": "paragraphPrev",
  "}": "paragraphNext",
  G: "docEnd",
};
// Motions an operator takes the character under the end of, as Vim does.
var INCLUSIVE = { wordEnd: true, lineEnd: true, findChar: true };

function exec(op) {
  return textus.editor.exec(op);
}

function label() {
  var text = "-- " + textus.l10n.t(mode) + " --";
  var typed = count + pending + (flash ? "s" + flash.query : "");
  return typed ? text + " " + typed : text;
}

function showStatus() {
  if (!on) {
    if (status) status.dispose();
    status = null;
    return;
  }
  status = textus.window.setStatusItem("mode", {
    text: label(),
    tooltip: textus.l10n.t("statusTip"),
    command: "catvinci.vim.toggle",
  });
}

function captureFor(m) {
  if (!on) return textus.editor.captureKeys(null);
  if (m === "insert") {
    var keys = ["Escape", "ctrl+["];
    if (settings.escape && settings.escape.length === 2)
      keys.push(settings.escape[0], settings.escape[1]);
    return textus.editor.captureKeys({ mode: "some", keys: keys });
  }
  // Every key, and these Ctrl ones the app would otherwise keep.
  return textus.editor.captureKeys({
    mode: "all",
    keys: ["ctrl+r", "ctrl+d", "ctrl+u", "ctrl+["],
  });
}

function setMode(m) {
  // The text typed in insert mode isn't seen here: a change that goes on
  // into it (c, s) isn't one dot can repeat.
  if (m === "insert" && !replaying) recording = null;
  mode = m;
  count = "";
  pending = "";
  operator = null;
  flash = null;
  captureFor(m);
  showStatus();
  return exec({ op: "cursor", style: m === "insert" ? "bar" : "block" }).catch(
    function () {},
  );
}

function takeCount() {
  var n = count ? parseInt(count, 10) : 1;
  count = "";
  return n;
}

/** Keeps the keys of a change as it is typed. */
function record(key) {
  if (replaying) return;
  if (recording) {
    recording.push(key);
    return;
  }
  var starts = CHANGES.indexOf(key) >= 0 || (key === "s" && !settings.flash);
  if (mode === "normal" && !operator && !pending && starts && key.length === 1)
    recording = (count ? count.split("") : []).concat([key]);
}

/** A change is done once nothing is pending in normal mode: it is what
 *  dot repeats. */
function endChange() {
  if (replaying || !recording) return;
  if (mode === "normal" && !pending && !operator) {
    lastChange = recording;
    recording = null;
  }
}

async function remember(text, linewise) {
  register = { text: text || "", linewise: !!linewise };
}

// --- Operators ----------------------------------------------------------

async function applyToSelection(op) {
  if (op === "y") {
    var copied = await exec({ op: "copy" });
    await remember(copied.text, false);
    await exec({ op: "collapse", to: "start" });
    return;
  }
  var cut = await exec({ op: "delete" });
  await remember(cut.text, false);
  if (op === "c") await setMode("insert");
}

async function operateLines(op, n) {
  if (op === "y") {
    var copied = await exec({ op: "copyLines", count: n });
    await remember(copied.text, true);
    return;
  }
  if (op === "c") {
    // The lines' text goes; one empty line stays, to write in.
    await exec({ op: "selectLines", count: n });
    var cut = await exec({ op: "delete" });
    await remember(cut.text + "\n", true);
    await setMode("insert");
    return;
  }
  var gone = await exec({ op: "deleteLines", count: n });
  await remember(gone.text, true);
  await exec({ op: "move", unit: "lineFirstChar" });
}

async function operateMotion(op, unit, n, extra) {
  if (unit === "down" || unit === "up") {
    if (unit === "up") await exec({ op: "move", unit: "up", count: n });
    return operateLines(op, n + 1);
  }
  // cw changes to the end of the word, as Vim's does.
  if (op === "c" && unit === "wordStart") unit = "wordEnd";
  var move = Object.assign(
    { op: "move", unit: unit, count: n, select: true },
    extra || {},
  );
  await exec(move);
  if (INCLUSIVE[unit])
    await exec({ op: "move", unit: "rightInsert", select: true });
  await applyToSelection(op);
}

// --- Flash --------------------------------------------------------------

async function flashKey(key) {
  if (key === "Escape" || key === "ctrl+[") {
    flash = null;
    await exec({ op: "flashClear" });
    showStatus();
    return;
  }
  if (key.length !== 1) return;
  if (flash.query.length < 2) {
    flash.query += key;
    var shown = await exec({ op: "flash", query: flash.query });
    if (flash.query.length === 2 && shown.labels === 1) {
      // One place only: there.
      await exec({ op: "flashJump", label: "a", select: mode === "visual" });
      flash = null;
    } else if (shown.labels === 0 && flash.query.length === 2) {
      flash = null;
    }
    showStatus();
    return;
  }
  await exec({ op: "flashJump", label: key, select: mode === "visual" });
  flash = null;
  showStatus();
}

// --- Normal and visual mode --------------------------------------------

async function normalKey(key) {
  if (flash) return flashKey(key);
  if (mode === "normal") record(key);

  if (key === "Escape" || key === "ctrl+[") {
    count = "";
    pending = "";
    operator = null;
    if (!replaying) recording = null;
    if (mode === "visual" || mode === "vline") {
      await exec({ op: "collapse", to: "head" });
      await setMode("normal");
    }
    showStatus();
    return;
  }

  // An operator's text object: iw (the word), aw (the word and the
  // space after it).
  if (pending === "i" || pending === "a") {
    var around = pending === "a";
    pending = "";
    var objectOp = operator;
    operator = null;
    if (key === "w" || key === "W") {
      await exec({ op: "move", unit: "rightInsert" });
      await exec({ op: "move", unit: "wordBack" });
      if (around) {
        await exec({ op: "move", unit: "wordStart", select: true });
      } else {
        await exec({ op: "move", unit: "wordEnd", select: true });
        await exec({ op: "move", unit: "rightInsert", select: true });
      }
      await applyToSelection(objectOp);
      endChange();
    } else if (!replaying) {
      recording = null;
    }
    showStatus();
    return;
  }

  // A key waiting for its character: f t F T r.
  if (
    pending &&
    "ftFTr".indexOf(pending) >= 0 &&
    pending.length === 1 &&
    pending !== "g"
  ) {
    if (key.length !== 1) {
      pending = "";
      operator = null;
      showStatus();
      return;
    }
    var waiting = pending;
    pending = "";
    var n = takeCount();
    if (waiting === "r") {
      await exec({ op: "replaceChar", char: key });
      endChange();
      showStatus();
      return;
    }
    var find = {
      char: key,
      forward: waiting === "f" || waiting === "t",
      till: waiting === "t" || waiting === "T",
    };
    lastFind = find;
    await doMotion("findChar", n, find);
    showStatus();
    return;
  }

  if (/^[1-9]$/.test(key) || (key === "0" && count)) {
    count += key;
    showStatus();
    return;
  }

  if (pending === "g") {
    pending = "";
    if (key === "g") await doMotion("docStart", 1);
    showStatus();
    return;
  }

  if (key === "g") {
    pending = "g";
    showStatus();
    return;
  }

  if ("fFtT".indexOf(key) >= 0) {
    pending = key;
    showStatus();
    return;
  }

  if (key === ";" || key === ",") {
    if (lastFind) {
      var repeat = Object.assign({}, lastFind);
      if (key === ",") repeat.forward = !repeat.forward;
      await doMotion("findChar", takeCount(), repeat);
    }
    showStatus();
    return;
  }

  if (key === "ctrl+d" || key === "ctrl+u") {
    await doMotion(key === "ctrl+d" ? "down" : "up", 15 * takeCount());
    showStatus();
    return;
  }

  if (MOTIONS[key]) {
    var unit = MOTIONS[key];
    var times = takeCount();
    if (key === "G" && times > 1) {
      // nG: the nth line from the top.
      await exec({ op: "move", unit: "docStart", visual: mode === "visual" });
      unit = "down";
      times = times - 1;
    }
    await doMotion(unit, times);
    showStatus();
    return;
  }

  if (mode === "visual" || mode === "vline") return visualKey(key);
  return normalCommand(key);
}

async function doMotion(unit, n, extra) {
  if (operator) {
    var op = operator;
    operator = null;
    await operateMotion(op, unit, n, extra);
    endChange();
    return;
  }
  if (mode === "vline") {
    if (unit === "down") vlineCount += n;
    else if (unit === "up") vlineCount = Math.max(1, vlineCount - n);
    await exec({ op: "collapse", to: "start" });
    await exec({ op: "selectLines", count: vlineCount });
    return;
  }
  var move = Object.assign(
    { op: "move", unit: unit, count: n, visual: mode === "visual" },
    extra || {},
  );
  await exec(move);
}

async function normalCommand(key) {
  var n;
  if (operator && (key === "i" || key === "a")) {
    pending = key;
    showStatus();
    return;
  }
  if (operator) {
    // dd, cc, yy: lines.
    if (key === operator) {
      var op = operator;
      operator = null;
      await operateLines(op, takeCount());
      endChange();
      showStatus();
      return;
    }
    operator = null;
    recording = null;
    showStatus();
    return;
  }

  switch (key) {
    case "d":
    case "c":
    case "y":
      operator = key;
      pending = "";
      showStatus();
      return;
    case "D":
      await operateMotion("d", "lineEnd", 1);
      break;
    case "C":
      await operateMotion("c", "lineEnd", 1);
      break;
    case "Y":
      await operateLines("y", takeCount());
      break;
    case "x":
    case "X": {
      var cut = await exec({
        op: "deleteChars",
        count: takeCount(),
        back: key === "X",
      });
      if (cut.text) await remember(cut.text, false);
      break;
    }
    case "r":
      pending = "r";
      showStatus();
      return;
    case "s":
      if (settings.flash) {
        recording = null;
        flash = { query: "" };
        showStatus();
        return;
      }
      await exec({ op: "deleteChars", count: takeCount() });
      recording = null;
      return setMode("insert");
    case "p":
    case "P":
      n = takeCount();
      for (var i = 0; i < n; i++) {
        if (register.linewise) {
          await exec({
            op: "pasteLines",
            text: register.text,
            above: key === "P",
          });
        } else if (register.text) {
          if (key === "p") await exec({ op: "move", unit: "rightInsert" });
          await exec({ op: "insertText", text: register.text });
          await exec({ op: "move", unit: "left" });
        }
      }
      break;
    case "u":
      n = takeCount();
      for (var u = 0; u < n; u++) await exec({ op: "undo" });
      break;
    case "~":
      // The case of the characters under the caret, flipped; the caret
      // ends after them.
      await exec({
        op: "move",
        unit: "right",
        count: takeCount(),
        select: true,
      });
      await recase("flip");
      break;
    case "ctrl+r":
      n = takeCount();
      for (var r = 0; r < n; r++) await exec({ op: "redo" });
      break;
    case ".":
      if (lastChange) {
        replaying = true;
        try {
          for (var k = 0; k < lastChange.length; k++)
            await normalKey(lastChange[k]);
        } finally {
          replaying = false;
        }
      }
      break;
    case "i":
      return setMode("insert");
    case "a":
      await exec({ op: "move", unit: "rightInsert" });
      return setMode("insert");
    case "I":
      await exec({ op: "move", unit: "lineFirstChar" });
      return setMode("insert");
    case "A":
      await exec({ op: "move", unit: "lineEndInsert" });
      return setMode("insert");
    case "o":
    case "O":
      await exec({ op: "openLine", above: key === "O" });
      return setMode("insert");
    case "v":
      await exec({ op: "visualStart" });
      return setMode("visual");
    case "V":
      vlineCount = 1;
      await exec({ op: "selectLines", count: 1 });
      return setMode("vline");
    default:
      count = "";
      if (!replaying) recording = null;
  }
  endChange();
  showStatus();
}

async function visualKey(key) {
  if (key === "d" || key === "x" || key === "y" || key === "c") {
    var op = key === "x" ? "d" : key;
    if (mode === "vline") {
      await exec({ op: "collapse", to: "start" });
      await setMode("normal");
      await operateLines(op, vlineCount);
    } else {
      await applyToSelection(op);
      if (op !== "c") await setMode("normal");
    }
    showStatus();
    return;
  }
  if (key === "s" && settings.flash) {
    flash = { query: "" };
    showStatus();
    return;
  }
  // ~ flips the selection's case, U upper-cases it, u lower-cases it -
  // within a paragraph (a visual-line selection keeps its blocks).
  if ((key === "~" || key === "U" || key === "u") && mode === "visual") {
    await recase(key === "~" ? "flip" : key === "U" ? "upper" : "lower");
    await setMode("normal");
    showStatus();
    return;
  }
  if (key === "v" || key === "V") {
    await exec({ op: "collapse", to: "head" });
    await setMode("normal");
  }
}

/** The selection's text again in another case. */
async function recase(how) {
  var copied = await exec({ op: "copy" });
  var text = copied.text || "";
  if (!text || text.indexOf("\n") >= 0) {
    await exec({ op: "collapse", to: "head" });
    return;
  }
  var next =
    how === "upper"
      ? text.toUpperCase()
      : how === "lower"
        ? text.toLowerCase()
        : text
            .split("")
            .map(function (c) {
              var up = c.toUpperCase();
              return c === up ? c.toLowerCase() : up;
            })
            .join("");
  await exec({ op: "insertText", text: next });
}

// --- Insert mode --------------------------------------------------------

async function insertKey(key) {
  if (key === "Escape" || key === "ctrl+[") {
    await setMode("normal");
    await exec({ op: "move", unit: "left" });
    return;
  }
  var esc = settings.escape;
  if (esc && esc.length === 2) {
    var now = Date.now();
    if (key === esc[1] && now - escapeFirstAt < 400) {
      // The first of the two went in as text a moment ago: take it back.
      escapeFirstAt = 0;
      await exec({ op: "deleteChars", count: 1, back: true });
      await setMode("normal");
      await exec({ op: "move", unit: "left" });
      return;
    }
    escapeFirstAt = key === esc[0] ? now : 0;
  }
  // A key typed while the editor still sent every key here (just after
  // i, cw, o...), or the first of the escape pair: typed as it is.
  if (key.length === 1) await exec({ op: "insertText", text: key });
  else if (key === "Enter") await exec({ op: "insertText", text: "\n" });
}

// --- Wiring -------------------------------------------------------------

var queue = Promise.resolve();
function handle(key) {
  queue = queue
    .then(function () {
      return mode === "insert" ? insertKey(key) : normalKey(key);
    })
    .catch(function (err) {
      console.error(err);
    });
}

async function readSettings() {
  settings.flash = (await textus.settings.get("flash")) !== false;
  settings.escape = String((await textus.settings.get("escape")) || "");
}

exports.activate = async function () {
  await readSettings();
  textus.settings.onDidChange(function () {
    readSettings().then(function () {
      captureFor(mode);
    });
  });
  textus.editor.onKey(handle);
  textus.commands.registerCommand("catvinci.vim.toggle", function () {
    on = !on;
    if (on) return setMode("normal");
    textus.editor.captureKeys(null);
    showStatus();
  });
  await setMode("normal");
};

exports.deactivate = function () {
  textus.editor.captureKeys(null);
};
