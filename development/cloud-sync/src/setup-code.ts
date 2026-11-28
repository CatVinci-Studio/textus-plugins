import type { Config } from "./model";

/**
 * A connection as text to carry to another device: copied on a computer,
 * pasted on a phone, where typing a remote folder is where it goes wrong.
 * It holds where the folder syncs and whether it is encrypted, never an
 * account, a key or a sync password: those are typed on each device.
 */

const PREFIX = "textus-sync:1:";

/** What a code carries. */
type Carried = Pick<
  Config,
  | "provider"
  | "endpoint"
  | "region"
  | "bucket"
  | "prefix"
  | "pathStyle"
  | "encrypt"
>;
const PROVIDERS: Config["provider"][] = ["s3", "webdav", "nutstore"];

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(text: string) {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(
    Uint8Array.from(binary, (c) => c.charCodeAt(0)),
  );
}

export function setupCode(config: Config): string {
  const carried: Carried = {
    provider: config.provider,
    endpoint: config.endpoint,
    region: config.region,
    bucket: config.bucket,
    prefix: config.prefix,
    pathStyle: config.pathStyle,
    encrypt: config.encrypt,
  };
  return PREFIX + toBase64Url(JSON.stringify(carried));
}

/** The connection a pasted code carries; null for anything else. */
export function readSetupCode(text: string): Carried | null {
  const code = text.trim();
  if (!code.startsWith(PREFIX)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(code.slice(PREFIX.length)));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Record<string, unknown>;
  const field = (key: string) =>
    typeof p[key] === "string" ? (p[key] as string) : "";
  if (!PROVIDERS.includes(p.provider as Config["provider"])) return null;
  return {
    provider: p.provider as Config["provider"],
    endpoint: field("endpoint"),
    region: field("region"),
    bucket: field("bucket"),
    prefix: field("prefix"),
    pathStyle: p.pathStyle === true,
    encrypt: p.encrypt === true,
  };
}
