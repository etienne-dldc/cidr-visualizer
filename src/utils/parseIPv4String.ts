import type { IPv4CIDR } from "./ipv4";

export function parseIPv4String(input: string): IPv4CIDR | null {
  const trimmed = input.trim();

  // Match IPv4 CIDR notation: XXX.XXX.XXX.XXX/XX
  const match = trimmed.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\/(\d+))?$/);

  if (!match) {
    return null;
  }

  const p1 = parseInt(match[1], 10);
  const p2 = parseInt(match[2], 10);
  const p3 = parseInt(match[3], 10);
  const p4 = parseInt(match[4], 10);
  const prefixLength = match[5] ? parseInt(match[5], 10) : 32;

  // Validate ranges
  if (
    p1 < 0 ||
    p1 > 255 ||
    p2 < 0 ||
    p2 > 255 ||
    p3 < 0 ||
    p3 > 255 ||
    p4 < 0 ||
    p4 > 255 ||
    prefixLength < 0 ||
    prefixLength > 32
  ) {
    return null;
  }

  return [p1, p2, p3, p4, prefixLength];
}
