// Every plugin whose package changes gets a new version: the release
// refuses to publish different files under a version already out. Compares
// with `main` (or the ref given), its own files and the shared ones it
// bundles (libs.json).
//
//   node scripts/check-bumps.mjs [base-ref]
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";

const base = process.argv[2] || "origin/main";
const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
try {
  git("rev-parse", "--verify", base);
} catch {
  console.log(`check-bumps: no ${base} here, skipped`);
  process.exit(0);
}
const changed = new Set(
  git("diff", "--name-only", `${base}...HEAD`).split("\n").filter(Boolean),
);
const libs = JSON.parse(readFileSync("libs.json", "utf8"));
const versionAt = (ref, id) => {
  try {
    return JSON.parse(git("show", `${ref}:plugins/${id}/textus-plugin.json`)).version;
  } catch {
    return null; // new in this branch
  }
};
const late = [];
for (const id of readdirSync("plugins")) {
  const own = [...changed].some(
    (f) => f.startsWith(`plugins/${id}/`) && !/\/(README[^/]*|screenshots\/.*)$/.test(f),
  );
  const bundled = Object.entries(libs).some(
    ([target, from]) =>
      target.startsWith(`${id}/`) &&
      from.startsWith("./") &&
      [...changed].some((f) => `./${f}` === from || (from.endsWith("/") && `./${f}`.startsWith(from))),
  );
  if (!own && !bundled) continue;
  const before = versionAt(base, id);
  const now = JSON.parse(readFileSync(`plugins/${id}/textus-plugin.json`, "utf8")).version;
  if (before && before === now) late.push(`${id} ${now}`);
}
if (late.length) {
  console.error(`These changed but kept their version - give each a new one:\n  ${late.join("\n  ")}`);
  process.exit(1);
}
console.log("check-bumps: every changed plugin has a new version");
