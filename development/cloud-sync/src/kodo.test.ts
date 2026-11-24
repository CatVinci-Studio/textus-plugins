import { describe, expect, it } from "vitest";
import {
  encodePolicy,
  multipart,
  putPolicy,
  signEncodedPolicy,
  uploadToken,
} from "./kodo";
import { normalizeConfig, providers } from "./config";
import { RemoteStore, type Fetch } from "./transport";
import { SyncError } from "./model";
import { bytes } from "./test-fixtures";

const docPolicy =
  "eyJzY29wZSI6Im15LWJ1Y2tldDpzdW5mbG93ZXIuanBnIiwiZGVhZGxpbmUiOjE0NTE0OTEyMDAsInJldHVybkJvZHkiOiJ7XCJuYW1lXCI6JChmbmFtZSksXCJzaXplXCI6JChmc2l6ZSksXCJ3XCI6JChpbWFnZUluZm8ud2lkdGgpLFwiaFwiOiQoaW1hZ2VJbmZvLmhlaWdodCksXCJoYXNoXCI6JChldGFnKX0ifQ==";

describe("Qiniu Kodo upload tokens", () => {
  it("matches Qiniu's token example", async () => {
    expect(await signEncodedPolicy("MY_SECRET_KEY", docPolicy)).toBe(
      "wQ4ofysef1R7IKnrziqtomqyDvI=",
    );
  });

  it("allows one key and no overwrite", () => {
    const policy = JSON.parse(
      putPolicy("bucket", "notes/v1/lock.json", 1_451_491_200),
    );
    expect(policy.scope).toBe("bucket:notes/v1/lock.json");
    expect(policy.insertOnly).toBe(1);
    expect(policy.deadline).toBe(1_451_491_200);
  });

  it("has three parts", async () => {
    const token = await uploadToken("AK", "SK", "bucket", "key", 1);
    expect(token.split(":")).toHaveLength(3);
    expect(token.startsWith("AK:")).toBe(true);
    expect(
      token.endsWith(`:${encodePolicy(putPolicy("bucket", "key", 1))}`),
    ).toBe(true);
  });

  it("carries the token, key and bytes in a form body", () => {
    const body = new TextDecoder().decode(
      multipart("BOUND", "TOKEN", "notes/a b.md", bytes("hi")),
    );
    expect(body.startsWith("--BOUND\r\n")).toBe(true);
    expect(body).toContain('name="token"\r\n\r\nTOKEN\r\n');
    expect(body).toContain('name="key"\r\n\r\nnotes/a b.md\r\n');
    expect(body).toContain('name="file"; filename="blob"');
    expect(body).toContain("\r\n\r\nhi\r\n--BOUND--\r\n");
  });
});

describe("a Kodo connection", () => {
  it("takes its address from a region in Qiniu's list, never typed in", () => {
    for (const region of Object.keys(providers.kodo.regions!)) {
      const config = normalizeConfig({
        provider: "kodo",
        endpoint: "https://elsewhere.example",
        region,
        bucket: "bucket",
      });
      expect(config.endpoint).toBe(`https://s3.${region}.qiniucs.com`);
      expect(config.region).toBe(region);
      expect(config.pathStyle).toBe(true);
    }
    for (const region of ["", "us-east-1", "eu-west-1"])
      expect(() =>
        normalizeConfig({ provider: "kodo", region, bucket: "bucket" }),
      ).toThrow("regionRequired");
    // S3 still starts in us-east-1.
    expect(normalizeConfig({ provider: "s3", bucket: "bucket" }).region).toBe(
      "us-east-1",
    );
  });
});

type Reply = Awaited<ReturnType<Fetch>>;
const reply = (
  status: number,
  data = new Uint8Array(),
  headers: Record<string, string> = {},
): Reply => ({
  status,
  ok: status >= 200 && status < 300,
  headers,
  bytes: async () => data,
  text: async () => new TextDecoder().decode(data),
  json: async () => JSON.parse(new TextDecoder().decode(data)),
});
interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}
/** A Kodo store whose upload host answers `upload` in turn (an Error: no
 *  answer), and whose S3 address holds `there`. */
function kodo(upload: (number | Error | Reply)[], there?: string) {
  const calls: Call[] = [];
  const waits: number[] = [];
  const fetch: Fetch = async (url, init = {}) => {
    calls.push({
      url,
      method: String(init.method),
      headers: init.headers ?? {},
      body: new TextDecoder().decode(init.body as Uint8Array | undefined),
    });
    if (!url.startsWith("https://up-"))
      return there === undefined ? reply(404) : reply(200, bytes(there));
    const next = upload.shift() ?? 200;
    if (next instanceof Error) throw next;
    return typeof next === "number" ? reply(next) : next;
  };
  const store = new RemoteStore(
    normalizeConfig({
      provider: "kodo",
      region: "cn-south-1",
      bucket: "bucket",
      prefix: "notes",
    }),
    { account: "AK", secret: "SK" },
    fetch,
    async (ms) => waits.push(ms),
  );
  const posts = () => calls.filter((c) => c.method === "POST");
  return { store, calls, posts, waits };
}
const lost = () => new Error("connection lost after the write");

describe("creating on Kodo", () => {
  it("posts an unsigned insert-only form to the region's upload host", async () => {
    const { store, posts } = kodo([200]);
    expect(await store.create("v1/lock.json", bytes("one"))).toBe(true);
    const [post] = posts();
    expect(post.url).toBe("https://up-z2.qiniup.com/");
    expect(Object.keys(post.headers).join()).not.toMatch(/authorization/i);
    expect(post.body).toContain('name="key"\r\n\r\nnotes/v1/lock.json\r\n');
    expect(post.body).toContain('name="token"\r\n\r\nAK:');
  });

  it("is refused by a file there (614) on the first try", async () => {
    const { store, calls } = kodo([614], "one");
    expect(await store.create("v1/lock.json", bytes("one"))).toBe(false);
    expect(calls).toHaveLength(1);
  });

  it("after a lost reply, counts a 614 as its own only for the same bytes", async () => {
    expect(
      await kodo([lost(), 614], "one").store.create(
        "v1/lock.json",
        bytes("one"),
      ),
    ).toBe(true);
    // Another device's lock: different bytes are never taken as ours.
    expect(
      await kodo([lost(), 614], "other").store.create(
        "v1/lock.json",
        bytes("one"),
      ),
    ).toBe(false);
    expect(
      await kodo([lost(), 614]).store.create("v1/lock.json", bytes("one")),
    ).toBe(false);
  });

  it("names a wrong region or bucket, and a refused token", async () => {
    for (const status of [400, 631])
      await expect(
        kodo([status]).store.create("v1/lock.json", bytes("one")),
      ).rejects.toMatchObject({ code: "invalidConfig" });
    await expect(
      kodo([401]).store.create("v1/lock.json", bytes("one")),
    ).rejects.toMatchObject({ code: "permissionError", args: [401] });
    await expect(
      kodo([599]).store.create("v1/lock.json", bytes("one")),
    ).rejects.toBeInstanceOf(SyncError);
  });

  it("waits out a busy or failing upload host as the S3 address is", async () => {
    for (const status of [429, 502, 503, 504]) {
      const { store, posts, waits } = kodo([
        reply(status, new Uint8Array(), { "retry-after": "2" }),
        200,
      ]);
      expect(await store.create("v1/lock.json", bytes("one"))).toBe(true);
      expect(posts()).toHaveLength(2);
      expect(Math.max(...waits)).toBeGreaterThanOrEqual(2000);
    }
    // A wait longer than a sync holds on stops it for now.
    await expect(
      kodo([
        reply(429, new Uint8Array(), { "retry-after": "120" }),
      ]).store.create("v1/lock.json", bytes("one")),
    ).rejects.toMatchObject({ code: "rateLimited" });
    // No answer, every time: a bounded number of tries.
    const { store, posts } = kodo([lost(), lost(), lost(), lost(), lost()]);
    await expect(
      store.create("v1/lock.json", bytes("one")),
    ).rejects.toMatchObject({ code: "networkError" });
    expect(posts()).toHaveLength(4);
  });

  it("dates its token by the server's clock", async () => {
    const ahead = Date.now() + 86_400_000;
    const date = { date: new Date(ahead).toUTCString() };
    const { store, posts } = kodo([reply(200, new Uint8Array(), date)]);
    // The first answer brings the server's Date.
    await store.create("v1/a.json", bytes("one"));
    await store.create("v1/b.json", bytes("one"));
    const token = posts()[1]
      .body.split('name="token"\r\n\r\n')[1]
      .split("\r\n")[0];
    const policy = JSON.parse(
      atob(token.split(":")[2].replace(/-/g, "+").replace(/_/g, "/")),
    );
    expect(policy.deadline).toBeGreaterThan(ahead / 1000 + 3000);
  });
});
