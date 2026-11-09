// Vim's key mappings, a vimrc's map lines: read, and matched against the
// keys as they are typed in normal, visual and insert mode.

// --- Key mappings (a vimrc's map lines) --------------------------------

// lhs and rhs as keys the way the editor names them: "j", "Escape",
// "ctrl+w", " ".
var maps = { n: [], v: [], i: [] };
var MAP_TIMEOUT = 1000; // Vim's timeoutlen

var KEY_NAMES = {
  esc: "Escape",
  cr: "Enter",
  enter: "Enter",
  return: "Enter",
  space: " ",
  bs: "Backspace",
  tab: "Tab",
  del: "Delete",
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
  home: "Home",
  end: "End",
  lt: "<",
  bar: "|",
  bslash: "\\",
};

/** "jj", "<Esc>", "<C-w>v", "<leader>w" as keys. */
function parseKeys(text, leader) {
  var keys = [];
  var i = 0;
  while (i < text.length) {
    var close = text[i] === "<" ? text.indexOf(">", i) : -1;
    if (close > i) {
      var name = text.slice(i + 1, close).toLowerCase();
      var ctrl = /^c-(.)$/.exec(name);
      if (name === "leader") keys = keys.concat(leader);
      else if (ctrl) keys.push("ctrl+" + ctrl[1]);
      else if (KEY_NAMES[name]) keys.push(KEY_NAMES[name]);
      else keys = keys.concat(text.slice(i, close + 1).split(""));
      i = close + 1;
    } else {
      keys.push(text[i]);
      i++;
    }
  }
  return keys;
}

var MAP_MODES = {
  map: "nv",
  noremap: "nv",
  nmap: "n",
  nnoremap: "n",
  vmap: "v",
  vnoremap: "v",
  xmap: "v",
  xnoremap: "v",
  imap: "i",
  inoremap: "i",
  "map!": "i",
  "noremap!": "i",
};

/** The mappings in `text`, a vimrc's lines: map, noremap, nnoremap,
 *  inoremap, vnoremap… and let mapleader. Anything else is passed over. */
function parseMappings(text) {
  var found = { n: [], v: [], i: [] };
  var leader = ["\\"];
  String(text || "")
    .split(/\r?\n/)
    .forEach(function (raw) {
      var line = raw.trim();
      if (!line || line[0] === '"') return;
      var lead = /^let\s+mapleader\s*=\s*(["'])(.*)\1\s*$/.exec(line);
      if (lead) {
        leader = parseKeys(lead[2].replace(/^\\</, "<"), []);
        return;
      }
      var words = line.split(/\s+/);
      var modes = MAP_MODES[words[0]];
      if (!modes) return;
      var rest = words.slice(1);
      while (rest.length && /^<(silent|buffer|nowait|expr|unique)>$/i.test(rest[0]))
        rest.shift();
      if (rest.length < 2) return;
      var lhs = parseKeys(rest[0], leader);
      var rhs = parseKeys(rest.slice(1).join(" "), leader);
      // As in Vim, mapping the same keys again replaces the mapping.
      modes.split("").forEach(function (m) {
        found[m] = found[m].filter(function (old) {
          return !same(old.lhs, lhs);
        });
        found[m].push({ lhs: lhs, rhs: rhs });
      });
    });
  return found;
}

function readMappings() {
  maps = parseMappings(settings.mappings + "\n" + settings.vimrc);
  // The older setting: two letters that leave insert mode.
  var esc = settings.escape;
  if (esc && esc.length === 2)
    maps.i.push({ lhs: [esc[0], esc[1]], rhs: ["Escape"] });
}

function same(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function startsWith(keys, start) {
  return keys.length > start.length && same(keys.slice(0, start.length), start);
}

// Normal and visual mode: the keys typed so far of a mapping not yet whole.
var typedMap = [];
var mapTimer = null;

/** Whether normal or visual mode's mappings may take this key: not
 *  inside something that waits for its own keys (an operator's motion,
 *  f's character, flash, the command line). */
function mappable() {
  return (
    !replaying && !flash && cmdline === null && !pending && !operator
  );
}

/** Runs keys as typed, unmapped (a mapping's right-hand side). */
async function feed(keys) {
  feeding++;
  try {
    for (var i = 0; i < keys.length; i++) await dispatch(keys[i]);
  } finally {
    feeding--;
  }
}

async function mapKey(key) {
  var list = maps[mode === "normal" ? "n" : "v"];
  var typed = typedMap.concat([key]);
  var whole = list.filter(function (m) {
    return same(m.lhs, typed);
  })[0];
  var longer = list.some(function (m) {
    return startsWith(m.lhs, typed);
  });
  clearTimeout(mapTimer);
  if (longer) {
    // Wait for the next key; without one, what was typed as it is (or
    // the shorter mapping it makes).
    typedMap = typed;
    mapTimer = setTimeout(function () {
      enqueue(function () {
        if (!same(typedMap, typed)) return;
        typedMap = [];
        return whole ? feed(whole.rhs) : feed(typed);
      });
    }, MAP_TIMEOUT);
    return;
  }
  typedMap = [];
  if (whole) return feed(whole.rhs);
  // No mapping: the keys held back, then this one, as they are.
  for (var i = 0; i < typed.length - 1; i++) await dispatch(typed[i]);
  return dispatch(key);
}

// Insert mode: the mapping keys typed (and typed into the text) lately.
var typedInsert = [];
var typedInsertAt = 0;

async function insertMapKey(key) {
  var now = Date.now();
  if (now - typedInsertAt > MAP_TIMEOUT) typedInsert = [];
  var typed = typedInsert.concat([key]);
  var whole = maps.i.filter(function (m) {
    return same(m.lhs, typed);
  })[0];
  var longer = maps.i.some(function (m) {
    return startsWith(m.lhs, typed);
  });
  if (whole && !longer) {
    // The keys before this one went in as text: take them back, then
    // do what the mapping says.
    var back = typedInsert.filter(function (k) {
      return k.length === 1;
    }).length;
    typedInsert = [];
    if (back)
      await exec({ op: "deleteChars", count: back, back: true, copy: false });
    return feed(whole.rhs);
  }
  var begins = function (keys) {
    return maps.i.some(function (m) {
      return startsWith(m.lhs, keys) || same(m.lhs, keys);
    });
  };
  typedInsert = longer ? typed : begins([key]) ? [key] : [];
  typedInsertAt = now;
  return insertKey(key);
}
