// Qiniu Kodo's upload tokens and form: how a file is created only where
// none is (see RemoteStore's upload).
const base64url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_");
};

/** A put policy, encoded as the token carries it. */
export function encodePolicy(policy: string): string {
  return base64url(new TextEncoder().encode(policy));
}

/** One key, and no overwrite. */
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
