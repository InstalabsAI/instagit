/**
 * Machine fingerprint generation.
 * Produces a stable identifier from hostname + platform + arch + MAC address.
 * Same algorithm as the Python version so tokens are shared.
 */

import { createHash } from "crypto";
import { hostname, platform, arch, networkInterfaces } from "os";

function getMacAddress(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const iface of nets[name] ?? []) {
      // Skip internal and zero MACs
      if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
        return iface.mac;
      }
    }
  }
  return "00:00:00:00:00:00";
}

/**
 * Python's uuid.getnode() returns the MAC as a 48-bit integer.
 * We replicate that here for fingerprint compatibility.
 */
function macToInt(mac: string): string {
  return BigInt("0x" + mac.replace(/:/g, "")).toString();
}

export function getMachineFingerprint(): string {
  const parts = [
    hostname(), // platform.node()
    platform(), // platform.system() — "darwin", "linux", "win32"
    arch(), // platform.machine() — "x64", "arm64"
    macToInt(getMacAddress()), // uuid.getnode() equivalent
  ];
  // Python uses platform.system() which returns "Darwin", "Linux", "Windows"
  // Node's os.platform() returns "darwin", "linux", "win32"
  // To match Python fingerprints, capitalize properly
  const platformMap: Record<string, string> = {
    darwin: "Darwin",
    linux: "Linux",
    win32: "Windows",
  };
  parts[1] = platformMap[parts[1]] ?? parts[1];

  // Python's platform.machine() returns "x86_64" on Intel Macs, "arm64" on Apple Silicon
  // Node's os.arch() returns "x64" on Intel, "arm64" on Apple Silicon
  const archMap: Record<string, string> = {
    x64: "x86_64",
    ia32: "i686",
  };
  parts[2] = archMap[parts[2]] ?? parts[2];

  const raw = parts.join("|");
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}
