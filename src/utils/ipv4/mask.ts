import type { IPv4 } from "./types";

/**
 * Convert an IPv4 CIDR prefix length to a network mask
 * @param prefixLength - CIDR prefix length (0-32)
 * @returns IPv4 mask as [p1, p2, p3, p4]
 */
export function getIPv4Mask(prefixLength: number): IPv4 {
  const mask: number[] = [0, 0, 0, 0];

  for (let i = 0; i < prefixLength; i++) {
    const octetIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    mask[octetIndex] |= 1 << bitIndex;
  }

  return mask as IPv4;
}
