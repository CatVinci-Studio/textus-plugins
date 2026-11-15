import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** MDX (plugins/catvinci.mdx) with its bundled reader, vendor/mdx.js. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdx = () => (globalThis as any).textusMdx;

const DOC = `import Tabs from '@theme/Tabs';
export const meta = { title: 'Guide' };

# Guide

Text with {props.version} and <Highlight color="red">words</Highlight>.

<Tabs items={['pnpm', 'npm']}>
  <Tabs.Tab>pnpm i</Tabs.Tab>
  <Tabs.Tab>npm i</Tabs.Tab>
</Tabs>

<Callout type="warning" title="Careful">
  **Bold** words.
</Callout>

:::tip[Pro tip]
Use it.
:::

<Image src="/a.png" width={400} />

<details>
  <summary>More</summary>

Hidden.

</details>

{/* a comment */}
`;

describe("the tool and its reader", () => {
  it("says where MDX's compiler stops, for text, a file or the document in front", async () => {
    const files = { readText: async () => "# a\n\n{a b}\n" };
    const editor = { getText: async () => DOC };
    const { tools } = loadPlugin("catvinci.mdx", { files, editor });
    const check = tools.get("check_mdx")!;
    expect(await check({})).toEqual({ ok: true });
    expect(await check({ path: "/r/a.mdx" })).toEqual({
      ok: false,
      problems: [{ line: 3, column: 3, message: "Could not parse expression with acorn" }],
    });
    expect(await check({ text: "<Foo>\n" })).toMatchObject({ ok: false });
  });

  it("draws components without running any of the document", () => {
    loadPlugin("catvinci.mdx");
    const html: string = mdx().toHtml(DOC);
    expect(html).not.toMatch(/import|export const|<script|a comment/);
    expect(html).toContain('<p class="mdx-tab-label">pnpm</p>pnpm i');
    expect(html).toContain('<aside class="mdx-callout" data-tone="warning"><p class="mdx-callout-title">Careful</p>');
    expect(html).toContain('data-tone="success"><p class="mdx-callout-title">Pro tip</p>');
    expect(html).toContain("&#x3C;Image src=\"/a.png\" width={400}>");
    expect(html).toContain("<details><summary>More</summary><p>Hidden.</p></details>");
    expect(html).toContain('<code class="mdx-expression">{props.version}</code>');
    // Mid-edit, what reads before the block it stops in.
    const broken: string = mdx().toHtml("# Title\n\nFine.\n\nBroken {a b} here.\n\nAfter.\n");
    expect(broken).toBe("<h1>Title</h1>\n<p>Fine.</p>");
    // A handler or a script URL is never drawn.
    const unsafe: string = mdx().toHtml('<a href="javascript:alert(1)" onClick={x}>go</a>\n');
    expect(unsafe).toBe("<p><a>go</a></p>");
  });

  it("turns MDX into Markdown that keeps what it said", () => {
    loadPlugin("catvinci.mdx");
    expect(mdx().mdxToMarkdown(DOC)).toBe(`# Guide

Text with {props.version} and words.

**pnpm**

pnpm i

**npm**

npm i

> [!WARNING]
> **Careful**
>
> **Bold** words.

> [!TIP]
> **Pro tip**
>
> Use it.

<!-- <Image src="/a.png" width={400} /> -->

<details>
  <summary>More</summary>

Hidden.

</details>

<!-- a comment -->
`);
  });

  it("writes Markdown so MDX reads it", async () => {
    loadPlugin("catvinci.mdx");
    const md = "Use {x} and a < b, <br>, <!-- note --> <https://x.org> `{code}`\n\n```\n{a}\n```\n";
    const out: string = mdx().markdownToMdx(md);
    expect(out).toBe(
      "Use \\{x\\} and a \\< b, <br />, {/* note */} [https://x.org](https://x.org) `{code}`\n\n```\n{a}\n```\n",
    );
    expect(await mdx().check(out)).toEqual([]);
    expect(await mdx().check(mdx().markdownToMdx(mdx().mdxToMarkdown(DOC)))).toEqual([]);
  });
});
