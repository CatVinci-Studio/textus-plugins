import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** OCR (plugins/catvinci.ocr) over a fake Ollama: what it asks before a
 *  download, and a picture read into Markdown. */
function withServer(models: string[], answers: { confirm: boolean }) {
  const requests: { url: string; body?: unknown }[] = [];
  const created: [string, string][] = [];
  const asked: string[] = [];
  const commands = new Map<string, (path?: string) => Promise<unknown>>();
  const respond = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 404, text: async () => JSON.stringify(body) });
  const plugin = loadPlugin("catvinci.ocr", {
    settings: { get: async () => undefined },
    net: {
      fetch: async (url: string, init?: { body?: string }) => {
        requests.push({ url, body: init?.body && JSON.parse(init.body) });
        if (url.endsWith("/api/tags")) return respond({ models: models.map((name) => ({ name })) });
        if (url.endsWith("/api/pull")) return respond({ status: "success" });
        if (url.endsWith("/v1/chat/completions"))
          return respond({ choices: [{ message: { content: "# Scanned\n\nText." } }] });
        return respond({}, false);
      },
    },
    files: {
      root: async () => "/root",
      read: async () => new Uint8Array([137, 80, 78, 71]),
      create: async (path: string, text: string) => (created.push([path, text]), path),
    },
    layout: { open: async () => {} },
    commands: { register: (id: string, run: (path?: string) => Promise<unknown>) => void commands.set(id, run) },
    views: { registerWebview: () => ({ dispose() {} }) },
    ui: {
      confirm: async (text: string) => (asked.push(text), answers.confirm),
      message: async (text: string) => void asked.push(text),
      notice: async () => true,
      withProgress: async (_title: string, task: () => Promise<unknown>) => task(),
    },
  });
  return { plugin, requests, created, asked, convert: (p: string) => commands.get("catvinci.ocr.convert")!(p) };
}

describe("the OCR plugin", () => {
  it("reads a picture into Markdown beside it, with the model there", async () => {
    const s = withServer(["richardyoung/xiaomi-ocr-0:latest"], { confirm: false });
    await s.convert("/root/scan.png");
    expect(s.asked).toEqual([]);
    expect(s.created).toEqual([["/root/scan.md", "# Scanned\n\nText.\n"]]);
    const call = s.requests.find((r) => r.url.endsWith("/v1/chat/completions"))!;
    expect(JSON.stringify(call.body)).toContain("data:image/png;base64,iVBORw==");
  });

  it("asks before downloading the model, and downloads nothing on no", async () => {
    const s = withServer([], { confirm: false });
    await s.convert("/root/scan.png");
    expect(s.asked).toHaveLength(1);
    expect(s.requests.some((r) => r.url.endsWith("/api/pull"))).toBe(false);
    expect(s.created).toEqual([]);
  });

  it("downloads it when the user says yes", async () => {
    const s = withServer([], { confirm: true });
    await s.convert("/root/scan.png");
    expect(s.requests.find((r) => r.url.endsWith("/api/pull"))?.body).toMatchObject({
      model: "richardyoung/xiaomi-ocr-0",
    });
    expect(s.created).toHaveLength(1);
  });

  it("gives Textus AI a picture's text, marked as OCR's", async () => {
    const s = withServer(["richardyoung/xiaomi-ocr-0"], { confirm: false });
    expect(await s.plugin.tools.get("read_with_ocr")!({ path: "scan.png" })).toMatchObject({
      file: "scan.png",
      text: "# Scanned\n\nText.",
    });
    expect(await s.plugin.tools.get("read_with_ocr")!({ path: "notes.md" })).toHaveProperty("error");
  });
});
