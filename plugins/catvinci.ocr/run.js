// A PDF read by OCR, page by page: each page drawn as a picture (pdf.js)
// and handed to the plugin to read, the next once it has; Stop ends it with
// the pages read so far.
(function () {
  "use strict";
  const api = acquireTextusApi();
  const t = api.t;
  const $ = (id) => document.getElementById(id);
  /** Drawn at twice the page's size: small print stays readable. */
  const SCALE = 2;
  let stopped = false;
  let total = 0;
  let next = null;

  const say = (text, done) => {
    $("status").textContent = text;
    $("progress").style.setProperty("--value", String(total ? done / total : 0));
  };
  $("stop").textContent = t("stop");
  $("stop").onclick = () => {
    stopped = true;
    $("stop").disabled = true;
    if (next) next();
  };
  say(t("opening"), 0);

  async function picture(pdf, number) {
    const page = await pdf.getPage(number);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = $("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
    return canvas.toDataURL("image/png").split(",")[1];
  }

  async function run(bytes, pages) {
    await (window.pdfjsLib ? null : new Promise((r) => addEventListener("pdfjs-ready", r, { once: true })));
    const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    const numbers = (pages || Array.from({ length: pdf.numPages }, (_, i) => i + 1)).filter((n) => n <= pdf.numPages);
    total = numbers.length;
    for (let i = 0; i < numbers.length && !stopped; i++) {
      say(t("readingPage", numbers[i], pdf.numPages), i);
      const png = await picture(pdf, numbers[i]);
      const read = new Promise((resolve) => (next = resolve));
      api.postMessage({ type: "page", number: numbers[i], png: png });
      await read;
    }
    say(stopped ? t("stoppedAt") : t("done"), total);
    $("stop").hidden = true;
    api.postMessage({ type: stopped ? "stopped" : "done" });
  }

  api.onMessage((message) => {
    if (message.type === "pdf")
      run(message.bytes, message.pages).catch((e) => {
        const text = String((e && e.message) || e);
        say(t("failed", text), 0);
        api.postMessage({ type: "failed", message: text });
      });
    if (message.type === "read" && next) next();
    if (message.type === "failed") {
      stopped = true;
      say(t("failed", message.message), 0);
      $("stop").hidden = true;
    }
    if (message.type === "gone") say(t("gone"), 0);
  });
  api.postMessage({ type: "ready" });
})();
