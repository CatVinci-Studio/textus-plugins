#!/usr/bin/env node
// A plugin page's sizes, colours and motion come from Textus's tokens
// (docs/dev/plugins/ui.md in the app): no fixed pixels of 3 and up, no
// literal colours, no fixed durations, in a page's stylesheets, its
// <style>s and the styles its scripts set - the plugins', the shared files
// copied into them, and the development plugins' sources. Nor does a page
// restyle a shared control (.tx-*): it places and sizes it in its layout,
// but its colours, border, corners, type, padding and height are Textus's.
// What must stay as it is says so in ALLOWED or RESTYLED, with why.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** "path:line text fragment": why it stays. */
const ALLOWED = {
  "plugins/catvinci.desk-pet/host.js:144 breathe 3.6s": "the pet's own breathing, not the interface's motion",
  "plugins/catvinci.desk-pet/host.js:145 hop 0.5s": "the pet's own hop, not the interface's motion",
};

/** "path selector": why that rule may change a shared control's look. */
const RESTYLED = {
  "plugins/catvinci.cloud-sync/panel.css #s3-more > .tx-row":
    "the group's divider, for rows folded inside it, which Textus draws only between a group's own rows",
  "plugins/catvinci.database/view.css .tx-chip.raw": "a filter Textus can't read, shown as written",
  "plugins/catvinci.pdf-viewer/view.css .textLayer span.tx-hit":
    "PDF.js's text layer stays see-through over the page drawn under it",
  "plugins/catvinci.quick-notes/panel.css .note-foot .tx-icon-button::after":
    "a touch area around the button, not its look",
  "plugins/catvinci.link-cards/card.css .link.tx-card:hover": "a card that opens its link shows it can be clicked",
};
/** A control's look, as opposed to where it sits and how wide it is. */
const LOOK = /^(?:color|background|border|outline|box-shadow|font|line-height|padding|height|min-height|max-height)\b/;

/** The rules in `css` whose selector's subject is a shared control and
 *  that change how it looks: [selector, line]. */
function restyled(css) {
  const found = [];
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const props = m[2].split(";").map((d) => d.split(":")[0].trim());
    if (!props.some((p) => LOOK.test(p))) continue;
    const line = plain.slice(0, m.index + m[1].search(/\S/)).split("\n").length;
    for (const selector of m[1].split(",").map((s) => s.trim()))
      if (/\.tx-[\w-]+[^\s>+~]*$/.test(selector)) found.push([selector, line]);
  }
  return found;
}

const PX = /(?<![\w.-])(\d*\.?\d+)px\b/g;
/** Text at a size of its own, not the type scale's (--text-*). */
const FIXED_TEXT = /font-size:\s*[\d.]+(?:rem|pt)\b/g;
const COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(|(?<![\w-])(?:white|black)(?![\w-])/gi;
/** A transition's or an animation's length: --dur-* instead. */
const DURATION = /(?:transition|animation|duration)[^;]*?(?<![\w.-])(\d*\.?\d+m?s)\b/gi;

function* pageFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (!/^(lib|vendor|node_modules|pets|lines|fonts)$/.test(name)) yield* pageFiles(path);
    } else if (/\.(css|html)$/.test(name) || /^(?!host\.js$).*\.js$/.test(name)) yield path;
  }
}

/** The parts of a file that style a page: all of a stylesheet, a page's
 *  <style>s, a script's CSS strings and style assignments. */
function styled(file, text) {
  if (file.endsWith(".css")) return text.split("\n");
  return text.split("\n").map((line) =>
    /style|css|<style|stroke|fill|width|height|font|duration|transition|animation/i.test(line) ? line : "",
  );
}

const problems = [];
const dirs = [
  ...readdirSync("plugins").map((plugin) => join("plugins", plugin)),
  "shared",
  ...readdirSync("development").map((plugin) => join("development", plugin, "src")),
];
for (const dir of dirs) {
  let files;
  try {
    files = [...pageFiles(dir)];
  } catch {
    continue;
  }
  // A page drawn in host.js (a floating view's HTML) counts too.
  const host = join(dir, "host.js");
  try {
    if (/<style|<html/i.test(readFileSync(host, "utf8"))) files.push(host);
  } catch {}
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    // A page's own stylesheet, or the <style>s of a page written out in a script.
    const css = file.endsWith(".css")
      ? text
      : text.replace(/<style[^>]*>([\s\S]*?)<\/style>|[^\n]/g, (m, style) => style ?? (m === "\n" ? m : " "));
    for (const [selector, line] of restyled(css))
      if (!RESTYLED[`${relative(".", file)} ${selector}`])
        problems.push(`${relative(".", file)}:${line}: ${selector} - a shared control keeps Textus's look`);
    const lines = styled(file, text);
    lines.forEach((line, i) => {
      const at = `${relative(".", file)}:${i + 1}`;
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (Object.keys(ALLOWED).some((k) => k.startsWith(at + " ") && line.includes(k.slice(at.length + 1))))
        return;
      for (const m of line.matchAll(PX))
        if (Math.abs(Number(m[1])) >= 3) problems.push(`${at}: ${m[0]} - use a token or a proportion`);
      for (const m of line.matchAll(FIXED_TEXT)) problems.push(`${at}: ${m[0]} - use a --text-* size`);
      for (const m of line.matchAll(COLOUR)) problems.push(`${at}: ${m[0]} - use a colour token`);
      for (const m of line.matchAll(DURATION))
        if (Number.parseFloat(m[1]) > 0) problems.push(`${at}: ${m[1]} - use a --dur-* token`);
    });
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} fixed sizes, colours or restyled controls in plugin pages`);
  process.exit(1);
}
console.log("ui: plugin pages take their sizes, colours and controls' look from Textus");
