import { deviceOf, type Device } from "./device";
import {
  KEEP_DAYS,
  MAX_FILE_MIB,
  PARALLEL,
  SyncError,
  type Config,
  type KeepDays,
} from "./model";

/** The connection fields a service asks for; the rest are left out. */
export type Field = "endpoint" | "bucket" | "region" | "token" | "pathStyle";

export interface Provider {
  transport: "s3" | "dav";
  /** Its address, `{region}` filled in; one typed in wins where the
   *  endpoint is a field. */
  endpoint: string;
  /** How a file is written only where none is: a conditional PUT, an
   *  upload host's insert-only form, or a MOVE that won't overwrite. */
  create: "conditional" | "upload" | "move";
  fields: readonly Field[];
  /** A region typed in starts as this. */
  region?: string;
  /** The regions to pick from, with each one's upload host; each is
   *  named in l10n under its code. */
  regions?: Readonly<Record<string, string>>;
  /** The labels of its sign-in, and a line under the service, if any. */
  signIn: readonly [string, string];
  help?: string;
  /** A new connection's wait, in minutes, between a save and its sync,
   *  and its transfers at once. */
  saveGap: number;
  parallel: number;
}

const S3_SIGN_IN = ["accountS3", "secretS3"] as const;
// Nutstore caps requests per account: it waits 3 minutes after a save,
// with few transfers at once.
export const providers: Record<Config["provider"], Provider> = {
  s3: {
    transport: "s3",
    endpoint: "https://s3.{region}.amazonaws.com",
    create: "conditional",
    fields: ["endpoint", "bucket", "region", "token", "pathStyle"],
    region: "us-east-1",
    signIn: S3_SIGN_IN,
    saveGap: 0,
    parallel: 8,
  },
  kodo: {
    transport: "s3",
    endpoint: "https://s3.{region}.qiniucs.com",
    create: "upload",
    fields: ["bucket", "region"],
    regions: {
      "cn-east-1": "up-z0.qiniup.com",
      "cn-east-2": "up-cn-east-2.qiniup.com",
      "cn-north-1": "up-z1.qiniup.com",
      "cn-south-1": "up-z2.qiniup.com",
      "us-north-1": "up-na0.qiniup.com",
      "ap-southeast-1": "up-as0.qiniup.com",
      "ap-southeast-2": "up-ap-southeast-2.qiniup.com",
      "ap-southeast-3": "up-ap-southeast-3.qiniup.com",
    },
    signIn: S3_SIGN_IN,
    saveGap: 0,
    parallel: 8,
  },
  webdav: {
    transport: "dav",
    endpoint: "",
    create: "move",
    fields: ["endpoint"],
    signIn: ["accountDav", "secretDav"],
    saveGap: 0,
    parallel: 4,
  },
  nutstore: {
    transport: "dav",
    endpoint: "https://dav.jianguoyun.com/dav",
    create: "move",
    fields: [],
    signIn: ["accountNutstore", "secretNutstore"],
    help: "nutstoreHelp",
    saveGap: 3,
    parallel: 2,
  },
};

/** A region as the picker reads it: its name, then its code. */
export const regionLabel = (code: string, t: (key: string) => string) =>
  `${t(code)} (${code})`;

export const defaults: Config = {
  provider: "s3",
  endpoint: "",
  region: providers.s3.region!,
  bucket: "",
  prefix: "textus/my-workspace",
  pathStyle: true,
  automatic: false,
  interval: 5,
  saveGap: 0,
  exclude: "",
  gitignore: false,
  obsidian: false,
  encrypt: false,
  keepDays: 90,
  parallel: 8,
  maxFileMiB: 128,
};

export function relativePath(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= 1024 &&
    !/[\\\x00-\x1f\x7f:*?"<>|]/.test(value) &&
    value
      .split("/")
      .every(
        (part) =>
          part !== "" &&
          part !== "." &&
          part !== ".." &&
          !/[. ]$/.test(part) &&
          !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
      )
  );
}

export function normalizeConfig(
  input: Partial<Config>,
  device: Pick<Device, "parallel" | "maxFileMiB"> = deviceOf(),
): Config {
  const c = { ...defaults, ...input };
  if (!Object.hasOwn(providers, c.provider))
    throw new SyncError("invalidConfig");
  c.prefix = String(c.prefix)
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (!relativePath(c.prefix)) throw new SyncError("invalidPrefix");
  const spec = providers[c.provider];
  const shows = (field: Field) => spec.fields.includes(field);
  c.region = shows("region")
    ? String(c.region).trim() || (spec.region ?? "")
    : "";
  if (spec.regions && !Object.hasOwn(spec.regions, c.region))
    throw new SyncError("regionRequired");
  if (shows("region") && !/^[a-z0-9-]+$/.test(c.region))
    throw new SyncError("invalidConfig");
  c.bucket = shows("bucket") ? String(c.bucket).trim() : "";
  if (
    shows("bucket") &&
    (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(c.bucket) ||
      c.bucket.includes(".."))
  )
    throw new SyncError("invalidBucket");
  c.endpoint = (
    (shows("endpoint") && String(c.endpoint).trim()) ||
    spec.endpoint.replace("{region}", c.region)
  ).replace(/\/+$/, "");
  // Not a field: S3 addresses by path, WebDAV has no bucket.
  c.pathStyle = shows("pathStyle")
    ? c.pathStyle !== false
    : spec.transport === "s3";
  let url: URL;
  try {
    url = new URL(c.endpoint);
  } catch {
    throw new SyncError("invalidEndpoint");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new SyncError("invalidEndpoint");
  if (
    url.pathname.split("/").some((p) => {
      try {
        return /[\\\x00-\x1f]/.test(decodeURIComponent(p));
      } catch {
        return true;
      }
    })
  )
    throw new SyncError("invalidEndpoint");
  c.endpoint = url.toString().replace(/\/+$/, "");
  c.automatic = c.automatic === true;
  c.exclude = String(c.exclude ?? "").slice(0, 20_000);
  c.gitignore = c.gitignore === true;
  c.obsidian = c.obsidian === true;
  c.encrypt = c.encrypt === true;
  c.keepDays = Number(c.keepDays) as KeepDays;
  if (!KEEP_DAYS.includes(c.keepDays)) c.keepDays = defaults.keepDays;
  c.keepPending = c.keepPending === true;
  c.interval = Number(c.interval);
  if (!Number.isInteger(c.interval) || c.interval < 1 || c.interval > 1440)
    throw new SyncError("invalidInterval");
  c.saveGap = Number(input.saveGap ?? spec.saveGap);
  if (!Number.isInteger(c.saveGap) || c.saveGap < 0 || c.saveGap > 60)
    throw new SyncError("invalidSaveGap");
  const parallel = Math.min(spec.parallel, device.parallel);
  c.parallel = Number(input.parallel ?? parallel);
  if (!(PARALLEL as readonly number[]).includes(c.parallel))
    c.parallel = parallel;
  c.maxFileMiB = Number(input.maxFileMiB ?? device.maxFileMiB);
  if (!(MAX_FILE_MIB as readonly number[]).includes(c.maxFileMiB))
    c.maxFileMiB = device.maxFileMiB;
  return c;
}

/** A connection typed in, with the folder's options when it has some: a
 *  different service starts from its own wait and transfers. */
export function withConnection(
  saved: Config | null,
  connection: Partial<Config>,
): Partial<Config> {
  if (!saved) return connection;
  if (saved.provider === connection.provider)
    return { ...saved, ...connection };
  const { saveGap: _gap, parallel: _parallel, ...options } = saved;
  return { ...options, ...connection };
}

export function identity(c: Config): string {
  return JSON.stringify([
    providers[c.provider].transport,
    c.endpoint,
    c.bucket,
    c.region,
    c.pathStyle,
    c.prefix,
  ]);
}

// Obsidian's bases and canvases are text too.
const documents = /\.(md|markdown|mdown|mkd|txt|csv|base|canvas)$/i;
const attachments =
  /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico|heic|pdf|docx?|xlsx?|pptx?|odt|ods|odp|mp3|wav|m4a|ogg|mp4|mov|webm)$/i;
const ignored = new Set(["node_modules", "dist", "build", "target", "vendor"]);
export const isText = (path: string) =>
  documents.test(path) || /\.svg$/i.test(path) || isObsidianSetting(path);
/** Obsidian's own settings a sync may carry, when asked: none of its
 *  plugins' code, nor what differs per machine (workspace.json). */
export const OBSIDIAN_SETTINGS = [
  "app.json",
  "appearance.json",
  "hotkeys.json",
  "bookmarks.json",
  "graph.json",
  "core-plugins.json",
  "types.json",
];
export const isObsidianSetting = (path: string) =>
  path.startsWith(".obsidian/") &&
  OBSIDIAN_SETTINGS.includes(path.slice(".obsidian/".length));
export function inScope(path: string): boolean {
  if (!relativePath(path)) return false;
  if (isObsidianSetting(path)) return true;
  const parts = path.split("/");
  if (parts[0] === ".textus") {
    return (
      /^\.textus\/(agent|style|style\.previous)\.md$/.test(path) ||
      (/^\.textus\/(library|memory|skills)\/.+\.md$/i.test(path) &&
        parts.slice(1).every((p) => !p.startsWith(".")))
    );
  }
  return (
    parts.every((p) => !p.startsWith(".") && !ignored.has(p.toLowerCase())) &&
    (documents.test(path) || attachments.test(path))
  );
}
export function descend(path: string): boolean {
  return (
    relativePath(path) &&
    path
      .split("/")
      .every((p) => !p.startsWith(".") && !ignored.has(p.toLowerCase()))
  );
}
