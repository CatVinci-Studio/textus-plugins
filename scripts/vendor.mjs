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

// MDX's compiler, a reader that runs none of a document's code, and the
// conversions (vendor-src/mdx.mjs), for catvinci.mdx.
await build({
  entryPoints: [`${ROOT}vendor-src/mdx.mjs`],
  banner: { js: "(function (module, exports) {" },
  footer: { js: "})();" },
  bundle: true,
  format: "iife",
  // Not "browser": its entity decoding would need the host frame's page.
  platform: "neutral",
  mainFields: ["module", "main"],
  minify: true,
  legalComments: "eof",
  outfile: `${ROOT}vendor/mdx.js`,
});
console.log("vendor/mdx.js");

// Excalidraw and React for catvinci.excalidraw's page. Left out, to keep
// the plugin within the catalog's 5 MB: Mermaid-to-drawing, the font
// subsetter (a WebAssembly build, for embedding fonts in an exported SVG)
// and the languages Textus isn't in.
const EXCALIDRAW_LANGUAGES = ["en", "zh-CN", "zh-TW", "ja-JP", "ko-KR", "es-ES", "fr-FR", "de-DE", "ru-RU", "pt-BR", "pt-PT", "percentages"];
const leftOut = {
  name: "left-out",
  setup(b) {
    b.onResolve({ filter: /^@excalidraw\/mermaid-to-excalidraw$|subset-(shared|worker)\.chunk\.js$/ }, (a) => ({ path: a.path, namespace: "left-out" }));
    b.onResolve({ filter: /\/locales\/[^/]+\.js$/ }, (a) => {
      const name = a.path.split("/").pop().replace(/-[A-Z0-9]+\.js$/, "");
      return EXCALIDRAW_LANGUAGES.includes(name) ? undefined : { path: a.path, namespace: "left-out" };
    });
    b.onLoad({ filter: /.*/, namespace: "left-out" }, () => ({
      contents: "export default {}; export const parseMermaidToExcalidraw = () => { throw new Error('Not in Textus.'); };",
      loader: "js",
    }));
  },
};
await build({
  entryPoints: [`${ROOT}vendor-src/excalidraw.mjs`],
  bundle: true,
  format: "iife",
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  conditions: ["production"],
  loader: { ".css": "text" },
  plugins: [leftOut],
  minify: true,
  legalComments: "eof",
  outfile: `${ROOT}vendor/excalidraw.js`,
});
console.log("vendor/excalidraw.js");

// lz-string for the Excalidraw plugin's host, as a global only: its own
// file sets module.exports, which is where a plugin's host keeps activate.
await build({
  stdin: {
    contents: `import LZString from "lz-string"; globalThis.LZString = LZString;`,
    resolveDir: ROOT,
  },
  bundle: true,
  format: "iife",
  platform: "browser",
  minify: true,
  legalComments: "eof",
  outfile: `${ROOT}vendor/lz-string.js`,
});
console.log("vendor/lz-string.js");
