// The licenses of the npm libraries a plugin's package carries, as
// THIRD-PARTY-NOTICES.md inside it: each library libs.json copies from
// node_modules, and for a bundle in vendor/ the packages it was built from,
// each with the packages it depends on.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const standard = createRequire(import.meta.url)("spdx-license-list/full.js");

export const NOTICES = "THIRD-PARTY-NOTICES.md";

// What each bundle in vendor/ was built from (scripts/vendor.mjs).
const VENDOR_ROOTS = {
  "./vendor/markdownlint.js": ["markdownlint"],
  "./vendor/marp-core.js": ["@marp-team/marp-core"],
  "./vendor/mdx.js": [
    "@mdx-js/mdx",
    "unified",
    "remark-parse",
    "remark-mdx",
    "remark-gfm",
    "remark-directive",
    "remark-rehype",
    "rehype-stringify",
  ],
  "./vendor/excalidraw.js": ["@excalidraw/excalidraw", "react", "react-dom"],
  "./vendor/lz-string.js": ["lz-string"],
};

const LICENSE_FILE = /^(licen[cs]e|copying)([-._].*)?$/i;
const NOTICE_FILE = /^notice([-._].*)?$/i;

/** The npm package a libs.json source names: "pdfjs-dist/legacy/x.mjs"
 *  is pdfjs-dist, "@plantuml/core/x.js" is @plantuml/core. */
export function packageOf(lib) {
  const parts = lib.split("/");
  return parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** The packages a plugin's libraries come from, with their dependencies. */
export function packagesFor(id, libs, root) {
  const roots = new Set();
  for (const [target, lib] of Object.entries(libs)) {
    if (!target.startsWith(`${id}/`)) continue;
    if (lib.startsWith("./")) for (const p of VENDOR_ROOTS[lib] ?? []) roots.add(p);
    else roots.add(packageOf(lib));
  }
  const found = new Map();
  const visit = (name, from) => {
    // Node's lookup: the nearest node_modules up from the one asking.
    let pkgDir = null;
    for (let dir = from; ; dir = dirname(dir)) {
      const candidate = join(dir, "node_modules", name);
      if (existsSync(join(candidate, "package.json"))) {
        pkgDir = candidate;
        break;
      }
      if (dir === root || dir === dirname(dir)) break;
    }
    if (!pkgDir || found.has(pkgDir)) return;
    const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
    found.set(pkgDir, pkg);
    for (const dep of Object.keys(pkg.dependencies ?? {})) visit(dep, pkgDir);
  };
  for (const name of roots) visit(name, root);
  return [...found.entries()]
    .map(([dir, pkg]) => ({ dir, pkg }))
    .sort((a, b) => a.pkg.name.localeCompare(b.pkg.name));
}

function readAll(dir, pattern) {
  return readdirSync(dir)
    .filter((name) => pattern.test(name))
    .sort()
    .map((name) => readFileSync(join(dir, name), "utf8").trim());
}

/** The notices file for these packages, or null when there are none. */
export function noticesFor(packages) {
  if (!packages.length) return null;
  const sections = packages.map(({ dir, pkg }) => {
    const license =
      typeof pkg.license === "string" ? pkg.license : "see its license file";
    const notices = readAll(dir, NOTICE_FILE);
    let texts = readAll(dir, LICENSE_FILE);
    if (!texts.length) {
      // No file of its own: the standard text of the license it declares.
      const text = standard[license.replace(/[()]/g, "").split(/ OR /)[0]]?.licenseText;
      if (!text)
        throw new Error(`${pkg.name} ${pkg.version}: no license text for "${license}"`);
      const author = typeof pkg.author === "string" ? pkg.author : pkg.author?.name;
      texts = [(author ? `Copyright (c) ${author}\n\n` : "") + text.trim()];
    }
    const block = (t) => "```text\n" + t + "\n```";
    return [
      `## ${pkg.name} ${pkg.version} (${license})`,
      ...texts.map(block),
      ...notices.map(block),
    ].join("\n\n");
  });
  return [
    "# Third-party notices",
    "This plugin carries the libraries below, each under its own license.",
    ...sections,
  ].join("\n\n") + "\n";
}
