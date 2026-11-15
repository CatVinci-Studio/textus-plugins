// Bars: a fenced ```bars block drawn by the plugin. Each line is
// `label: number`; the block shows them as bars in the theme's accent
// (textus.appearance.colors), redrawn as the block's text changes.

/** The block's lines as [label, number] pairs; other lines are skipped. */
function parse(source) {
  return source
    .split("\n")
    .map((line) => /^(.+?):\s*(-?\d+(?:\.\d+)?)\s*$/.exec(line.trim()))
    .filter(Boolean)
    .map((m) => [m[1], Number(m[2])]);
}

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg(rows, fill) {
  const most = Math.max(1, ...rows.map(([, n]) => n));
  const bar = (row, i) => {
    const [label, n] = row;
    const width = Math.max(0, (n / most) * 70);
    const y = i * 28;
    return `<text x="0" y="${y + 18}" fill="currentColor">${escape(label)}</text>
      <rect x="28%" y="${y + 4}" width="${width}%" height="18" rx="4" fill="${fill}"/>`;
  };
  return `<svg width="100%" height="${rows.length * 28}" font-size="13">${rows.map(bar).join("")}</svg>`;
}

exports.activate = function (ctx) {
  ctx.subscriptions.push(
    textus.views.registerCodeBlock("bars", {
      async render(block, webview) {
        const fill = (await textus.appearance.colors())["--doc-accent"];
        const draw = (source) => {
          webview.html = svg(parse(source), fill);
        };
        draw(block.source);
        block.onDidChange(draw);
      },
    }),
  );
};

// For tests; Textus reads only activate.
exports.parse = parse;
