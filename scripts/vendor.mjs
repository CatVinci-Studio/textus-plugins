// Bundles the libraries a plugin's host needs that ship only as ES
// modules (the host runs plain scripts, no imports) into vendor/, as one
// script each that puts the library on the global object. Checked in, so
// the build and the dev server read them like any library; run
// `npm run vendor` after updating one of them.
import { build } from "esbuild";

const ROOT = new URL("..", import.meta.url).pathname;

await build({
  stdin: {
    contents: `
      import { lint } from "markdownlint/sync";
      import { applyFixes } from "markdownlint";
      globalThis.markdownlint = { lint, applyFixes };
    `,
    resolveDir: ROOT,
  },
  bundle: true,
  format: "iife",
  platform: "browser",
  minify: true,
  legalComments: "eof",
  outfile: `${ROOT}vendor/markdownlint.js`,
});
console.log("vendor/markdownlint.js");

await build({
  stdin: {
    contents: `
      import { Marp } from "@marp-team/marp-core";
      globalThis.Marp = Marp;
    `,
    resolveDir: ROOT,
  },
  // A plugin's scripts run as one CommonJS module: hidden from Marp's
  // dependencies, which would take module.exports for their own.
  banner: { js: "(function (module, exports) {" },
  footer: { js: "})();" },
  bundle: true,
  format: "iife",
  platform: "browser",
  minify: true,
  legalComments: "eof",
  outfile: `${ROOT}vendor/marp-core.js`,
});
console.log("vendor/marp-core.js");
