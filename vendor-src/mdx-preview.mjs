// How the preview draws what MDX adds to Markdown (mdast-util-to-hast
// handlers). Nothing of the document runs: a component Textus knows is
// drawn in its look, any other as a card with its name and attributes.

const el = (tagName, properties, children) => ({
  type: "element",
  tagName,
  properties: properties ?? {},
  children: children ?? [],
});
const text = (value) => ({ type: "text", value });

/** HTML a document may use as itself, and the attributes kept on it. */
const HTML = new Set(
  "a abbr b blockquote br caption code dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i img ins kbd li mark ol p pre q s small span strong sub summary sup table tbody td tfoot th thead tr u ul".split(" "),
);
const ATTRIBUTES = new Set(["href", "src", "alt", "title", "width", "height", "open", "colspan", "rowspan"]);
const SAFE_URL = /^(?:https?:|mailto:|#|\.{0,2}\/|[\w-]+(?:\.\w+)?(?:[/?#]|$))/i;

const TONES = {
  note: "info",
  info: "info",
  tip: "success",
  success: "success",
  important: "accent",
  warning: "warning",
  caution: "warning",
  danger: "danger",
  error: "danger",
};
const CALLOUTS = new Set(["Callout", "Admonition", "Note", "Tip", "Info", "Warning", "Caution", "Danger", "Important"]);
const TABS = new Set(["Tabs"]);
const TAB = new Set(["TabItem", "Tab", "Tabs.Tab"]);

/** An attribute's value as written: a string, `{…}` for code, or true. */
function attributeText(attribute) {
  if (attribute.type === "mdxJsxExpressionAttribute") return `{${attribute.value}}`;
  const value = attribute.value;
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value;
  return `{${value.value}}`;
}

const attributes = (node) =>
  Object.fromEntries(
    (node.attributes ?? [])
      .filter((a) => a.type === "mdxJsxAttribute")
      .map((a) => [a.name, attributeText(a)]),
  );

/** The tag as written, for a component's card. */
function tagText(node) {
  const parts = (node.attributes ?? []).map((a) => {
    if (a.type === "mdxJsxExpressionAttribute") return `{${a.value}}`;
    const value = attributeText(a);
    if (value === true) return a.name;
    return typeof a.value === "string" ? `${a.name}="${value}"` : `${a.name}=${value}`;
  });
  return `<${[node.name ?? "", ...parts].join(" ")}>`;
}

/** `items={['a', 'b']}`'s strings (Nextra's tab names). */
const listedStrings = (value) =>
  typeof value === "string" && value.startsWith("{")
    ? [...value.matchAll(/(['"`])((?:(?!\1).)*)\1/g)].map((m) => m[2])
    : [];

function callout(state, node, tone, title) {
  const head = title ? [el("p", { className: ["mdx-callout-title"] }, title)] : [];
  return el("aside", { className: ["mdx-callout"], dataTone: TONES[tone] ?? "info" }, [
    ...head,
    ...state.all(node),
  ]);
}

/** A Tabs' tabs: its children, or in a paragraph when written on one line. */
export const tabsOf = (node) =>
  (node.children ?? []).flatMap((child) =>
    child.type === "paragraph" ? (child.children ?? []).filter((c) => TAB.has(c.name)) : TAB.has(child.name) ? [child] : [],
  );

function tabs(state, node) {
  const names = listedStrings(attributes(node).items);
  let index = 0;
  const panels = tabsOf(node)
    .map((child) => {
      const own = attributes(child);
      const label = own.label ?? own.title ?? own.value ?? names[index] ?? `${index + 1}`;
      index++;
      return el("section", { className: ["mdx-tab"] }, [
        el("p", { className: ["mdx-tab-label"] }, [text(String(label))]),
        ...state.all(child),
      ]);
    });
  return el("div", { className: ["mdx-tabs"] }, panels);
}

/** A lowercase element: itself, with only safe attributes. */
function html(state, node) {
  const properties = {};
  for (const [name, value] of Object.entries(attributes(node))) {
    if (!ATTRIBUTES.has(name) || (typeof value === "string" && value.startsWith("{"))) continue;
    if ((name === "href" || name === "src") && !SAFE_URL.test(String(value))) continue;
    properties[name] = value;
  }
  // "<summary>" on its own line reads as a paragraph of it.
  const children = state.all(node).flatMap((child) => {
    const only = child.tagName === "p" && child.children.filter((c) => c.type === "element");
    return only?.length === 1 && only[0].tagName === "summary" ? only : [child];
  });
  return el(node.name, properties, children);
}

function jsx(state, node) {
  const name = node.name ?? "";
  if (!name) return state.all(node);
  if (HTML.has(name)) return html(state, node);
  if (TABS.has(name) && tabsOf(node).length) return tabs(state, node);
  const own = attributes(node);
  if (CALLOUTS.has(name)) {
    const tone = typeof own.type === "string" ? own.type : name.toLowerCase();
    const title = typeof own.title === "string" ? [text(own.title)] : null;
    return callout(state, node, tone, title);
  }
  const inline = node.type === "mdxJsxTextElement";
  const tag = el("code", { className: ["mdx-tag"] }, [text(tagText(node))]);
  const children = state.all(node);
  return inline
    ? el("span", { className: ["mdx-component", "is-inline"] }, [tag, ...children])
    : el("div", { className: ["mdx-component"] }, [el("p", {}, [tag]), ...children]);
}

const isComment = (value) => /^\s*\/\*[\s\S]*\*\/\s*$/.test(value ?? "");

function expression(state, node) {
  if (isComment(node.value)) return [];
  const code = el("code", { className: ["mdx-expression"] }, [text(`{${node.value}}`)]);
  return node.type === "mdxFlowExpression" ? el("p", {}, [code]) : code;
}

/** `:::tip[Title]`: a callout; any other directive, its text again. */
function directive(state, node) {
  if (node.type === "containerDirective" && TONES[node.name]) {
    const [first, ...rest] = node.children ?? [];
    const labelled = first?.data?.directiveLabel;
    const title = labelled ? state.all(first) : null;
    return callout(state, { ...node, children: labelled ? rest : node.children }, node.name, title);
  }
  const marker = { textDirective: ":", leafDirective: "::", containerDirective: ":::" }[node.type];
  const children = state.all(node);
  return node.type === "textDirective"
    ? [text(`${marker}${node.name}`), ...children]
    : el("div", {}, [el("p", {}, [text(`${marker}${node.name}`)]), ...children]);
}

export const previewHandlers = {
  mdxjsEsm: () => [],
  mdxFlowExpression: expression,
  mdxTextExpression: expression,
  mdxJsxFlowElement: jsx,
  mdxJsxTextElement: jsx,
  containerDirective: directive,
  leafDirective: directive,
  textDirective: directive,
};
