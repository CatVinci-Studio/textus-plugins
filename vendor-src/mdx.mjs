// MDX for the catvinci.mdx plugin, bundled into vendor/mdx.js as
// globalThis.textusMdx: check a document with MDX's own compiler, draw it
// without running any of its code, and turn it into Markdown and back.
import { compile } from "@mdx-js/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { previewHandlers } from "./mdx-preview.mjs";
import { mdxToMarkdown, markdownToMdx } from "./mdx-convert.mjs";

/** The first problem MDX's compiler finds, as `{ line, column, message }`;
 *  none when it compiles. The compiler stops at the first. */
async function check(text) {
  try {
    await compile(String(text), { format: "mdx" });
    return [];
  } catch (error) {
    const place = error.place?.start ?? error.place ?? {};
    return [
      {
        line: error.line ?? place.line ?? 1,
        column: error.column ?? place.column ?? 1,
        message: String(error.reason ?? error.message ?? error),
      },
    ];
  }
}

const preview = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkRehype, { handlers: previewHandlers, allowDangerousHtml: false })
  .use(rehypeStringify);

/** The document drawn as HTML: components Textus knows (tabs, callouts,
 *  details) in its own look, any other as a card naming it; no code of
 *  the document's runs. Where it stops reading (mid-edit), what comes
 *  before; null when nothing does. */
function toHtml(text) {
  let source = String(text);
  for (let tries = 0; tries < 4 && source.trim(); tries++) {
    try {
      return String(preview.processSync(source));
    } catch (error) {
      // Up to the blank line before the block it stopped in.
      const line = error.line ?? error.place?.start?.line ?? error.place?.line;
      if (!line) return null;
      const lines = source.split("\n").slice(0, line - 1);
      const blank = lines.findLastIndex((l) => !l.trim());
      source = blank < 0 ? "" : lines.slice(0, blank).join("\n");
    }
  }
  return null;
}

globalThis.textusMdx = { check, toHtml, mdxToMarkdown, markdownToMdx };
