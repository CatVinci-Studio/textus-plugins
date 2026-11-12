// The command line: ":" in the command palette, and the Ex commands
// Textus has (:w, :q, :wq, :12).

// --- The command line ---------------------------------------------------

async function cmdlineKey(key) {
  if (key === "Escape" || key === "ctrl+[" || key === "ctrl+c") {
    cmdline = null;
  } else if (key === "Enter") {
    var text = cmdline;
    cmdline = null;
    showStatus();
    return runCommand(text);
  } else if (key === "Backspace") {
    cmdline = cmdline ? cmdline.slice(0, -1) : null;
  } else if (key === "ctrl+u") {
    cmdline = "";
  } else if (key.length === 1) {
    cmdline += key;
  }
  showStatus();
}

var EX = [
  [":w", "exWrite"],
  [":q", "exQuit"],
  [":wq", "exWriteQuit"],
  [":u", "exUndo"],
  [":red", "exRedo"],
];

/** ":" typed: the palette with Vim's commands first. One of Textus's runs
 *  there; Vim's, or what was typed (":12"), runs here. */
async function commandPalette() {
  var range = mode === "visual" || mode === "vline" ? "'<,'>" : "";
  var got = await textus.ui.pick(
    EX.map(function (ex) {
      return { label: ex[0], description: textus.l10n.t(ex[1]), value: ex[0] };
    }),
    {
      commands: true,
      value: ":" + range,
      placeholder: textus.l10n.t("commandLine"),
    },
  );
  var text = typeof got === "string" ? got : got && got.typed;
  if (typeof text === "string") await runCommand(text.replace(/^:/, ""));
}

/** An Ex command: what Textus has of them - saving, closing the tab,
 *  going to a line, undo. */
async function runCommand(text) {
  // A visual selection's range ('<,'>) and a whole file's (%) mean this
  // document, as every command here does.
  var line = text.trim().replace(/^('<,'>|%)\s*/, "");
  if (!line) return;
  if (/^\d+$/.test(line)) {
    await exec({
      op: "move",
      unit: "docLine",
      count: parseInt(line, 10),
      visual: mode === "visual",
    });
    return;
  }
  if (line === "$") {
    await exec({ op: "move", unit: "docEnd", visual: mode === "visual" });
    return;
  }
  var name = line.split(/\s+/)[0];
  if (mode === "visual" || mode === "vline") {
    // Leave visual mode even when the editor refuses the collapse.
    await exec({ op: "collapse", to: "head" }).catch(function () {});
    await setMode("normal");
  }
  switch (name) {
    case "w":
    case "w!":
    case "write":
    case "wa":
    case "wall":
    case "up":
    case "update":
      return textus.commands.execute("textus.save");
    case "q":
    case "q!":
    case "quit":
    case "quit!":
    case "clo":
    case "close":
    case "bd":
    case "bdelete":
      return textus.commands.execute("textus.closeTab");
    case "wq":
    case "wq!":
    case "x":
    case "xit":
    case "exi":
    case "exit":
      return textus.commands.execute("textus.closeTab", { save: true });
    case "u":
    case "undo":
      return exec({ op: "undo" });
    case "red":
    case "redo":
      return exec({ op: "redo" });
    case "noh":
    case "nohlsearch":
      return;
  }
  note = textus.l10n.t("notCommand").replace("{command}", name);
  showStatus();
}
