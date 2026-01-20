import type { IPv6CIDR } from "./ipv4";

/**
 * Convert an IPv6 CIDR prefix length to a network mask
 * @param prefixLength - CIDR prefix length (0-128)
 * @returns IPv6 mask as [p1, p2, p3, p4, p5, p6, p7, p8]
 */
export function getIPv6Mask(
  prefixLength: number,
): [number, number, number, number, number, number, number, number] {
  const mask: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < prefixLength; i++) {
    const partIndex = Math.floor(i / 16);
    const bitIndex = 15 - (i % 16);
    mask[partIndex] |= 1 << bitIndex;
  }

  return mask as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

/**
 * Generate a random IPv6 CIDR by randomizing host bits and setting network bits to 0
 * @param prefixLength - CIDR prefix length (0-128)
 * @returns Random IPv6 CIDR with the given prefix length
 */
export function generateRandomIPv6CIDR(prefixLength: number): IPv6CIDR {
  // Generate random 16-bit parts
  const randomParts: number[] = [
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
  ];

  // Get the network mask to zero out host bits
  const mask = getIPv6Mask(prefixLength);

  // Apply mask to keep network bits and randomize host bits
  const maskedParts: number[] = randomParts.map(
    (part, index) => part & mask[index],
  );

  return [
    maskedParts[0],
    maskedParts[1],
    maskedParts[2],
    maskedParts[3],
    maskedParts[4],
    maskedParts[5],
    maskedParts[6],
    maskedParts[7],
    prefixLength,
  ];
}

/**
 * Generate a random IPv6 CIDR by randomizing only the host bits (after the prefix)
 * @param ipv6 - Current IPv6 CIDR
 * @returns Random IPv6 CIDR with randomized host bits
 */
export function generateRandomIPv6InNetwork(ipv6: IPv6CIDR): IPv6CIDR {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;
  const currentParts: number[] = [p1, p2, p3, p4, p5, p6, p7, p8];

  // Get the network mask
  const mask = getIPv6Mask(prefixLength);

  // Create an inverse mask to identify host bits
  const hostMask: number[] = mask.map((m) => ~m & 0xffff);

  // Generate random parts and extract only host bits
  const randomParts: number[] = [
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
  ];

  const newParts: number[] = randomParts.map(
    (part, index) =>
      (currentParts[index] & mask[index]) | (part & hostMask[index]),
  );

  return [
    newParts[0],
    newParts[1],
    newParts[2],
    newParts[3],
    newParts[4],
    newParts[5],
    newParts[6],
    newParts[7],
    prefixLength,
  ];
}

export function formatIPv6(ipv6: IPv6CIDR): string {
  const parts = ipv6.slice(0, 8) as number[];

  // Convert all parts to hex strings
  const hexParts = parts.map((num) => num.toString(16));

  // Find the longest sequence of consecutive zeros
  let longestStart = -1;
  let longestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < hexParts.length; i++) {
    if (hexParts[i] === "0") {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > longestLength) {
        longestStart = currentStart;
        longestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }

  // Check if the last sequence is the longest
  if (currentLength > longestLength) {
    longestStart = currentStart;
    longestLength = currentLength;
  }

  // Only replace if we found a sequence of at least 2 consecutive zeros
  if (longestLength >= 2) {
    const before = hexParts.slice(0, longestStart);
    const after = hexParts.slice(longestStart + longestLength);

    if (before.length === 0 && after.length === 0) {
      return "::";
    } else if (before.length === 0) {
      return "::" + after.join(":");
    } else if (after.length === 0) {
      return before.join(":") + "::";
    } else {
      return before.join(":") + "::" + after.join(":");
    }
  }

  return hexParts.join(":");
}
