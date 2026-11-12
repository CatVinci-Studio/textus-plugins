// PlantUML blocks: drawn in the page by the PlantUML engine compiled to
// JavaScript, or - when the user picks it - by plantuml.com, fetched here.
const SERVER = "https://www.plantuml.com/plantuml/";
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

/** PlantUML's text encoding: raw deflate, then its own base64. */
async function encode(text) {
  const stream = new Blob([new TextEncoder().encode(text)])
    .stream()
    .pipeThrough(new CompressionStream("deflate-raw"));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const [a, b = 0, c = 0] = bytes.subarray(i, i + 3);
    out +=
      ALPHABET[a >> 2] +
      ALPHABET[((a & 3) << 4) | (b >> 4)] +
      ALPHABET[((b & 15) << 2) | (c >> 6)] +
      ALPHABET[c & 63];
  }
  return out;
}

/** One drawing from the server; a 400 is PlantUML's own error, drawn. */
async function fetchSvg(kind, code) {
  const response = await textus.net.fetch(SERVER + kind + "/" + code);
  const drawn = response.ok || response.status === 400;
  const text = drawn ? await response.text() : "";
  if (!text.trimStart().startsWith("<svg"))
    throw new Error("PlantUML server: " + response.status);
  return text;
}

/** The server's drawings, light and dark, when the user chose the server. */
async function fromServer(block) {
  if ((await textus.settings.get("renderer")) !== "server") return null;
  const code = await encode(block.source);
  const [svg, dark] = await Promise.all([
    fetchSvg("svg", code),
    fetchSvg("dsvg", code),
  ]);
  return { svg, dark };
}

exports.activate = function (context) {
  registerChartBlock(context, "plantuml", "chart.html", fromServer, (redraw) =>
    textus.settings.onDidChange(({ key }) => key === "renderer" && redraw()),
  );
};
