import { describe, expect, it } from "vitest";
import {
  encodePolicy,
  multipart,
  putPolicy,
  signEncodedPolicy,
  uploadHost,
  uploadToken,
} from "./kodo";

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
    expect(token.endsWith(`:${encodePolicy(putPolicy("bucket", "key", 1))}`)).toBe(
      true,
    );
  });

  it("maps every S3 region to an upload host", () => {
    for (const [region, host] of [
      ["cn-east-1", "up-z0.qiniup.com"],
      ["cn-east-2", "up-cn-east-2.qiniup.com"],
      ["cn-north-1", "up-z1.qiniup.com"],
      ["cn-south-1", "up-z2.qiniup.com"],
      ["us-north-1", "up-na0.qiniup.com"],
      ["ap-southeast-1", "up-as0.qiniup.com"],
      ["ap-southeast-2", "up-ap-southeast-2.qiniup.com"],
      ["ap-southeast-3", "up-ap-southeast-3.qiniup.com"],
    ]) {
      expect(uploadHost(region)).toBe(host);
    }
    expect(uploadHost("CN-SOUTH-1")).toBe("up-z2.qiniup.com");
    expect(uploadHost("eu-west-1")).toBeNull();
  });

  it("carries the token, key and bytes in a form body", () => {
    const body = new TextDecoder().decode(
      multipart("BOUND", "TOKEN", "notes/a b.md", new TextEncoder().encode("hi")),
    );
    expect(body.startsWith("--BOUND\r\n")).toBe(true);
    expect(body).toContain('name="token"\r\n\r\nTOKEN\r\n');
    expect(body).toContain('name="key"\r\n\r\nnotes/a b.md\r\n');
    expect(body).toContain('name="file"; filename="blob"');
    expect(body).toContain("\r\n\r\nhi\r\n--BOUND--\r\n");
  });
});
