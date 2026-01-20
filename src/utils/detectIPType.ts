import type { IPv4CIDR, IPv6CIDR } from "./ipv4";
import { parseIPv4String } from "./parseIPv4String";
import { parseIPv6String } from "./parseIPv6String";

export interface DetectionResult {
  ipv4: IPv4CIDR | null;
  ipv6: IPv6CIDR | null;
}

/**
 * Try to parse input as both IPv4 and IPv6.
 * Returns both results; caller can decide which one to use.
 */
export function detectIPType(input: string): DetectionResult {
  const ipv4 = parseIPv4String(input);
  const ipv6 = parseIPv6String(input);

  return {
    ipv4,
    ipv6,
  };
}

/**
 * Determine which IP type should be used for the input.
 * Returns "ipv4", "ipv6", "both", or null if neither parses.
 */
export function getPreferredIPType(
  input: string,
): "ipv4" | "ipv6" | "both" | null {
  const { ipv4, ipv6 } = detectIPType(input);

  if (ipv4 && ipv6) {
    return "both";
  }
  if (ipv4) {
    return "ipv4";
  }
  if (ipv6) {
    return "ipv6";
  }

  return null;
}
