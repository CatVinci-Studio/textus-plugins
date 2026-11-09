#!/usr/bin/env node
// A plugin page's sizes and colours come from Textus's tokens
// (docs/dev/plugins/ui.md in the app): no fixed pixels of 3 and up, no
// literal colours, in a page's stylesheets, its <style>s and the styles its
// scripts set. What must stay as it is says so in ALLOWED, with why.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** "path:line text fragment": why it stays. */
const ALLOWED = {};

const PX = /(?<![\w.-])(\d*\.?\d+)px\b/g;
/** Text at a size of its own, not the type scale's (--text-*). */
const FIXED_TEXT = /font-size:\s*[\d.]+(?:rem|pt)\b/g;
const COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(|(?<![\w-])(?:white|black)(?![\w-])/gi;

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
    /style|css|<style|stroke|fill|width|height|font/i.test(line) ? line : "",
  );
}

const problems = [];
for (const plugin of readdirSync("plugins")) {
  const dir = join("plugins", plugin);
  const files = [...pageFiles(dir)];
  // A page drawn in host.js (a floating view's HTML) counts too.
  const host = join(dir, "host.js");
  try {
    if (/<style|<html/i.test(readFileSync(host, "utf8"))) files.push(host);
  } catch {}
  for (const file of files) {
    const lines = styled(file, readFileSync(file, "utf8"));
    lines.forEach((line, i) => {
      const at = `${relative(".", file)}:${i + 1}`;
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (Object.keys(ALLOWED).some((k) => k.startsWith(at + " ") && line.includes(k.slice(at.length + 1))))
        return;
      for (const m of line.matchAll(PX))
        if (Math.abs(Number(m[1])) >= 3) problems.push(`${at}: ${m[0]} - use a token or a proportion`);
      for (const m of line.matchAll(FIXED_TEXT)) problems.push(`${at}: ${m[0]} - use a --text-* size`);
      for (const m of line.matchAll(COLOUR)) problems.push(`${at}: ${m[0]} - use a colour token`);
    });
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} fixed sizes or colours in plugin pages`);
  process.exit(1);
}
console.log("ui: plugin pages take their sizes and colours from Textus");
