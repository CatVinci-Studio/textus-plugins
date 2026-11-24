// Qiniu Kodo creates a new object through the upload service: its S3
// endpoint has no conditional PUT, but an upload token whose policy says
// `insertOnly` refuses a second write. Reads, overwrites and deletes stay on
// the S3 endpoint.
const HOSTS: Record<string, string> = {
  "cn-east-1": "up-z0.qiniup.com",
  "cn-east-2": "up-cn-east-2.qiniup.com",
  "cn-north-1": "up-z1.qiniup.com",
  "cn-south-1": "up-z2.qiniup.com",
  "us-north-1": "up-na0.qiniup.com",
  "ap-southeast-1": "up-as0.qiniup.com",
  "ap-southeast-2": "up-ap-southeast-2.qiniup.com",
  "ap-southeast-3": "up-ap-southeast-3.qiniup.com",
};

/** The upload host for a Qiniu S3 region; null for an unknown one. */
export function uploadHost(region: string): string | null {
  return HOSTS[region.toLowerCase()] ?? null;
}

const base64url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_");
};

/** The encoded form of a put policy that allows one key and no overwrite. */
export function encodePolicy(policy: string): string {
  return base64url(new TextEncoder().encode(policy));
}

export function putPolicy(
  bucket: string,
  key: string,
  deadline: number,
): string {
  return JSON.stringify({
    scope: `${bucket}:${key}`,
    deadline,
    insertOnly: 1,
  });
}

/** HMAC-SHA1 over the encoded policy, URL-safe base64 like the policy. */
export async function signEncodedPolicy(
  secretKey: string,
  encodedPolicy: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPolicy),
  );
  return base64url(new Uint8Array(signature));
}

/** `accessKey:sign:encodedPolicy`, the shape the upload host expects. */
export async function uploadToken(
  accessKey: string,
  secretKey: string,
  bucket: string,
  key: string,
  deadline: number,
): Promise<string> {
  const encoded = encodePolicy(putPolicy(bucket, key, deadline));
  return `${accessKey}:${await signEncodedPolicy(secretKey, encoded)}:${encoded}`;
}

/** The form body: token, full object key and bytes. */
export function multipart(
  boundary: string,
  token: string,
  key: string,
  bytes: Uint8Array,
): Uint8Array {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const field = (name: string, value: string) =>
    encoder.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    );
  parts.push(field("token", token), field("key", key));
  parts.push(
    encoder.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="blob"\r\nContent-Type: application/octet-stream\r\n\r\n`,
    ),
    bytes,
    encoder.encode(`\r\n--${boundary}--\r\n`),
  );
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const body = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }
  return body;
}
