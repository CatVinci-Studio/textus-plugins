// Vim in the Textus editor: normal, insert, visual and visual-line mode,
// counts, motions, operators, a register, dot repeat, flash (s and a
// character, then a label, jumps anywhere on screen), the command line in
// the command palette (:w, :q, :wq, :12) and key mappings written as in a
// vimrc (inoremap jj <Esc>), and those of an Obsidian vault's
// .obsidian.vimrc after them. Keys come from the editor while this plugin holds the keyboard
// (textus.editor.captureKeys); every change is an editor action
// (textus.editor.exec), done as typing is and undone with u. A Markdown
// document is not a plain file: a "line" here is a paragraph, a heading,
// a list item - or a code block's line.

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
var flash = null; // { query, letters, op } while s is collecting
var cmdline = null; // the command line's text while a mapping's : runs
var feeding = 0; // above 0 while a mapping's keys are fed
var note = ""; // a line for the status until the next key (an unknown command)
var settings = { flash: true, escape: "", mappings: "", vimrc: "" };

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
  return textus.editor.keys.exec(op);
}

function label() {
  if (cmdline !== null) return ":" + cmdline;
  var text = "-- " + textus.l10n.t(mode) + " --";
  var typed = count + pending + (flash ? "s" + flash.query : "");
  if (note) return text + " " + note;
  return typed ? text + " " + typed : text;
}

function showStatus() {
  if (!on) {
    if (status) status.dispose();
    status = null;
    return;
  }
  status = textus.ui.statusItem("mode", {
    text: label(),
    tooltip: textus.l10n.t("statusTip"),
    command: "catvinci.vim.toggle",
  });
}

function captureFor(m) {
  if (!on) return textus.editor.keys.capture(null);
  if (m === "insert") {
    // Escape, and every key an insert-mode mapping starts with or goes on
    // with (jj, jk): the rest are typed by the editor itself.
    var keys = ["Escape", "ctrl+["];
    maps.i.forEach(function (m) {
      m.lhs.forEach(function (k) {
        if (keys.indexOf(k) < 0) keys.push(k);
      });
    });
    return textus.editor.keys.capture({ mode: "some", keys: keys });
  }
  // Every key, and these Ctrl ones the app would otherwise keep.
  return textus.editor.keys.capture({
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
  cmdline = null;
  typedMap = [];
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

// --- Insert mode --------------------------------------------------------

async function insertKey(key) {
  if (key === "Escape" || key === "ctrl+[") {
    typedInsert = [];
    await setMode("normal");
    await exec({ op: "move", unit: "left" });
    return;
  }
  // A key typed while the editor still sent every key here (just after
  // i, cw, o...), or one a mapping starts with: typed as it is.
  if (key.length === 1) await exec({ op: "insertText", text: key });
  else if (key === "Enter") await exec({ op: "insertText", text: "\n" });
}

// --- Wiring -------------------------------------------------------------

/** One key, as typed, no mapping looked up. */
function dispatch(key) {
  return mode === "insert" ? insertKey(key) : normalKey(key);
}

var queue = Promise.resolve();
function enqueue(work) {
  queue = queue.then(work).catch(function (err) {
    console.error(err);
  });
}

function handle(key) {
  enqueue(function () {
    if (note) {
      note = "";
      showStatus();
    }
    if (mode === "insert")
      return maps.i.length ? insertMapKey(key) : insertKey(key);
    var list = maps[mode === "normal" ? "n" : "v"];
    if ((list.length && mappable()) || typedMap.length) return mapKey(key);
    return normalKey(key);
  });
}

async function readSettings() {
  settings.flash = (await textus.settings.get("flash")) !== false;
  settings.escape = String((await textus.settings.get("escape")) || "");
  settings.mappings = String((await textus.settings.get("mappings")) || "");
  settings.vimrc = await vaultVimrc();
  readMappings();
}

/** The open vault's .obsidian.vimrc (Obsidian's Vimrc Support); "" for
 *  none. */
async function vaultVimrc() {
  try {
    var root = await textus.files.root();
    if (!root) return "";
    var found = await textus.files.conventions().catch(function () {
      return null;
    });
    var vault = found && (found.sources || []).find(function (s) {
      return s.app === "obsidian";
    });
    if (vault && typeof vault.root === "string") root = vault.root;
    var sep = root.includes("\\") && !root.includes("/") ? "\\" : "/";
    return String(await textus.files.readText(root.replace(/[\\/]+$/, "") + sep + ".obsidian.vimrc"));
  } catch {
    return "";
  }
}

function settingsChanged() {
  readSettings().then(function () {
    captureFor(mode);
  });
}

exports.activate = async function () {
  await readSettings();
  textus.settings.onDidChange(settingsChanged);
  textus.files.onDidChangeRoot(settingsChanged);
  textus.files.onDidChange(function (event) {
    if (/[\\/]\.obsidian\.vimrc$/.test(event.path)) settingsChanged();
  });
  textus.editor.keys.onKey(handle);
  textus.commands.register("catvinci.vim.toggle", function () {
    on = !on;
    if (on) return setMode("normal");
    textus.editor.keys.capture(null);
    showStatus();
  });
  await setMode("normal");
};

exports.deactivate = function () {
  textus.editor.keys.capture(null);
};

// For the tests: how a vimrc's lines are read.
exports.parseMappings = parseMappings;
