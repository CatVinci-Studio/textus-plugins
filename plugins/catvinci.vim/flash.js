// Flash: s and a character, then a label, jumps anywhere on screen.

// --- Flash --------------------------------------------------------------

async function flashKey(key) {
  if (key === "Escape" || key === "ctrl+[") return endFlash();
  if (key.length !== 1) return;
  // A label's letter jumps; any other character narrows the search.
  if (flash.query && flash.letters.indexOf(key) >= 0) return flashJump(key);
  flash.query += key;
  var shown = await exec({ op: "flash", query: flash.query });
  flash.letters = shown.letters || "";
  if (!shown.labels) return endFlash();
  // One place only: there.
  if (flash.query.length >= 2 && shown.labels === 1)
    return flashJump(flash.letters[0]);
  showStatus();
}

async function flashJump(letter) {
  var op = flash.op;
  flash = null;
  if (op) {
    // d, c or y and s: from the caret to the place.
    await exec({ op: "flashJump", label: letter, extend: true });
    await applyToSelection(op);
  } else {
    await exec({ op: "flashJump", label: letter, select: mode === "visual" });
  }
  showStatus();
}

async function endFlash() {
  flash = null;
  await exec({ op: "flashClear" });
  showStatus();
}
