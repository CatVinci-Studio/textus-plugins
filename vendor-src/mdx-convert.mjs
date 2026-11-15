// MDX to Markdown and back, by the source: what isn't converted is copied
// as written. Components Markdown has a form for become it (a callout a
// GitHub alert, tabs headed parts); any other keeps its contents, or, with
// none, stays as a comment, so nothing is lost.
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { tabsOf } from "./mdx-preview.mjs";

const mdxReader = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkDirective);
const mdReader = unified().use(remarkParse).use(remarkGfm);

const startOf = (node) => node.position.start.offset;
const endOf = (node) => node.position.end.offset;
const placed = (node) => node.position?.start?.offset !== undefined;

const ALERTS = {
  note: "NOTE",
  info: "NOTE",
  tip: "TIP",
  success: "TIP",
  important: "IMPORTANT",
  warning: "WARNING",
  caution: "CAUTION",
  danger: "CAUTION",
  error: "CAUTION",
};
const CALLOUTS = new Set(["Callout", "Admonition", "Note", "Tip", "Info", "Warning", "Caution", "Danger", "Important"]);

function dedent(text) {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join("\n");
}

const quoted = (text) =>
  text
    .split("\n")
    .map((l) => (l ? `> ${l}` : ">"))
    .join("\n");

function stringAttribute(node, name) {
  const found = (node.attributes ?? []).find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  return typeof found?.value === "string" ? found.value : null;
}

const listedStrings = (node, name) => {
  const found = (node.attributes ?? []).find((a) => a.name === name);
  const value = found?.value?.value;
  return typeof value === "string" ? [...value.matchAll(/(['"`])((?:(?!\1).)*)\1/g)].map((m) => m[2]) : [];
};

function toMarkdown(text) {
  /** `[s, e)` of the source, each child in it as converted. */
  const range = (s, e, children) => {
    let out = "";
    let at = s;
    for (const child of children ?? []) {
      if (!placed(child)) continue;
      out += text.slice(at, startOf(child)) + convert(child);
      at = endOf(child);
    }
    return out + text.slice(at, e);
  };
  const inner = (node) => {
    const kids = (node.children ?? []).filter(placed);
    if (!kids.length) return "";
    return range(startOf(kids[0]), endOf(kids.at(-1)), kids);
  };
  const alert = (tone, title, body) =>
    quoted(`[!${ALERTS[tone] ?? "NOTE"}]\n${title ? `**${title}**\n\n` : ""}${dedent(body)}`);

  function convert(node) {
    switch (node.type) {
      case "mdxjsEsm":
        return "";
      case "mdxFlowExpression":
      case "mdxTextExpression": {
        const comment = /^\s*\/\*([\s\S]*)\*\/\s*$/.exec(node.value ?? "");
        return comment ? `<!--${comment[1]}-->` : text.slice(startOf(node), endOf(node));
      }
      case "containerDirective":
        if (ALERTS[node.name]) {
          const [first, ...rest] = node.children ?? [];
          const labelled = first?.data?.directiveLabel;
          const title = labelled ? inner(first) : null;
          return alert(node.name, title, inner({ children: labelled ? rest : node.children }));
        }
        break;
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement": {
        const name = node.name ?? "";
        if (!/^[A-Z]/.test(name)) break;
        if (CALLOUTS.has(name))
          return alert(stringAttribute(node, "type") ?? name.toLowerCase(), stringAttribute(node, "title"), inner(node));
        const tabs = name === "Tabs" ? tabsOf(node) : [];
        if (tabs.length) {
          const names = listedStrings(node, "items");
          return tabs
            .map((tab, i) => {
              const label = stringAttribute(tab, "label") ?? stringAttribute(tab, "title") ?? stringAttribute(tab, "value") ?? names[i] ?? `${i + 1}`;
              return `**${label}**\n\n${dedent(inner(tab))}`;
            })
            .join("\n\n");
        }
        const kept = inner(node);
        if (kept.trim()) return node.type === "mdxJsxTextElement" ? kept : dedent(kept);
        return `<!-- ${text.slice(startOf(node), endOf(node))} -->`;
      }
    }
    return range(startOf(node), endOf(node), node.children);
  }
  const tree = mdxReader.parse(text);
  return range(0, text.length, tree.children).replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "");
}

/** The Markdown of an MDX document; throws where MDX can't read it. */
export function mdxToMarkdown(text) {
  return toMarkdown(String(text));
}

const VOID = /^<(br|hr|img|input|col|wbr)(\s[^>]*)?>$/i;

/** A Markdown document written so MDX reads it the same: braces and `<`
 *  in its text escaped, comments and void tags in MDX's form, autolinks
 *  as links. */
export function markdownToMdx(source) {
  const text = String(source);
  const edits = [];
  const walk = (node) => {
    if (!placed(node)) return node.children?.forEach(walk);
    const s = startOf(node);
    const e = endOf(node);
    const raw = text.slice(s, e);
    if (node.type === "text") {
      const escaped = raw.replace(/(\\.)|([{}<])/g, (m, esc, ch) => esc ?? `\\${ch}`);
      if (escaped !== raw) edits.push([s, e, escaped]);
    } else if (node.type === "html") {
      const comment = /^<!--([\s\S]*?)-->$/.exec(raw.trim());
      if (comment) edits.push([s, e, `{/*${comment[1].replace(/\*\//g, "* /")}*/}`]);
      else if (VOID.test(raw.trim())) edits.push([s, e, raw.trim().replace(/\s*\/?>$/, " />")]);
    } else if (node.type === "link" && raw.startsWith("<")) {
      edits.push([s, e, `[${node.url}](${node.url})`]);
      return;
    }
    if (node.type !== "code" && node.type !== "inlineCode") node.children?.forEach(walk);
  };
  walk(mdReader.parse(text));
  let out = text;
  for (const [s, e, value] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + value + out.slice(e);
  return out;
}
