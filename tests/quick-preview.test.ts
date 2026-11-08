import { expect, it } from "vitest";
import { folder, loadPlugin } from "./plugin-host";

/** Quick Preview's cards (plugins/catvinci.quick-preview/host.js). */
type Hover = (
  target: Record<string, unknown>,
) => Promise<{ title: string; markdown: string } | null>;

function cards(files: Record<string, string>): Hover {
  let hover: Hover | null = null;
  const editor = {
    registerHover: (provider: { provideHover: Hover }) => {
      hover = provider.provideHover;
      return { dispose() {} };
    },
  };
  const { manifest } = loadPlugin("catvinci.quick-preview", {
    files: folder(files),
    editor,
  });
  // It alone is asked for document cards.
  expect(manifest.contributes.hovers).toEqual(["document"]);
  return hover!;
}

const NOTE =
  "---\ntags: [x]\n---\n# Plan\n\nIntro.\n\n## Steps\n\nDo it. ^step1\n\n- a\n- b\n\n^list1\n";

it("shows the block a link names, the section, or the opening", async () => {
  const hover = cards({ "Plan.md": NOTE });
  const doc = (more: Record<string, unknown>) =>
    hover({ type: "document", path: "/root/Plan.md", heading: null, ...more });
  expect(await doc({ block: "step1" })).toEqual({
    title: "Plan › ^step1",
    markdown: "Do it.",
  });
  expect(await doc({ block: "list1" })).toEqual({
    title: "Plan › ^list1",
    markdown: "- a\n- b",
  });
  expect(await doc({ heading: "Steps" })).toEqual({
    title: "Plan › Steps",
    markdown: "## Steps\n\nDo it.\n\n- a\n- b",
  });
  // A block that isn't there: the note's opening, as a click opens it.
  expect(await doc({ block: "gone" })).toEqual({
    title: "Plan",
    markdown: "# Plan\n\nIntro.\n\n## Steps\n\nDo it.\n\n- a\n- b",
  });
  expect(await hover({ type: "link", url: "https://x.org" })).toBeNull();
  expect(await doc({ path: "/root/None.md" })).toBeNull();
});
