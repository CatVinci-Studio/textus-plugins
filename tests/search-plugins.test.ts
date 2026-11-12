import { describe, expect, it } from "vitest";
import { loadPlugin } from "./plugin-host";

/** A fetch answering `body` as JSON, remembering what it was asked. */
function answering(body: unknown, status = 200) {
  const asked: { url: string; init?: { headers?: Record<string, string> } }[] =
    [];
  const fetch = async (
    url: string,
    init?: { headers?: Record<string, string> },
  ) => {
    asked.push({ url, init });
    return { ok: status < 400, status, json: async () => body };
  };
  return { asked, net: { fetch } };
}

describe("Openverse Pictures", () => {
  it("offers only openly licensed pictures, each with its credit", async () => {
    const { asked, net } = answering({
      results: [
        {
          title: "Roof",
          url: "https://x/a.jpg",
          license: "by",
          license_version: "2.0",
          creator: "Ann",
          source: "flickr",
          foreign_landing_url: "https://flickr/a",
        },
        {
          title: "Shut",
          url: "https://x/b.jpg",
          license: "by-nc",
          license_version: "4.0",
        },
        {
          title: "Old",
          url: "https://x/c.jpg",
          license: "pdm",
          source: "museum",
          foreign_landing_url: "https://m/c",
        },
      ],
    });
    const found = JSON.parse(
      (await loadPlugin("catvinci.openverse", { net }).tools.get(
        "find_open_pictures",
      )!({ query: "green roof" })) as string,
    );
    expect(asked[0].url).toContain("license=by,by-sa,cc0,pdm");
    expect(found.map((p: { title: string }) => p.title)).toEqual([
      "Roof",
      "Old",
    ]);
    expect(found[0].credit).toBe(
      "Ann · CC BY 2.0 · [flickr](https://flickr/a)",
    );
    expect(found[1].credit).toBe("Public domain · [museum](https://m/c)");
  });
});

describe("Keenable Search", () => {
  it("uses the public search without a key, and cuts a long text", async () => {
    const { asked, net } = answering({
      results: [
        {
          title: "A",
          url: "https://a",
          snippet: "x".repeat(700),
          published_at: "2026-01-02",
        },
      ],
    });
    const found = JSON.parse(
      (await loadPlugin("catvinci.keenable", { net }).tools.get(
        "keenable_search",
      )!({ query: "q" })) as string,
    );
    expect(asked[0].url).toBe("https://api.keenable.ai/v1/search/public");
    expect(asked[0].init?.headers?.["X-Keenable-Title"]).toBe("Textus");
    expect(found[0].text).toHaveLength(601);
    expect(found[0].date).toBe("2026-01-02");
  });

  it("treats a key left as \"null\" as none, and reports an unreadable answer", async () => {
    const asked: string[] = [];
    let setKey: () => Promise<void> = async () => {};
    const plugin = loadPlugin("catvinci.keenable", {
      net: {
        fetch: async (url: string) => {
          asked.push(url);
          return { ok: true, status: 200, json: async () => JSON.parse("<") };
        },
      },
      ui: { input: async () => "null", notice: () => {} },
      commands: {
        register: (_id: string, run: () => Promise<void>) => {
          setKey = run;
          return { dispose() {} };
        },
      },
    });
    await setKey();
    const answer = await plugin.tools.get("keenable_search")!({ query: "q" });
    expect(asked[0]).toBe("https://api.keenable.ai/v1/search/public");
    expect(answer).toBe("Keenable sent an unreadable answer.");
  });
});
