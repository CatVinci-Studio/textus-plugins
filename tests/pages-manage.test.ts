import { expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Pages' tree managed from the sidebar (plugins/catvinci.database/pages-host.js):
 *  renamed, deleted, dragged, and units kept whole when their folder is renamed. */
function setup(
  files: Record<string, string>,
  answers: { input?: string; confirm?: boolean } = {},
) {
  const f = folder(files);
  const commands = new Map<string, (...args: unknown[]) => Promise<unknown>>();
  let provider: { onMove?: (a: unknown, b: unknown) => Promise<unknown> } = {};
  const renames: ((change: { from: string; to: string }) => void)[] = [];
  loadPlugin("catvinci.database", {
    files: {
      ...f,
      onDidRename: (fn: (typeof renames)[0]) => (
        renames.push(fn),
        { dispose() {} }
      ),
    },
    metadata: {
      all: async () =>
        Object.keys(files).map((rel) => ({
          path: "/root/" + rel,
          rel,
          frontmatter: {},
        })),
    },
    commands: {
      register: (id: string, run: (...a: unknown[]) => Promise<unknown>) => (
        commands.set(id, run),
        { dispose() {} }
      ),
    },
    views: {
      registerList: (_: string, p: typeof provider) => (
        (provider = p),
        { refresh() {}, dispose() {} }
      ),
      registerCodeBlock: () => ({ dispose() {} }),
      registerFileEditor: () => ({ dispose() {} }),
    },
    ui: {
      input: async () => answers.input ?? null,
      confirm: async () => answers.confirm ?? false,
      message: async () => {},
    },
  });
  const page = (rel: string) => ({ data: { rel, dir: null } });
  return {
    files,
    commands,
    move: (a: string, b: string) => provider.onMove!(page(a), page(b)),
    renamed: (from: string, to: string) =>
      renames.forEach((fn) => fn({ from: "/root/" + from, to: "/root/" + to })),
  };
}

it("takes a page dragged onto another as its sub-page, the other made a unit", async () => {
  const { files, move } = setup({
    "Plans.md": "# Plans\n",
    "Trip.md": "# Trip\n",
    "Trip/Day 1.md": "# Day 1\n",
  });
  await move("Trip.md", "Plans.md");
  expect(Object.keys(files).sort()).toEqual([
    "Plans/Plans.md",
    "Plans/Trip.md",
    "Trip/Day 1.md",
  ]);
  // A unit dragged goes with its folder.
  const unit = setup({
    "Plans.md": "# Plans\n",
    "Trip/Trip.md": "# Trip\n",
    "Trip/Day 1.md": "# Day 1\n",
  });
  await unit.move("Trip/Trip.md", "Plans.md");
  expect(Object.keys(unit.files).sort()).toEqual([
    "Plans/Plans.md",
    "Plans/Trip/Day 1.md",
    "Plans/Trip/Trip.md",
  ]);
  // Never into itself.
  await unit.move("Plans/Plans.md", "Plans/Trip/Trip.md");
  expect(Object.keys(unit.files)).toHaveLength(3);
});

it("keeps a unit whole when its folder is renamed anywhere, and renames a unit with its folder", async () => {
  const { files, renamed, commands } = setup(
    { "Goals/Plans.md": "# Plans\n", "Goals/Q1.md": "# Q1\n" },
    { input: "Aims" },
  );
  renamed("Plans", "Goals");
  await new Promise((r) => setTimeout(r, 0));
  expect(Object.keys(files).sort()).toEqual(["Goals/Goals.md", "Goals/Q1.md"]);
  await commands.get("catvinci.database.renamePage")!("/root/Goals/Goals.md");
  expect(Object.keys(files).sort()).toEqual(["Aims/Goals.md", "Aims/Q1.md"]);
});

it("moves a page and its sub-pages to the Trash once confirmed", async () => {
  const no = setup(
    { "Trip/Trip.md": "#", "Trip/Day.md": "#", "Keep.md": "#" },
    { confirm: false },
  );
  await no.commands.get("catvinci.database.deletePage")!("/root/Trip/Trip.md");
  expect(Object.keys(no.files)).toHaveLength(3);
  const yes = setup(
    { "Trip/Trip.md": "#", "Trip/Day.md": "#", "Keep.md": "#" },
    { confirm: true },
  );
  await yes.commands.get("catvinci.database.deletePage")!("/root/Trip/Trip.md");
  expect(Object.keys(yes.files)).toEqual(["Keep.md"]);
});
