// PlantUML blocks: drawn in the page by the PlantUML engine compiled to
// JavaScript, or - when the user picks it - by plantuml.com, fetched here.
const SERVER = "https://www.plantuml.com/plantuml/svg/";
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

/** The server's drawing, when the user chose the server. */
async function fromServer(block) {
  if ((await textus.settings.get("renderer")) !== "server") return null;
  const response = await textus.net.fetch(
    SERVER + (await encode(block.source)),
  );
  return { svg: new TextDecoder().decode(response.body) };
}

exports.activate = function (context) {
  registerChartBlock(context, "plantuml", "chart.html", fromServer);
};
