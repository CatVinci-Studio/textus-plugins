/** What differs between the devices a folder syncs on. */
export interface Device {
  /** Syncs on opening and on coming back to Textus, never in the
   *  background (lifecycle.ts). */
  phone: boolean;
  /** The most transfers at once a new connection starts with. */
  parallel: number;
  /** A new connection's largest file, in MiB: larger ones stay out. */
  maxFileMiB: number;
  /** The part of a folder's path that changes when the app is updated,
   *  and what stands for it in the keys the folder's settings are under. */
  container?: [RegExp, string];
  /** Where a file deleted elsewhere goes when the system has no Trash: a
   *  folder in the synced one that isn't synced. */
  ownTrash?: string;
}

const DESKTOP: Device = { phone: false, parallel: 32, maxFileMiB: 128 };
const DEVICES: Record<string, Device> = {
  ios: {
    phone: true,
    parallel: 2,
    maxFileMiB: 32,
    // The app's Documents, on a device and in the simulator.
    container: [
      /^.*\/Containers\/Data\/Application\/[0-9a-f-]{36}\/Documents(?=\/|$)/i,
      "documents:",
    ],
  },
  android: { phone: true, parallel: 2, maxFileMiB: 32, ownTrash: "Sync trash" },
};

export const deviceOf = (platform?: string): Device =>
  (platform && Object.hasOwn(DEVICES, platform) && DEVICES[platform]) ||
  DESKTOP;

/** The folder as its saved settings know it: the same across updates of
 *  the app, which move its Documents on iOS. */
export function folderKey(root: string, platform?: string) {
  const container = deviceOf(platform).container;
  return container ? root.replace(container[0], container[1]) : root;
}
