// Normal and visual mode: motions, operators over them, and commands.

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
  // cw changes to the end of the word, as Vim's does; dw stops at the end
  // of the line; d} at the end of the paragraph.
  if (op === "c" && unit === "wordStart") unit = "wordEnd";
  else if (unit === "wordStart") unit = "wordStartInLine";
  else if (unit === "paragraphNext") unit = "paragraphEnd";
  var move = Object.assign(
    { op: "move", unit: unit, count: n, select: true },
    extra || {},
  );
  await exec(move);
  if (INCLUSIVE[unit])
    await exec({ op: "move", unit: "rightInsert", select: true });
  await applyToSelection(op);
}

// --- Normal and visual mode --------------------------------------------

async function normalKey(key) {
  if (cmdline !== null) return cmdlineKey(key);
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
    // gg, or 5gg: the fifth line.
    if (key === "g") {
      if (count) await doMotion("docLine", takeCount());
      else await doMotion("docStart", 1);
    }
    showStatus();
    return;
  }

  if (key === "g") {
    pending = "g";
    showStatus();
    return;
  }

  // zz, zt, zb (and z., z<CR>, z-): the caret's line to the middle, top or
  // bottom of the window. A Textus without the op scrolls nothing.
  if (pending === "z") {
    pending = "";
    takeCount();
    var to = { z: "center", ".": "center", t: "top", Enter: "top", b: "bottom", "-": "bottom" }[key];
    if (to && !operator) await exec({ op: "scroll", to: to }).catch(function () {});
    showStatus();
    return;
  }

  if (key === "z" && !operator) {
    pending = "z";
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

  if (key === ":" && !operator) {
    count = "";
    if (!replaying) recording = null;
    // A mapping's ":w<CR>" types on in the status line; typed, ":" opens
    // the command palette.
    if (replaying || feeding) cmdline = "";
    else await commandPalette();
    showStatus();
    return;
  }

  if (MOTIONS[key]) {
    // 12G: the twelfth line.
    if (key === "G" && count) await doMotion("docLine", takeCount());
    else await doMotion(MOTIONS[key], takeCount());
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
  if (operator && key === "s" && settings.flash) {
    // ds, cs, ys and a label: to the place flash finds.
    if (!replaying) recording = null;
    flash = { query: "", letters: "", op: operator };
    operator = null;
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
        flash = { query: "", letters: "", op: null };
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
    flash = { query: "", letters: "", op: null };
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
